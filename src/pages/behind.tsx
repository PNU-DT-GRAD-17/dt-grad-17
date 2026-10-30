import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import Footer from "../components/Footer";
import behindCuts from "../data/behind.json";
import { getYoutubeEmbedUrl } from "../utils/youtube";

// watch, youtu.be, shorts 주소를 모두 사용할 수 있습니다.
const MAKING_FILM_URL = "https://www.youtube.com/watch?v=kHyJ7CxcEA4";

type BCut = {
  src: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  date: string;
  title: string;
};

// 사진 정보와 표시 순서는 src/data/behind.json에서 관리합니다.
const B_CUTS: BCut[] = behindCuts;

const THUMBNAILS_PER_PAGE = 5;
const CARD_ANGLES = [0, -2.4, 1.7, -1.1, 2.8] as const;
const CARD_PADDING = 16;
const CARD_BORDER = 1;
const STAGE_SIDE_PADDING = 16;

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => {
  const blueArrow = direction === "left" ? "arrowLeftBlue.webp" : "arrowRightBlue.webp";

  return (
    <span aria-hidden="true" className="relative block h-5 w-5 sm:h-6 sm:w-6">
      <svg
        viewBox="0 0 24 24"
        className={`absolute inset-0 h-full w-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0 ${
          direction === "right" ? "rotate-180" : ""
        }`}
      >
        <path
          d="M15 4 7 12l8 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
      </svg>
      <img
        src={`/images/icon/${blueArrow}`}
        alt=""
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </span>
  );
};

function Behind() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const makingFilmEmbedUrl = getYoutubeEmbedUrl(MAKING_FILM_URL);
  const thumbnailStart = Math.floor(activeIndex / THUMBNAILS_PER_PAGE) * THUMBNAILS_PER_PAGE;
  const visibleCuts = B_CUTS.slice(thumbnailStart, thumbnailStart + THUMBNAILS_PER_PAGE);
  const cardStack = B_CUTS.slice(thumbnailStart, activeIndex + 1);

  const addCutToStack = useCallback((cutIndex: number) => {
    setActiveIndex(cutIndex);
  }, []);

  const moveCut = useCallback((direction: -1 | 1) => {
    setActiveIndex((currentIndex) => (currentIndex + direction + B_CUTS.length) % B_CUTS.length);
  }, []);

  const showPrevious = useCallback(() => moveCut(-1), [moveCut]);
  const showNext = useCallback(() => moveCut(1), [moveCut]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(([entry]) => {
      setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pageCount = Math.ceil(B_CUTS.length / THUMBNAILS_PER_PAGE);
    if (pageCount === 0) return;

    const currentPage = thumbnailStart / THUMBNAILS_PER_PAGE;
    const pagesToPreload = new Set([
      currentPage,
      (currentPage + 1) % pageCount,
      (currentPage - 1 + pageCount) % pageCount,
    ]);

    // 현재 묶음과 앞뒤 묶음만 준비해 사진 수가 늘어도 한꺼번에 모두 받지 않습니다.
    for (const page of pagesToPreload) {
      const start = page * THUMBNAILS_PER_PAGE;
      for (const cut of B_CUTS.slice(start, start + THUMBNAILS_PER_PAGE)) {
        for (const src of new Set([cut.src, cut.thumbnail ?? cut.src])) {
          const image = new Image();
          image.decoding = "async";
          image.fetchPriority = "low";
          image.src = src;
          void image.decode().catch(() => undefined);
        }
      }
    }
  }, [thumbnailStart]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNext, showPrevious]);

  return (
    <main
      className="min-h-screen bg-[url('/images/background.webp')] bg-[length:400%_auto] bg-top bg-repeat-y text-[#000101] lg:bg-cover lg:bg-center lg:bg-no-repeat"
    >
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-[clamp(64px,8vw,118px)] sm:px-8 lg:px-12 lg:pb-[8.4rem]">
        <h1 className="flex justify-center">
          <img
            src="/images/label-behind.webp"
            alt="비하인드"
            className="h-auto w-[clamp(220px,20vw,380px)] object-contain"
          />
        </h1>

        <section className="mt-[clamp(72px,7vw,104px)]" aria-labelledby="making-film-title">
          <h2
            id="making-film-title"
            className="text-center text-[clamp(24px,2.4vw,32px)] font-semibold text-[#000101]"
          >
            Making Film
          </h2>

          <div className="mx-auto mt-12 flex aspect-video w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden bg-[#E3E7ED]">
            {makingFilmEmbedUrl ? (
              <iframe
                src={makingFilmEmbedUrl}
                title="졸업전시 Making Film"
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                src="/images/comingsoon.webp"
                alt="Making Film 준비 중"
                loading="lazy"
                decoding="async"
                className="w-[37.5%] object-contain"
              />
            )}
          </div>
        </section>

        <section className="mt-[clamp(105px,13vw,190px)]" aria-labelledby="b-cut-title">
          <h2
            id="b-cut-title"
            className="mb-4 text-center text-[#000101] text-[clamp(20px,2vw,28px)] font-semibold sm:mb-[40px]"
          >
            B-cut
          </h2>

          <div className="relative mx-auto w-full max-w-[720px] min-w-0 px-2 [--b-cut-stage-height:clamp(500px,65svh,540px)] sm:px-10">
            <div ref={stageRef} className="relative h-[var(--b-cut-stage-height)] w-full min-w-0">
              {cardStack.map((cut, stackIndex) => {
                const cutIndex = thumbnailStart + stackIndex;
                const isActive = stackIndex === cardStack.length - 1;
                const imageWidth = cut.width ?? 320;
                const imageHeight = cut.height ?? 320;
                const maxImageWidth = stageSize.width - STAGE_SIDE_PADDING * 2 - CARD_PADDING * 2 - CARD_BORDER * 2;
                const maxImageHeight = stageSize.height - 80;
                const scale = stageSize.width && stageSize.height
                  ? Math.min(1, maxImageWidth / imageWidth, maxImageHeight / imageHeight)
                  : 1;
                const displayedWidth = imageWidth * Math.max(0, scale);
                const frameWidth = displayedWidth + CARD_PADDING * 2 + CARD_BORDER * 2;

                return (
                  <div
                    key={cutIndex}
                    aria-hidden={!isActive}
                    className="absolute inset-0 flex min-w-0 items-center justify-center px-4"
                    style={{ zIndex: stackIndex + 1 }}
                  >
                    <article
                      className="box-border min-w-0 shrink border border-[#A0A0A0] bg-[#fbfbfa] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-out"
                      style={{
                        width: `${frameWidth}px`,
                        transform: `rotate(${CARD_ANGLES[stackIndex]}deg)`,
                      }}
                    >
                      <img
                        src={cut.src}
                        width={cut.width}
                        height={cut.height}
                        alt={isActive ? cut.title || `비하인드 사진 ${cutIndex + 1}` : ""}
                        decoding="async"
                        className="block h-auto w-full border border-[#A0A0A0]"
                      />

                      <div className="mt-2 flex w-full min-w-0 items-end justify-between gap-3 text-[clamp(7px,0.85vw,11px)] text-[#A0A0A0] sm:mt-3 sm:gap-6">
                        <time className="shrink-0">{cut.date}</time>
                        <p className="min-w-0 truncate text-right font-semibold" title={cut.title}>
                          {cut.title}
                        </p>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-[930px] items-center justify-center gap-3 sm:mt-12 sm:gap-6">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="이전 B-cut 사진"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white transition-transform hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#45BFE6] sm:h-14 sm:w-14"
            >
              <ArrowIcon direction="left" />
            </button>

            <p
              className="w-20 shrink-0 text-center text-base font-medium tabular-nums text-[#000101] sm:hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sr-only">현재 사진 </span>
              <span className="font-semibold text-[#0072c1]">{activeIndex + 1}</span>
              <span className="mx-2">/</span>
              <span>{B_CUTS.length}</span>
            </p>

            <div className="hidden min-w-0 flex-1 grid-cols-5 gap-3 sm:grid">
              {visibleCuts.map((cut, pageIndex) => {
                const index = thumbnailStart + pageIndex;
                return (
                  <button
                    key={`${cut.src}-${index}`}
                    type="button"
                    onClick={() => addCutToStack(index)}
                    aria-label={`${cut.title || `비하인드 사진 ${index + 1}`} 보기`}
                    aria-current={activeIndex === index ? "true" : undefined}
                    className={`aspect-[4/3] overflow-hidden bg-[#ecece8] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45BFE6] ${
                      activeIndex === index
                        ? "ring-[4px] ring-[#45BFE6]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={cut.thumbnail ?? cut.src}
                      width={cut.width}
                      height={cut.height}
                      alt=""
                      decoding="async"
                      className="h-full w-full object-contain p-1 sm:p-2"
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="다음 B-cut 사진"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#45BFE6] sm:h-14 sm:w-14"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <p
            className="mt-8 hidden text-center text-xl font-medium tabular-nums text-[#000101] sm:block"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="sr-only">현재 사진 </span>
            <span className="font-semibold text-[#0072c1]">{activeIndex + 1}</span>
            <span className="mx-2">/</span>
            <span>{B_CUTS.length}</span>
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Behind;
