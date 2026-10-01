import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "main-banner", label: "메인 배너" },
  { id: "exhibition-overview", label: "전시 개요" },
  { id: "opening", label: "오프닝 영상" },
  { id: "exhibition-members", label: "전시 인원 소개" },
  { id: "offline-information", label: "오프라인 정보" },
  { id: "professors", label: "교수님 소개" },
];

export default function HomeSectionNav() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const destination = useRef<number | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
      const positions = sections.map(({ id }) => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity);
      const footerRect = document.querySelector("main footer")?.getBoundingClientRect();
      const footerHalfVisible = footerRect
        ? footerRect.top + footerRect.height / 2 <= window.innerHeight
        : false;
      setVisible(positions[1] <= headerBottom + 1 && !footerHalfVisible);
      if (destination.current !== null) return;
      let current = 0;
      positions.forEach((top, index) => {
        if (top <= headerBottom + (window.innerHeight - headerBottom) * 0.25) current = index;
      });
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const release = () => {
      destination.current = null;
      clearTimeout(releaseTimer.current);
      schedule();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scrollend", release);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(releaseTimer.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scrollend", release);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
    };
  }, []);

  const navigate = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (!section) return;
    destination.current = index;
    setActive(index);
    clearTimeout(releaseTimer.current);
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top - headerBottom,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    releaseTimer.current = setTimeout(() => {
      destination.current = null;
      window.dispatchEvent(new Event("scroll"));
    }, 1800);
  };

  return (
    <nav className="home-section-nav" aria-label="메인페이지 섹션" hidden={!visible}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className="home-section-nav__item"
          aria-label={`${index + 1}. ${section.label}`}
          aria-current={active === index ? "location" : undefined}
          onClick={() => navigate(index)}
        >
          <span className="home-section-nav__number">{index + 1}</span>
          <span className="home-section-nav__label" aria-hidden="true">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}
