import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import { teamProjects, type TeamCategory } from "../data/team";

const categories: TeamCategory[] = ["BRANDING", "DP", "OPENING", "WEB"];

const defaultDescription =
  "우리는 사용자의 행동 패턴을 분석하여 가장 직관적이고 편리한 UI/UX 인터페이스를 설계합니다. 복잡한 과정을 최소화하고, 누구나 쉽게 이해할 수 있는 디지털 환경을 만드는 것이 우리의 목표입니다. 지금 새로운 변화를 경험해 보세요.";

type MediaPanelProps = {
  src?: string;
  alt: string;
  className?: string;
};

const MediaPanel = ({ src, alt, className = "" }: MediaPanelProps) => (
  <div className={`overflow-hidden bg-white/30 ${className}`}>
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <span className="sr-only">{alt} 준비 중</span>
    )}
  </div>
);

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="text-[clamp(22px,2vw,34px)] font-semibold tracking-[-0.02em]">
    {children}
  </h2>
);

const TeamProjectDetail = () => {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<HTMLElement>(null);
  const snapAnimationRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);
  const isWheelGestureLockedRef = useRef(false);
  const wheelUnlockTimerRef = useRef<number | null>(null);
  const { category: categoryParam } = useParams();
  const category = categoryParam?.toUpperCase() as TeamCategory | undefined;
  const currentIndex = category ? categories.indexOf(category) : -1;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [categoryParam]);

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
  }, [categoryParam]);

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
        releaseWheelGestureAfterIdle();
      };

      snapAnimationRef.current = window.requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isWheelGestureLockedRef.current) {
        event.preventDefault();

        if (!isSnappingRef.current) {
          releaseWheelGestureAfterIdle();
        }

        return;
      }

      if (Math.abs(event.deltaY) < 6) {
        return;
      }

      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }

      const frameHeight = container.clientHeight - 64;
      const lastFrameTop = frameHeight * 2;
      const isEnteringFooter = event.deltaY > 0 && container.scrollTop >= lastFrameTop - 1;
      const isLeavingFooter = event.deltaY < 0 && container.scrollTop > lastFrameTop + 1;

      if (isEnteringFooter || isLeavingFooter) {
        return;
      }

      event.preventDefault();

      const snapPoints = [0, frameHeight, lastFrameTop];
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

      if (targetFrameIndex === currentFrameIndex) {
        return;
      }

      isWheelGestureLockedRef.current = true;
      snapTo(snapPoints[targetFrameIndex]);
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
      container.style.scrollSnapType = "";
    };
  }, [categoryParam]);

  if (currentIndex === -1 || !category) {
    return <Navigate to="/project" replace />;
  }

  const project = teamProjects[category];
  const previous = categories[(currentIndex - 1 + categories.length) % categories.length];
  const next = categories[(currentIndex + 1) % categories.length];
  const conceptDescription = project.conceptDescription || project.description || defaultDescription;
  const videoDescription = project.videoDescription || defaultDescription;
  const interactionDescription = project.interactionDescription || defaultDescription;
  const backgroundImage = `/images/team-object/teamObject_${category}.png`;

  return (
    <main
      ref={scrollContainerRef}
      className="team-detail relative isolate h-[calc(100svh-72px)] snap-y snap-proximity overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#12191d] text-white lg:h-[calc(100svh-var(--header-height))]"
    >
      <div
        className="team-detail__backdrop fixed inset-x-0 bottom-0 top-[var(--header-height)] -z-20 bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        aria-hidden="true"
      />
      <div className="team-detail__veil fixed inset-x-0 bottom-0 top-[var(--header-height)] -z-10" aria-hidden="true" />

      <section className="relative mx-auto flex h-[calc(100svh-72px-4rem)] max-w-[1920px] snap-start snap-always overflow-hidden lg:h-[calc(100svh-var(--header-height)-4rem)]">
        <MediaPanel
          alt={`${project.title} 대표 영상`}
          className="absolute inset-y-0 left-0 aspect-[9/16] h-full shrink-0 md:relative"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#07151d]/35 via-[#07151d]/90 to-[#07151d] md:hidden" aria-hidden="true" />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col px-6 py-[clamp(28px,5svh,64px)] sm:px-10 lg:px-[clamp(42px,4vw,80px)]">
          <Link
            to="/project"
            className="group ml-auto inline-flex items-center gap-2 text-lg font-semibold text-white/40 transition-colors hover:text-white focus-visible:text-white"
          >
            <span className="text-3xl font-light leading-none transition-transform group-hover:-translate-x-1" aria-hidden="true">‹</span>
            BACK
          </Link>

          <dl className="mt-2 text-sm leading-relaxed lg:mt-[-30px]">
            <div>
              <dt className="font-semibold text-[#45BFE6]">credit</dt>
              <dd className="mt-2 font-semibold text-2xl">{category}</dd>
              <dd className="mt-3 flex text-lg flex-wrap gap-x-4 gap-y-1 text-white">
                {project.members.map((member) => (
                  <Link
                    key={member.id}
                    to={`/designer/${member.id}`}
                    className="exhibition-member-link"
                  >
                    {member.name}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>

          <section className="mt-auto pt-32 lg:pt-16">
            <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[clamp(24px,2vw,34px)] font-semibold">
              {project.conceptName || "컨셉"}
              <span className="text-sm font-medium text-[#45BFE6]">Team Concept</span>
            </h1>
            <p className="mt-4 max-w-[980px] whitespace-pre-line text-sm leading-7 text-white/85">{conceptDescription}</p>
          </section>
        </div>
      </section>

      <section className="mx-auto h-[calc(100svh-72px-4rem)] max-w-[1720px] snap-start snap-always overflow-hidden px-6 py-10 sm:px-10 md:py-[clamp(48px,6vw,96px)] lg:h-[calc(100svh-var(--header-height)-4rem)] lg:px-[clamp(56px,6.25vw,120px)]">
        <SectionTitle>TEAM FILM</SectionTitle>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.45fr_0.85fr] md:items-start md:gap-[clamp(20px,3vw,48px)]">
          <MediaPanel alt={`${project.videoTitle} 영상`} className="aspect-video" />

          <section>
            <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[clamp(22px,2vw,30px)] font-semibold">
              {project.videoTitle || "영상 제목"}
              <span className="text-sm font-medium text-[#45BFE6]">Team Film</span>
            </h3>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/85">{videoDescription}</p>
          </section>
        </div>
      </section>

      <section className="mx-auto h-[calc(100svh-72px-4rem)] max-w-[1720px] snap-start snap-always overflow-hidden px-6 py-9 sm:px-10 md:py-[clamp(40px,4vw,70px)] lg:h-[calc(100svh-var(--header-height)-4rem)] lg:px-[clamp(56px,6.25vw,120px)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionTitle>INDIVIDUAL INTERACTION</SectionTitle>
          <span className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm text-white/65">
            <span aria-hidden="true">↗</span>
            시나리오 영상
          </span>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.05fr_1fr] md:items-start md:gap-[clamp(32px,5vw,52px)]">
          <div className="grid grid-cols-2 gap-2">
            <MediaPanel alt={`${project.interactionTitle} 화면 1`} className="aspect-video" />
            <MediaPanel alt={`${project.interactionTitle} 화면 2`} className="aspect-video" />
          </div>

          <section>
            <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[clamp(22px,2vw,30px)] font-semibold">
              {project.interactionTitle || "인터 제목"}
              <span className="text-sm font-medium text-[#45BFE6]">Team Interaction</span>
            </h3>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/85">{interactionDescription}</p>
          </section>
        </div>

        <div className="mt-[clamp(32px,5vw,72px)] grid grid-cols-3 gap-3 sm:gap-[clamp(24px,3vw,50px)]">
          {[1, 2, 3].map((index) => (
            <figure key={index}>
              <MediaPanel alt={`${project.interactionTitle} 시나리오 ${index}`} className="aspect-video" />
              <figcaption className="mt-3 text-xs text-white/75">시나리오 설명</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div ref={footerRef}>
        <Footer />
      </div>

      <nav
        ref={navigatorRef}
        className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-3 items-center bg-[#0871b8] px-5 text-base sm:px-10 lg:px-[clamp(56px,6.25vw,120px)]"
        aria-label="다른 팀 프로젝트"
      >
        <Link to={`/project/team/${previous.toLowerCase()}`} className="group flex min-w-0 items-center gap-2 justify-self-start">
          <img src="/images/icon/arrowLeft.png" alt="" className="h-5 w-auto opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          <span className="truncate text-lg opacity-70 transition-opacity group-hover:opacity-100">{previous}</span>
        </Link>

        <Link to="/project" aria-label="프로젝트 목록" className="grid grid-cols-2 gap-1 justify-self-center p-3 opacity-80 transition-opacity hover:opacity-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="h-2 w-2 border border-white" />
          ))}
        </Link>

        <Link to={`/project/team/${next.toLowerCase()}`} className="group flex min-w-0 items-center gap-2 justify-self-end">
          <span className="truncate text-lg opacity-70 transition-opacity group-hover:opacity-100">{next}</span>
          <img src="/images/icon/arrowRight.png" alt="" className="h-5 w-auto opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
};

export default TeamProjectDetail;
