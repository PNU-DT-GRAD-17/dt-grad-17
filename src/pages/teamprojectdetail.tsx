import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import MobileProjectHeader from "../components/MobileProjectHeader";
import { ScenarioVideoLink, ScenarioVideoModal } from "../components/ScenarioVideo";
import { teamProjects, type TeamCategory } from "../data/team";

const categories: TeamCategory[] = ["BRANDING", "DP", "OPENING", "WEB"];

const getYoutubeEmbedUrl = (value?: string) => {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;

    let videoId: string | null | undefined;
    if (host === "youtu.be") {
      videoId = url.pathname.split("/")[1];
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const [, kind, id] = url.pathname.split("/");
      videoId = kind === "watch" ? url.searchParams.get("v") :
        ["embed", "shorts", "live"].includes(kind) ? id : undefined;
    }

    return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : undefined;
  } catch {
    return undefined;
  }
};

const defaultDescription =
  "우리는 사용자의 행동 패턴을 분석하여 가장 직관적이고 편리한 UI/UX 인터페이스를 설계합니다. 복잡한 과정을 최소화하고, 누구나 쉽게 이해할 수 있는 디지털 환경을 만드는 것이 우리의 목표입니다. 지금 새로운 변화를 경험해 보세요.";

type MediaPanelProps = {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

const MediaPanel = ({ src, alt, className = "", imageClassName = "object-cover" }: MediaPanelProps) => (
  <div className={`overflow-hidden bg-white/30 ${className}`}>
    {src ? (
      <img src={src} alt={alt} className={`h-full w-full ${imageClassName}`} />
    ) : (
      <span className="sr-only">{alt} 준비 중</span>
    )}
  </div>
);

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="text-[clamp(22px,2vw,32px)] font-semibold tracking-[-0.02em]">
    {children}
  </h2>
);

const TeamProjectDetail = () => {
  const [isScenarioVideoOpen, setIsScenarioVideoOpen] = useState(false);
  const [isMobileConceptOpen, setIsMobileConceptOpen] = useState(false);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const [activeCreditId, setActiveCreditId] = useState<string | null>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<HTMLElement>(null);
  const snapAnimationRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);
  const isWheelGestureLockedRef = useRef(false);
  const wheelUnlockTimerRef = useRef<number | null>(null);
  const location = useLocation();
  const { category: categoryParam } = useParams();
  const category = categoryParam?.toUpperCase() as TeamCategory | undefined;
  const currentIndex = category ? categories.indexOf(category) : -1;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const targetId = location.hash.slice(1);

    if (targetId) {
      const resolvedId = window.innerWidth < 768 && ["team-film", "team-interaction"].includes(targetId)
        ? `mobile-${targetId}`
        : targetId;
      document.getElementById(resolvedId)?.scrollIntoView();
    } else {
      scrollContainerRef.current?.scrollTo(0, 0);
      mobileGalleryRef.current?.scrollTo(0, 0);
    }
  }, [categoryParam, location.hash]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const footer = footerRef.current;
    const navigator = navigatorRef.current;

    if (!container || !footer || !navigator) {
      return;
    }

    const positionNavigator = () => {
      if (window.innerWidth < 768) {
        navigator.style.transform = "";
        return;
      }
      const lastFrameTop = (container.clientHeight - 64) * 2;

      if (container.scrollTop <= lastFrameTop + 1) {
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
      if (window.innerWidth < 768) return;
      const frameHeight = container.clientHeight - 64;
      const lastFrameTop = frameHeight * 2;
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
  const detail = project.projectDetail;
  const filmEmbedUrl = getYoutubeEmbedUrl(detail?.filmUrl);
  const backgroundImage = detail?.motionPosterImage ?? `/images/team-object/teamObject_${category}.png`;

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
          <MobileProjectHeader key={category} label={category} currentPath={`/project/team/${category.toLowerCase()}`} />

          <div
            ref={mobileGalleryRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-none"
            aria-label="팀 프로젝트 갤러리"
            tabIndex={0}
            onScroll={(event) => {
              const gallery = event.currentTarget;
              if (gallery.clientWidth > 0) {
                setMobileSlideIndex(Math.max(0, Math.min(3, Math.round(gallery.scrollLeft / gallery.clientWidth))));
              }
            }}
          >
            <section className="relative h-full w-full shrink-0 snap-start touch-pan-x overflow-hidden" aria-label="팀 컨셉 이미지">
              <button
                type="button"
                className="h-full w-full cursor-pointer"
                onClick={() => setIsMobileConceptOpen((isOpen) => !isOpen)}
                aria-expanded={isMobileConceptOpen}
                aria-controls="mobile-team-concept"
                aria-label={`${project.conceptName || "컨셉"} 설명 ${isMobileConceptOpen ? "닫기" : "보기"}`}
              >
                <img src={backgroundImage} alt={`${project.title} 팀 컨셉 이미지`} className="h-full w-full object-cover" />
              </button>
              {isMobileConceptOpen ? (
                <div
                  id="mobile-team-concept"
                  className="absolute inset-0 flex w-full flex-col items-start overflow-hidden bg-[#000101]/60 px-5 pb-[calc(52px+env(safe-area-inset-bottom))] pt-7 text-left text-white"
                >
                  <button
                    type="button"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                    onClick={() => {
                      setIsMobileConceptOpen(false);
                      setActiveCreditId(null);
                    }}
                    aria-label="컨셉 설명 닫고 이미지 보기"
                  />
                  <span className="pointer-events-none relative flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                    <span>{project.conceptName || "컨셉 제목"}</span>
                    <span className="text-sm font-medium text-[#45BFE6]">concept</span>
                  </span>
                  <span className="pointer-events-none relative mt-6 shrink-0 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{conceptDescription}</span>
                  <span className="pointer-events-none relative mt-auto flex w-full shrink-0 flex-col items-start pt-6">
                    <span className="text-sm font-semibold text-[#45BFE6]">credit</span>
                    <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-lg">
                      {project.members.map((member) => (
                        <Link
                          key={member.id}
                          to={`/designer/${member.id}`}
                          className="exhibition-member-link mobile-project-designer-link pointer-events-auto inline-flex transition-colors"
                          data-active={activeCreditId === member.id}
                          onClick={(event) => {
                            if (activeCreditId !== member.id) {
                              event.preventDefault();
                              setActiveCreditId(member.id);
                            }
                          }}
                          onBlur={() => setActiveCreditId(null)}
                        >
                          {member.name}
                        </Link>
                      ))}
                    </span>
                  </span>
                </div>
              ) : (
                <div id="mobile-team-concept" className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-12 pt-16 text-center text-sm text-white/60">
                  이미지를 터치하면 컨셉 설명이 보입니다.
                </div>
              )}
            </section>

            <section id="mobile-team-interaction" className="h-full w-full shrink-0 snap-start overflow-y-auto px-5 pb-12 pt-7">
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                <span>{project.interactionTitle || "인터랙션 제목"}</span>
                <span className="text-sm font-medium text-[#45BFE6]">team interaction</span>
              </h2>
              <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{interactionDescription}</p>
              <div className="mt-8 grid w-full grid-cols-1">
                {["도면", "배치도"].map((label, index) => (
                  <MediaPanel key={label} src={detail?.interactionImages?.[index]} alt={`${project.interactionTitle} ${label}`} className="aspect-square" imageClassName="object-contain" />
                ))}
              </div>
            </section>

            <section className="flex h-full w-full shrink-0 snap-start flex-col overflow-hidden">
              <div className="flex shrink-0 justify-center px-5 pb-6">
                <ScenarioVideoLink onClick={() => setIsScenarioVideoOpen(true)} />
              </div>
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-12">
                {[2, 3, 4].map((index) => (
                  <figure key={index}>
                    <MediaPanel src={detail?.interactionImages?.[index]} alt={`${project.interactionTitle} 시나리오 ${index - 1}`} className="aspect-video" />
                    <figcaption className="mt-3 text-sm text-white/80">{detail?.scenarioDescriptions?.[index - 2] || "시나리오 설명"}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section id="mobile-team-film" className="h-full w-full shrink-0 snap-start touch-pan-x overflow-hidden pb-12" aria-label="팀 영상 및 소개">
              {filmEmbedUrl ? (
                <iframe
                  key={filmEmbedUrl}
                  src={filmEmbedUrl}
                  title={`${project.videoTitle} 팀 필름`}
                  className="aspect-video w-full border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <MediaPanel src={detail?.filmImage} alt={`${project.videoTitle} 팀 영상`} className="aspect-video w-full" />
              )}
              <div className="px-5 pt-7">
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold">
                <span>{project.videoTitle || "영상 제목"}</span>
                <span className="text-sm font-medium text-[#45BFE6]">team film</span>
              </h2>
              <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-white/85">{videoDescription}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="pointer-events-none fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 md:hidden" role="img" aria-label={`전체 4페이지 중 ${mobileSlideIndex + 1}페이지`}>
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} aria-hidden="true" className={`h-1.5 w-1.5 rounded-full transition-colors ${index === mobileSlideIndex ? "bg-white/80" : "bg-white/40"}`} />
          ))}
        </div>

        <div className="hidden md:block">
        <section className="relative mx-auto flex h-[calc(100svh-var(--header-height)-4rem)] max-w-[1920px] overflow-hidden">
          <MediaPanel
            src={backgroundImage}
            alt={`${project.title} 대표 이미지`}
            className="absolute inset-y-0 left-0 aspect-[9/16] h-full shrink-0 lg:relative"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#07151d]/35 via-[#07151d]/90 to-[#07151d] lg:hidden" aria-hidden="true" />

          <div className="relative z-10 flex min-w-0 flex-1 flex-col px-6 pb-[clamp(28px,5svh,64px)] pt-[clamp(28px,5svh,64px)] sm:px-10 lg:px-[clamp(48px,5vw,52px)]">
            <Link
              to="/project"
              className="group absolute right-6 top-8 inline-flex items-center gap-2 text-lg font-semibold text-white/40 transition-colors hover:text-white focus-visible:text-white sm:right-10 lg:right-[clamp(48px,5vw,96px)] lg:top-[clamp(28px,5svh,64px)]"
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
                <dd className="mt-2 font-semibold text-2xl">{category}</dd>
                <dd className="mt-3 flex text-lg flex-wrap gap-x-4 gap-y-1 text-white">
                  {project.members.map((member) => (
                    <Link
                      key={member.id}
                      to={`/designer/${member.id}`}
                      className="exhibition-member-link detail-member-link"
                    >
                      {member.name}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>

            <section className="mt-auto">
              <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-semibold">
                {project.conceptName || "컨셉"}
                <span className="text-sm font-medium text-[#45BFE6]">team concept</span>
              </h1>
              <p className="mt-4 max-w-[920px] whitespace-pre-line text-sm leading-7 text-white">{conceptDescription}</p>
            </section>
          </div>
        </section>

        <section id="team-film" className="h-[calc(100svh-var(--header-height)-4rem)] overflow-hidden px-12 py-16 lg:pb-24 lg:pt-12">
          <div className="mb-7 flex items-end justify-between gap-6">
            <SectionTitle>TEAM FILM</SectionTitle>
          </div>

          <div className="grid gap-8 lg:grid-cols-[3.6fr_1.4fr] lg:items-start">
            {filmEmbedUrl ? (
              <iframe
                key={filmEmbedUrl}
                src={filmEmbedUrl}
                title={`${project.videoTitle} 팀 필름`}
                className="aspect-video w-[90%] border-0 bg-black lg:w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <MediaPanel src={detail?.filmImage} alt={`${project.videoTitle} 영상`} className="aspect-video w-[90%] lg:w-full" />
            )}
            <section>
              <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-semibold">
                {project.videoTitle || "영상 제목"}
                <span className="text-sm font-medium text-[#45BFE6]">team film</span>
              </h3>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white">{videoDescription}</p>
            </section>
          </div>
        </section>

        <section id="team-interaction" className="h-[calc(100svh-var(--header-height))] overflow-hidden px-12 py-16 lg:pb-24 lg:pt-12">
          <div className="mb-7 flex items-end justify-between gap-6">
            <SectionTitle>TEAM INTERACTION</SectionTitle>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.12fr] lg:items-start">
            <section className="lg:-mr-[144px] xl:-mr-[176px]">
              <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-semibold">
                {project.interactionTitle || "인터 제목"}
                <span className="text-sm font-medium text-[#45BFE6]">team interaction</span>
              </h3>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white">{interactionDescription}</p>
              <ScenarioVideoLink onClick={() => setIsScenarioVideoOpen(true)} />
            </section>
            <div className="grid w-4/5 grid-cols-2 justify-self-end overflow-hidden">
              <MediaPanel src={detail?.interactionImages?.[0]} alt={`${project.interactionTitle} 화면 1`} className="aspect-square" imageClassName="object-contain" />
              <MediaPanel src={detail?.interactionImages?.[1]} alt={`${project.interactionTitle} 화면 2`} className="aspect-square" imageClassName="object-contain" />
            </div>
          </div>

          <div className="mt-[24px] grid gap-8 sm:grid-cols-3">
            {[2, 3, 4].map((index) => (
              <figure key={index}>
                <MediaPanel src={detail?.interactionImages?.[index]} alt={`${project.interactionTitle} 시나리오 ${index - 1}`} className="aspect-video" />
                <figcaption className="mt-3 text-xs text-white/70">{detail?.scenarioDescriptions?.[index - 2] || "시나리오 설명"}</figcaption>
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
        <ScenarioVideoModal
          embedUrl={getYoutubeEmbedUrl(detail?.scenarioUrl)}
          onClose={() => setIsScenarioVideoOpen(false)}
        />
      )}

      <nav
        ref={navigatorRef}
        className="project-detail__navigator fixed inset-x-0 bottom-0 z-20 hidden h-16 grid-cols-3 items-center bg-[#0066AD] px-5 text-base md:grid sm:px-10 lg:px-[clamp(56px,6.25vw,120px)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 102, 173, 0.5), rgba(0, 102, 173, 0.5)), url('/images/blue_bg-upscaled.png')",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "100% 100%, 106% auto",
        }}
        aria-label="다른 팀 프로젝트"
      >
        <Link to={`/project/team/${previous.toLowerCase()}`} className="group flex min-w-0 items-center gap-2 justify-self-start">
          <img src="/images/icon/arrowLeft.png" alt="" className="h-5 w-auto opacity-70 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
          <span className="truncate text-lg opacity-70 transition-opacity duration-200 group-hover:opacity-100">{previous}</span>
        </Link>

        <Link to="/project" aria-label="프로젝트 목록" className="grid grid-cols-2 gap-1 justify-self-center p-3 opacity-80 transition-opacity hover:opacity-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="h-2 w-2 border border-white" />
          ))}
        </Link>

        <Link to={`/project/team/${next.toLowerCase()}`} className="group flex min-w-0 items-center gap-2 justify-self-end">
          <span className="truncate text-lg opacity-70 transition-opacity duration-200 group-hover:opacity-100">{next}</span>
          <img src="/images/icon/arrowRight.png" alt="" className="h-5 w-auto opacity-70 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
};

export default TeamProjectDetail;
