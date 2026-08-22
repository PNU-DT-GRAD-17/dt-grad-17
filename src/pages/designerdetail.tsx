import { useLayoutEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";

import { designers, type Designer } from "../data/designers";

type MediaPanelProps = {
  label: string;
  src?: string;
};

const MediaPanel = ({ label, src }: MediaPanelProps) => (
  <section className="xl:flex xl:min-h-0 xl:flex-col">
    <h2 className="mb-2 text-xs font-bold uppercase tracking-[-0.02em] sm:text-sm xl:mb-3 xl:text-[clamp(18px,1.15vw,22px)]">
      {label}
    </h2>
    <div className="aspect-video w-full overflow-hidden border border-[#9d9d9d] bg-[#d9d9d9] xl:min-h-0 xl:flex-1 xl:aspect-auto">
      {src ? (
        <video
          className="h-full w-full object-cover"
          controls
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
    </div>
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

  return (
    <main className="bg-[url('/images/background.png')] text-[#111]">
      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-[2100px] flex-col px-6 pb-12 pt-8 sm:px-10 lg:min-h-[calc(100svh-var(--header-height))] lg:px-[clamp(40px,2.5vw,52px)] lg:pb-12 lg:pt-12 xl:max-w-none xl:px-0 xl:pb-[clamp(48px,6svh,72px)] xl:pt-[clamp(56px,7svh,80px)]">
        <div className="grid min-h-0 flex-1 items-start gap-10 lg:grid-cols-2 xl:mx-auto xl:w-[calc(100%_-_104px)] xl:max-w-[1962px] xl:grid-cols-[minmax(0,1.45fr)_clamp(64px,4vw,84px)_minmax(0,1.25fr)_clamp(120px,9vw,190px)_clamp(320px,21.5vw,450px)] xl:items-stretch xl:gap-0">
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
            <div className="absolute left-0 top-0 h-[clamp(90px,8vw,150px)] w-[clamp(90px,8vw,150px)] xl:top-[52px]">
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
              <h1 className="flex flex-wrap items-baseline gap-x-6 gap-y-1 tracking-[-0.04em] text-[#000101]">
                <span className="text-[clamp(24px,2vw,40px)] font-bold">{designer.name}</span>
                <span className="text-[clamp(24px,2vw,40px)] font-medium">{getEnglishName(designer)}</span>
              </h1>

              <dl className="mt-8 grid max-w-[570px] grid-cols-1 gap-x-12 gap-y-6 text-sm sm:grid-cols-2 xl:mt-12 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] xl:gap-x-[clamp(72px,6.2vw,130px)] xl:gap-y-10 xl:text-[clamp(16px,1.05vw,20px)]">
                <div className="sm:col-span-2">
                  <dt className="mb-1">team</dt>
                  <dd className="text-lg font-bold xl:text-[clamp(17px,1.15vw,22px)]">{designer.team}</dd>
                </div>

                <div>
                  <dt className="mb-1">e-mail</dt>
                  <dd className="break-all text-lg font-bold xl:text-[clamp(17px,1.15vw,22px)]">
                    {detail?.email ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">instagram</dt>
                  <dd className="break-all font-bold xl:text-[clamp(17px,1.15vw,22px)]">
                    {detail?.instagram?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">portfolio</dt>
                  <dd className="break-all font-bold xl:text-[clamp(17px,1.15vw,22px)]">
                    {detail?.portfolio?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">phone number</dt>
                  <dd className="font-bold xl:text-[clamp(17px,1.15vw,22px)]">{detail?.phone ?? "-"}</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="grid gap-2 text-[#000101] ssm:grid-cols-3 lg:col-span-2 xl:col-span-1 xl:col-start-5 xl:h-full xl:min-h-0 xl:grid-cols-1 xl:grid-rows-3 xl:gap-5 xl:self-stretch">
            <MediaPanel label="TEAM FILM" src={detail?.teamFilm} />
            <MediaPanel
              label="TEAM INTERACTION"
              src={detail?.teamInteraction}
            />
            <MediaPanel
              label="INDIVIDUAL INTERACTION"
              src={detail?.individualInteraction}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default DesignerDetail;
