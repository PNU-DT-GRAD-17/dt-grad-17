import { useEffect, useMemo, useState } from "react";
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
  to: string;
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
  const randomIndex = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomIndex];
}

export default function Guestbook() {
  const [selectedTo, setSelectedTo] = useState("ALL");
  const [formTo, setFormTo] = useState("ALL");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [randomPlaceholderName, setRandomPlaceholderName] = useState(getRandomName());

  useEffect(() => {
    const q = query(
      collection(db, "guestbookMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextMessages = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          to: data.to ?? "ALL",
          from: data.from ?? "",
          message: data.message ?? "",
          createdAt: data.createdAt ?? null,
        };
      });

      setMessages(nextMessages);
    });

    return () => unsubscribe();
  }, []);

  const filteredMessages = useMemo(() => {
    if (selectedTo === "ALL") return messages;
    return messages.filter((item) => item.to === selectedTo);
  }, [messages, selectedTo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalFrom = from.trim() || randomPlaceholderName;

    if (!message.trim()) {
      alert("남기고 싶은 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, "guestbookMessages"), {
        to: formTo,
        from: finalFrom,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });

      setFrom("");
      setMessage("");
      setRandomPlaceholderName(getRandomName());
    } catch (error) {
      console.error(error);
      alert("방명록 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10 text-neutral-900">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-5xl font-bold">Guestbook</h1>
        <div className="mb-8 max-w-xs">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">방명록 확인</span>
            <div className="relative">
              <select
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-11 text-sm outline-none"
              >
                {designers.map((name) => (
                  <option key={name} value={name}>
                    {name === "ALL" ? "전체 방명록" : `${name}`}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                ▼
              </span>
            </div>
          </label>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-5">
            <p className="mb-2 text-sm font-semibold">TO.</p>
            <div className="flex flex-wrap gap-2">
              {designers.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormTo(name)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    formTo === name
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">FROM.</span>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={`${randomPlaceholderName}`}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold">MESSAGE.</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="남기고 싶은 말을 적어주세요."
              rows={5}
              className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black py-3 text-white disabled:bg-neutral-400"
          >
            {isSubmitting ? "작성 중..." : "작성하기"}
          </button>
        </form>

        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">TO. {selectedTo}</h2>
          <p className="text-sm text-neutral-500">{filteredMessages.length}개</p>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            아직 남겨진 방명록이 없습니다.
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filteredMessages.map((item) => (
              <li key={item.id} className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs text-neutral-500">TO. {item.to}</p>
                <p className="mb-5 whitespace-pre-wrap text-sm leading-7">
                  {item.message}
                </p>
                <p className="text-right text-sm font-semibold">
                  FROM. {item.from}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}