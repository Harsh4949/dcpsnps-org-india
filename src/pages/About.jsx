import aboutpng from '../assets/about2.png';
import Chat from './Chat.jsx';

export default function About() {
  return (
    <section id="About"
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-between 
                 px-6 md:px-24 lg:px-40 pt-0 pb-8 gap-12"
      style={{ background: "var(--body-color)" }}
    >
      {/* Left: Animated Hand with Label */}
      <div className="flex-1 flex flex-col items-center mb-8 md:mb-0">
        <img
          src={aboutpng}
          alt="Pension Support"
          className="w-72 md:w-96 lg:w-[420px] drop-shadow-2xl rounded-lg animate-float"
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 text-center md:text-left md:pr-6 lg:pr-10 flex flex-col">
        <h1 className="uppercase text-sm tracking-widest font-semibold text-white opacity-80">
          About US
        </h1>

        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mt-3">
          WHY START <br /> <span className="text-yellow-300">THIS WEBSITE</span> 
        </h1>

        <p className="mt-5 max-w-xl text-gray-200 leading-relaxed text-justify">
        All DCPS-NPS officers / employees are welcome on the "DCPS-NPS Employess's Foundation" website.
         The main purpose of launching this website is for the officers / employees joining 
         the state government service. Newly launched National Pension Scheme by the Government. 
         It is to be identified. It is hoped that this website will be useful in facilitating NPS procedures.
        </p>

        {/* ✅ Buttons Container */}
        <div className="mt-6 w-full max-w-xl flex gap-6">
          <a
            href="/about"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 
                       rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
          >
            Know More
          </a>
          
        </div>
      </div>
      <Chat />
    </section>
  );
}