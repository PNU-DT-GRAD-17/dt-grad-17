import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import MobileProjectHeader from "../components/MobileProjectHeader";
import { ScenarioVideoLink, ScenarioVideoModal } from "../components/ScenarioVideo";
import { designers } from "../data/designers";

const defaultDescription =
  "우리는 사용자의 행동 패턴을 분석하여 가장 직관적이고 편리한 경험을 설계합니다. 복잡한 과정을 최소화하고, 누구나 쉽게 이해할 수 있는 디지털 환경을 만드는 것이 우리의 목표입니다.";

const MediaPlaceholder = ({
  src,
  alt,
  className = "aspect-[16/9]",
  imageClassName = "object-cover",
}: {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) => (
  <div className={`${className} overflow-hidden bg-white/30`}>
    {src ? (
      <img src={src} alt={alt} className={`h-full w-full ${imageClassName}`} />
    ) : (
      <span className="sr-only">이미지 준비 중</span>
    )}
  </div>
);

const ProjectDetail = () => {
  const [isScenarioVideoOpen, setIsScenarioVideoOpen] = useState(false);
  const [isMobileConceptOpen, setIsMobileConceptOpen] = useState(false);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<HTMLElement>(null);
  const snapAnimationRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);
  const isWheelGestureLockedRef = useRef(false);
  const wheelUnlockTimerRef = useRef<number | null>(null);
  const location = useLocation();
  const { designerId } = useParams();
  const projectDesigners = designers.filter((designer) => designer.id !== "all");
  const currentIndex = projectDesigners.findIndex((designer) => designer.id === designerId);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const targetId = location.hash.slice(1);

    if (targetId) {
      // 모바일에서는 아래 모바일 전용 인터랙션 섹션으로 이동합니다.
      const resolvedId = window.innerWidth < 768 && targetId === "individual-interaction"
        ? "mobile-individual-interaction"
        : targetId;
      document.getElementById(resolvedId)?.scrollIntoView();
    } else {
      scrollContainerRef.current?.scrollTo(0, 0);
      mobileGalleryRef.current?.scrollTo(0, 0);
    }
  }, [designerId, location.hash]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const footer = footerRef.current;
    const navigator = navigatorRef.current;

    if (!container || !footer || !navigator) {
      return;
    }

    const positionNavigator = () => {
      // 모바일 하단 내비게이션은 콘텐츠 끝에 놓이므로 위치 보정을 하지 않습니다.
      if (window.innerWidth < 768) {
        navigator.style.transform = "";
        return;
      }

      const secondFrameTop = container.clientHeight - 64;

      if (container.scrollTop <= secondFrameTop + 1) {
        navigator.style.transform = "";
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const footerOverlap = Math.max(0, window.innerHeight - footerTop);
      navigator.style.transform = `translateY(-${footerOverlap}px)`;
    };

    positionNavigator();
    container.addEventListener("scroll", positionNavigator, { passive: true });
    window.addEventListener("resize", positionNavigator);

    return () => {
      container.removeEventListener("scroll", positionNavigator);
      window.removeEventListener("resize", positionNavigator);
      navigator.style.transform = "";
    };
  }, [designerId]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const releaseWheelGestureAfterIdle = () => {
      if (wheelUnlockTimerRef.current !== null) {
        window.clearTimeout(wheelUnlockTimerRef.current);
      }

      wheelUnlockTimerRef.current = window.setTimeout(() => {
        isWheelGestureLockedRef.current = false;
        wheelUnlockTimerRef.current = null;
      }, 260);
    };

    const snapTo = (targetTop: number) => {
      if (isSnappingRef.current) {
        return;
      }

      if (reducedMotion) {
        container.scrollTop = targetTop;
        releaseWheelGestureAfterIdle();
        return;
      }

      isSnappingRef.current = true;
      const startTop = container.scrollTop;
      const distance = targetTop - startTop;
      const startedAt = performance.now();
      const duration = 620;

      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress =
            progress < 0.5
              ? 4 * progress ** 3
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        container.scrollTop = startTop + distance * easedProgress;

        if (progress < 1) {
          snapAnimationRef.current = window.requestAnimationFrame(animate);
          return;
        }

        container.scrollTop = targetTop;
        snapAnimationRef.current = null;
        isSnappingRef.current = false;
        releaseWheelGestureAfterIdle();
      };

      snapAnimationRef.current = window.requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      // 모바일은 일반 스크롤 사용. 768px 이상에서만 화면 단위 스크롤을 적용합니다.
      if (window.innerWidth < 768) return;

      const frameHeight = container.clientHeight - 64;
      const lastFrameTop = frameHeight;
      const isEnteringFooter =
        event.deltaY > 0 && container.scrollTop >= lastFrameTop - 1;
      const isLeavingFooter =
        event.deltaY < 0 && container.scrollTop > lastFrameTop + 1;

      if (isWheelGestureLockedRef.current) {
        event.preventDefault();

        if (!isSnappingRef.current) {
          releaseWheelGestureAfterIdle();
        }

        return;
      }

      // The footer keeps native scrolling in both directions. Once it reaches
      // the final project frame again, the presentation-style navigation resumes.
      if (isEnteringFooter || isLeavingFooter) {
        return;
      }

      if (Math.abs(event.deltaY) < 6) {
        event.preventDefault();
        return;
      }

      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const snapPoints = [0, lastFrameTop];
      const currentFrameIndex = snapPoints.reduce(
        (closestIndex, point, index) =>
          Math.abs(point - container.scrollTop) <
          Math.abs(snapPoints[closestIndex] - container.scrollTop)
            ? index
            : closestIndex,
        0,
      );
      const direction = event.deltaY > 0 ? 1 : -1;
      const targetFrameIndex = Math.min(
        snapPoints.length - 1,
        Math.max(0, currentFrameIndex + direction),
      );

      if (targetFrameIndex !== currentFrameIndex) {
        isWheelGestureLockedRef.current = true;
        snapTo(snapPoints[targetFrameIndex]);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);

      if (snapAnimationRef.current !== null) {
        window.cancelAnimationFrame(snapAnimationRef.current);
      }

      if (wheelUnlockTimerRef.current !== null) {
        window.clearTimeout(wheelUnlockTimerRef.current);
      }

      snapAnimationRef.current = null;
      isSnappingRef.current = false;
      isWheelGestureLockedRef.current = false;
      wheelUnlockTimerRef.current = null;
    };
  }, [designerId]);

  if (currentIndex === -1) {
    return <Navigate to="/project" replace />;
  }

  const designer = projectDesigners[currentIndex];
  const previous = projectDesigners[(currentIndex - 1 + projectDesigners.length) % projectDesigners.length];
  const next = projectDesigners[(currentIndex + 1) % projectDesigners.length];
  const detail = designer.projectDetail;
  const backgroundImage = detail?.motionPosterImage ?? designer.selectedObjectImage;
  const conceptDescription = designer.conceptDescription ?? defaultDescription;
  const motionPosterDescription = designer.motionPosterDescription ?? defaultDescription;
  const interactionDescription = designer.interactionDescription ?? defaultDescription;

  return (
    <main
      ref={scrollContainerRef}
      className="project-detail relative h-[calc(100svh-var(--header-height))] overflow-x-hidden overflow-y-hidden overscroll-y-contain bg-[#0a171e] text-white md:overflow-y-auto"
    >
      <div
        className="project-detail__poster fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        aria-hidden="true"
      />
      <div className="project-detail__veil fixed inset-0" aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex h-[calc(100svh-var(--header-height))] flex-col md:hidden">
          <MobileProjectHeader key={designer.id} label={designer.name} currentPath={`/project/${designer.id}`} />

          <div
            ref={mobileGalleryRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-none"
            aria-label="개인 프로젝트 갤러리"
            tabIndex={0}
            onScroll={(event) => {
              const gallery = event.currentTarget;
              if (gallery.clientWidth > 0) {
                setMobileSlideIndex(Math.max(0, Math.min(4, Math.round(gallery.scrollLeft / gallery.clientWidth))));
              }
            }}
          >
            <section className="relative h-full min-w-full snap-start touch-pan-x overflow-hidden" aria-label="모션 포스터 썸네일">
              <button
                type="button"
                className="h-full w-full cursor-pointer"
                onClick={() => setIsMobileConceptOpen((isOpen) => !isOpen)}
                aria-expanded={isMobileConceptOpen}
                aria-controls="mobile-project-concept"
                aria-label={`${designer.conceptName || "컨셉"} 설명 ${isMobileConceptOpen ? "닫기" : "보기"}`}
              >
                <img
                  src={backgroundImage}
                  alt={`${designer.motionPosterTitle || designer.name} 모션 포스터`}
                  className="h-full w-full object-cover"
                />
              </button>
              {isMobileConceptOpen ? (
                <button
                  id="mobile-project-concept"
                  type="button"
                  className="absolute inset-0 flex w-full cursor-pointer flex-col items-start overflow-hidden bg-[#000101]/60 px-5 pb-8 pt-7 text-left text-white"
                  onClick={() => setIsMobileConceptOpen(false)}
                  aria-label="컨셉 설명 닫고 썸네일 보기"
                >
                  <span className="flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                    <span>{designer.conceptName || "컨셉 제목"}</span>
                    <span className="text-sm font-medium text-[#45BFE6]">concept</span>
                  </span>
                  <span className="mt-6 shrink-0 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{conceptDescription}</span>
                </button>
              ) : (
                <div id="mobile-project-concept" className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-16 text-center text-sm text-white/60">
                  이미지를 터치하면 컨셉 설명이 보입니다.
                </div>
              )}
            </section>

            <section id="mobile-individual-interaction" className="h-full min-w-full snap-start overflow-y-auto px-5 pb-8 pt-7">
              <h2 className="flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                <span>{designer.interactionTitle || "인터랙션 제목"}</span>
                <span className="text-sm font-medium text-[#45BFE6]">interaction</span>
              </h2>
              <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{interactionDescription}</p>
              <div className="mt-8 grid w-full grid-cols-1">
                {["도면", "배치도"].map((label, index) => (
                  <figure key={label}>
                    <MediaPlaceholder
                      className="aspect-square"
                      imageClassName="object-contain"
                      src={detail?.interactionImages?.[index]}
                      alt={`${designer.interactionTitle || "인터랙션"} ${label}`}
                    />
                  </figure>
                ))}
              </div>
            </section>

            <section className="flex h-full min-w-full snap-start flex-col overflow-hidden">
              <div className="flex shrink-0 justify-center px-5 pb-6">
                <ScenarioVideoLink onClick={() => setIsScenarioVideoOpen(true)} />
              </div>
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-8">
                {[2, 3, 4].map((index) => (
                  <figure key={index}>
                    <MediaPlaceholder className="aspect-[16/9]" src={detail?.interactionImages?.[index]} alt={`${designer.interactionTitle} 시나리오 ${index - 1}`} />
                    <figcaption className="mt-3 text-sm text-white/80">시나리오 설명</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="h-full min-w-full snap-start touch-pan-x overflow-hidden" aria-label="모션 포스터">
              <video
                src={detail?.motionPosterVideoUrl}
                poster={backgroundImage}
                aria-label={`${designer.motionPosterTitle || designer.name} 모션 포스터 영상`}
                className="h-full w-full object-contain"
                controls
                playsInline
                loop
                preload="metadata"
              />
            </section>

            <section className="h-full min-w-full snap-start touch-pan-x overflow-hidden px-5 pb-8 pt-7" aria-label="모션 포스터 설명">
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                <span>{designer.motionPosterTitle || "포스터 제목"}</span>
                <span className="text-sm font-medium text-[#45BFE6]">motion poster</span>
              </h2>
              <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{motionPosterDescription}</p>
            </section>
          </div>
        </div>

        <div
          className="pointer-events-none fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 md:hidden"
          role="img"
          aria-label={`전체 5페이지 중 ${mobileSlideIndex + 1}페이지`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full transition-colors ${index === mobileSlideIndex ? "bg-white/80" : "bg-white/40"}`}
            />
          ))}
        </div>

        {/* 데스크톱 전용 레이아웃 (768px 이상): 모바일 디자인 수정 시 이 영역은 유지합니다. */}
        <div className="hidden md:block">
        <section className="relative mx-auto flex h-[calc(100svh-var(--header-height)-4rem)] max-w-[1920px] overflow-hidden">
          <div className="absolute inset-y-0 left-0 aspect-[9/16] h-full shrink-0 overflow-hidden bg-white/30 lg:relative">
            <img
              src={backgroundImage}
              alt={`${designer.motionPosterTitle || designer.name} 모션 포스터`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#07151d]/35 via-[#07151d]/90 to-[#07151d] lg:hidden" aria-hidden="true" />

          <div className="relative z-10 flex min-w-0 flex-1 flex-col px-6 pb-[clamp(28px,5svh,64px)] pt-[clamp(28px,5svh,64px)] sm:px-10 lg:px-[clamp(48px,5vw,52px)]">

            <Link
              to="/project"
              className="group absolute right-6 top-8 inline-flex items-center gap-2 text-lg font-semibold text-white/40 transition-colors hover:text-white sm:right-10 lg:right-[clamp(48px,5vw,96px)] lg:top-[clamp(28px,5svh,64px)]"
            >
              <img
                src="/images/icon/arrowLeft.png"
                alt=""
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              BACK
            </Link>

            <dl className="text-sm leading-relaxed">
              <div>
                <dt className="font-semibold text-[#45BFE6]">credit</dt>
                <dd className="mt-2 text-xl">
                  <Link
                    to={`/designer/${designer.id}`}
                    className="exhibition-member-link detail-member-link inline-flex"
                  >
                    {designer.name}
                  </Link>
                </dd>
              </div>
            </dl>

            <div className="mt-auto space-y-[clamp(24px,4svh,44px)]">
              <section>
                <h1 className="flex items-baseline gap-3 text-2xl font-semibold">
                  {designer.conceptName || "컨셉 제목"}
                  <span className="text-sm font-medium text-[#45BFE6]">concept</span>
                </h1>
                <p className="mt-4 max-w-[920px] whitespace-pre-line text-sm leading-7 text-white/80">{conceptDescription}</p>
              </section>

              <section>
                <h2 className="flex items-baseline gap-3 text-2xl font-semibold">
                  {designer.motionPosterTitle || "포스터 제목"}
                  <span className="text-sm font-medium text-[#45BFE6]">motion poster</span>
                </h2>
                <p className="mt-4 max-w-[920px] whitespace-pre-line text-sm leading-7 text-white">{motionPosterDescription}</p>
              </section>
            </div>
          </div>
        </section>

        <section id="individual-interaction" className="h-[calc(100svh-var(--header-height))] overflow-hidden px-12 py-16 lg:pb-24 lg:pt-12">
          <div className="mb-7 flex items-end justify-between gap-6">
            <h2 className="text-[clamp(22px,2vw,32px)] font-semibold tracking-[-0.02em]">INDIVIDUAL INTERACTION</h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.12fr] lg:items-start">
            <section className="lg:-mr-[144px] xl:-mr-[176px]">
              <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-semibold">
                {designer.interactionTitle || "인터랙션 제목"}
                <span className="text-sm font-medium text-[#45BFE6]">interaction</span>
              </h3>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white">{interactionDescription}</p>
              <ScenarioVideoLink onClick={() => setIsScenarioVideoOpen(true)} />
            </section>

            <div className="grid w-4/5 grid-cols-2 justify-self-end overflow-hidden">
              <MediaPlaceholder className="aspect-square" imageClassName="object-contain" src={detail?.interactionImages?.[0]} alt={`${designer.interactionTitle} 인터랙션 화면 1`} />
              <MediaPlaceholder className="aspect-square" imageClassName="object-contain" src={detail?.interactionImages?.[1]} alt={`${designer.interactionTitle} 인터랙션 화면 2`} />
            </div>
          </div>

          <div className="mt-[24px] grid gap-8 sm:grid-cols-3">
            {[2, 3, 4].map((index) => (
              <figure key={index}>
                <MediaPlaceholder src={detail?.interactionImages?.[index]} alt={`${designer.interactionTitle} 시나리오 ${index - 1}`} />
                <figcaption className="mt-3 text-xs text-white/70">시나리오 설명</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div ref={footerRef}>
          <Footer />
        </div>
        </div>
      </div>

      {isScenarioVideoOpen && (
        <ScenarioVideoModal onClose={() => setIsScenarioVideoOpen(false)} />
      )}

      {/* 이전·다음 내비게이션은 데스크톱에서만 표시합니다. */}
      <nav
        ref={navigatorRef}
        className="project-detail__navigator relative mx-2 z-20 hidden h-14 grid-cols-2 md:fixed md:inset-x-0 md:bottom-0 md:mx-0 md:grid md:h-16 md:grid-cols-3 items-center bg-[#0066AD] px-5 text-base sm:px-10 lg:px-[clamp(56px,6.25vw,120px)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 102, 173, 0.5), rgba(0, 102, 173, 0.5)), url('/images/blue_bg-upscaled.png')",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "100% 100%, 106% auto",
        }}
        aria-label="다른 개인 프로젝트"
      >
        <Link to={`/project/${previous.id}`} className="group flex items-center gap-2 justify-self-start">
          <img
            src="/images/icon/arrowLeft.png"
            alt=""
            className="h-5 w-auto opacity-70 transition-all duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span className="opacity-70 transition-opacity duration-200 group-hover:opacity-100 text-lg">{previous.name}</span>
        </Link>
        <Link to="/project" aria-label="프로젝트 목록" className="hidden grid-cols-2 gap-1 justify-self-center p-3 md:grid opacity-80 transition-opacity hover:opacity-100">
          {Array.from({ length: 4 }).map((_, index) => <span key={index} className="h-2 w-2 border border-white" />)}
        </Link>
        <Link to={`/project/${next.id}`} className="group flex items-center gap-2 justify-self-end">
          <span className="opacity-70 transition-opacity duration-200 group-hover:opacity-100 text-lg">{next.name}</span>
          <img
            src="/images/icon/arrowRight.png"
            alt=""
            className="h-5 w-auto opacity-70 transition-all duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
        </Link>
      </nav>
    </main>
  );
};

export default ProjectDetail;
