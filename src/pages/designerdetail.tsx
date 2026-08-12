import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";

import { designers, type Designer } from "../data/designers";

type MediaPanelProps = {
  label: string;
  src?: string;
};

const MediaPanel = ({ label, src }: MediaPanelProps) => (
  <section>
    <h2 className="mb-2 text-xs font-bold uppercase tracking-[-0.02em] sm:text-sm">
      {label}
    </h2>
    <div className="aspect-video w-full overflow-hidden border border-[#9d9d9d] bg-[#d9d9d9]">
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
  const designerList = designers.filter((designer) => designer.id !== "all");
  const currentIndex = designerList.findIndex(
    (designer) => designer.id === designerId,
  );

  if (currentIndex === -1) {
    return <Navigate to="/designer" replace />;
  }

  const designer = designerList[currentIndex];
  const previousDesigner =
    designerList[(currentIndex - 1 + designerList.length) % designerList.length];
  const nextDesigner = designerList[(currentIndex + 1) % designerList.length];
  const detail = designer.detail;
  const imageNumber = String(currentIndex + 1).padStart(2, "0");

  return (
    <main className="min-h-[calc(100svh-var(--header-height))] bg-[url('/images/background.png')] text-[#111]">
      <div className="mx-auto flex min-h-[calc(100svh-var(--header-height)-64px)] max-w-[1540px] flex-col px-6 pb-12 pt-8 sm:px-10 lg:px-[clamp(48px,6.25vw,96px)] lg:pb-16 lg:pt-12">
        <Link
          to="/designer"
          className="group mb-8 inline-flex w-fit items-center gap-1 text-lg font-semibold text-[#a7adb1] transition-colors hover:text-[#000101] focus-visible:text-[#000101] lg:mb-10 lg:text-2xl"
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

        <div className="grid flex-1 items-start gap-10 lg:grid-cols-2 xl:grid-cols-[minmax(300px,1.25fr)_minmax(320px,1.35fr)_minmax(248px,0.74fr)] xl:gap-[clamp(36px,4vw,72px)]">
          <section className="overflow-hidden bg-[#dedede] lg:self-stretch">
            {detail?.profileImage ? (
              <img
                src={detail.profileImage}
                alt={`${designer.name} 디자이너 프로필`}
                className="h-full min-h-[420px] w-full object-cover object-center"
              />
            ) : (
              <div className="flex aspect-[3/4] min-h-[420px] items-center justify-center bg-[#dedede] text-sm font-semibold text-[#777] lg:h-full lg:aspect-auto">
                PROFILE IMAGE
              </div>
            )}
          </section>

          <section className="relative flex min-h-[520px] flex-col justify-end pb-2 lg:min-h-0 lg:self-stretch">
            <div className="absolute left-0 top-0 h-[clamp(90px,10vw,150px)] w-[clamp(90px,10vw,150px)]">
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
              <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 tracking-[-0.04em] text-[#000101]">
                <span className="text-[clamp(24px,2vw,34px)] font-bold">{designer.name}</span>
                <span className="text-md text-2xl font-medium">{getEnglishName(designer)}</span>
              </h1>

              <dl className="mt-8 grid max-w-[470px] grid-cols-1 gap-x-12 gap-y-6 text-sm sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="mb-1">team</dt>
                  <dd className="font-bold text-lg">{designer.team}</dd>
                </div>

                <div>
                  <dt className="mb-1">e-mail</dt>
                  <dd className="break-all font-bold text-lg">
                    {detail?.email ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">instagram</dt>
                  <dd className="break-all font-bold">
                    {detail?.instagram?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">portfolio</dt>
                  <dd className="break-all font-bold">
                    {detail?.portfolio?.toString() ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1">phone number</dt>
                  <dd className="font-bold">{detail?.phone ?? "-"}</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="grid gap-2 ssm:grid-cols-3 lg:col-span-2 xl:col-span-1 xl:grid-cols-1 xl:gap-3">
            <MediaPanel
              label="INDIVIDUAL INTERACTION"
              src={detail?.individualInteraction}
            />
            <MediaPanel label="TEAM FILM" src={detail?.teamFilm} />
            <MediaPanel
              label="TEAM INTERACTION"
              src={detail?.teamInteraction}
            />
          </div>
        </div>
      </div>

      <nav
        aria-label="디자이너 상세 페이지 이동"
        className="grid min-h-16 grid-cols-3 items-center bg-cover bg-center bg-no-repeat px-5 text-white sm:px-[clamp(32px,6vw,90px)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 102, 173, 0.3), rgba(0, 102, 173, 0.3)), url('/images/navigator_bg.png')",
        }}
      >
        <Link
          to={`/designer/${previousDesigner.id}`}
          className="flex items-center gap-2 justify-self-start text-base font-semibold opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:text-xl"
        >
          <img
            src="/images/icon/arrowLeft.png"
            alt=""
            aria-hidden="true"
            className="h-6 w-6 shrink-0 object-contain"
          />
          <span>{previousDesigner.name}</span>
        </Link>

        <Link
          to="/designer"
          aria-label="디자이너 전체 목록"
          className="grid grid-cols-2 gap-1 justify-self-center opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="h-2 w-2 border border-white"
            />
          ))}
        </Link>

        <Link
          to={`/designer/${nextDesigner.id}`}
          className="flex items-center gap-2 justify-self-end text-base font-semibold opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:text-xl"
        >
          <span>{nextDesigner.name}</span>
          <img
            src="/images/icon/arrowRight.png"
            alt=""
            aria-hidden="true"
            className="h-6 w-6 shrink-0 object-contain sm:h-9 sm:w-9"
          />
        </Link>
      </nav>
       <Footer />
    </main>
  );
};

export default DesignerDetail;
