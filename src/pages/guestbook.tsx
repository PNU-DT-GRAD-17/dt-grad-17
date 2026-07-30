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
   * view-all: 모든 방명록을 확인하는 필터
   * all: 전체 디자이너에게 보내는 실제 수신인
   */
  const [selectedToId, setSelectedToId] =
    useState("view-all");

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
    randomPlaceholderName,
    setRandomPlaceholderName,
  ] = useState(getRandomName());

  const [hoveredDesignerName, setHoveredDesignerName] =
  useState("");

  const [tooltipPosition, setTooltipPosition] =
    useState({
      x: 0,
      y: 0,
    });
  
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

      /*
       * 방명록 카드 영역이 화면 아래쪽에
       * 들어오기 시작하는 위치입니다.
       */
      const showButtonPosition =
        cardsSection.offsetTop -
        window.innerHeight * 0.85;

      setIsGoTopVisible(
        window.scrollY >= showButtonPosition
      );
    };

    /*
     * 페이지를 처음 열었을 때도
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
  }, []);

  /*
   * 페이지 맨 위로 이동합니다.
   */
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * 상단 방명록 확인 필터
   */
  const filteredMessages = useMemo(() => {
    if (selectedToId === "view-all") {
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
    style={{
      backgroundImage: "url('/images/background.png')",
      backgroundSize: "100% auto",
    }}
  >
    <section className="mx-auto w-full max-w-[1440px] px-8 pb-24 pt-28">
      {/* 상단 오브제 영역 */}
      <section className="min-h-[600px] pt-8">
        <div className="relative mx-auto h-[520px] max-w-[1280px]">
          {orderedDesigners.map((designer, index) => {
            const is000Image =
              designer.objectImage
                .split("?")[0]
                .endsWith("/000.png");

            const objectScale = is000Image ? 1.4 : 1;
            const isSelected =
              formToId === designer.id;
            
            return (
              <button
                key={designer.id}
                type="button"
                onClick={() =>
                  handleObjectClick(designer.id)
                }
                onMouseEnter={(event) => {
                  setHoveredDesignerName(
                    designer.name
                  );

                  setTooltipPosition({
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
                onMouseMove={(event) => {
                  setTooltipPosition({
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredDesignerName("");
                }}
                className={`absolute flex items-center justify-center border-0 bg-transparent p-0
                  ${
                    isSelected
                      ? ""
                      : "mix-blend-hard-light"
                  }
                `}
                //기존 그리드배열 방식(이후 수정해야 함)
                // style={{
                //   left: `${8 + (index % 6) * 16}%`,
                //   top: `${
                //     8 +
                //     Math.floor(index / 6) * 24
                //   }%`,
                // }}
                
                //2차 수정
                // style={{
                //   left: `${objectLayouts[index]?.left ?? 50}%`,
                //   top: `${objectLayouts[index]?.top ?? 50}%`,
                //   width: `${objectLayouts[index]?.size ?? 110}px`,
                //   height: `${objectLayouts[index]?.size ?? 110}px`,
                //   transform: "translate(-50%, -50%)",
                // }}
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
                    h-full w-full object-contain
                    transition-transform duration-200
                    hover:scale-110
                  `}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* 작성 폼 */}
      <section ref={guestbookFormRef}
        className="mb-20 scroll-mt-32 border border-[#BCBCBC] bg-[#f9f9f9] p-8">
        <form
          onSubmit={handleSubmit}
          className="grid min-h-[360px] grid-cols-1 md:grid-cols-[420px_1fr]"
        >
          {/* 왼쪽 */}
          <div className="border-b border-[#BCBCBC] pr-16 p-8 md:border-b-0 md:border-r">
            <div className="mb-6 grid grid-cols-[70px_1fr] items-center gap-4">
              <p className="text-lg font-semibold">
                TO. 
              </p>

              <select
                value={formToId}
                onChange={(event) =>
                  setFormToId(event.target.value)
                }
                className="border-b border-neutral-300 bg-transparent px-2 py-3 outline-none"
              >
                {designers.map((designer) => (
                  <option
                    key={designer.id}
                    value={designer.id}
                  >
                    {designer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8 grid grid-cols-[70px_1fr] items-center gap-4">
              <p className="text-lg font-semibold">
                FROM.
              </p>

              <input
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
                placeholder={randomPlaceholderName}
                className="border-b border-neutral-300 bg-transparent px-2 py-3 outline-none"
              />
            </div>

            <div className="relative h-[130px] w-[105px] mt-12">
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
                className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-50"
              />
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="flex flex-col pl-12 pb-4 pr-4 pt-8">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="상단의 오브젝트를 선택하여 응원의 한마디를 남겨주세요."
              className="min-h-[220px] flex-1 resize-none bg-transparent text-medium outline-none placeholder:text-neutral-300"
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

      {/* 필터 */}
      <section className="mb-10">
        <select
          value={selectedToId}
          onChange={(event) =>
            setSelectedToId(event.target.value)
          }
          className="border-b border-neutral-700 bg-transparent px-1 py-2 text-sm outline-none"
        >

          {designers.map((designer) => (
            <option
              key={designer.id}
              value={designer.id}
            >
              {designer.name}
            </option>
          ))}
        </select>
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

                  <p className="guestbook-scroll relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain whitespace-pre-wrap break-words pr-0 text-lg font-normal leading-7">
                    {item.message}
                  </p>

                  {messageDesigner && (
                    <img
                      src={messageDesigner.selectedObjectImage}
                      alt=""
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-[50%]
                        h-[34%]
                        w-[60%]
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
    {hoveredDesignerName && (

      <div

        className="pointer-events-none fixed z-[9999] whitespace-nowrap bg-[#000101]
          px-2 py-1 text-medium font-bold text-white"

        style={{
          left: tooltipPosition.x + 14,
          top:tooltipPosition.y + 14,
        }}
      >
        {hoveredDesignerName}
      </div>
    )}
    <button
      type="button"
      onClick={handleGoToTop}
      aria-label="페이지 맨 위로 이동"
      className={`fixed bottom-6 left-1/2 z-[9998] -translate-x-1/2 transition-all duration-400 hover:-translate-y-1
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