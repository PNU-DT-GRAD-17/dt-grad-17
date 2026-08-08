import { NavLink } from "react-router-dom";

function Header() {
  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `
      transition-all
      duration-200
      ${isActive ? "font-bold" : "font-normal hover:font-bold"}
    `;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className="
          relative
          mx-auto
          p-5
          w-full
          bg-top
          bg-white
        "
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
