import { useEffect, useRef, useState } from "react";

type KakaoMapStatus = "loading" | "ready" | "missing-key" | "error";

type KakaoLatLng = object;

type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => object;
  Marker: new (options: { map: object; position: KakaoLatLng }) => object;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let kakaoMapsPromise: Promise<KakaoMaps> | null = null;

const loadKakaoMaps = (appKey: string) => {
  if (window.kakao?.maps) {
    return new Promise<KakaoMaps>((resolve) => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps));
    });
  }

  if (kakaoMapsPromise) return kakaoMapsPromise;

  kakaoMapsPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK was not initialized."));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => reject(new Error("Kakao Maps SDK could not be loaded."));
    document.head.appendChild(script);
  }).catch((error) => {
    kakaoMapsPromise = null;
    throw error;
  });

  return kakaoMapsPromise;
};

const KAKAO_MAP_URL = "https://map.kakao.com/link/map/부산디자인진흥원,35.173944617381,129.12948707357";
const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY?.trim();

function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<KakaoMapStatus>(
    KAKAO_MAP_KEY ? "loading" : "missing-key",
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!KAKAO_MAP_KEY) return;

    if (!container) return;

    let cancelled = false;

    void loadKakaoMaps(KAKAO_MAP_KEY)
      .then((maps) => {
        if (cancelled) return;

        const center = new maps.LatLng(35.173944617381, 129.12948707357);
        const map = new maps.Map(container, { center, level: 3 });
        new maps.Marker({ map, position: center });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden bg-[#d9d9d9]">
      <div ref={containerRef} className="h-full w-full" aria-label="부산디자인진흥원 위치 지도" />

      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#d9d9d9] px-6 text-center text-sm leading-relaxed text-[#666]">
          {status === "loading" && <p>지도를 불러오는 중입니다.</p>}
          {status === "missing-key" && (
            <p>
              카카오맵 JavaScript 키를 설정하면<br />이 위치에 지도가 표시됩니다.
            </p>
          )}
          {status === "error" && (
            <p>
              지도를 불러오지 못했습니다.<br />카카오 앱 키와 등록 도메인을 확인해 주세요.
            </p>
          )}
        </div>
      )}

      <a
        href={KAKAO_MAP_URL}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 z-10 rounded-sm bg-white/95 px-3 py-2 text-xs font-semibold text-[#222] shadow-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066ad]"
      >
        카카오맵에서 보기
      </a>
    </div>
  );
}

export default KakaoMap;
