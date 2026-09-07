import { useCallback, useEffect, useState } from "react";

import Footer from "../components/Footer";

// 유튜브 영상 주소가 정해지면 이 값만 교체해 주세요.
// watch, youtu.be, shorts 주소를 모두 사용할 수 있습니다.
const MAKING_FILM_URL = "";

type BCut = {
  src: string;
  date: string;
  title: string;
};

// 실제 비하인드 사진이 준비되면 src, date, title을 교체해 주세요.
const B_CUTS: BCut[] = [
  { src: "/images/object/original/01_ori.png", date: "00.00.00", title: "사진 제목 01" },
  { src: "/images/object/original/02_ori.png", date: "00.00.00", title: "사진 제목 02" },
  { src: "/images/object/original/03_ori.png", date: "00.00.00", title: "사진 제목 03" },
  { src: "/images/object/original/04_ori.png", date: "00.00.00", title: "사진 제목 04" },
  { src: "/images/object/original/05_ori.png", date: "00.00.00", title: "사진 제목 05" },
];

const MAX_STACK_SIZE = 5;
const CARD_ANGLES = [0, -2.4, 1.7, -1.1, 2.8] as const;

type StackedCut = {
  id: number;
  cutIndex: number;
  angle: number;
};

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.hostname.includes("youtu.be")
      ? parsedUrl.pathname.slice(1)
      : parsedUrl.searchParams.get("v") ?? parsedUrl.pathname.split("/").filter(Boolean).pop();

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
};

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => {
  const blueArrow = direction === "left" ? "arrowLeftBlue.png" : "arrowRightBlue.png";

  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
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
  const [cardStack, setCardStack] = useState<StackedCut[]>([
    { id: 0, cutIndex: 1, angle: CARD_ANGLES[0] },
  ]);
  const makingFilmEmbedUrl = getYoutubeEmbedUrl(MAKING_FILM_URL);
  const activeIndex = cardStack.at(-1)?.cutIndex ?? 0;

  const addCutToStack = useCallback((cutIndex: number) => {
    setCardStack((currentStack) => {
      const nextId = (currentStack.at(-1)?.id ?? 0) + 1;

      if (currentStack.length >= MAX_STACK_SIZE) {
        return [{ id: nextId, cutIndex, angle: CARD_ANGLES[0] }];
      }

      return [
        ...currentStack,
        {
          id: nextId,
          cutIndex,
          angle: CARD_ANGLES[currentStack.length],
        },
      ];
    });
  }, []);

  const moveCut = useCallback((direction: -1 | 1) => {
    setCardStack((currentStack) => {
      const currentIndex = currentStack.at(-1)?.cutIndex ?? 0;
      const cutIndex = (currentIndex + direction + B_CUTS.length) % B_CUTS.length;
      const nextId = (currentStack.at(-1)?.id ?? 0) + 1;

      if (currentStack.length >= MAX_STACK_SIZE) {
        return [{ id: nextId, cutIndex, angle: CARD_ANGLES[0] }];
      }

      return [
        ...currentStack,
        {
          id: nextId,
          cutIndex,
          angle: CARD_ANGLES[currentStack.length],
        },
      ];
    });
  }, []);

  const showPrevious = useCallback(() => moveCut(-1), [moveCut]);
  const showNext = useCallback(() => moveCut(1), [moveCut]);

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
      className="min-h-screen bg-top text-[#000101]"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-[clamp(64px,8vw,118px)] sm:px-8 lg:px-12 lg:pb-40">
        <h1 className="flex justify-center">
          <img
            src="/images/label-behind.png"
            alt="비하인드"
            className="h-auto w-[clamp(220px,20vw,380px)] object-contain"
          />
        </h1>

        <section className="mt-[clamp(82px,10vw,140px)]" aria-labelledby="making-film-title">
          <h2
            id="making-film-title"
            className="mb-[40px] text-[#000101] text-center text-[clamp(20px,2vw,28px)] font-semibold"
          >
            Making Film
          </h2>

          <div className="mx-auto aspect-video w-full max-w-[760px] overflow-hidden bg-[#d8d8d8] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {makingFilmEmbedUrl ? (
              <iframe
                src={makingFilmEmbedUrl}
                title="졸업전시 Making Film"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(145deg,#dadada,#a9a9a9)] px-6 text-center text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 bg-black/15 pl-1 text-2xl sm:h-20 sm:w-20">
                  ▶
                </span>
                <p className="mt-5 text-sm font-medium tracking-wide sm:text-base">Making Film 준비 중</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-[clamp(105px,13vw,190px)]" aria-labelledby="b-cut-title">
          <h2
            id="b-cut-title"
            className="mb-[40px] text-center text-[#000101] text-[clamp(20px,2vw,28px)] font-semibold"
          >
            B-cut
          </h2>

          <div className="relative mx-auto w-full max-w-[720px] px-2 sm:px-10">
            <div className="relative">
              {cardStack.map((stackedCut, stackIndex) => {
                const cut = B_CUTS[stackedCut.cutIndex];
                const isActive = stackIndex === cardStack.length - 1;

                return (
                  <article
                    key={stackedCut.id}
                    aria-hidden={!isActive}
                    className={`${stackIndex === 0 ? "relative" : "absolute inset-0"} border border-[#A0A0A0] bg-[#fbfbfa] p-[clamp(14px,2vw,24px)] shadow-[0_12px_28px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-out`}
                    style={{
                      zIndex: stackIndex + 1,
                      transform: `rotate(${stackedCut.angle}deg)`,
                    }}
                  >
                    <div className="aspect-[16/9] overflow-hidden border border-[#A0A0A0] bg-[#ecece8]">
                      <img
                        src={cut.src}
                        alt={isActive ? cut.title : ""}
                        className="h-full w-full object-contain p-[4%]"
                      />
                    </div>

                    <div className="mt-[clamp(14px,2vw,24px)] flex items-end justify-between gap-6 text-[clamp(14px,1.7vw,22px)] text-[#A0A0A0]">
                      <time>{cut.date}</time>
                      <p className="truncate text-right">{cut.title}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-[clamp(70px,8vw,108px)] flex max-w-[930px] items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="이전 B-cut 사진"
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white transition-transform hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#45BFE6] sm:h-14 sm:w-14"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="grid min-w-0 flex-1 grid-cols-5 gap-2 sm:gap-3">
              {B_CUTS.map((cut, index) => (
                <button
                  key={`${cut.src}-${index}`}
                  type="button"
                  onClick={() => addCutToStack(index)}
                  aria-label={`${cut.title} 보기`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={`aspect-[4/3] overflow-hidden bg-[#ecece8] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45BFE6] ${
                    activeIndex === index
                      ? "ring-[4px] ring-[#45BFE6]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={cut.src} alt="" className="h-full w-full object-contain p-2" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="다음 B-cut 사진"
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#45BFE6] sm:h-14 sm:w-14"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Behind;
