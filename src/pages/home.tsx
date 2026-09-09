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
import KakaoMap from "../components/KakaoMap";
import { designers } from "../data/designers";
import { motion, type Variants } from "framer-motion";

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
const DRAG_CURSOR_SCALE = 0.2;
const CURSOR_IMAGE_SCALE = 1;
const CURSOR_FOLLOW_EASING = 0.18;
const ERASER_STRENGTH = 0.06;
const ERASER_ALPHA_CUTOFF = 12;

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const professorContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const professorItem: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0, 0, 0.2, 1] },
  },
};

// 유튜브 영상 링크
const OPENING_YOUTUBE_URL = "https://www.youtube.com/watch?v=SXdVfDNvYUk&t=640s";

const EXHIBITION_MEMBER_GROUPS = [
  { label: "위원장", members: ["김예원"] },
  { label: "부위원장", members: ["이수현"] },
  { label: "BRANDING", members: ["황혜정", "박건희", "박보은", "안선주"] },
  { label: "DP", members: ["배명환", "이수현", "전수빈", "정미연", "정성현"] },
  { label: "OPENING", members: ["박지수", "윤서현", "이현지", "장재원"] },
  { label: "WEB", members: ["최양진", "강예주", "김예원", "박수민", "이은솔"] },
] as const;

const PROFESSORS = [
  {
    id: "professor-1",
    name: "이화세 교수님",
    field: "HCI",
    image: "/images/professor/hwaselee.webp",
  },
  {
    id: "professor-2",
    name: "김철기 교수님",
    field: "UX / AI / 감성공학",
    image: "/images/professor/chulkikim.webp",
  },
  {
    id: "professor-3",
    name: "김태완 교수님",
    field: "DIGITAL CONTENT DESIGN",
    image: "/images/professor/taiwankim.webp",
  },
  {
    id: "professor-4",
    name: "홍동진 교수님",
    field: "IMAGE PROCESSING / ML",
    image: "/images/professor/dongjinhong.webp",
  },
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
  { id: "key", file: "dp.png", x: 20, y: 28, rotate: 0, scale: 1.3 },
  { id: "spider-web", file: "web.png", x: 90, y: 16, rotate: 0, scale: 1.2 },
  { id: "flower", file: "branding.png", x: 8, y: 84, rotate: 0, scale: 1.2 },
  { id: "hourglass", file: "opening.png", x: 72, y: 70, rotate: 10, scale: 1.2 },
  { id: "logo", file: "logo.png", x: 49, y: 50, rotate: 0, scale: 1.2 },
];

const getObjectSize = (sceneWidth: number) =>
  Math.min(462, Math.max(264, sceneWidth * 0.28));

const getCursorSize = (sceneWidth: number): Size => {
  const width = Math.min(509, Math.max(270, sceneWidth * 0.31)) * CURSOR_IMAGE_SCALE;
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
  const pointerTargetRef = useRef<Position | null>(null);
  const pointerPositionRef = useRef<Position | null>(null);
  const hasInitializedCursorRef = useRef(false);

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

  useEffect(() => {
    let animationFrame = 0;

    const followPointer = () => {
      const target = pointerTargetRef.current;
      const current = pointerPositionRef.current;

      if (target && current) {
        const deltaX = target.x - current.x;
        const deltaY = target.y - current.y;

        if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
          const nextPosition = {
            x: current.x + deltaX * CURSOR_FOLLOW_EASING,
            y: current.y + deltaY * CURSOR_FOLLOW_EASING,
          };
          pointerPositionRef.current = nextPosition;
          setPointerPosition(nextPosition);
        }
      }

      animationFrame = requestAnimationFrame(followPointer);
    };

    animationFrame = requestAnimationFrame(followPointer);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const measure = () => {
      const rect = scene.getBoundingClientRect();
      setSceneSize({ width: rect.width, height: rect.height });

      if (!hasInitializedCursorRef.current) {
        const centerPosition = { x: rect.width / 2, y: rect.height / 2 };
        pointerTargetRef.current = centerPosition;
        pointerPositionRef.current = centerPosition;
        setPointerPosition(centerPosition);
        hasInitializedCursorRef.current = true;
      }
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
        const rect = scene.getBoundingClientRect();
        const centerPosition = { x: rect.width / 2, y: rect.height / 2 };
        setIsErasing(false);
        pointerTargetRef.current = centerPosition;
        pointerPositionRef.current = centerPosition;
        setPointerPosition(centerPosition);
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
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    const left = Math.max(
      0,
      Math.floor((Math.min(from.x, to.x) - eraseSize.width / 2) * scaleX),
    );
    const top = Math.max(
      0,
      Math.floor((Math.min(from.y, to.y) - eraseSize.height / 2) * scaleY),
    );
    const right = Math.min(
      canvas.width,
      Math.ceil((Math.max(from.x, to.x) + eraseSize.width / 2) * scaleX),
    );
    const bottom = Math.min(
      canvas.height,
      Math.ceil((Math.max(from.y, to.y) + eraseSize.height / 2) * scaleY),
    );
    const affectedWidth = right - left;
    const affectedHeight = bottom - top;
    const beforeErase = affectedWidth > 0 && affectedHeight > 0
      ? context.getImageData(left, top, affectedWidth, affectedHeight)
      : null;

    context.save();
    context.globalCompositeOperation = "destination-out";
    context.globalAlpha = ERASER_STRENGTH;
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

    if (beforeErase) {
      const afterErase = context.getImageData(left, top, affectedWidth, affectedHeight);

      for (let index = 3; index < afterErase.data.length; index += 4) {
        const alphaWasReduced = afterErase.data[index] < beforeErase.data[index];
        if (alphaWasReduced && afterErase.data[index] <= ERASER_ALPHA_CUTOFF) {
          afterErase.data[index] = 0;
        }
      }

      context.putImageData(afterErase, left, top);
    }
  };

  const getPointerPosition = (event: ReactPointerEvent<HTMLElement>): Position => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const updatePointerTarget = (position: Position) => {
    pointerTargetRef.current = position;

    if (!pointerPositionRef.current) {
      pointerPositionRef.current = position;
      setPointerPosition(position);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const position = getPointerPosition(event);
    updatePointerTarget(position);

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
    updatePointerTarget(position);
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

  const handlePointerLeave = () => {
    pointerTargetRef.current = null;
    pointerPositionRef.current = null;
    setPointerPosition(null);
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
        onPointerLeave={handlePointerLeave}
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
          <h2 className="text-[clamp(28px,2.4vw,32px)] font-semibold text-[#000101]">
            전시 개요
          </h2>

          <motion.p
            className="mt-16 text-[clamp(12px,1.7vw,20px)] text-[#000101] font-regular leading-[1.5] tracking-[-0.02em]"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }} // 화면에 40% 보이면 실행
          >
            <motion.span variants={item} className="block">
              사라짐으로부터 발생되는 ‘잔향’은 우리에게 다음과 같은 질문들을 던진다.
            </motion.span>

            <motion.span variants={item} className="block mt-6 md:mt-8">
              우리는 무엇을 남길 것인가.
              <br className="hidden md:block" />
              우리는 무엇을 기억할 것인가.
            </motion.span>

            <motion.span variants={item} className="block mt-6 md:mt-8">
              이번 전시를 준비하며 사라짐이 남기는 울림을 각자의 시선으로 해석하고, 그 자취를 오브제로 표현하였다.
            </motion.span>

            <motion.span variants={item} className="block mt-6 md:mt-8">
              본 전시는 마지막과 처음의 경계에서 우리가 마주한 잔향의 의미를 선보인다.
            </motion.span>

            <motion.span variants={item} className="block mt-6 md:mt-8">
              지금 나는 어떤 마지막과 처음 위에 서있는가.
            </motion.span>
          </motion.p>
        </div>

      </section>

      <section
        id="opening"
        className="scroll-mt-[var(--header-height)] px-6 py-[clamp(64px,8vw,120px)] sm:px-10 lg:px-[clamp(80px,13vw,200px)]"
      >
        <h2 className="text-center text-[clamp(28px,2.4vw,32px)] font-semibold text-[#000101]">
          OPENING
        </h2>

        <div className="mx-auto mt-16 aspect-video w-full max-w-[1300px] overflow-hidden bg-[#d9d9d9]">
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
        className="px-6 pb-[clamp(96px,12vw,180px)] pt-[clamp(48px,7vw,100px)] sm:px-10 lg:px-[clamp(80px,10vw,160px)] text-[#000101]"
      >
        <h2 className="text-center text-[clamp(28px,2.4vw,32px)] font-semibold">
            전시 인원 소개
          </h2>

        <div className="mx-auto mt-16 grid w-full max-w-[1280px] gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] xl:items-center xl:gap-[clamp(56px,7vw,112px)]">
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
                <h3 className="text-base text-[18px] font-bold leading-none text-[#000101]">
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
                          className="exhibition-member-link inline-flex items-center text-[clamp(12px,1.5vw,18px)] font-medium tracking-[-0.035em] text-[#000101]"
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

      <section
        aria-labelledby="offline-information-title"
        className="px-6 pb-[clamp(96px,12vw,180px)] pt-[clamp(64px,8vw,120px)] sm:px-10 lg:px-[clamp(80px,13vw,200px)]"
      >
        <h2
          id="offline-information-title"
          className="text-center text-[clamp(28px,2.4vw,32px)] font-semibold"
        >
          오프라인 정보
        </h2>

        <div className="mx-auto mt-16 grid w-full max-w-[1080px] lg:items-end gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="w-full max-w-[500px] min-w-0 justify-self-center">
            <div className="text-[clamp(13px,1.15vw,16px)] text-[#000101]">
              <div className="pb-6">
                <h3 className="font-semibold text-[20px]">부산디자인진흥원 1층 전시실</h3>
                <p className="mt-2 leading-relaxed">부산광역시 해운대구 센텀동로 57</p>
              </div>

              <div className="py-6">
                <h3 className="font-semibold text-[20px]">DESIGN CENTER BUSAN 1F Exhibition Hall</h3>
                <p className="mt-2 leading-relaxed">57, Centum dong-ro, Haeundae-gu, Busan</p>
              </div>

              <p className="pt-6 font-semibold text-[20px]">2026.11.06(FRI) - 11.08(SUN)</p>
              <p className="mt-2">10AM - 6PM</p>
            </div>
          </div>

          <div className="h-[400px] w-full max-w-[600px] justify-self-center">
            <KakaoMap />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="professors-title"
        className="px-6 pb-[clamp(112px,14vw,220px)] pt-[clamp(64px,8vw,120px)] sm:px-10 lg:px-[clamp(64px,7vw,140px)]"
      >
        <h2
          id="professors-title"
          className="text-center text-[clamp(28px,2.4vw,32px)] font-bold"
        >
          교수님 소개
        </h2>

        <motion.div
          className="mx-auto mt-16 grid w-full max-w-[1200px] grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-16 sm:grid-cols-2 xl:grid-cols-4"
          variants={professorContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {PROFESSORS.map((professor) => (
            <motion.article
              key={professor.id}
              variants={professorItem}
              className="min-w-0 text-center"
            >
              <div className="mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden">
                <img
                  src={professor.image}
                  alt={`${professor.name} 사진`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-[clamp(28px,3vw,52px)] text-[26px] font-semibold text-[#000101]">
                {professor.name}
              </h3>
              <p className="mt-[16px] text-[18px] font-medium text-[#888A96]">
                {professor.field}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;
