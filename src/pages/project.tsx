import { useEffect, useRef, useState } from "react";

import { designers } from "../data/designers";
import { teamProjects } from "../data/team";

const categories = ["ALL", "BRANDING", "DP", "OPENING", "WEB"] as const;
type Category = (typeof categories)[number];

type ProjectItem = {
  id: string;
  category: Exclude<Category, "ALL">;
  title: string;
  designer: string;
  conceptName: string;
  motionPosterTitle: string;
  interactionTitle: string;
  objectImage: string;
};

type GalleryImageSlot = {
  kind: "image";
  id: string;
  src: string;
  alt: string;
  span: 1 | 2;
};

const webFeaturedSlot: GalleryImageSlot = {
  kind: "image",
  id: "web-featured-image",
  src: "/images/team-object/teamObject_WEB.png",
  alt: "WEB 프로젝트 이미지",
  span: 1,
};

const openingFeaturedSlot: GalleryImageSlot = {
  kind: "image",
  id: "opening-featured-image",
  src: "/images/team-object/teamObject_OPENING.png",
  alt: "OPENING 프로젝트 이미지",
  span: 2,
};

const dpFeaturedSlot: GalleryImageSlot = {
  kind: "image",
  id: "dp-featured-image",
  src: "/images/team-object/teamObject_DP.png",
  alt: "DP 프로젝트 이미지",
  span: 1,
};

const brandingFeaturedSlot: GalleryImageSlot = {
  kind: "image",
  id: "branding-featured-image",
  src: "/images/team-object/teamObject_BRANDING.png",
  alt: "BRANDING 프로젝트 이미지",
  span: 2,
};

const teamMembers: Record<ProjectItem["category"], string[]> = {
  BRANDING: [
    "bak-geonhui",
    "park-boeun",
    "an-seonju",
    "hwang-hyejeong"
  ],
  WEB: [
    "kang-yeju",
    "kim-yewon",
    "park-sumin",
    "lee-eunsol",
    "choi-yangjin"
  ],
  DP: [
    "bae-myeonghwan",
    "lee-suhyeon",
    "jeon-subean",
    "jung-miyeon",
    "jeong-sunghyun"
  ],
  OPENING: [
    "park-jisu",
    "yoon-seohyun",
    "lee-hyeonji",
    "jang-jaewon"
  ],
};

const getCategory = (designerId: string): ProjectItem["category"] => {
  const category = categories
    .filter((item): item is ProjectItem["category"] => item !== "ALL")
    .find((item) => teamMembers[item].includes(designerId));

  if (!category) {
    throw new Error(`${designerId}의 프로젝트 카테고리가 지정되지 않았습니다.`);
  }

  return category;
};

const projects: ProjectItem[] = designers.slice(1).map((designer, index) => ({
  id: designer.id,
  category: getCategory(designer.id),
  title: `PROJECT ${String(index + 1).padStart(2, "0")}`,
  conceptName: designer.conceptName,
  motionPosterTitle: designer.motionPosterTitle ?? "",
  interactionTitle: designer.interactionTitle,
  designer: designer.name,
  objectImage: designer.selectedObjectImage,
}));

const Project = () => {
  const projectLabelRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [isProjectLabelVisible, setIsProjectLabelVisible] = useState(true);

  useEffect(() => {
    const projectLabel = projectLabelRef.current;

    if (!projectLabel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProjectLabelVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setActiveCategory("ALL");
        }
      },
      {
        // 헤더가 오버레이로 숨겨지므로 화면 최상단을 기준으로 계산합니다.
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(projectLabel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isProjectLabelVisible) return;

    const categorySections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-project-category]"),
    );
    const intersectionRatios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectionRatios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const currentSection = categorySections.reduce<HTMLElement | null>((current, section) => {
          if (!current) return section;

          return (intersectionRatios.get(section) ?? 0) > (intersectionRatios.get(current) ?? 0)
            ? section
            : current;
        }, null);
        const currentCategory = currentSection?.dataset.projectCategory;

        if (
          currentCategory &&
          categories.some((category) => category === currentCategory)
        ) {
          setActiveCategory(currentCategory as Category);
        }
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    categorySections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isProjectLabelVisible]);

  const visibleCategories = categories.filter(
    (category): category is ProjectItem["category"] => category !== "ALL",
  );

  const handleCategoryNavigation = (category: Category) => {
    setActiveCategory(category);

    if (category === "ALL") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(`category-${category.toLowerCase()}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[url('/images/background.png')] bg-cover bg-center bg-fixed text-[#121212] lg:pt-[var(--header-height)]">
      <section
        ref={projectLabelRef}
        data-project-label
        className="relative flex min-h-[clamp(210px,26vw,300px)] items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/project_background.png')",
          }}
        />
        <img
          src="/images/label-project.png"
          alt="Project"
          className="relative z-10 h-auto w-[clamp(200px,20vw,360px)]"
        />
      </section>

      <div className="flex w-full items-start">
        <aside className="sticky top-0 hidden h-dvh w-[clamp(190px,19vw,420px)] shrink-0 self-start overflow-hidden bg-white px-8 py-8 lg:block">
          <nav
            aria-label="프로젝트 카테고리"
            className="flex flex-col items-start"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {categories.map((category) => {
              const categoryProjects =
                category === "ALL" ? [] : projects.filter((project) => project.category === category);
              const isExpanded = !isProjectLabelVisible || hoveredCategory === category;

              return (
                <div
                  key={category}
                  className="w-full"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onFocusCapture={() => setHoveredCategory(category)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setHoveredCategory(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleCategoryNavigation(category)}
                    aria-label={`${category} 프로젝트 카테고리`}
                    aria-expanded={categoryProjects.length > 0 ? isExpanded : undefined}
                    className={`group flex w-full items-center py-1.5 text-left text-lg transition-colors hover:text-[#45BFE6] ${
                      activeCategory === category ? "font-bold text-[#45BFE6]" : "text-[#000101]"
                    }`}
                  >
                    {isExpanded && category !== "ALL" ? (
                      <>
                        <span className="min-w-0 break-words">
                          {teamProjects[category].conceptName}
                        </span>
                        <span className="ml-0 max-w-0 translate-x-1 overflow-hidden whitespace-nowrap text-sm font-normal opacity-0 transition-all duration-300 group-hover:ml-4 group-hover:max-w-28 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:ml-4 group-focus-visible:max-w-28 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                          {category}
                        </span>
                      </>
                    ) : (
                      category
                    )}
                  </button>

                  {categoryProjects.length > 0 && (
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="flex flex-col gap-3 pb-4 pt-1">
                          {categoryProjects.map((project) => (
                            <li key={project.id}>
                              <a
                                href={`#${project.id}`}
                                onClick={() => setActiveCategory(category)}
                                className="
                                  group flex items-center
                                  text-md leading-5 text-[#777]
                                  transition-colors hover:text-[#45BFE6]
                                  focus-visible:text-[#45BFE6]
                                "
                              >
                                {/* 기본으로 표시 */}
                                <span>{project.conceptName}</span>

                                {/* hover할 때 오른쪽에 표시 */}
                                {project.designer && (
                                  <span
                                    className="
                                      ml-0 max-w-0 translate-x-1 overflow-hidden whitespace-nowrap
                                      opacity-0 transition-all duration-300
                                      group-hover:ml-4
                                      group-hover:max-w-48
                                      group-hover:translate-x-0
                                      group-hover:opacity-100
                                      group-focus-visible:ml-4
                                      group-focus-visible:max-w-48
                                      group-focus-visible:opacity-100
                                    "
                                  >
                                    {project.designer}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <div id="project-gallery" className="grid grid-cols-2 lg:block">
            {visibleCategories.map((category) => {
              const categoryProjects = projects.filter((project) => project.category === category);
              const teamProject = teamProjects[category];
              const categoryIndex = categories.indexOf(category) - 1;
              const teamOnRight = categoryIndex % 2 === 1;
              const baseSlots: Array<ProjectItem | GalleryImageSlot | null> =
                category === "BRANDING"
                  ? [
                      categoryProjects[0] ?? null,
                      brandingFeaturedSlot,
                      ...categoryProjects.slice(1),
                    ]
                  : category === "WEB"
                  ? [categoryProjects[0] ?? null, webFeaturedSlot, ...categoryProjects.slice(1)]
                  : category === "DP"
                    ? [
                        ...categoryProjects.slice(0, 2),
                        dpFeaturedSlot,
                        ...categoryProjects.slice(2),
                      ]
                  : category === "OPENING"
                    ? [openingFeaturedSlot, ...categoryProjects]
                    : [...categoryProjects];
              const occupiedSlotCount = baseSlots.reduce(
                (count, slot) => count + (slot && "kind" in slot ? slot.span : 1),
                0,
              );
              const projectSlots: Array<ProjectItem | GalleryImageSlot | null> = [
                ...baseSlots,
                ...Array.from({ length: Math.max(0, 6 - occupiedSlotCount) }, () => null),
              ];

              return (
                <section
                  key={category}
                  id={`category-${category.toLowerCase()}`}
                  data-project-category={category}
                  aria-labelledby={`${category.toLowerCase()}-title`}
                  className="contents lg:block lg:h-dvh lg:w-full lg:scroll-mt-0 lg:overflow-hidden"
                >
                  <div
                    className={`contents lg:grid lg:h-full lg:w-full lg:grid-flow-row-dense lg:grid-rows-2 ${
                      teamOnRight
                        ? "lg:grid-cols-[repeat(3,28.125dvh)_minmax(0,1fr)]"
                        : "lg:grid-cols-[minmax(0,1fr)_repeat(3,28.125dvh)]"
                    }`}
                  >
                    <article
                      id={`team-${category.toLowerCase()}`}
                      className={`relative aspect-[9/16] min-w-0 overflow-hidden bg-[#ececec] lg:col-span-1 lg:row-span-2 lg:aspect-auto ${
                        teamOnRight
                          ? "lg:col-start-4 lg:row-start-1"
                          : "lg:col-start-1 lg:row-start-1"
                      }`}
                    >
                      <a
                        href={teamProject.link}
                        className="group relative block h-full w-full overflow-hidden"
                        aria-label={`${teamProject.title}, ${category} 팀 프로젝트`}
                      >
                        <img
                          src={teamProject.objectImage}
                          alt={teamProject.title}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="pointer-events-none absolute inset-0 z-10 opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
                          <img
                            src="/images/team_bd_gradient.png"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>

                        <p
                          id={`${category.toLowerCase()}-title`}
                          className="pointer-events-none absolute inset-x-0 top-0 z-40 p-[clamp(18px,2.4vw,36px)] text-[clamp(18px,2vw,36px)] font-semibold leading-none tracking-tight text-white"
                        >
                          {category}
                        </p>

                        <div className="absolute inset-0 z-20 bg-[#252525] opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-focus-visible:opacity-60" />

                        <div className="absolute inset-0 z-30 flex translate-y-3 flex-col justify-between overflow-hidden p-[clamp(24px,4vw,36px)] pt-[clamp(76px,8vw,104px)] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                          <div>
                            <p className="break-words text-[clamp(18px,2vw,28px)] font-medium leading-snug [overflow-wrap:anywhere]">
                              {teamProject.conceptName}
                            </p>
                            <ul className="mt-[clamp(16px,2vw,28px)] flex flex-col gap-[clamp(8px,1vw,16px)] text-[clamp(13px,1.2vw,19px)]">
                              {teamProject.members.map((member) => (
                                <li key={member.id}>{member.name}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-[clamp(20px,2.5vw,36px)]">
                            <div>
                              <p className="text-[clamp(14px,1.4vw,22px)] font-semibold text-[#45BFE6]">
                                • video
                              </p>
                              <p className="mt-1 break-words text-[clamp(16px,1.7vw,26px)] font-medium leading-snug text-white [overflow-wrap:anywhere]">
                                {teamProject.videoTitle || "팀 영상 제목"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[clamp(14px,1.4vw,22px)] font-semibold text-[#45BFE6]">
                                • interaction
                              </p>
                              <p className="mt-1 break-words text-[clamp(16px,1.7vw,26px)] font-medium leading-snug text-white [overflow-wrap:anywhere]">
                                {teamProject.interactionTitle || "팀 인터 제목"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </article>

                    {projectSlots.map((slot, slotIndex) => {
                      if (!slot) {
                        return (
                          <div
                            key={`${category}-empty-${slotIndex}`}
                            aria-hidden="true"
                            className="hidden aspect-[9/16] lg:block"
                          />
                        );
                      }

                      if ("kind" in slot) {
                        return (
                          <figure
                            key={slot.id}
                            className={`hidden min-w-0 overflow-hidden bg-transparent lg:block ${
                              slot.span === 2 ? "col-span-2 aspect-[18/16]" : "aspect-[9/16]"
                            }`}
                          >
                            <img
                              src={slot.src}
                              alt={slot.alt}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                              className={`h-full w-full object-contain ${
                                slot.id === "opening-featured-image" ||
                                slot.id === "branding-featured-image"
                                  ? "scale-[0.55]"
                                  : "scale-[0.8]"
                              }`}
                            />
                          </figure>
                        );
                      }

                      const project = slot;

                      return (
                        <article
                          key={project.id}
                          id={project.id}
                          className="aspect-[9/16] min-w-0 scroll-mt-0 overflow-hidden bg-white"
                        >
                          <a
                            href={`#${project.id}`}
                            className="group relative block h-full w-full overflow-hidden"
                            aria-label={`${project.conceptName}, ${project.designer}`}
                          >
                            <img
                              src={project.objectImage}
                              alt=""
                              className="absolute inset-0 m-auto h-1/2 w-3/4 object-contain transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 z-10 bg-[#252525] opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-focus-visible:opacity-60" />

                            <div className="absolute inset-0 z-20 flex translate-y-2 flex-col justify-between overflow-hidden p-[clamp(14px,1.5vw,22px)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                              <div>
                                <p className="w-full whitespace-normal break-words text-[clamp(24px,1.5vw,28px)] font-bold leading-snug tracking-tight text-white [overflow-wrap:anywhere]">
                                  {project.conceptName || "UNTITLED"}
                                </p>
                                <p className="mt-2 w-full whitespace-normal break-words text-[clamp(16px,1vw,20px)] font-medium leading-snug text-white [overflow-wrap:anywhere]">
                                  {project.designer}
                                </p>
                              </div>

                              <div className="flex flex-col gap-[clamp(14px,1.4vw,22px)]">
                                <div>
                                  <p className="text-[clamp(11px,0.9vw,16px)] font-semibold text-[#45BFE6]">
                                    • motion poster
                                  </p>
                                  <p className="mt-1 break-words text-[clamp(13px,1vw,20px)] font-medium leading-snug text-white [overflow-wrap:anywhere]">
                                    {project.motionPosterTitle || "개인 모션포스터 제목"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[clamp(11px,0.9vw,16px)] font-semibold text-[#45BFE6]">
                                    • interaction
                                  </p>
                                  <p className="mt-1 break-words text-[clamp(13px,1vw,20px)] font-medium leading-snug text-white [overflow-wrap:anywhere]">
                                    {project.interactionTitle || "개인 인터 제목"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>

    </main>
  );
};

export default Project;
