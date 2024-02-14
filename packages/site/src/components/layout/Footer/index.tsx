import Image from 'next/image'
const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="w-full flex flex-col items-center gap-8 bg-[#00182F] pt-[120px]"
    >
      <div className={'flex justify-between max-w-7xl w-4/5'}>
        <div className="flex flex-col items-start gap-6 mt-8">
          <h1 className="text-[24px] text-white font-semibold mb-8">
            We are going to make it. Together.
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <p className="font-thin text-white w-[350px] mt-[-2px]">
                Cojourney is created by people like you. Interested in working
                with us?{' '}
                <span className="font-semibold cursor-pointer">
                  Get in touch.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <Image src={'/images/image 5.png'} height={400} width={400} alt="" />
        </div>
      </div>
      <div className="flex justify-between w-full p-8 bg-black">
        <h1 className="text-2xl font-medium text-white md:text-4xl">
          Cojourney
        </h1>
        <div className="flex items-center justify-around w-32 md:w-96 ">
          <Image
            height={50}
            width={50}
            alt=""
            src="/images/social/x.svg"
            className="w-4 h-4 md:w-10 md:h-10"
          />
          <Image
            height={50}
            width={50}
            alt=""
            src="/images/social/discord.svg"
            className="w-4 h-4 md:w-10 md:h-10"
          />
          <Image
            height={50}
            width={50}
            alt=""
            src="/images/social/tiktok.svg"
            className="w-4 h-4 md:w-10 md:h-10"
          />
          <Image
            height={50}
            width={50}
            alt=""
            src="/images/social/gitHub.svg"
            className="w-4 h-4 md:w-10 md:h-10"
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
