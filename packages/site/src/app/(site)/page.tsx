"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AboutCojourney from "@/sections/AboutCojourney";
import Benefits from "@/sections/Benefits";
import Header from "@/sections/Header";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="bg-[#0D121F] text-white relative">
        <Image
          src="/images/background.png"
          alt="bg"
          fill
          className="object-cover w-full"
        />
        <Navbar />
        <Header />
      </div>
      <AboutCojourney />
      {/* <Benefits /> */}
      {/* <HowItWorks /> */}
      {/* <WhyUs /> */}
      {/* <Testimonials /> */}
      <Pricing />
      <Footer />
    </main>
  );
}
