import Link from 'next/link';

export default function Landing() {
  return (
    <section className="pt-[150px] p-5 w-full overflow-none h-screen bg-cover bg-center landing-bg">
      <div className="lg:grid lg:grid-cols-2 ">
        <div className="flex flex-col gap-5 pl-5">
          <div className="flex w-[300px] items-center rounded-xl overflow-hidden bg-orange-400 max-md:hidden">
            <span className="bg-orange-300 text-white px-5 py-1 text-lg">
              new!
            </span>
            <span className="text-white px-5 py-2 text-lg">
              jobs made for gen z
            </span>
          </div>
          <h1 className="font-sora leading-tight font-bold! text-white !text-[100px] max-md:!text-[70px]">
            HOUSE OF <br />
            THE BRIGHT
          </h1>
          <h1 className="font-sora !text-[40px]">world&apos;s biggest jobseeker</h1>
          <Link href="/jobs">
            <button
              className="flex flex-row bg-black font-sora text-[#FBBF24] px-5 py-3 mt-5 rounded-lg font-semibold transition-all duration-200 w-fit
                hover:scale-105 hover:outline hover:outline-2 hover:outline-white hover:shadow-[0_0_10px_2px_white]"
            >
              start discovering now!
              <span className="mt-1 ml-2">
                <svg
                  width="18"
                  height="13"
                  viewBox="0 0 18 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0014 5.75442L10.0258 1.07052L11.0951 0L18 6.50001L11.0951 13L10.0258 11.9295L15.0014 7.24561H0V5.75442H15.0014Z"
                    fill="#FFAD42"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}