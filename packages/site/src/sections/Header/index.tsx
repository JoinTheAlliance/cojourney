import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full h-[93vh] flex items-center justify-center gap-4 flex-col text-center relative overflow-hidden bg-transparent">
      <h1 className="text-3xl font-bold leading-snug md:text-7xl">
        Find your person|
      </h1>
      <p className="mb-12 text-base leading-normal text-white">
        Cojourney is an AI-powered network for building real,{" "}
        <br className="hidden md:inline-block" /> meaningful connections between
        humans
      </p>
      <div className="flex items-center justify-center gap-6">
        <button className="bg-[#696969] py-2 px-2 md:px-8 rounded-lg">
          Open in Browser
        </button>
        <button className="bg-[#0075FF] py-2 px-2 md:px-8 rounded-lg">
          Download for Mac
        </button>
      </div>

      {/* <div className="min-h-[852px] w-[1200px] bg-slate-800 rounded-lg" /> */}

      {/* <Image
				src="/images/Dashboard.png"
				alt="Dashboard"
				width={1200}
				height={852}
			/> */}
    </div>
  );
};

export default Header;
