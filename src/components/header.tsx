import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const [isProjectLabelVisible, setIsProjectLabelVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/project") {
      return;
    }

    const projectLabel = document.querySelector<HTMLElement>("[data-project-label]");

    if (!projectLabel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsProjectLabelVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(projectLabel);

    return () => observer.disconnect();
  }, [location.pathname]);

  const isProjectPage = location.pathname === "/project";
  const shouldAutoHide = isProjectPage && !isProjectLabelVisible;

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `
      transition-all
      duration-200
      ${isActive ? "font-bold" : "font-normal hover:font-bold"}
    `;

  return (
    <header
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
                h-[clamp(32px,3.15vw,55px)]
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
            <NavLink to="/designer" className={menuClass}>
              디자이너
            </NavLink>

            <NavLink to="/project" className={menuClass}>
              프로젝트
            </NavLink>

            <NavLink to="/behind" className={menuClass}>
              비하인드
            </NavLink>

            <NavLink to="/guestbook" className={menuClass}>
              방명록
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
