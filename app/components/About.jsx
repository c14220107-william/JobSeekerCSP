export default function About() {
  return (
    <section id="about" className="py-20 px-10 bg-black w-full lg:grid lg:grid-cols-2">
      <div>
        <img
          src="/About.png"
          alt="About Us"
          className="w-[75%] ml-[20px] object-cover max-md:hidden"
        />
      </div>
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-center lg:text-right text-4xl font-bold mb-4 text-white font-sora">
          ABOUT <span className="text-[#FF851A]">US</span>
        </h1>
        <p className="lg:text-right text-lg text-gray-300 font-semibold font-sora">
          Welcome to <span className="text-[#FF851A]">Bright!</span> a platform
          that connects talents with the right opportunities.
        </p>
        <br />
        <p className="lg:text-right text-lg text-gray-300 font-semibold font-sora">
          Under the leadership of our{" "}
          <span className="text-white">CEO Crisnanda</span>,{" "}
          <span className="text-[#FF851A]">Bright!</span> was founded to help
          individuals unlock their{" "}
          <span className="text-[#FF851A]">brightest</span> potential and{" "}
          <span className="text-[#FF851A]">shine</span> in their careers.
        </p>
        <br />
        <p className="lg:text-right text-lg text-gray-300 font-semibold font-sora">
          We believe that every journey deserves a space where{" "}
          <span className="text-[#FF851A]">passion</span> meets
          <span className="text-[#FF851A]"> profession.</span>
        </p>
        <br />
        <h1 className="lg:text-right !text-3xl font-bold mb-4 text-white font-sora">
          HOUSE OF THE <span className="text-[#FF851A]">BRIGHT.</span>
        </h1>
      </div>
    </section>
  );
}
