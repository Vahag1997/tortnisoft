// app/terms/page.jsx
export const metadata = {
  title: 'Terms of Use - TORTNI SOFT',
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

        <p className="mb-4"><strong>Effective Date:</strong> July 27, 2025</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Agreement to Terms</h2>
        <p className="mb-4">
          These Terms of Use ("Terms") are a legal agreement between you and TORTNI SOFT regarding your use of our mobile application. By accessing or using the app, you agree to be bound by these Terms. If you do not agree, do not use the app.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. License</h2>
        <p className="mb-4">
          TORTNI SOFT grants you a limited, non-exclusive, non-transferable, revocable license to use the app for personal, non-commercial purposes strictly in accordance with these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. User Conduct</h2>
        <p className="mb-4">You agree not to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 mb-4">
          <li>Violate any applicable law or regulation</li>
          <li>Disassemble, reverse engineer, or tamper with the app</li>
          <li>Use the app for any unlawful or abusive purpose</li>
          <li>Upload or distribute harmful or offensive content</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Intellectual Property</h2>
        <p className="mb-4">
          All rights, title, and interest in and to the app and its content, including trademarks, logos, and software code, are owned by TORTNI SOFT. You may not use our intellectual property without prior written consent.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Privacy</h2>
        <p className="mb-4">
          Please refer to our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> for information on how we handle your data. By using the app, you consent to the collection and use of your data as described therein.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your access to the app at any time, without notice or liability, if you violate these Terms or engage in any behavior deemed inappropriate or harmful.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Disclaimers</h2>
        <p className="mb-4">
          The app is provided on an "as-is" and "as-available" basis. We make no warranties or guarantees, express or implied, about the reliability or availability of the app. You use the app at your own risk.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, TORTNI SOFT shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the app.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Changes to the Terms</h2>
        <p className="mb-4">
          We may update these Terms from time to time. Continued use of the app after such changes constitutes your acceptance of the revised Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws of Armenia. You agree to submit to the exclusive jurisdiction of the courts located in Armenia to resolve any legal matter arising from these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">11. Contact</h2>
        <p className="mb-4">
          If you have any questions or concerns about these Terms, please contact us at:
        </p>
        <p className="text-blue-600 underline mb-10">
          info@tortnisoft.com
        </p>

        <p className="text-sm text-gray-500">Last updated: July 27, 2025</p>
      </div>
    </main>
  );
}
