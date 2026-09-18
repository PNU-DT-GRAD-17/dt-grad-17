import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { designers } from "../data/designers";


type GuestbookMessage = {
  id: string;
  recipientId: string;
  recipientName: string;
  from: string;
  message: string;
  createdAt: Timestamp | null;
};

const randomNames = [
  "솔리플로어",
  "플로럴 부케",
  "파우더리 플로럴",
  "프루티 플로럴",
  "그린 플로럴",
  "시트러스",
  "아쿠아",
  "그린",
  "프루티",
  "알데하이드",
  "드라이 우디",
  "소프트 우디",
  "오리엔탈 우디",
  "머스크",
  "오리엔탈",
  "구르망",
  "앰버",
  "푸제르",
];

const objectLayouts = [
  { left: 10, top: 18},
  { left: 24, top: 5},
  { left: 37, top: 17},
  { left: 51, top: 6},
  { left: 64, top: 18},
  { left: 77, top: 5},
  { left: 90, top: 17},

  { left: 3,  top: 45},
  { left: 22, top: 44},
  { left: 75, top: 45},
  { left: 95, top: 44},

  { left: 11, top: 70},
  { left: 35, top: 61},
  { left: 63, top: 66},
  { left: 91, top: 70},

  { left: 25, top: 84},
  { left: 50, top: 83},
  { left: 74, top: 83},
  { left: 50, top: 45}, // 000.png 위치
];

function getRandomName() {
  const randomIndex = Math.floor(
    Math.random() * randomNames.length
  );

  return randomNames[randomIndex];
}

function PostcardMessage({
  message,
}: {
  message: string;
}) {
  const messageRef =
    useRef<HTMLParagraphElement>(null);

  const [canScroll, setCanScroll] =
    useState(false);

  useEffect(() => {
    const element = messageRef.current;

    if (!element) {
      return;
    }

    const checkOverflow = () => {
      const isOverflowing =
        element.scrollHeight >
        element.clientHeight + 1;

      setCanScroll(isOverflowing);

      if (!isOverflowing) {
        element.scrollTop = 0;
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(
      checkOverflow
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [message]);

  return (
    <p
      ref={messageRef}
      className={`guestbook-scroll relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden [overflow-wrap:anywhere] whitespace-pre-wrap break-words pr-0 text-lg font-normal leading-7 ${
        canScroll
          ? "overflow-y-auto overscroll-contain"
          : "overflow-y-hidden"
      }`}
    >
      {message}
    </p>
  );
}

export default function Guestbook() {
   /*
    * 방명록 카드 영역과
    * GO TO TOP 버튼 표시 여부
    */
  const guestbookCardsRef =
    useRef<HTMLElement>(null);

  const guestbookFormRef =
  useRef<HTMLElement>(null);

  const [
    isGoTopVisible,
    setIsGoTopVisible,
  ] = useState(false);
  /*
   * all: 전체 디자이너에게 보내는 실제 수신인
   */
  const [selectedToId, setSelectedToId] =
    useState("all");

  const [formToId, setFormToId] =
    useState("all");

  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<
    GuestbookMessage[]
  >([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    isMobileComposerOpen,
    setIsMobileComposerOpen,
  ] = useState(false);

  const mobileMessageRef =
    useRef<HTMLTextAreaElement>(null);

  const [
    randomPlaceholderName,
    setRandomPlaceholderName,
  ] = useState(getRandomName());

  const objectTooltipRef =
    useRef<HTMLDivElement>(null);

  /*
   * 오브제들이 들어있는 컨테이너.
   * 호버 이벤트를 이 영역으로 한정해서
   * 불필요한 전역 이벤트 처리를 줄입니다.
   */
  const objectsContainerRef =
    useRef<HTMLDivElement>(null);

  // 현재 호버 중인 오브제 이름 (리렌더 없이 추적)
  const hoveredNameRef = useRef<string | null>(null);

  /*
   * 오브제 컨테이너 안에서만 호버를 감지해
   * 툴팁의 이름/표시 여부를 갱신합니다.
   *
   * pointermove에서 툴팁 위치를 즉시 반영해
   * 버튼을 누르지 않은 일반 hover도 지연되지 않게 합니다.
   */
  useEffect(() => {
    const container = objectsContainerRef.current;
    const tooltip = objectTooltipRef.current;

    if (!container || !tooltip) {
      return;
    }

    const handlePointerOver = (
      event: PointerEvent
    ) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const objectButton = event.target.closest<HTMLElement>(
        "[data-object-name]"
      );

      if (!objectButton) {
        return;
      }

      const name = objectButton.dataset.objectName ?? "";

      hoveredNameRef.current = name;
      tooltip.textContent = name;
      tooltip.style.transform = `translate3d(${event.clientX + 14}px, ${event.clientY + 14}px, 0)`;
      tooltip.style.opacity = "1";
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (hoveredNameRef.current) {
        tooltip.style.transform = `translate3d(${event.clientX + 14}px, ${event.clientY + 14}px, 0)`;
      }
    };

    const handlePointerOut = (
      event: PointerEvent
    ) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const objectButton = event.target.closest<HTMLElement>(
        "[data-object-name]"
      );

      if (!objectButton) {
        return;
      }

      const nextObject =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest(
              "[data-object-name]"
            )
          : null;

      if (nextObject) {
        return;
      }

      hoveredNameRef.current = null;
      tooltip.style.opacity = "0";
    };

    const handlePointerLeave = () => {
      hoveredNameRef.current = null;
      tooltip.style.opacity = "0";
    };

    container.addEventListener(
      "pointerover",
      handlePointerOver,
      { passive: true }
    );

    container.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    container.addEventListener(
      "pointerout",
      handlePointerOut,
      { passive: true }
    );

    container.addEventListener(
      "pointerleave",
      handlePointerLeave,
      { passive: true }
    );

    return () => {
      container.removeEventListener(
        "pointerover",
        handlePointerOver
      );

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      container.removeEventListener(
        "pointerout",
        handlePointerOut
      );

      container.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  /*
   * 현재 방명록 작성 폼에서 선택된 수신인
   */
  const selectedDesigner =
    designers.find(
      (designer) =>
        designer.id === formToId
    ) ?? designers[0];


  useEffect(() => {
    const guestbookQuery = query(
      collection(db, "guestbookMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      guestbookQuery,
      (snapshot) => {
        const nextMessages: GuestbookMessage[] =
          snapshot.docs.map((document) => {
            const data = document.data();

            /*
             * 예전에 to: "김예원"처럼 저장했던
             * 기존 데이터도 표시하기 위한 처리
             */
            const legacyRecipientName =
              data.to ?? "ALL";

            const legacyDesigner =
              designers.find(
                (designer) =>
                  designer.name ===
                  legacyRecipientName
              );

            return {
              id: document.id,

              recipientId:
                data.recipientId ??
                legacyDesigner?.id ??
                "all",

              recipientName:
                data.recipientName ??
                legacyRecipientName,

              from: data.from ?? "",

              message:
                data.message ?? "",

              createdAt:
                data.createdAt ?? null,
            };
          });

        setMessages(nextMessages);
      },
      (error) => {
        console.error(
          "방명록 불러오기 오류:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const [
  isRecipientDropdownOpen,
  setIsRecipientDropdownOpen,
] = useState(false);
    /*
   * 방명록 카드 영역에 도달하면
   * GO TO TOP 버튼을 보여줍니다.
   */
  useEffect(() => {
    const handleScroll = () => {
      const cardsSection =
        guestbookCardsRef.current;

      if (!cardsSection) {
        return;
      }

      const isMobile = window.matchMedia(
        "(max-width: 767px)"
      ).matches;

      const firstCard =
        cardsSection.querySelector<HTMLElement>("li");

      const cardsSectionTop =
        cardsSection.getBoundingClientRect().top +
        window.scrollY;

      /*
       * 모바일에서는 카드 약 1.5개를 지난 뒤,
       * 웹에서는 기존 위치에서 버튼을 표시합니다.
       */
      const showButtonPosition = isMobile
        ? cardsSectionTop +
          (firstCard?.offsetHeight ??
            window.innerHeight * 0.6) *
            1.5
        : cardsSection.offsetTop -
          window.innerHeight * 1;

      /*
       * 계산된 카드 위치와 별개로 페이지 상단에서는
       * 버튼이 절대 나타나지 않도록 최소 스크롤 거리를 둡니다.
       */
      const minimumScrollPosition = isMobile
        ? Math.max(window.innerHeight * 0.75, 320)
        : 120;

      setIsGoTopVisible(
        window.scrollY >= showButtonPosition &&
        window.scrollY >= minimumScrollPosition
      );
    };

    /*
     * 페이지를 ㅜ처음 열었을 때도
     * 현재 스크롤 위치를 확인합니다.
     */
    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );
    };
  }, [messages.length]);

  /*
   * 페이지 맨 위로 이동합니다.
   */
  const handleGoToTop = () => {
    setIsGoTopVisible(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  /*
   * 모바일에서는 하단 작성 버튼을 누르면
   * 엽서 입력 폼을 바텀 시트로 엽니다.
   */
  useEffect(() => {
    if (
      !isMobileComposerOpen ||
      window.matchMedia("(min-width: 768px)").matches
    ) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(
      () => mobileMessageRef.current?.focus()
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileComposerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileComposerOpen]);

  /*
   * 상단 방명록 확인 필터
   */
  const filteredMessages = useMemo(() => {
    if (selectedToId === "all") {
      return messages;
    }
    return messages.filter(
      (item) =>
        item.recipientId === selectedToId
    );
  }, [messages, selectedToId]);

  /*
   * 위쪽 오브제 클릭
   */
  const handleObjectClick = (
    designerId: string
  ) => {
    setFormToId(designerId);
  };

  /*
   * 엽서의 메시지 입력 영역을 클릭하면
   * 작성 엽서가 보이는 위치로 이동합니다.
   */
  const handleMessageClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    guestbookFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /*
   * 방명록 제출
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const finalFrom =
      from.trim() || randomPlaceholderName;

    if (!message.trim()) {
      alert(
        "남기고 싶은 내용을 입력해주세요 :)"
      );

      return;
    }

    if (!selectedDesigner) {
      alert("수신인을 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      await addDoc(
        collection(
          db,
          "guestbookMessages"
        ),
        {
          recipientId:
            selectedDesigner.id,

          recipientName:
            selectedDesigner.name,

          from: finalFrom,

          message: message.trim(),

          createdAt: serverTimestamp(),
        }
      );

      setFrom("");
      setMessage("");

      setRandomPlaceholderName(
        getRandomName()
      );

      setIsMobileComposerOpen(false);
    } catch (error) {
      console.error(
        "방명록 작성 오류:",
        error
      );

      alert(
        "방명록 작성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderedDesigners = useMemo(() => {
    const targetIndex = designers.findIndex(
      (designer) =>
        designer.objectImage
          .split("?")[0]
          .endsWith("/000.png")
    );

    // 000.png를 찾지 못하면 기존 순서 유지
    if (targetIndex === -1) {
      return designers;
    }

    const targetDesigner = designers[targetIndex];

    // 원본 배열을 변경하지 않고 000.png만 제외
    const remainingDesigners = designers.filter(
      (_, index) => index !== targetIndex
    );

    // 10번째 자리이므로 배열 index는 9
    remainingDesigners.splice(
      18,
      0,
      targetDesigner
    );

    return remainingDesigners;
  }, []);

  return (
  <main
    className="min-h-screen bg-repeat-y bg-top text-neutral-900"
  >
    {/* <div className="text-2xl font-semibold text-center py-4">
      감사합니다!
    </div> */}
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-36 md:px-8 md:pb-24">
      <div className="contents">
        <span className="mt-8 block text-center text-lg font-medium text-[#6A6A6A] md:mt-20">
          제17회 졸업전시회를 찾아주신 여러분께
          <br className="md:hidden" />{" "}
          진심으로 감사드립니다!
        </span>
        {/* 상단 오브제 영역 */}
        <section className="hidden min-h-[600px] pt-16 md:block">
          <div
            ref={objectsContainerRef}
            className="relative mx-auto h-[520px] max-w-[1280px]"
          >
            {orderedDesigners.map((designer, index) => {
              const is000Image =
                designer.objectImage
                  .split("?")[0]
                  .endsWith("/000.png");

              const objectScale = is000Image ? 1.7 : 1.4;
              const isSelected =
                formToId === designer.id;

              return (
                <button
                  key={designer.id}
                  type="button"
                  onClick={() =>
                    handleObjectClick(designer.id)
                  }
                  data-object-name={designer.name}
                  aria-label={`${designer.name} 선택`}
                  className={`group absolute flex items-center justify-center border-0 bg-transparent p-0
                    ${
                      isSelected
                        ? ""
                        : "mix-blend-hard-light"
                    }
                  `}
                  style={{
                    left: `${objectLayouts[index]?.left ?? 50}%`,
                    top: `${objectLayouts[index]?.top ?? 50}%`,
                    width: `${110 * objectScale}px`,
                    height: `${110 * objectScale}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <img
                    src={
                      isSelected
                        ? designer.selectedObjectImage
                        : designer.objectImage
                    }
                    alt={`${designer.name} 오브제`}
                    className={`
                      pointer-events-none h-full w-full object-contain
                      transition-transform duration-200
                      group-hover:scale-110
                    `}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* 작성 폼 */}
        <section
          ref={guestbookFormRef}
          role={isMobileComposerOpen ? "dialog" : undefined}
          aria-modal={isMobileComposerOpen ? true : undefined}
          aria-label={isMobileComposerOpen ? "방명록 작성" : undefined}
          className={`${
            isMobileComposerOpen
              ? "fixed inset-x-0 bottom-0 z-40 block max-h-[calc(100dvh-72px)] overflow-y-auto rounded-t-2xl"
              : "hidden"
          } scroll-mt-48 border border-[#BCBCBC] bg-[#f9f9f9] p-4 md:static md:z-auto md:mb-20 md:block md:max-h-none md:overflow-visible md:rounded-none md:p-8`}
        >
          <div className="mb-3 flex items-center justify-between md:hidden">
            <p className="text-lg font-semibold">방명록 남기기</p>
            <button
              type="button"
              onClick={() => {
                setIsMobileComposerOpen(false);
                setIsRecipientDropdownOpen(false);
              }}
              aria-label="방명록 작성 닫기"
              className="flex h-9 w-9 items-center justify-center text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:min-h-[360px] md:grid-cols-[420px_1fr]"
          >
          {/* 왼쪽 */}
          <div className="border-b border-[#BCBCBC] p-3 md:border-b-0 md:border-r md:p-8 md:pr-16">
            <div className="mb-3 grid grid-cols-[56px_1fr] items-center gap-2 md:mb-6 md:grid-cols-[70px_1fr] md:gap-4">
              <p className="text-lg font-semibold">
                TO. 
              </p>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() =>
                    setIsRecipientDropdownOpen(
                      (previous) => !previous
                    )
                  }
                  aria-haspopup="listbox"
                  aria-expanded={isRecipientDropdownOpen}
                  className={`flex w-full items-center justify-between border-b border-neutral-300 bg-transparent px-2 py-2 text-left text-lg font-semibold outline-none md:py-3 ${
                    formToId === "all"
                      ? "text-neutral-900"
                      : "text-[#45BFE6]"
                  }`}
                >
                  <span>{selectedDesigner.name}</span>

                  <img
                    src={
                      formToId === "all"
                        ? "/images/icon/arrowDown.png"
                        : "/images/icon/arrowDownSelected.png"
                    }
                    alt=""
                    className={`pointer-events-none h-6 w-6 object-contain ${
                      isRecipientDropdownOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {isRecipientDropdownOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 top-full z-50 max-h-[220px] w-full overflow-y-auto bg-white shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {designers.map((designer) => {
                      const isCurrent =
                        designer.id === formToId;

                      return (
                        <li
                          key={designer.id}
                          className="border-x border-t border-[#BCBCBC] last:border-b"
                        >
                          <button
                            type="button"
                            role="option"
                            aria-selected={isCurrent}
                            onClick={() => {
                              setFormToId(designer.id);
                              setIsRecipientDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-md font-medium ${
                              isCurrent
                                ? "bg-[#FFFFFF] text-[#000101]"
                                : "bg-white hover:bg-[#DFDFDF]"
                            }`}
                          >
                            {designer.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="mb-3 grid grid-cols-[56px_1fr] items-center gap-2 md:mb-8 md:grid-cols-[70px_1fr] md:gap-4">
              <p className="text-lg font-semibold text-[#000101]">
                FROM.
              </p>

              <input
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
                placeholder={randomPlaceholderName}
                className="min-w-0 w-full border-b border-neutral-300 bg-transparent px-2 py-2 text-lg font-semibold outline-none placeholder:text-lg placeholder:font-medium placeholder:text-[#bcbcbc] md:py-3"
              />
            </div>

            <div className="relative mt-2 h-20 w-16 md:mt-12 md:h-[130px] md:w-[105px]">
              <img
                src="/images/stamp-frame.png"
                alt="우표 프레임"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              />
              <img
                src={
                  selectedDesigner.selectedObjectImage
                }
                alt="선택된 오브제"
                className="absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-50"
              />
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="flex flex-col p-3 md:pb-4 md:pl-12 md:pr-4 md:pt-8">
            <textarea
              ref={mobileMessageRef}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onClick={handleMessageClick}
              placeholder={
                isMobileComposerOpen
                  ? "응원의 한마디를 남겨주세요."
                  : "상단의 오브젝트를 선택하여 응원의 한마디를 남겨주세요."
              }
              className="min-h-[120px] flex-1 resize-none bg-transparent text-medium outline-none placeholder:text-neutral-300 md:min-h-[220px]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-lg font-semibold disabled:opacity-40"
              >
                {isSubmitting
                  ? "작성 중..."
                  : "보내기 ↓"}
              </button>
            </div>
          </div>
          </form>
        </section>
      </div>

      {/* 필터 */}
      <section className="mt-10 mb-10 md:mt-0">
        <div className="relative w-full md:w-[160px]">
          <button
            type="button"
            onClick={() =>
              setIsFilterDropdownOpen(
                (previous) => !previous
              )
            }
            aria-haspopup="listbox"
            aria-expanded={isFilterDropdownOpen}
            className="flex w-full items-center justify-between border-b border-[#000101] bg-transparent px-6 py-3 text-left text-lg font-semibold text-neutral-900 outline-none md:px-2"
          >
            <span>
              {designers.find(
                (designer) =>
                  designer.id === selectedToId
              )?.name ?? "ALL"}
            </span>

            <img
              src="/images/icon/arrowDown.png"
              alt=""
              className={`pointer-events-none h-6 w-6 object-contain ${
                isFilterDropdownOpen
                  ? "rotate-180"
                  : "rotate-0"
              }`}
            />
          </button>

          {isFilterDropdownOpen && (
            <ul
              role="listbox"
              className="absolute left-0 top-full z-50 max-h-[220px] w-full overflow-y-auto bg-white shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {designers.map((designer) => {
                const isCurrent =
                  designer.id === selectedToId;

                return (
                  <li
                    key={designer.id}
                    className="border-x border-t border-[#BCBCBC] last:border-b"
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => {
                        setSelectedToId(
                          designer.id
                        );
                        setIsFilterDropdownOpen(
                          false
                        );
                      }}
                      className="block w-full bg-white px-6 py-3 text-left text-md font-medium leading-none text-[#000101] hover:bg-[#DFDFDF] md:px-4"
                    >
                      {designer.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* 방명록 카드 */}
      <section ref={guestbookCardsRef}>
      {filteredMessages.length === 0 ? (
        <div className="py-20 text-center text-neutral-500">
          아직 남겨진 방명록이 없습니다.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((item) => {
            const messageDesigner =
              designers.find(
                (designer) =>
                  designer.id ===
                  item.recipientId
              );

            return (
              <li
                key={item.id}
                className="relative aspect-[4/5] w-full"
              >
                {/* 방명록 프레임 */}
                <img
                  src="/images/guestbook_frame.png"
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-fill"
                />

                {/* 카드 안의 실제 내용 */}
                <div className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden px-[14%] py-[13%]">
                  <p className="relative z-10 mb-6 shrink-0 text-xl font-bold">
                    TO. {item.recipientName}
                  </p>

                  <PostcardMessage
                    message={item.message}
                  />

                  {messageDesigner && (
                    <img
                      src={messageDesigner.selectedObjectImage}
                      alt=""
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-[50%]
                        h-[60%]
                        -translate-x-1/2
                        -translate-y-1/2
                        object-contain
                        opacity-25
                      "
                    />
                  )}

                  <p className="relative z-10 mt-6 shrink-0 self-end text-xl font-bold">
                    FROM. {item.from}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
    </section>
    {isMobileComposerOpen ? (
      <button
        type="button"
        onClick={() => {
          setIsMobileComposerOpen(false);
          setIsRecipientDropdownOpen(false);
        }}
        aria-label="방명록 작성 닫기"
        className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-black/25 md:hidden"
      />
    ) : (
      <button
        type="button"
        onClick={() => setIsMobileComposerOpen(true)}
        aria-haspopup="dialog"
        aria-label="방명록 작성 열기"
        className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[#45BFE6] bg-white px-4 pt-5 text-left md:hidden"
        style={{
          paddingBottom:
            "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <span className="block border-b border-neutral-200 pb-4 text-lg font-medium text-neutral-400">
          응원의 한마디를 남겨주세요.
        </span>
      </button>
    )}
    <div
      ref={objectTooltipRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden whitespace-nowrap bg-[#000101] px-2 py-1 text-sm font-bold text-white opacity-0 transition-none will-change-transform md:block"
      aria-hidden="true"
    />
    <button
      type="button"
      onClick={handleGoToTop}
      aria-label="페이지 맨 위로 이동"
      className={`fixed top-20 left-1/2 z-20 -translate-x-1/2 transition-all duration-400 hover:-translate-y-1 md:top-auto md:bottom-6 md:z-[9998]
        ${isMobileComposerOpen ? "hidden md:block" : ""}
        ${
          isGoTopVisible
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-4 opacity-0"
        }
      `}
    >
      {/* 실제 버튼 이미지 */}
      <img
        src="/images/btn:gototop.png"
        className="relative block h-auto w-16 drop-shadow-[0_0_8px_rgba(0,73,123,0.3)]"
      />
    </button>
  </main>
);
}
