'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          TORTNI SOFT
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-black transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
