import { designers } from "../data/designers";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Designer = () => {
  // ALL 제외
  const designerList = designers.filter(
    (designer) => designer.id !== "all"
  );

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage:
          "url('/images/background.png')",
      }}
    >
      <img
        src="/images/label-designer.png"
        alt="label"
        className="mx-auto mt-28 mb-24 w-[clamp(280px,20vw,400px)] object-contain"
      />

      <section className="mx-auto max-w-[1540px] px-2 pt-2 pb-24 md:px-4">
        <div className="designer-grid grid grid-cols-2 xl:grid-cols-10">
          {designerList.map((designer, index) => {
            const imageNumber = String(index + 1).padStart(2, "0");
            const imageClassName =
              "pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 object-contain";
            const namePositionClassName = [
              "left-4 top-4 md:left-6 md:top-6",
              "right-4 top-4 md:right-6 md:top-6",
              "bottom-4 left-4 md:bottom-6 md:left-6",
              "bottom-4 right-4 md:bottom-6 md:right-6",
            ][index % 4];

            return (
              <Link
                key={designer.id}
                to={`/designer/${designer.id}`}
                aria-label={`${designer.name} 디자이너 상세 페이지로 이동`}
                className={`designer-card group relative aspect-[5/6] w-auto xl:col-span-2 ${
                  index === designerList.length - 3
                    ? "designer-card-last-row-start xl:col-start-3"
                    : ""
                }`}
              >
                <p
                  className={`absolute z-40 text-base font-semibold text-[#000101] md:text-2xl ${namePositionClassName}`}
                >
                  {designer.name}
                </p>

                <img
                  src={`/images/object/paper/${imageNumber}.png`}
                  alt={`${designer.name} 오브제`}
                  className={`${imageClassName} mix-blend-hard-light`}
                />
                <img
                  src={`/images/object/paper/${imageNumber}_paper.png`}
                  alt=""
                  aria-hidden="true"
                  className={`${imageClassName} z-10 transition-opacity duration-300 group-hover:opacity-0`}
                />
                <img
                  src={`/images/object/original/${imageNumber}_ori.png`}
                  alt=""
                  aria-hidden="true"
                  className={`${imageClassName} designer-hover-original z-20 opacity-0`}
                />
              </Link>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Designer;
