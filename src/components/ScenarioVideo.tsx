import { useEffect, useRef } from "react";

export const ScenarioVideoModal = ({
  onClose,
  embedUrl = "https://www.youtube.com/embed/LqWsTYJKwLA",
}: {
  onClose: () => void;
  embedUrl?: string;
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
          className="flex h-16 w-16 cursor-pointer items-center justify-center text-[#BABDC1] transition-colors hover:text-[#45bee6] focus-visible:text-[#45bee6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-current"
        >
          <span
            aria-hidden="true"
            className="h-16 w-16 bg-current"
            style={{
              mask: "url('/images/icon/x.svg') center / contain no-repeat",
              WebkitMask: "url('/images/icon/x.svg') center / contain no-repeat",
            }}
          />
        </button>
        <iframe
          src={embedUrl}
          title="시연 영상 YouTube 플레이어"
          className="aspect-video w-full border-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
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
