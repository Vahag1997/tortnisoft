'use client';

import {
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  CpuChipIcon,
  CloudIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      {/* Intro */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">About TORTNI SOFT</h1>
        <p className="text-lg text-gray-600">
          TORTNI SOFT is a modern software company specializing in mobile applications, intelligent tools,
          and scalable digital solutions. We work with businesses and startups to design, build, and scale
          technology that performs — beautifully and reliably.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-center mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg text-center">
          To empower ideas through thoughtful, high-performance technology. Our mission is to simplify the
          complex, innovate with purpose, and deliver outstanding user experiences across platforms.
        </p>
      </section>

      {/* What We Do */}
      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-center mb-6">Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-base">
          <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <DevicePhoneMobileIcon className="h-8 w-8 text-black mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Mobile App Development</h3>
              <p>We build performant, cross-platform mobile apps using the latest frameworks and best practices.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <CodeBracketIcon className="h-8 w-8 text-black mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Custom Web Applications</h3>
              <p>From internal tools to full-scale platforms — we create software that is tailored to your needs.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <CpuChipIcon className="h-8 w-8 text-black mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">AI-Integrated Solutions</h3>
              <p>We develop intelligent tools powered by OpenAI, GPT, and machine learning models.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <CloudIcon className="h-8 w-8 text-black mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Cloud Infrastructure & DevOps</h3>
              <p>Reliable and scalable backend systems with CI/CD, containerization, and modern cloud stacks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center px-4">
            <LightBulbIcon className="h-8 w-8 text-black mb-2" />
            <h3 className="text-lg font-medium mb-1">Innovation</h3>
            <p className="text-gray-600">We embrace new technologies and push boundaries to deliver better solutions.</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <ShieldCheckIcon className="h-8 w-8 text-black mb-2" />
            <h3 className="text-lg font-medium mb-1">Reliability</h3>
            <p className="text-gray-600">Our products are built to perform under pressure — stable, secure, and scalable.</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <UsersIcon className="h-8 w-8 text-black mb-2" />
            <h3 className="text-lg font-medium mb-1">Partnership</h3>
            <p className="text-gray-600">We collaborate closely with clients to understand needs and exceed expectations.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Let us Build Something Great</h2>
        <p className="text-gray-600 text-lg mb-6">
          Whether you're a startup or an enterprise, we're ready to help you launch your next product.
          Get in touch — and let us make it happen.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
