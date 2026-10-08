import { useEffect, useRef } from "react";

export const ScenarioVideoModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
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
      aria-label="시연 영상"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onWheel={(event) => event.stopPropagation()}
      className="fixed inset-0 m-auto max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/85"
      style={{ width: "min(960px, calc(100vw - 48px), calc((100svh - 160px) * 16 / 9))" }}
    >
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="시연 영상 닫기"
          autoFocus
          className="flex h-12 w-12 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-[#45bee6] outline-none [-webkit-tap-highlight-color:transparent] transition-colors md:h-16 md:w-16 md:text-[#BABDC1] hover:text-[#45bee6] focus-visible:text-[#45bee6] md:focus-visible:outline md:focus-visible:outline-2 md:focus-visible:outline-current"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full"
          >
            <path
              d="M6.4 6.4L17.6 17.6M17.6 6.4L6.4 17.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </button>
        <img src="/images/comingsoon.png" alt="시연 영상 준비 중" className="aspect-video w-[37.5%] object-contain" />
      </div>
    </dialog>
  );
};

export const ScenarioVideoLink = ({ onClick }: { onClick: () => void }) => (
<button
  type="button"
  onClick={onClick}
  aria-haspopup="dialog"
  className="mt-6 inline-flex cursor-pointer shrink-0 items-center gap-2 border-b border-current text-md text-[#BABDC1] transition-colors hover:text-white focus-visible:text-white"
>
  <span
    aria-hidden="true"
    className="h-4 w-4 shrink-0 bg-current"
    style={{
      mask: "url('/images/icon/link.svg') center / contain no-repeat",
      WebkitMask: "url('/images/icon/link.svg') center / contain no-repeat",
    }}
  />
  시연 영상
</button>
);
