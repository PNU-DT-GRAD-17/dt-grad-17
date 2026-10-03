import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { designers } from "../data/designers";

const projects = [
  ...["BRANDING", "DP", "OPENING", "WEB"].map((team) => ({
    label: team,
    path: `/project/team/${team.toLowerCase()}`,
  })),
  ...designers.filter((designer) => designer.id !== "all").map((designer) => ({
    label: designer.name,
    path: `/project/${designer.id}`,
  })),
];

export default function MobileProjectHeader({ label, currentPath, designerPath }: { label: string; currentPath: string; designerPath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNameActive, setIsNameActive] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useLayoutEffect(() => {
    if (isOpen && listRef.current && selectedRef.current) {
      listRef.current.scrollTop = selectedRef.current.offsetTop;
    }
  }, [isOpen, currentPath]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={headerRef} className="relative z-40 flex h-12 shrink-0 items-center justify-center bg-[#000101] text-lg font-medium text-white">
      <Link to="/project" aria-label="프로젝트 목록으로 돌아가기" className="absolute inset-y-0 left-2 flex w-11 items-center justify-center">
        <img src="/images/icon/arrowLeft.png" alt="" className="h-5 w-auto" />
      </Link>
      <div className="relative flex h-full items-center justify-center">
        {designerPath ? (
          <Link
            to={designerPath}
            className="exhibition-member-link mobile-project-designer-link inline-flex transition-colors"
            data-active={isNameActive}
            onClick={(event) => {
              setIsOpen(false);
              if (!isNameActive) {
                event.preventDefault();
                setIsNameActive(true);
              }
            }}
            onBlur={() => setIsNameActive(false)}
          >
            {label}
          </Link>
        ) : <span>{label}</span>}
        <button
        ref={triggerRef}
        type="button"
        aria-label="프로젝트 선택 목록"
        aria-expanded={isOpen}
        aria-controls={listId}
        className="absolute left-full ml-1 flex h-11 w-8 cursor-pointer items-center justify-start"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          aria-hidden="true"
          className={`h-8 w-8 bg-white transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ mask: "url('/images/icon/triangle_down.svg') center / contain no-repeat", WebkitMask: "url('/images/icon/triangle_down.svg') center / contain no-repeat" }}
        />
      </button>
      </div>
      {isOpen && (
        <div id={listId} ref={listRef} className="absolute inset-x-0 top-full h-[min(224px,50svh)] overflow-y-auto overscroll-y-contain bg-[#000101]" aria-label="프로젝트 선택">
          <nav className="pb-[calc(min(224px,50svh)-48px)]">
            {projects.map((project) => (
              <Link
                key={project.path}
                ref={project.path === currentPath ? selectedRef : undefined}
                to={project.path}
                aria-current={project.path === currentPath ? "page" : undefined}
                className="flex h-12 items-center justify-center text-white transition-colors hover:text-[#45bee6] focus-visible:text-[#45bee6]"
                onClick={() => setIsOpen(false)}
              >
                {project.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
