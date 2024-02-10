'use client'
import React from 'react'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

const TermsOfService = () => {
  return (
        <div className="container mx-auto p-4 px-[100px] text-black">

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
                <p className="mb-4">
                    {'These Terms of Service ("Terms") form an agreement between you ("User", "you") and Clio Dynamics, Inc. ("Cojourney", "Company", "we", "us"). They apply to the website available at https://cojourney.app (the "Website"), and the Cojourney mobile application (the "App"), collectively referred to as the "Services."'}`
                </p>
                <p className="mb-4">
                    {'By accessing or using the Services, you agree to these Terms. If you do not understand or agree, please refrain from using the Services.'}
                </p>
                <p className="mb-4">
                    {'If the Services are used on behalf of an entity, "you" also includes that entity, with the assurance that you are an authorized representative with the authority to bind the entity to these Terms.'}
                </p>
                <p className="font-semibold mb-4">
                    {'NOTE: THESE TERMS INCLUDE AN ARBITRATION CLAUSE AND A WAIVER OF CLASS ACTION RIGHTS.'}
                </p>
            </section>

            {/* Registration and Account Management */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {'Registration and Account Management'}
                </h2>
                <p className="mb-4">
                    You must provide accurate and complete information when creating an
                    account. If you are under 13, or an EU citizen or resident under 16,
                    you are not permitted to use the Services.
                </p>
                <p className="mb-4">
                    You are responsible for all activities under your account and
                    maintaining its confidentiality. Notify us immediately at{' '}
                    <a
                        href="mailto:support@cojourney.app"
                        className="text-blue-600 hover:underline"
                    >
                        support@cojourney.app
                    </a>{' '}
                    of any unauthorized use.
                </p>
            </section>

            {/* User Conduct and Content */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">User Conduct and Content</h2>
                <p className="mb-4">
                    You are solely responsible for your conduct and any content you submit
                    to the Services. Do not upload content that infringes rights, contains
                    harmful code, or engages in unlawful or objectionable activities.
                </p>
            </section>

            {/* Intellectual Property Rights */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    Intellectual Property Rights
                </h2>
                <p className="mb-4">
                    You retain ownership of content you submit but grant Cojourney a
                    broad license to use that content. Cojourney trademarks must not be
                    used without prior consent.
                </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
                <p className="mb-4">
                    We are not liable for third-party services or content accessed through
                    the Services.
                </p>
            </section>

            {/* Indemnification */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Indemnification</h2>
                <p className="mb-4">
                    You agree to indemnify and hold harmless Cojourney from any claims
                    arising from your use of the Services.
                </p>
            </section>

            {/* Disclaimer of Warranty */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Disclaimer of Warranty</h2>
                <p className="mb-4">
                    The Services are provided &quot;as is&quot; without any warranties. Cojourney
                    disclaims all warranties, express or implied.
                </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="mb-4">
                    The liability of the Company is limited under these Terms. You may not
                    claim punitive or incidental damages.
                </p>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Dispute Resolution</h2>
                <p className="mb-4">
                    Disputes will be resolved through binding arbitration, and you waive
                    the right to participate in class actions.
                </p>
            </section>

            {/* Termination */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Termination</h2>
                <p className="mb-4">
                    Cojourney may terminate or suspend your access to the Services for
                    any reason, including inactivity or violation of these Terms.
                </p>
            </section>

            {/* General Provisions */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">General Provisions</h2>
                <p className="mb-4">
                    These Terms constitute the entire agreement between you and
                    Cojourney and are governed by the laws of California, USA.
                </p>
            </section>

            {/* Contact Information */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <p className="mb-4">
                    Questions or comments about the Services can be directed to{' '}
                    <a
                        href="mailto:support@cojourney.app"
                        className="text-blue-600 hover:underline"
                    >
                        support@cojourney.app
                    </a>
                    .
                </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
                <p className="mb-4">
                    We reserve the right to modify these Terms at any time. By continuing
                    to use the Services, you agree to accept such modifications.
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
            <TermsOfService />
            <Footer />
        </main>
  )
}
