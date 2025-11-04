export default function Footer() {
  return (
    <footer className="py-8 px-10 bg-[#FF851A] text-white">
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          {/* icon */}
          <img
            src="/icon-black.png"
            alt="Icon"
            className="!w-[150px]"
          />
          <p className="font-sora text-[20px] text-black">
            the easiest way to career opportunities starts here.
          </p>
          <p className="font-sora text-[14px] text-black">
            © 2025 Crisnanda Agung Salvatoni
          </p>
        </div>
        <div className="flex flex-col !items-end">
          <p className="mt-5 font-sora font-bold text-[17px] text-black">
            Explore this web
                  </p>
                  <ul className="flex flex-col text-right">
                      <li>
                          <a href="#" className="font-sora text-[14px] !text-black">
                            Home
                          </a>
                      </li>
                      <li>
                          <a href="#" className="font-sora text-[14px] !text-black">
                            About
                          </a>
                      </li>
                      <li>
                          <a href="#" className="font-sora text-[14px] !text-black">
                            Seek jobs
                          </a>
                      </li>
                      <li>
                          <a href="#" className="font-sora text-[14px] !text-black">
                            Contact
                          </a>
                      </li>
                  </ul>
        </div>
      </div>
    </footer>
  );
}
