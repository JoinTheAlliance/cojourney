import PricingCard from './card'
import data from './pricing.json'

export interface PricingType {
  type: string
  title: string
  pricing: string
  pricingUnit: string
  popular?: boolean
  features: Feature[]
  button: string
}

interface Feature {
  name: string
  isIncluded: boolean
}

const Pricing = () => {
  const pricingData = data as PricingType[]

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-16 bg-[#1E293B]"
      id="pricing"
    >
      <h1 className="text-2xl font-semibold text-white md:text-3xl">
        Open Source. Free forever.
      </h1>
      <p className=" text-base text-[#c4c4c4]">
        Upgrade for more connections and better AI.{' '}
      </p>
      <div className="flex flex-wrap items-start justify-center mt-8 gap-14">
        {pricingData.map((pricing, index) => {
          return <PricingCard key={index} {...pricing} />
        })}
      </div>
    </div>
  )
}

export default Pricing
