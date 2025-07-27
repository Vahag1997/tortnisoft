// app/privacy/page.jsx
export const metadata = {
  title: 'Privacy Policy - TORTNI SOFT',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4"><strong>Developer:</strong> TORTNI SOFT</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Privacy and Data Collection</h2>
        <p className="mb-4">
          We do not collect, store, or share any personally identifiable information.
          The app does not require a user account or login, and it does not collect names, emails, phone numbers, or any contact information.
          We do not use third-party analytics or advertising SDKs, and we do not sell or share any data with external parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Camera Usage</h2>
        <p className="mb-4">
          The app uses your device's camera to scan Pokemon cards.
          Captured images are processed only to identify the card and are not saved, stored, or shared beyond the temporary processing required for app functionality.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Local Storage</h2>
        <p className="mb-4">
          Your scanned cards and collections are stored locally on your device.
          This data remains private and under your control at all times.
          We do not store any user data on external servers.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Children's Privacy</h2>
        <p className="mb-4">
          This app is not intended for children under the age of 13.
          We do not knowingly collect data from children.
          If we become aware of any such data, we will delete it promptly.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Security</h2>
        <p className="mb-4">
          We take reasonable steps to ensure the security of all temporary and local data.
          However, as with all software, no system is completely secure.
          We recommend keeping your device secure and using the latest version of the app.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
        <p className="mb-4">
          Since we do not collect or store any personal data, there is no information for us to access, correct, or delete.
          You can delete all local app data at any time by removing the app from your device.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          This Privacy Policy may be updated from time to time.
          We will notify users by updating this page with a new Effective Date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p className="mb-4">
          If you have any questions or concerns, you may contact us at:
        </p>
        <p className="text-blue-600 underline mb-10">
          tortnisoft@gmail.com
        </p>

        <p className="text-sm text-gray-500">Last updated: July 27, 2025</p>
      </div>
    </main>
  );
}
