import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import { designers } from "../data/designers";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

type BannerObject = {
  id: string;
  file: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

const ASSET_ROOT = "/images/main_banner";
const CURSOR_ASPECT_RATIO = 339 / 509;
const DRAG_CURSOR_SCALE = 0.4;

// 전달받은 유튜브 영상 주소로 교체하면 됩니다.
// 예: https://www.youtube.com/watch?v=dQw4w9WgXcQ
const OPENING_YOUTUBE_URL = "";

const EXHIBITION_MEMBER_GROUPS = [
  { label: "위원장", members: ["김예원"] },
  { label: "부위원장", members: ["이수현"] },
  { label: "BRANDING", members: ["황혜정", "박건희", "박보은", "안선주"] },
  { label: "DP", members: ["배명환", "이수현", "전수빈", "정미연", "정성현"] },
  { label: "OPENING", members: ["박지수", "윤서현", "이현지", "장재원"] },
  { label: "WEB", members: ["최양진", "강예주", "김예원", "박수민", "이은솔"] },
] as const;

const exhibitionDesigners = new Map(
  designers.filter((designer) => designer.id !== "all").map((designer) => [designer.name, designer]),
);

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.hostname.includes("youtu.be")
      ? parsedUrl.pathname.slice(1)
      : parsedUrl.searchParams.get("v") ?? parsedUrl.pathname.split("/").pop();

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : "";
  } catch {
    return "";
  }
};

const BANNER_OBJECTS: BannerObject[] = [
  { id: "key", file: "dp.png", x: 14, y: 22, rotate: 0, scale: 1.2 },
  { id: "spider-web", file: "web.png", x: 90, y: 16, rotate: 0, scale: 1.2 },
  { id: "flower", file: "branding.png", x: 8, y: 84, rotate: 0, scale: 1.2 },
  { id: "hourglass", file: "opening.png", x: 88, y: 80, rotate: 10, scale: 1.2 },
  { id: "logo", file: "logo.png", x: 49, y: 50, rotate: 0, scale: 1.5 },
];

const getObjectSize = (sceneWidth: number) =>
  Math.min(462, Math.max(264, sceneWidth * 0.28));

const getCursorSize = (sceneWidth: number): Size => {
  const width = Math.min(509, Math.max(270, sceneWidth * 0.31));
  return { width, height: width * CURSOR_ASPECT_RATIO };
};

function ObjectLayer({ color }: { color: boolean }) {
  return (
    <div className="absolute inset-0">
      {BANNER_OBJECTS.map((object) => (
        <img
          key={object.id}
          src={`${ASSET_ROOT}/${color ? "color" : "black"}/${object.file}`}
          alt=""
          draggable={false}
          className="absolute aspect-square w-[clamp(264px,28vw,462px)] max-w-none object-contain select-none"
          style={{
            left: `${object.x}%`,
            top: `${object.y}%`,
            transform: `translate(-50%, -50%) rotate(${object.rotate}deg) scale(${object.scale})`,
          }}
        />
      ))}
    </div>
  );
}

function Home() {
  const sceneRef = useRef<HTMLElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const blackCanvasRef = useRef<HTMLCanvasElement>(null);
  const eraseImageRef = useRef<HTMLImageElement | null>(null);
  const lastErasePointRef = useRef<Position | null>(null);
  const cursorScaleRef = useRef(1);
  const eraseReadyRef = useRef(false);

  const [sceneSize, setSceneSize] = useState<Size>({ width: 0, height: 0 });
  const [pointerPosition, setPointerPosition] = useState<Position | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isScrollCueHovered, setIsScrollCueHovered] = useState(false);
  const [cursorScale, setCursorScale] = useState(1);
  const openingEmbedUrl = getYoutubeEmbedUrl(OPENING_YOUTUBE_URL);

  const baseCursorSize = getCursorSize(sceneSize.width);
  const activeCursorSize = {
    width: baseCursorSize.width * cursorScale,
    height: baseCursorSize.height * cursorScale,
  };

  const keepInside = (position: Position, size: Size): Position => ({
    x: Math.min(
      sceneSize.width - size.width / 2,
      Math.max(size.width / 2, position.x),
    ),
    y: Math.min(
      sceneSize.height - size.height / 2,
      Math.max(size.height / 2, position.y),
    ),
  });

  const visibleCursorPosition = pointerPosition
    ? keepInside(pointerPosition, activeCursorSize)
    : null;

  useEffect(() => {
    const from = cursorScaleRef.current;
    const to = isErasing ? DRAG_CURSOR_SCALE : 1;
    const duration = 800;
    const startedAt = performance.now();
    let animationFrame = 0;
    eraseReadyRef.current = false;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const nextScale = from + (to - from) * eased;
      cursorScaleRef.current = nextScale;
      setCursorScale(nextScale);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else if (isErasing) {
        eraseReadyRef.current = true;
        lastErasePointRef.current = null;
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isErasing]);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const measure = () => {
      const rect = scene.getBoundingClientRect();
      setSceneSize({ width: rect.width, height: rect.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = blackCanvasRef.current;
    if (!scene || !canvas) return;

    let cancelled = false;
    const images = BANNER_OBJECTS.map((object) => {
      const image = new Image();
      image.src = `${ASSET_ROOT}/black/${object.file}`;
      return { image, object };
    });
    const eraseImage = new Image();
    eraseImage.src = `${ASSET_ROOT}/cursor.png`;
    eraseImageRef.current = eraseImage;

    const waitForImage = (image: HTMLImageElement) =>
      image.complete && image.naturalWidth
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });

    const drawBlackObjects = async () => {
      await Promise.all([
        ...images.map(({ image }) => waitForImage(image)),
        waitForImage(eraseImage),
      ]);
      if (cancelled) return;

      const rect = scene.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.globalAlpha = 1;

      const objectSize = getObjectSize(rect.width);
      images.forEach(({ image, object }) => {
        if (!image.naturalWidth) return;
        const size = objectSize * object.scale;
        context.save();
        context.translate((rect.width * object.x) / 100, (rect.height * object.y) / 100);
        context.rotate((object.rotate * Math.PI) / 180);
        context.drawImage(image, -size / 2, -size / 2, size, size);
        context.restore();
      });
      context.globalAlpha = 1;
    };

    void drawBlackObjects();
    const resizeObserver = new ResizeObserver(() => void drawBlackObjects());
    resizeObserver.observe(scene);

    let hasLeftScene = false;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        hasLeftScene = true;
        return;
      }

      if (hasLeftScene) {
        hasLeftScene = false;
        setIsErasing(false);
        setPointerPosition(null);
        eraseReadyRef.current = false;
        lastErasePointRef.current = null;
        void drawBlackObjects();
      }
    });
    visibilityObserver.observe(scene);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const eraseBetween = (from: Position, to: Position) => {
    const canvas = blackCanvasRef.current;
    const eraseImage = eraseImageRef.current;
    if (!canvas || !eraseImage?.naturalWidth) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const eraseSize = {
      width: baseCursorSize.width * cursorScaleRef.current,
      height: baseCursorSize.height * cursorScaleRef.current,
    };
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const step = Math.max(8, eraseSize.width * 0.08);
    const count = Math.max(1, Math.ceil(distance / step));

    context.save();
    context.globalCompositeOperation = "destination-out";
    for (let index = 0; index <= count; index += 1) {
      const progress = index / count;
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      context.drawImage(
        eraseImage,
        x - eraseSize.width / 2,
        y - eraseSize.height / 2,
        eraseSize.width,
        eraseSize.height,
      );
    }
    context.restore();
  };

  const getPointerPosition = (event: ReactPointerEvent<HTMLElement>): Position => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const position = getPointerPosition(event);
    setPointerPosition(position);

    if (isErasing) {
      const eraseSize = {
        width: baseCursorSize.width * cursorScaleRef.current,
        height: baseCursorSize.height * cursorScaleRef.current,
      };
      const boundedPosition = keepInside(position, eraseSize);

      if (eraseReadyRef.current) {
        eraseBetween(lastErasePointRef.current ?? boundedPosition, boundedPosition);
      }
      lastErasePointRef.current = boundedPosition;
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault();
    const position = getPointerPosition(event);
    const eraseSize = {
      width: baseCursorSize.width * cursorScaleRef.current,
      height: baseCursorSize.height * cursorScaleRef.current,
    };
    const boundedPosition = keepInside(position, eraseSize);

    event.currentTarget.setPointerCapture(event.pointerId);
    setPointerPosition(position);
    setIsErasing(true);
    eraseReadyRef.current = false;
    lastErasePointRef.current = boundedPosition;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsErasing(false);
    eraseReadyRef.current = false;
    lastErasePointRef.current = null;
  };

  const scrollBelowBanner = () => {
    overviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const revealMaskStyle: CSSProperties = visibleCursorPosition
    ? {
        WebkitMaskImage: `url("${ASSET_ROOT}/cursor.png")`,
        maskImage: `url("${ASSET_ROOT}/cursor.png")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: `${activeCursorSize.width}px ${activeCursorSize.height}px`,
        maskSize: `${activeCursorSize.width}px ${activeCursorSize.height}px`,
        WebkitMaskPosition: `${visibleCursorPosition.x - activeCursorSize.width / 2}px ${
          visibleCursorPosition.y - activeCursorSize.height / 2
        }px`,
        maskPosition: `${visibleCursorPosition.x - activeCursorSize.width / 2}px ${
          visibleCursorPosition.y - activeCursorSize.height / 2
        }px`,
      }
    : {};

  return (
    <main className="relative min-h-screen w-full bg-[url('/images/background.png')] bg-cover bg-center bg-no-repeat text-[#111]">
      <section
        ref={sceneRef}
        aria-label="파란 종이를 움직여 색을 발견하는 메인 배너"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => setPointerPosition(null)}
        className="relative isolate h-[calc(100svh-var(--header-height))] min-h-[540px] w-full cursor-none touch-none overflow-hidden"
      >
        <h1 className="sr-only">잔향 — 부산대학교 디자인앤테크놀로지 졸업전시</h1>

        <canvas
          ref={blackCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        />

        {visibleCursorPosition && !isScrollCueHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-[0_10px_14px_rgba(0,70,105,0.16)]"
            style={{
              left: visibleCursorPosition.x,
              top: visibleCursorPosition.y,
              width: activeCursorSize.width,
              height: activeCursorSize.height,
            }}
          >
            <img
              src={`${ASSET_ROOT}/cursor.png`}
              alt=""
              draggable={false}
              className="block h-full w-full"
            />
          </div>
        )}

        {visibleCursorPosition && !isScrollCueHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            style={revealMaskStyle}
          >
            <ObjectLayer color />
          </div>
        )}

        <button
          type="button"
          aria-label="아래 콘텐츠로 이동"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerEnter={() => setIsScrollCueHovered(true)}
          onPointerLeave={() => setIsScrollCueHovered(false)}
          onClick={scrollBelowBanner}
          className="main-scroll-cue absolute bottom-[clamp(0px,1vh,10px)] left-1/2 z-50 flex h-40 w-40 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
        >
          <img
            src="/images/icon/arrowDown_main.png"
            alt=""
            draggable={false}
            className="h-[72px] w-[72px] object-contain"
          />
        </button>
      </section>

      <section
        ref={overviewRef}
        className="relative flex min-h-[calc(100svh-var(--header-height))] scroll-mt-[var(--header-height)] flex-col items-center justify-center px-6 py-20 text-center"
      >
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[clamp(28px,2.4vw,42px)] font-bold tracking-[-0.04em]">
            전시 개요
          </h2>

          <p className="mt-[clamp(60px,10vw,92px)] text-[clamp(17px,1.7vw,20px)] leading-[1.5] tracking-[-0.03em]">
            사라짐으로부터 발생되는 ‘잔향’은 우리에게 다음과 같은 질문들을 던진다.
            <br className="hidden md:block" /><br/>
            우리는 무엇을 남길 것인가.
            <br className="hidden md:block" />
            우리는 무엇을 기억할 것인가.
            <br className="hidden md:block" /><br/>
            이번 전시를 준비하며 사라짐이 남기는 울림을 각자의 시선으로 해석하고, 그 자취를 오브제로 표현하였다.
            <br className="hidden md:block" /><br/>
            본 전시는 마지막과 처음의 경계에서 우리가 마주한 잔향의 의미를 선보인다.
            <br className="hidden md:block" />
            지금 나는 어떤 마지막과 처음 위에 서있는가.
          </p>
        </div>

      </section>

      <section
        id="opening"
        className="scroll-mt-[var(--header-height)] px-6 py-[clamp(64px,8vw,120px)] sm:px-10 lg:px-[clamp(80px,13vw,200px)]"
      >
        <h2 className="text-center text-[clamp(24px,2.2vw,36px)] font-bold tracking-[-0.03em]">
          OPENING
        </h2>

        <div className="mx-auto mt-8 aspect-video w-full max-w-[1200px] overflow-hidden border border-[#8d8d8d] bg-[#d9d9d9]">
          {openingEmbedUrl ? (
            <iframe
              className="h-full w-full"
              src={openingEmbedUrl}
              title="OPENING 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm font-medium text-[#777] sm:text-base">
              OPENING VIDEO
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="exhibition-members-title"
        className="px-6 pb-[clamp(96px,12vw,180px)] pt-[clamp(48px,7vw,100px)] sm:px-10 lg:px-[clamp(80px,10vw,160px)]"
      >
        <h2 className="text-center text-[clamp(28px,2.4vw,42px)] font-bold tracking-[-0.04em]">
            전시 인원 소개
          </h2>

        <div className="mx-auto mt-[clamp(48px,7vw,56px)] grid w-full max-w-[1280px] gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] xl:items-center xl:gap-[clamp(56px,7vw,112px)]">
          <div className="aspect-[3/2] min-w-0 w-full overflow-hidden">
            <img
              src="/images/footer_background.png"
              alt="전시 참여 인원 단체사진"
              className="block h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            {EXHIBITION_MEMBER_GROUPS.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-[92px_1fr] items-center gap-4 py-3 sm:grid-cols-[120px_1fr] sm:gap-7 sm:py-3"
              >
                <h3 className="text-base font-bold leading-none tracking-[-0.02em]">
                  {group.label}
                </h3>
                <ul className="grid min-w-0 w-full list-none grid-cols-5 items-center p-0">
                  {group.members.map((name) => {
                    const designer = exhibitionDesigners.get(name);
                    if (!designer) return null;

                    return (
                      <li key={`${group.label}-${name}`} className="min-w-0 whitespace-nowrap">
                        <Link
                          to={`/designer/${designer.id}`}
                          className="exhibition-member-link inline-flex items-center text-[clamp(12px,1.5vw,16px)] font-medium tracking-[-0.035em] text-[#000101]"
                          aria-label={`${name} 디자이너 상세 페이지로 이동`}
                        >
                          <span>{name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;
