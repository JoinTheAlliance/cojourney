import Image from 'next/image'

const socials = [
  {
    name: 'x',
    link: '/#'
  },
  {
    name: 'discord',
    link: '/#'
  },
  {
    name: 'tiktok',
    link: '/#'
  },
  {
    name: 'github',
    link: 'https://github.com/CojourneyAI/cojourney'
  }
]
const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="w-full flex flex-col items-center bg-[#00182F] pt-4"
    >
      <div className={'flex justify-between  max-w-7xl w-4/5'}>
        <div className="flex flex-col items-start gap-8 mt-8">
          <h1 className="text-[24px] text-white font-semibold">
            We are going to make it. Together.
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <p className="font-thin text-white w-[350px] mb-4">
                Cojourney is created by people like you. Interested in working
                with us?{' '}
                <a
                  href="mailto:hello@cojourney.app"
                  className="font-semibold cursor-pointer"
                >
                  Get in touch.
                </a>
              </p>
            </div>
          </div>
        </div>
        <div>
          <Image
            src={'/images/cj.png'}
            height={200}
            className="mb-[-70px]"
            width={200}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-between w-full p-8 bg-black">
        <h1 className="text-2xl font-medium text-white md:text-4xl">
          Cojourney
        </h1>
        <div className="flex items-center justify-around w-32 md:w-96 ">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target={`${social.link !== '/#' ? '_blank' : '_self'}`}
              rel={` ${social.link !== '/#' ? 'noopener noreferrer' : ''}`}
            >
              <Image
                height={50}
                width={50}
                alt=""
                src={`/images/social/${social.name}.svg`}
                className="w-4 h-4 transition duration-200 ease-in-out md:w-10 md:h-10 hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
