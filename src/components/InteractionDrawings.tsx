import { useEffect, useRef, useState } from "react";

const views = ["탑뷰", "사이드뷰"];

function DrawingImage({ src, label }: { src?: string; label: string }) {
  return (
    <div className="aspect-square w-full shrink-0 overflow-hidden bg-white/30">
      {src ? <img src={src} alt={label} className="h-full w-full object-contain" /> : <span className="sr-only">{label} 준비 중</span>}
    </div>
  );
}

function DrawingModal({ images, title, onClose }: { images: (string | undefined)[]; title: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} 도면`}
      onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onWheel={(event) => event.stopPropagation()}
      className="fixed inset-0 m-auto max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/85"
      style={{ width: "min(640px, calc(100vw - 48px))" }}
    >
      <div className="flex max-h-[calc(100svh-48px)] flex-col items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="도면 닫기"
          autoFocus
          className="flex h-12 w-12 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-[#45bee6] outline-none [-webkit-tap-highlight-color:transparent] transition-colors md:h-16 md:w-16 md:text-[#BABDC1] hover:text-[#45bee6] focus-visible:text-[#45bee6] md:focus-visible:outline md:focus-visible:outline-2 md:focus-visible:outline-current"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path d="M6.4 6.4L17.6 17.6M17.6 6.4L6.4 17.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </button>
        <div className="min-h-0 w-full overflow-y-auto overscroll-contain" tabIndex={0} aria-label="탑뷰와 사이드뷰">
          {views.map((view, index) => <DrawingImage key={view} src={images[index]} label={`${title} ${view}`} />)}
        </div>
      </div>
    </dialog>
  );
}

export default function InteractionDrawings({ images, title }: { images?: string[]; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="mt-8 grid w-full cursor-pointer grid-cols-2 overflow-hidden"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${title} 탑뷰와 사이드뷰 확대 보기`}
      >
        {views.map((view, index) => <DrawingImage key={view} src={images?.[index]} label={`${title} ${view}`} />)}
      </button>
      {isOpen && <DrawingModal images={[images?.[0], images?.[1]]} title={title} onClose={() => setIsOpen(false)} />}
    </>
  );
}
