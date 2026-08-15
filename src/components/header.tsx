import { type MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const [isProjectLabelVisible, setIsProjectLabelVisible] = useState(true);

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

  const releasePointerFocus = (event: MouseEvent<HTMLAnchorElement>) => {
    // A clicked navigation link otherwise keeps :focus-within active after
    // the route changes, preventing the auto-hidden project header from closing.
    // Keep focus for keyboard activation (detail === 0).
    if (event.detail > 0) {
      event.currentTarget.blur();
    }
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
            px-[clamp(40px,4vw,70px)]
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
              flex
              shrink-0
              items-center
              gap-[clamp(16px,4vw,70px)]
              whitespace-nowrap
              text-[clamp(16px,1.15vw,20px)]
              text-[#000101]
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
