import TypeWriter from 'typewriter-effect'

const Header = () => {
  return (
    <div className="w-full h-[80vh] md:h-[93vh] flex items-center justify-center gap-4 flex-col text-center relative overflow-hidden bg-transparent">
      <div className="flex flex-col gap-20">
        <div className="flex items-center justify-center align-middle">
          <div className="text-3xl font-bold leading-snug capitalize md:text-7xl">
            Find your&nbsp;
          </div>
          <TypeWriter
            options={{
              strings: [
                'people',
                'place',
                'mission',
                'community',
                'person',
                'mentor'
              ],
              autoStart: true,
              // @ts-expect-error
              pauseFor: 3000,
              loop: true,
              wrapperClassName:
                'text-3xl font-bold leading-snug md:text-7xl capitalize',
              cursorClassName: 'text-3xl font-bold leading-snug md:text-7xl'
            }}
          />
        </div>
      </div>
      <p className="max-w-xl mb-16 text-lg font-semibold leading-normal text-white text-shadow">
        Cojourney is an AI-powered social network for meaningful connections
        between real people
      </p>
      <div className="flex items-center justify-center gap-8">
        <a
          href="https://web.cojourney.app"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0075FF] py-3 px-2 md:px-12 rounded-lg capitalize font-bold hover:scale-110 transition duration-200 ease-in-out"
        >
          Try it now free
        </a>
        {/* <button className="bg-[#0075FF] py-2 px-2 md:px-8 rounded-lg">
          Download for Mac
        </button> */}
      </div>
    </div>
  )
}

export default Header
