import { useRef, useState } from "react";

type Letter = {
  id: string;
  src: string;
  x: number;
  y: number;
//   width: number;
  rotate: number;
};

const initialLetters: Letter[] = [
  {
    id: "ㅈ",
    src: "/logo/ㅈ.png",
    x: 8.2,
    y: 14.2,
    rotate: 0,
  },
  {
    id: "ㅏ",
    src: "/logo/ㅏ.png",
    x: 31.3,
    y: 3.2,
    rotate: 15,
  },
  {
    id: "ㄴ",
    src: "/logo/ㄴ.png",
    x: 35.3,
    y: 54.2,
    rotate: 15,
  },
  {
    id: "ㅎ",
    src: "/logo/ㅎ.png",
    x: 52.8,
    y: 21.1,
    rotate: 0,
  },
  {
    id: "ㅑ",
    src: "/logo/ㅑ.png",
    x: 71.6,
    y: 4.4,
    rotate: 0,
  },
  {
    id: "ㅇ",
    src: "/logo/ㅇ.png",
    x: 77.4,
    y: 58,
    rotate: 0,
  },
];

const LETTER_SIZE = 220;

const InteractiveLogo = () => {
  const [letters, setLetters] = useState(initialLetters);

  const containerRef = useRef<HTMLDivElement>(null);

  const dragInfo = useRef<{
    id: string;
    startPointerX: number;
    startPointerY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLImageElement>,
    letter: Letter
  ) => {
    e.preventDefault();

    e.currentTarget.setPointerCapture(e.pointerId);

    dragInfo.current = {
      id: letter.id,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startX: letter.x,
      startY: letter.y,
    };
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!dragInfo.current || !containerRef.current) return;

    const containerRect =
      containerRef.current.getBoundingClientRect();

    const deltaX =
      ((e.clientX - dragInfo.current.startPointerX) /
        containerRect.width) *
      100;

    const deltaY =
      ((e.clientY - dragInfo.current.startPointerY) /
        containerRect.height) *
      100;

    const draggingId = dragInfo.current.id;
    const startX = dragInfo.current.startX;
    const startY = dragInfo.current.startY;

    setLetters((prev) =>
      prev.map((letter) =>
        letter.id === draggingId
          ? {
              ...letter,
              x: startX + deltaX,
              y: startY + deltaY,
            }
          : letter
      )
    );
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!dragInfo.current) return;

    e.currentTarget.releasePointerCapture(e.pointerId);

    dragInfo.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-none"
    >
      {letters.map((letter) => (
        <img
          key={letter.id}
          src={letter.src}
          alt={letter.id}
          draggable={false}
          onPointerDown={(e) =>
            handlePointerDown(e, letter)
          }
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="
            absolute
            cursor-grab
            select-none
            touch-none
            active:cursor-grabbing
          "
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            width: `${LETTER_SIZE}px`,
            height: `${LETTER_SIZE}px`,
            objectFit: "contain",
            transform: `rotate(${letter.rotate}deg)`,
            userSelect: "none",
            touchAction: "none",
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveLogo;