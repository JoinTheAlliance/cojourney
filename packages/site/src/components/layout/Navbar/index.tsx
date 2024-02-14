// import { useUser } from '@/hooks/useUser'
// import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  {
    label: 'How it Works',
    href: '/#cojourney'
  },
  {
    label: 'Where to get it',
    href: '/#footer'
  },
  {
    label: 'Pricing',
    href: '/#pricing'
  }
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // const supabaseClient = useSupabaseClient()

  // const { user } = useUser()

  // const handleLogout = async () => {
  //   const { error } = await supabaseClient.auth.signOut()
  //   if (error) {
  //     console.log(error)
  //   }
  // }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 w-full  transition duration-500  py-4 px-16 ${
        scrolled ? 'bg-blue-500 shadow-lg' : 'bg-transparent'
      } z-10`}
    >
      <div className="flex items-center justify-between ">
        <Link
          href="/"
          aria-label="Company"
          title="Company"
          className="inline-flex items-center"
        >
          <span className="text-xl font-bold tracking-wide uppercase">
            Cojourney
          </span>
        </Link>
        {/* <ul className="items-center hidden gap-12 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                aria-label={link.label}
                title={link.label}
                className="tracking-wide transition-colors duration-200 hover:text-deep-purple-accent-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul> */}
        <div className="items-center hidden gap-4 lg:flex">
          <button className="bg-[#0075FF] py-2 px-8 rounded-lg">
            Open App
          </button>
        </div>
        {/* <div className="lg:hidden">
          <button
            aria-label="Open Menu"
            title="Open Menu"
            className="p-2 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
            onClick={() => { setIsMenuOpen(true) }}
          >
            <svg className="w-5 text-white" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
              />
              <path
                fill="currentColor"
                d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
              />
              <path
                fill="currentColor"
                d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute top-0 left-0 z-50 w-full">
              <div className="p-5 bg-white border rounded shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Link
                      href="/"
                      aria-label="Company"
                      title="Company"
                      className="inline-flex items-center"
                    >
                      <svg
                        className="w-8 text-deep-purple-accent-400"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        stroke="currentColor"
                        fill="none"
                      >
                        <rect x="3" y="1" width="7" height="12" />
                        <rect x="3" y="17" width="7" height="6" />
                        <rect x="14" y="1" width="7" height="6" />
                        <rect x="14" y="11" width="7" height="12" />
                      </svg>
                      <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                        Cojourney
                      </span>
                    </Link>
                  </div>
                  <div>
                    <button
                      aria-label="Close Menu"
                      title="Close Menu"
                      className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                      onClick={() => { setIsMenuOpen(false) }}
                    >
                      <svg className="w-5 text-gray-600" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <nav>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href="/#cojourney"
                        aria-label="Our product"
                        title="Our product"
                        className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                      >
                        How it Works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#footer"
                        aria-label="Our product"
                        title="Our product"
                        className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                      >
                        Where to get it
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#pricing"
                        aria-label="Product pricing"
                        title="Product pricing"
                        className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                      >
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default Navbar
