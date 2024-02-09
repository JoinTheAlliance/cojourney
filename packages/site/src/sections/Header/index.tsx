import Link from "next/link";

const Header = () => {
	return (
		<div className="w-full h-[93vh] flex items-center justify-center flex-col text-center relative overflow-hidden gap-6 pt-[500px]">
			<h1 className="text-7xl font-bold leading-snug">
				Real human connection. <br />
				Powered by AI.
			</h1>
			<p className="text-[#90A3BF] text-xl leading-normal">
				Cojourney is a new kind of social networking app. <br />
				Find your people and grow together.
			</p>
			<div className="flex items-center justify-center gap-6 mb-[50px]">
				Try It Now
			</div>

			<div className="min-h-[852px] w-[1200px] bg-slate-800 rounded-lg" />

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
