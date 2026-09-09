import { useLayoutEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";

import { designers, type Designer } from "../data/designers";
import { teamProjects } from "../data/team";

type MediaPanelProps = {
  label: string;
  src?: string;
  hoverTitle: string;
  to: string;
};

const MediaPanel = ({ label, src, hoverTitle, to }: MediaPanelProps) => (
  <section className="xl:flex xl:min-h-0 xl:flex-col">
    <Link
      to={to}
      className="group flex min-h-0 flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066AD]"
      aria-label={`${label}: ${hoverTitle} 상세 페이지로 이동`}
    >
      <h2 className="mb-1 text-xs font-bold uppercase sm:text-sm xl:mb-1 xl:text-[clamp(12px,1.15vw,18px)]">
        {label}
      </h2>
      <div className="relative aspect-video w-full overflow-hidden bg-[#d9d9d9] xl:min-h-0 xl:flex-1 xl:aspect-auto">
        {src ? (
          <video
            className="h-full w-full object-cover"
            playsInline
            preload="metadata"
          >
            <source src={src} />
            브라우저에서 영상을 재생할 수 없습니다.
          </video>
        ) : (
          <div
            className="flex h-full items-center justify-center text-xs text-[#777]"
            aria-label={`${label} 영상 준비 중`}
          >
            COMING SOON
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-b from-transparent via-black/10 to-black/75 p-[16px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="text-[clamp(12px,2.2vw,16px)] font-light text-white">
            {hoverTitle}
          </p>
        </div>
      </div>
    </Link>
  </section>
);

const getEnglishName = (designer: Designer) =>
  designer.detail?.nameEn ?? designer.id.replaceAll("-", " ").toUpperCase();

const DesignerDetail = () => {
  const { designerId } = useParams();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [designerId]);

  const designerList = designers.filter((designer) => designer.id !== "all");
  const currentIndex = designerList.findIndex(
    (designer) => designer.id === designerId,
  );

  if (currentIndex === -1) {
    return <Navigate to="/designer" replace />;
  }

  const designer = designerList[currentIndex];
  const detail = designer.detail;
  const imageNumber = String(currentIndex + 1).padStart(2, "0");
  const teamProject = Object.values(teamProjects).find(
    (project) => project.category === designer.team,
  );

  return (
    <main className="bg-[url('/images/background.png')] text-[#111]">
      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-[2100px] flex-col px-6 pb-12 pt-4 sm:px-10 lg:min-h-[calc(100svh-var(--header-height))] lg:px-[clamp(40px,2.5vw,52px)] lg:pb-12 lg:pt-6 xl:max-w-none xl:px-0 xl:pb-[clamp(48px,6svh,72px)] xl:pt-[clamp(28px,3.5svh,40px)]">
        <div className="grid min-h-0 flex-1 items-start gap-y-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1.25fr)] lg:gap-x-[clamp(28px,2.5vw,36px)] xl:mx-auto xl:w-[calc(100%_-_104px)] xl:max-w-[1962px] xl:grid-cols-[minmax(0,1.45fr)_clamp(28px,2.5vw,36px)_minmax(0,1.25fr)_clamp(120px,9vw,190px)_clamp(320px,21.5vw,450px)] xl:items-stretch xl:gap-0">
          <div className="flex w-full flex-col justify-end xl:col-start-1 xl:min-h-0">
            <Link
              to="/designer"
              className="group z-20 mb-4 inline-flex w-fit items-center gap-1 text-lg font-semibold text-[#a7adb1] transition-colors hover:text-[#000101] focus-visible:text-[#000101] lg:text-2xl xl:mb-12"
            >
              <span
                className="relative h-7 w-7 shrink-0 lg:h-9 lg:w-9"
                aria-hidden="true"
              >
                <img
                  src="/images/icon/arrowLeftGray.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
                />
                <img
                  src="/images/icon/arrowLeftBlack.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </span>
              <span>BACK</span>
            </Link>

            <section className="aspect-[3/4] w-full overflow-hidden bg-[#dedede]">
              {detail?.profileImage ? (
                <img
                  src={detail.profileImage}
                  alt={`${designer.name} 디자이너 프로필`}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#dedede] text-sm font-semibold text-[#777]">
                  PROFILE IMAGE
                </div>
              )}
            </section>
          </div>

          <section className="relative flex min-h-[520px] flex-col justify-end lg:min-h-0 lg:self-stretch xl:col-start-3">
            <div className="absolute left-[-28px] top-0 h-[clamp(200px,8vw,320px)] w-[clamp(200px,8vw,320px)] xl:top-[60px]">
              <img
                src={`/images/object/paper/${imageNumber}.png`}
                alt={`${designer.name} 디자이너 오브제`}
                className="absolute inset-0 h-full w-full object-contain mix-blend-hard-light"
              />
              <img
                src={`/images/object/paper/${imageNumber}_paper.png`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 z-10 h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[clamp(24px,2vw,40px)] font-bold text-[#000101]">{designer.name}</span>
                <span className="text-[clamp(16px,2vw,24px)] font-regular text-[#4A4B51] tracking-[-0.02em]">{getEnglishName(designer)}</span>
              </h1>

              <dl className="mt-8 grid max-w-[570px] grid-cols-1 gap-x-12 gap-y-6 text-sm sm:grid-cols-2 xl:mt-12 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] xl:gap-x-[clamp(72px,6.2vw,130px)] xl:gap-y-10 xl:text-[clamp(16px,1.05vw,20px)]">
                <div className="sm:col-span-2">
                  <dt className="mb-1 text-[#888A96] text-[clamp(14px,1.15vw,16px)]">team</dt>
                  <dd className="text-lg text-[#000101] font-semibold text-[clamp(18px,1.15vw,20px)]">
                    {teamProject ? (
                      <Link
                        to={teamProject.link}
                        className="exhibition-member-link designer-team-link inline-flex"
                        aria-label={`${designer.team} 팀 프로젝트 상세 페이지로 이동`}
                      >
                        {designer.team}
                      </Link>
                    ) : (
                      designer.team
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="mb-1 text-[#888A96] text-[clamp(14px,1.15vw,16px)]">e-mail</dt>
                  <dd className="text-lg text-[#000101] font-semibold text-[clamp(18px,1.15vw,20px)]">
                    {detail?.email ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[#888A96] text-[clamp(14px,1.15vw,16px)]">instagram</dt>
                  <dd className="text-lg text-[#000101] font-semibold text-[clamp(18px,1.15vw,20px)]">
                    {detail?.instagram?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[#888A96] text-[clamp(14px,1.15vw,16px)]">portfolio</dt>
                  <dd className="text-lg text-[#000101] font-semibold text-[clamp(18px,1.15vw,20px)]">
                    {detail?.portfolio?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[#888A96] text-[clamp(14px,1.15vw,16px)]">phone number</dt>
                  <dd className="text-lg text-[#000101] font-semibold text-[clamp(18px,1.15vw,20px)]">{detail?.phone ?? "-"}</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="grid gap-5 text-[#000101] ssm:grid-cols-3 lg:col-span-2 xl:col-span-1 xl:col-start-5 xl:h-full xl:min-h-0 xl:grid-cols-1 xl:grid-rows-3 xl:gap-5 xl:self-stretch">
            <MediaPanel
              label="INDIVIDUAL INTERACTION"
              src={detail?.individualInteraction}
              hoverTitle={designer.conceptName || "UNTITLED"}
              to={`/project/${designer.id}#individual-interaction`}
            />
            <MediaPanel
              label="TEAM FILM"
              src={detail?.teamFilm}
              hoverTitle={teamProject?.videoTitle || "UNTITLED"}
              to={`${teamProject?.link ?? "/project"}#team-film`}
            />
            <MediaPanel
              label="TEAM INTERACTION"
              src={detail?.teamInteraction}
              hoverTitle={teamProject?.interactionTitle || "UNTITLED"}
              to={`${teamProject?.link ?? "/project"}#team-interaction`}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default DesignerDetail;
