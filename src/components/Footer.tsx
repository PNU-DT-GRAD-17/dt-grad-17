const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden text-[#5A6C84]">
      {/* PC / 태블릿 */}
      <div className="relative hidden aspect-[4/1] w-full md:block">
        <img src="/images/footer_background.png" alt="" className="absolute inset-0 h-full w-full object-fill" />

        {/* 로고 */}
        <img src="/images/footer_logo.png" alt="잔향" className="absolute left-[9.4%] top-[10%] h-auto w-[14%] object-contain" />

        {/* SNS */}
        <div className="absolute right-[8.8%] top-[19%] flex items-center gap-[1.8vw]">
          <a href="https://www.instagram.com/pnu.dt.16/" target="_blank" rel="noreferrer" aria-label="인스타그램" className="transition-transform duration-200 hover:scale-105">
            <img src="/images/icon/instagram.png" alt="" className="h-[clamp(28px,3vw,48px)] w-[clamp(28px,3vw,48px)] object-contain" />
          </a>

          <a href="https://www.youtube.com/@pnudt" target="_blank" rel="noreferrer" aria-label="유튜브" className="transition-transform duration-200 hover:scale-105">
            <img src="/images/icon/youtube.png" alt="" className="h-[clamp(28px,3vw,48px)] w-[clamp(28px,3vw,48px)] object-contain" />
          </a>
        </div>

        {/* 왼쪽 하단 정보 */}
        <div className="absolute bottom-[16%] left-[9.4%] text-[clamp(10px,1.15vw,16px)] leading-[1.5]">
          <p>부산대학교 디자인학과 디자인앤테크놀로지 전공 17회 졸업전시</p>
          <p>Dept. of Design, Design and Technology 17th Graduation Show</p>
          <p className="font-semibold">본 사이트는 2026 졸업논문을 대체합니다.</p>
          <p className="font-semibold">©2026 Pusan National University Design&amp;Technology all rights reserved.</p>
        </div>

        {/* 오른쪽 하단 링크 */}
        <div className="absolute bottom-[16%] right-[9.4%] flex flex-col items-end gap-[0.7vw] text-[clamp(10px,1.05vw,17px)]">
          <a href="https://design.pusan.ac.kr/" target="_blank" rel="noreferrer" className="group flex items-center gap-[0.7vw]">
            <img src="/images/icon/link.png" alt="" className="h-[clamp(15px,1.5vw,23px)] w-[clamp(15px,1.5vw,23px)] flex-shrink-0 object-contain" />
            <span className="whitespace-nowrap border-b border-[#5A6C84] leading-[1.25] group-hover:font-semibold">부산대학교 디자인학과 공식 홈페이지</span>
          </a>

          <a href="https://inter.pusan.ac.kr/designtech/index.do" target="_blank" rel="noreferrer" className="group flex items-center gap-[0.7vw]">
            <img src="/images/icon/link.png" alt="" className="h-[clamp(15px,1.5vw,23px)] w-[clamp(15px,1.5vw,23px)] flex-shrink-0 object-contain" />
            <span className="whitespace-nowrap border-b border-[#5A6C84] leading-[1.25] group-hover:font-semibold">부산대학교 디자인테크놀로지전공 공식 홈페이지</span>
          </a>
        </div>
      </div>

      {/* 모바일 */}
      <div className="relative min-h-[430px] px-6 py-8 md:hidden">
        <img src="/images/footer_background.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />

        <div className="relative z-10 flex h-full min-h-[366px] flex-col">
          <div className="flex items-start justify-between">
            <img src="/images/footer_logo.png" alt="잔향" className="w-[130px] object-contain" />

            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/pnu.dt.16/" target="_blank" rel="noreferrer" aria-label="인스타그램">
                <img src="/images/icon/instagram.png" alt="" className="h-8 w-8 object-contain" />
              </a>

              <a href="https://www.youtube.com/@pnudt" target="_blank" rel="noreferrer" aria-label="유튜브">
                <img src="/images/icon/youtube.png" alt="" className="h-8 w-8 object-contain" />
              </a>
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-[11px] leading-[1.45]">
              <p>부산대학교 디자인학과 디자인앤테크놀로지 전공 17회 졸업전시</p>
              <p>Dept. of Design, Design and Technology 17th Graduation Show</p>
              <p className="font-semibold">본 사이트는 2026 졸업논문을 대체합니다.</p>
              <p className="font-semibold">©2026 Pusan National University Design&amp;Technology all rights reserved.</p>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 text-[11px]">
              <a href="https://design.pusan.ac.kr/" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <img src="/images/icon/link.png" alt="" className="h-4 w-4 flex-shrink-0 object-contain" />
                <span className="border-b border-[#5A6C84]">부산대학교 디자인학과 공식 홈페이지</span>
              </a>

              <a href="https://inter.pusan.ac.kr/designtech/index.do" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <img src="/images/icon/link.png" alt="" className="h-4 w-4 flex-shrink-0 object-contain" />
                <span className="border-b border-[#5A6C84]">부산대학교 디자인테크놀로지전공 공식 홈페이지</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;