import { type FC } from 'react'
import type Pricing from '..'
import Image from 'next/image'

const PricingCard: FC<Pricing> = (props) => {
  return (
    <div className="bg-[#F3F5F7] p-6 rounded-2xl flex flex-col items-center  gap-4 w-[300px]">
      <div className="flex flex-col justify-around h-60">
        <h1 className="self-center text-4xl font-bold">Basic</h1>
        <div className="flex self-center h-12">
          <h4 className="self-center text-lg font-bold">{props.pricingUnit}</h4>
          <h3 className="self-end text-4xl font-bold ">
            {props.pricing}
            <span className="text-base">/wk</span>
          </h3>
        </div>
        <button
          className={` ${props.popular ? 'bg-[#0075FF]' : 'bg-[#444]'} cursor-pointer shadow-md px-16 py-2 rounded-3xl capitalize text-white`}
        >
          {props.button}
        </button>
      </div>
      <div className="flex flex-col gap-4 my-4">
        {props.features.map((feature, index) => {
          return (
            <div className="flex items-center gap-2" key={index}>
              <Image
                src="/images/pricing/included.svg"
                alt="included"
                width={20}
                height={20}
              />
              <p>{feature.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PricingCard
