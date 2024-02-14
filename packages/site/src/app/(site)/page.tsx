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
          src="/images/NewBackground.png"
          alt="bg"
          fill
          className="absolute top-0 left-0 object-cover w-full h-full md:object-fill"
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
