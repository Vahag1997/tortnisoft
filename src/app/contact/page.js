'use client';

import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      {/* Intro */}
      <section className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600">
          We’d love to hear from you. Whether you have a project in mind or just want to connect, reach out and we’ll get back to you as soon as possible.
        </p>
      </section>

      {/* Contact Info */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-20">
        <div className="flex flex-col items-center">
          <EnvelopeIcon className="h-8 w-8 text-black mb-2" />
          <h3 className="text-lg font-semibold mb-1">Email</h3>
          <a
            href="mailto:contact@tortnisoft.com"
            className="text-gray-600 hover:text-black transition underline"
          >
            gevorgyanvahagn45@gmail.com
          </a>
        </div>

        <div className="flex flex-col items-center">
          <MapPinIcon className="h-8 w-8 text-black mb-2" />
          <h3 className="text-lg font-semibold mb-1">Location</h3>
          <p className="text-gray-600">Yerevan, Armenia</p>
        </div>

        <div className="flex flex-col items-center">
          <PhoneIcon className="h-8 w-8 text-black mb-2" />
          <h3 className="text-lg font-semibold mb-1">Phone</h3>
          <p className="text-gray-600">+374 55115491</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Your Project</h2>
        <p className="text-gray-600 text-lg mb-6">
          Ready to build something together? Send us a message and let's bring your idea to life.
        </p>
        <a
          href="mailto:contact@tortnisoft.com"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
