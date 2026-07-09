// function Home() {
//   return (
//     <main className="min-h-screen bg-black text-white">
//       <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
//         <p className="mb-4 text-sm tracking-[0.3em] text-neutral-400">
//           PNU DESIGN & TECHNOLOGY
//         </p>

//         <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
//           DT Graduation Exhibition
//         </h1>

//         <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300">
//           부산대학교 디자인앤테크놀로지 졸업전시 웹사이트입니다.
//         </p>
//       </section>
//     </main>
//   )
// }

// export default Home

import InteractiveLogo from "../components/interactiveLogo";

const Home = () => {
  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <section className="relative h-full w-full">
        {/* 기준이 되는 완성 로고 */}
        <img

        src="/logo/logo_total.png" alt="logo guide"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-30"/>
        
        {/* 움직이는 음운 */}
        <div className="absolute inset-0 z-10">
          <InteractiveLogo />
        </div>
      </section>
    </main>
  );
};

export default Home;

