import { designers } from "../data/designers";

const Designer = () => {
  // ALL 제외
  const designerList = designers.filter(
    (designer) => designer.id !== "all"
  );

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('/images/background.png')",
      }}
    >
      <img
        src="/images/label-designer.png"
        alt="label"
        className="absolute top-52 left-1/2 w-[300px] -translate-x-1/2"
      />

      <section className="mx-auto max-w-[1440px] px-12 pt-[200px] pb-24">
        <div className="grid grid-cols-5 border-l border-t border-dashed border-[#BCBCBC]">
          {designerList.map((designer, index) => {
            const isTop =
              index % 2 === 0;

            return (
              <div
                key={designer.id}
                className="relative h-[300px] w-auto border-r border-b border-dashed border-[#BCBCBC]"
              >
                {isTop ? (
                  <p className="absolute left-6 top-6 text-lg font-semibold">
                    {designer.name}
                  </p>
                ) : (
                  <p className="absolute bottom-6 right-6 text-lg font-semibold">
                    {designer.name}
                  </p>
                )}

                <img
                  src={
                    designer.selectedObjectImage
                  }
                  alt={designer.name}
                  className="absolute left-1/2 top-1/2 h-[65%] w-[70%] -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Designer;