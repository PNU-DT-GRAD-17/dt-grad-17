import { type MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { designers } from "../data/designers";
import { teamProjects } from "../data/team";

const designerMenuItems = designers.filter((designer) => designer.id !== "all");
const teamProjectMenuItems = Object.values(teamProjects);

function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const [isProjectLabelVisible, setIsProjectLabelVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesignerMenuOpen, setIsDesignerMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDesignerMenuOpen(false);
        setIsProjectMenuOpen(false);
      }
    };
    const preventScrollOutsideMenuList = (event: WheelEvent | TouchEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest("[data-mobile-menu-scroll]")) {
        return;
      }

      event.preventDefault();
    };
    const preventWheel = (event: WheelEvent) => preventScrollOutsideMenuList(event);
    const preventTouchMove = (event: TouchEvent) => preventScrollOutsideMenuList(event);

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("wheel", preventWheel, { passive: false });
    document.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("wheel", preventWheel);
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (location.pathname !== "/project") {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let animationFrameId: number | null = null;

    const observeProjectLabel = () => {
      const projectLabel = document.querySelector<HTMLElement>("[data-project-label]");

      // Header and the routed page are siblings. During client-side navigation,
      // the location effect can run before the project page is available in the DOM.
      if (!projectLabel) {
        animationFrameId = window.requestAnimationFrame(observeProjectLabel);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setIsProjectLabelVisible(entry.isIntersecting),
        {
          rootMargin: `-${headerRef.current?.getBoundingClientRect().height ?? 0}px 0px 0px 0px`,
          threshold: 0,
        },
      );
      observer.observe(projectLabel);
    };

    observeProjectLabel();

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      observer?.disconnect();
    };
  }, [location.pathname]);

  const isProjectPage = location.pathname === "/project";
  const shouldAutoHide = isProjectPage && !isProjectLabelVisible;

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `
      transition-all
      duration-200
      ${isActive ? "font-bold" : "font-normal hover:font-bold"}
    `;

  const mobileMenuClass =
    "font-normal text-white transition-colors duration-200 active:text-[#45bee6]";

  const releasePointerFocus = (event: MouseEvent<HTMLAnchorElement>) => {
    // A clicked navigation link otherwise keeps :focus-within active after
    // the route changes, preventing the auto-hidden project header from closing.
    // Keep focus for keyboard activation (detail === 0).
    if (event.detail > 0) {
      event.currentTarget.blur();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDesignerMenuOpen(false);
    setIsProjectMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`group sticky top-0 z-50 h-[72px] w-full ${
        isProjectPage
          ? shouldAutoHide
            ? "lg:fixed lg:inset-x-0 lg:h-3 lg:hover:h-[var(--header-height)] lg:focus-within:h-[var(--header-height)]"
            : "lg:fixed lg:inset-x-0 lg:h-[var(--header-height)]"
          : "lg:sticky lg:h-[var(--header-height)]"
      }`}
    >
      <div
        className={`
          absolute
          inset-x-0
          top-0
          mx-auto
          p-5
          w-full
          bg-top
          bg-white
          shadow-[0_8px_24px_rgba(0,0,0,0.08)]
          transition-transform
          duration-300
          ease-out
          ${
            shouldAutoHide
              ? "lg:-translate-y-full lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0"
              : "lg:translate-y-0"
          }
        `}
      >
        <nav
          className="
            flex
            h-full
            items-center
            justify-between
            lg:px-[clamp(40px,4vw,70px)]
          "
        >
          <NavLink to="/" end className="shrink-0">
            <img
              src="/images/navBar_logo.png"
              alt="잔향 로고"
              className="
                h-[clamp(32px,3.15vw,40px)]
                w-auto
                object-contain
              "
            />
          </NavLink>

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-[clamp(16px,4vw,70px)]
              whitespace-nowrap
              text-[clamp(16px,1.15vw,20px)]
              text-[#000101]
              lg:flex
            "
          >
            <NavLink to="/designer" className={menuClass} onClick={releasePointerFocus}>
              디자이너
            </NavLink>

            <NavLink to="/project" className={menuClass} onClick={releasePointerFocus}>
              프로젝트
            </NavLink>

            <NavLink to="/guestbook" className={menuClass} onClick={releasePointerFocus}>
              방명록
            </NavLink>

            <NavLink to="/behind" className={menuClass} onClick={releasePointerFocus}>
              비하인드
            </NavLink>

          </div>

          <button
            type="button"
            className="shrink-0 lg:hidden"
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <img src="/images/icon/menu.svg" alt="" className="h-8 w-8" />
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex h-[100svh] flex-col overflow-hidden bg-[rgba(0,1,1,0.8)] px-5 py-5 text-white backdrop-blur-[2px] lg:hidden"
        >
          <button
            type="button"
            className="h-8 w-8 shrink-0 self-start"
            aria-label="메뉴 닫기"
            onClick={closeMobileMenu}
          >
            <img src="/images/icon/x.svg" alt="" className="h-8 w-8" />
          </button>

          <nav
            aria-label="모바일 메뉴"
            className="relative flex min-h-0 flex-1 text-xl leading-tight"
          >
            <div className="flex shrink-0 flex-col justify-center gap-4">
              <NavLink to="/" end className={mobileMenuClass} onClick={closeMobileMenu}>
                홈
              </NavLink>

              <button
                type="button"
                className={`shrink-0 text-left transition-colors duration-200 ${
                  isDesignerMenuOpen
                    ? "font-bold text-[#45bee6]"
                    : "font-normal text-white active:text-[#45bee6]"
                }`}
                aria-expanded={isDesignerMenuOpen}
                aria-controls="mobile-designer-menu"
                onClick={() => {
                  setIsDesignerMenuOpen((isOpen) => !isOpen);
                  setIsProjectMenuOpen(false);
                }}
              >
                디자이너
              </button>

              <button
                type="button"
                className={`shrink-0 text-left transition-colors duration-200 ${
                  isProjectMenuOpen
                    ? "font-bold text-[#45bee6]"
                    : "font-normal text-white active:text-[#45bee6]"
                }`}
                aria-expanded={isProjectMenuOpen}
                aria-controls="mobile-project-menu"
                onClick={() => {
                  setIsProjectMenuOpen((isOpen) => !isOpen);
                  setIsDesignerMenuOpen(false);
                }}
              >
                프로젝트
              </button>
              <NavLink to="/guestbook" className={mobileMenuClass} onClick={closeMobileMenu}>
                방명록
              </NavLink>
              <NavLink to="/behind" className={mobileMenuClass} onClick={closeMobileMenu}>
                비하인드
              </NavLink>
            </div>

            {isDesignerMenuOpen && (
              <div
                id="mobile-designer-menu"
                data-mobile-menu-scroll
                className="absolute inset-y-8 left-[120px] right-0 flex flex-col gap-6 overflow-y-auto overscroll-contain border-l border-white pl-7 text-[16px]"
              >
                <NavLink
                  to="/designer"
                  end
                  className="shrink-0 font-bold text-white transition-colors duration-200 active:text-[#45bee6]"
                  onClick={closeMobileMenu}
                >
                  ALL
                </NavLink>
                {designerMenuItems.map((designer) => (
                  <NavLink
                    key={designer.id}
                    to={`/designer/${designer.id}`}
                    className="shrink-0 font-bold text-white transition-colors duration-200 active:text-[#45bee6]"
                    onClick={closeMobileMenu}
                  >
                    {designer.name}
                  </NavLink>
                ))}
              </div>
            )}

            {isProjectMenuOpen && (
              <div
                id="mobile-project-menu"
                data-mobile-menu-scroll
                className="absolute inset-y-8 left-[120px] right-0 flex flex-col gap-6 overflow-y-auto overscroll-contain border-l border-white pl-7 text-[16px]"
              >
                <NavLink
                  to="/project"
                  className="shrink-0 font-bold text-white transition-colors duration-200 active:text-[#45bee6]"
                  onClick={closeMobileMenu}
                >
                  ALL
                </NavLink>

                <p className="shrink-0 pt-4 text-[12px] font-bold text-white/40">
                  TEAM
                </p>
                {teamProjectMenuItems.map((project) => (
                  <NavLink
                    key={project.category}
                    to={project.link}
                    className="shrink-0 font-bold text-[16px] text-white transition-colors duration-200 active:text-[#45bee6]"
                    onClick={closeMobileMenu}
                  >
                    {project.conceptName}
                  </NavLink>
                ))}

                <p className="shrink-0 pt-8 text-[12px] font-bold text-white/40">
                  INDIVIDUAL
                </p>
                {designerMenuItems.map((designer) => (
                  <NavLink
                    key={designer.id}
                    to={`/project/${designer.id}`}
                    className="shrink-0 font-bold text-[16px] text-white transition-colors duration-200 active:text-[#45bee6]"
                    onClick={closeMobileMenu}
                  >
                    {designer.conceptName}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          <div className="flex items-center gap-4 pb-2">
            <a
              href="https://www.instagram.com/pnu.dt.16/"
              target="_blank"
              rel="noreferrer"
              aria-label="인스타그램"
            >
              <img src="/images/icon/instagram.svg" alt="" className="h-8 w-8 object-contain brightness-0 invert" />
            </a>
            <a href="https://www.youtube.com/@pnudt" target="_blank" rel="noreferrer" aria-label="유튜브">
              <img src="/images/icon/youtube.svg" alt="" className="h-8 w-8 object-contain brightness-0 invert" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
