'use client'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

const Privacy = () => {
  return (
    <div className="container mx-auto p-4 px-[100px] mt-8 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          {
            'Clio Dynamics, Inc. ("we", "us", or "our") operates the Cojourney application and website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.'
          }
        </p>
        <p className="mb-4">
          {
            "We prioritize your privacy and operate with transparency. We do not collect personal user data, including cookies, except for the essential data required for the Service's functionality."
          }
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Data Collection & Use</h2>
        <p className="mb-4">
          For a better experience while using our Service, we collect basic
          usage data such as views and plays. This data is non-personally
          identifiable and is used for service improvement purposes only.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Account Information & Data Retention
        </h2>
        <p className="mb-4">
          You have the ability to delete your account at any time. When you
          delete your account, all data associated with your account is
          permanently erased from our records.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Security of Data</h2>
        <p className="mb-4">
          The security of your data is of utmost importance to us. We implement
          industry-standard measures to prevent unauthorized access or
          disclosure of the data we collect and store.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          {
            'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top.'
          }
        </p>
        <p className="mb-4">
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          by email at{' '}
          <a
            href="mailto:support@cojourney.app"
            className="text-blue-600 hover:underline"
          >
            support@cojourney.app
          </a>
          .
        </p>
      </section>
    </div>
  )
}

export default function Home () {
  return (
    <main>
      <div className="bg-[#0D121F] px-[100px] text-white">
        <Navbar />
      </div>
      <Privacy />
      <Footer />
    </main>
  )
}
