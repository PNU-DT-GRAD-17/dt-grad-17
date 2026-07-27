import {
  useEffect,
  useMemo,
  useState,
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

function getRandomName() {
  const randomIndex = Math.floor(
    Math.random() * randomNames.length
  );

  return randomNames[randomIndex];
}

export default function Guestbook() {
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

  /*
   * 방명록 확인 필터에서 선택된 디자이너
   */
  const selectedFilterDesigner =
    designers.find(
      (designer) =>
        designer.id === selectedToId
    );

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
        "남기고 싶은 내용을 입력해주세요."
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
      <section className="min-h-[600px]">
        <div className="relative mx-auto h-[520px] max-w-[1280px]">
          {designers.map((designer, index) => {
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
                className="absolute flex items-center justify-center"
                style={{
                  left: `${8 + (index % 6) * 16}%`,
                  top: `${
                    8 +
                    Math.floor(index / 6) * 24
                  }%`,
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
                    h-24 w-24 object-contain
                    transition-transform duration-200
                    hover:scale-110
                    ${
                      isSelected
                        ? ""
                        : "mix-blend-hard-light"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* 작성 폼 */}
      <section className="mb-20 border border-[#BCBCBC] bg-[#f9f9f9] p-8">
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
                <div className="absolute inset-0 z-10 px-[14%] py-[13%]">
                  <p className="mb-10 text-xl font-bold">
                    TO. {item.recipientName}
                  </p>

                  <p className="whitespace-pre-wrap text-lg font-normal leading-7">
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

                  <p className="absolute bottom-[11%] right-[14%] text-xl font-bold">
                    FROM. {item.from}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
  </main>
);
}