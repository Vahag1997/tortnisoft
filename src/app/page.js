"use client";

import {
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ServiceCard from "./components/ServiceCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">TORTNI SOFT</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          We build cutting-edge apps, tools, and experiences.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Contact Us
        </a>
      </section>

      {/* What We Do */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ServiceCard
            title="Mobile App Development"
            description="We build fast, stunning mobile apps for iOS and Android — responsive, scalable, and user-friendly."
            Icon={DevicePhoneMobileIcon}
          />
          <ServiceCard
            title="Custom Software"
            description="From internal tools to public-facing platforms, we craft solutions tailored to your business needs."
            Icon={WrenchScrewdriverIcon}
          />
        </div>
      </section>
    </main>
  );
}
