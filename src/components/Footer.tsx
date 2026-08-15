const Footer = () => {
  return (
    <div className="relative z-10 w-full shadow-[0_-8px_30px_rgba(53,73,98,0.18)]">
      <footer className="relative w-full overflow-hidden text-[#fff]">
        {/* PC */}
        <div className="relative hidden aspect-[1920/400] w-full lg:block">
          <img src="/images/footer_background.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />

          <div className="absolute inset-x-[9.4%] inset-y-[15%] z-10 xl:inset-y-[17%]">
            <img src="/images/footer_logo.png" alt="잔향" className="absolute left-0 top-0 h-auto w-[12.3%] object-contain" />

            <div className="absolute right-0 top-0 flex items-center gap-[1.8vw]">
              <a href="https://www.instagram.com/pnu.dt.16/" target="_blank" rel="noreferrer" aria-label="인스타그램" className="transition-transform duration-200 hover:scale-105">
                <img src="/images/icon/instagram.png" alt="" className="w-[clamp(28px,3vw,40px)] object-contain" />
              </a>

              <a href="https://www.youtube.com/@pnudt" target="_blank" rel="noreferrer" aria-label="유튜브" className="transition-transform duration-200 hover:scale-105">
                <img src="/images/icon/youtube.png" alt="" className="w-[clamp(28px,3vw,40px)] object-contain" />
              </a>
            </div>

            <div className="absolute bottom-0 left-0 text-[clamp(10px,1.15vw,14px)] leading-[1.5]">
              <p className="font-light">부산대학교 디자인학과 디자인앤테크놀로지 전공 17회 졸업전시</p>
              <p className="font-light">Dept. of Design, Design and Technology 17th Graduation Show</p>
              <br/>
              <p className="font-medium text-[#CBD0D7]">본 사이트는 2026 졸업논문을 대체합니다.</p>
              <p className="font-medium text-[#CBD0D7]">©2026 Pusan National University Design&amp;Technology all rights reserved.</p>
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col items-end gap-[0.5vw] text-[clamp(10px,1.05vw,12px)]">
              <a href="https://design.pusan.ac.kr/" target="_blank" rel="noreferrer" className="group flex items-center gap-[0.7vw]">
                <img src="/images/icon/pnu_logo.png" alt="" className="h-[clamp(15px,1.5vw,23px)] w-[clamp(15px,1.5vw,23px)] flex-shrink-0 object-contain" />
                <span className="whitespace-nowrap border-b border-[#CBD0D7] text-[#CBD0D7] leading-[1.25] group-hover:font-semibold">부산대학교 디자인학과 공식 홈페이지</span>
              </a>

              <a href="https://inter.pusan.ac.kr/designtech/index.do" target="_blank" rel="noreferrer" className="group flex items-center gap-[0.7vw]">
                <img src="/images/icon/pnu_logo.png" alt="" className="h-[clamp(15px,1.5vw,23px)] w-[clamp(15px,1.5vw,23px)] flex-shrink-0 object-contain" />
                <span className="whitespace-nowrap border-b border-[#CBD0D7] text-[#CBD0D7] leading-[1.25] group-hover:font-semibold">부산대학교 디자인테크놀로지전공 공식 홈페이지</span>
              </a>
            </div>
          </div>
        </div>

        {/* 모바일 */}
        <div className="relative px-[9.4%] py-[clamp(36px,6vw,56px)] lg:hidden">
          <img src="/images/footer_background.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />

          <div className="relative z-10 flex flex-col">
            <div className="flex items-start justify-between">
              <img src="/images/footer_logo.png" alt="잔향" className="w-[120px] object-contain" />

              <div className="flex items-center gap-[clamp(10px,3vw,16px)]">
                <a href="https://www.instagram.com/pnu.dt.16/" target="_blank" rel="noreferrer" aria-label="인스타그램">
                  <img src="/images/icon/instagram.png" alt="" className="h-9 w-9 object-contain" />
                </a>

                <a href="https://www.youtube.com/@pnudt" target="_blank" rel="noreferrer" aria-label="유튜브">
                  <img src="/images/icon/youtube.png" alt="" className="h-9 w-9 object-contain" />
                </a>
              </div>
            </div>

            <div className="mt-[clamp(36px,7vw,56px)] md:mt-10">
              <div className="text-[10px] leading-[1.45]">
                <p className="font-light">부산대학교 디자인학과 디자인앤테크놀로지 전공 17회 졸업전시</p>
                <p className="font-light">Dept. of Design, Design and Technology 17th Graduation Show</p><br/>
                <p className="font-medium text-[#CBD0D7]">본 사이트는 2026 졸업논문을 대체합니다.</p>
                <p className="font-medium text-[#CBD0D7]">©2026 Pusan National University Design&amp;Technology all rights reserved.</p>
              </div>

              <div className="mt-[clamp(16px,4vw,24px)] flex flex-col items-start gap-[clamp(8px,2.5vw,12px)] text-[10px] sm:text-[11px]">
                <a href="https://design.pusan.ac.kr/" target="_blank" rel="noreferrer" className="group flex items-center gap-2">
                  <img src="/images/icon/pnu_logo.png" alt="" className="h-4 w-4 flex-shrink-0 object-contain" />
                  <span className="border-b border-[#CBD0D7] text-[#CBD0D7] group-hover:font-semibold group-focus-visible:font-semibold group-active:font-semibold">부산대학교 디자인학과 공식 홈페이지</span>
                </a>

                <a href="https://inter.pusan.ac.kr/designtech/index.do" target="_blank" rel="noreferrer" className="group flex items-center gap-2">
                  <img src="/images/icon/pnu_logo.png" alt="" className="h-4 w-4 flex-shrink-0 object-contain" />
                  <span className="border-b border-[#CBD0D7] text-[#CBD0D7] group-hover:font-semibold group-focus-visible:font-semibold group-active:font-semibold">부산대학교 디자인테크놀로지전공 공식 홈페이지</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
