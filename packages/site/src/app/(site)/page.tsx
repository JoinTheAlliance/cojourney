'use client'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import AboutCojourney from '@/sections/AboutCojourney'
import Header from '@/sections/Header'
import Pricing from '@/sections/Pricing'
import Image from 'next/image'

export default function Home () {
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
  )
}
