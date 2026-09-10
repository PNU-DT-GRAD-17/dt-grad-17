import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import { designers } from "../data/designers";

const defaultDescription =
  "우리는 사용자의 행동 패턴을 분석하여 가장 직관적이고 편리한 경험을 설계합니다. 복잡한 과정을 최소화하고, 누구나 쉽게 이해할 수 있는 디지털 환경을 만드는 것이 우리의 목표입니다.";

const MediaPlaceholder = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="aspect-[16/9] overflow-hidden bg-white/30">
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <span className="sr-only">이미지 준비 중</span>
    )}
  </div>
);

const ProjectDetail = () => {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<HTMLElement>(null);
  const snapAnimationRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);
  const location = useLocation();
  const { designerId } = useParams();
  const projectDesigners = designers.filter((designer) => designer.id !== "all");
  const currentIndex = projectDesigners.findIndex((designer) => designer.id === designerId);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const targetId = location.hash.slice(1);

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView();
    } else {
      scrollContainerRef.current?.scrollTo(0, 0);
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

    const snapTo = (targetTop: number) => {
      if (isSnappingRef.current) {
        return;
      }

      if (reducedMotion) {
        container.scrollTop = targetTop;
        return;
      }

      isSnappingRef.current = true;
      // Prevent the browser snap from fighting the custom animation.
      container.style.scrollSnapType = "none";
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
        container.style.scrollSnapType = "";
        snapAnimationRef.current = null;
        isSnappingRef.current = false;
      };

      snapAnimationRef.current = window.requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 6) {
        return;
      }

      const firstSectionHeight = container.clientHeight - 64;
      const boundaryTolerance = 96;
      const isLeavingPoster = event.deltaY > 0 && container.scrollTop < boundaryTolerance;
      const isReturningToPoster =
        event.deltaY < 0 &&
        container.scrollTop > boundaryTolerance &&
        container.scrollTop <= firstSectionHeight + boundaryTolerance;

      if (!isLeavingPoster && !isReturningToPoster && !isSnappingRef.current) {
        return;
      }

      event.preventDefault();

      if (isLeavingPoster) {
        snapTo(firstSectionHeight);
      } else if (isReturningToPoster) {
        snapTo(0);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);

      if (snapAnimationRef.current !== null) {
        window.cancelAnimationFrame(snapAnimationRef.current);
      }

      snapAnimationRef.current = null;
      isSnappingRef.current = false;
      container.style.scrollSnapType = "";
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
      className="project-detail relative h-[calc(100svh-var(--header-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0a171e] text-white"
    >
      <div
        className="project-detail__poster fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        aria-hidden="true"
      />
      <div className="project-detail__veil fixed inset-0" aria-hidden="true" />

      <div className="relative z-10">
        <section className="relative mx-auto flex h-[calc(100svh-var(--header-height)-4rem)] max-w-[1920px] snap-start snap-always overflow-hidden">
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
                  <span className="text-sm font-medium text-[#45BFE6]">poster</span>
                </h2>
                <p className="mt-4 max-w-[920px] whitespace-pre-line text-sm leading-7 text-white">{motionPosterDescription}</p>
              </section>
            </div>
          </div>
        </section>

        <section id="individual-interaction" className="min-h-[calc(100svh-var(--header-height))] snap-start snap-always px-12 py-16 lg:pb-24 lg:pt-12">
          <div className="mb-7 flex items-end justify-between gap-6">
            <h2 className="text-[clamp(22px,2vw,32px)] font-semibold tracking-[-0.02em]">INDIVIDUAL INTERACTION</h2>
            {detail?.scenarioUrl && (
              <a href={detail.scenarioUrl} target="_blank" rel="noreferrer" className="shrink-0 text-sm text-white/65 underline-offset-4 hover:text-white hover:underline">
                ↗ 시나리오 영상
              </a>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.12fr] lg:items-start">
            <section>
              <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-semibold">
                {designer.interactionTitle || "인터랙션 제목"}
                <span className="text-sm font-medium text-[#45BFE6]">interaction</span>
              </h3>
              <p className="mt-5 max-w-[800px] whitespace-pre-line text-sm leading-7 text-white">{interactionDescription}</p>
            </section>

            <div className="grid grid-cols-2 overflow-hidden">
              <MediaPlaceholder src={detail?.interactionImages?.[0]} alt={`${designer.interactionTitle} 인터랙션 화면 1`} />
              <MediaPlaceholder src={detail?.interactionImages?.[1]} alt={`${designer.interactionTitle} 인터랙션 화면 2`} />
            </div>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
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

      <nav
        ref={navigatorRef}
        className="project-detail__navigator fixed inset-x-0 bottom-0 z-20 grid h-16 grid-cols-3 items-center bg-[#0066AD] px-5 text-base sm:px-10 lg:px-[clamp(56px,6.25vw,120px)]"
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
        <Link to="/project" aria-label="프로젝트 목록" className="grid grid-cols-2 gap-1 justify-self-center p-3 opacity-80 transition-opacity hover:opacity-100">
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
