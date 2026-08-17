// app/privacy/page.jsx
export const metadata = {
  title: "AI CLOUD SOLUTIONS Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI CLOUD SOLUTIONS Privacy Policy</h1>

        <h2 className="text-xl font-semibold mt-8 mb-2">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how applications published by AI CLOUD SOLUTIONS handle
          information when you use features such as scanning items, viewing details, saving content,
          and sharing content. The goal is to keep data collection to a minimum and use information
          only to provide application functionality.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Information the App May Process</h2>
        <p className="mb-4">
          The app may process the following types of information depending on how you use it:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Camera and Photos:</strong> If you choose to scan a card or import an image, the app
            will access the camera and/or photo library to capture or select an image.
          </li>
          <li>
            <strong>Scans and Recognition Data:</strong> The app may analyze images to identify a card and
            show related information (such as name, set, number, rarity, and pricing details).
          </li>
          <li>
            <strong>Local Content:</strong> Collections, saved cards, notes, and preferences may be stored
            locally on your device so you can use the app offline and keep your progress.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">How Images Are Used</h2>
        <p className="mb-4">
          Images captured or selected for scanning are used only to perform the scan and display results.
          Depending on your settings and the selected feature, images may be processed on-device or sent
          securely to a processing service to identify the card and return results.
        </p>
        <p className="mb-4">
          Images are not used for identity verification, facial recognition, or profiling.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Storage and Retention</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>On-device storage:</strong> Collections and saved items are typically stored locally on
            your device.
          </li>
          <li>
            <strong>Temporary processing:</strong> If an image must be sent to a service for scanning, it
            is used only to generate the result. Any temporary data is retained only as long as needed to
            complete the request.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Sharing</h2>
        <p className="mb-4">
          The app may allow you to share images or card information using your device’s sharing options.
          Shared content is sent only when you choose to share it.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Third-Party Services</h2>
        <p className="mb-4">
          The app may use third-party services to provide scanning, card data lookup, or app functionality.
          These services may receive limited information (such as an image submitted for scanning or a card
          identifier) strictly to provide the requested feature. Third-party services are not authorized to
          use the data for unrelated purposes.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Children’s Privacy</h2>
        <p className="mb-4">
          The app is not designed to collect personal information from children. If you believe that
          personal information has been provided in error, please contact support to request removal.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Security</h2>
        <p className="mb-4">
          Reasonable technical measures are used to help protect information and communications. However,
          no method of transmission or storage is completely secure.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Your Choices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            You can control camera and photo access in your device settings.
          </li>
          <li>
            You can delete locally stored app data by clearing the app’s storage in device settings or
            uninstalling the app.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          This Privacy Policy may be updated from time to time. Updates will be posted on this page.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p className="mb-1">If you have questions about this Privacy Policy, contact:</p>
        <p className="mb-1">AI CLOUD SOLUTIONS</p>
        <p className="text-blue-600 underline mb-10">
          cloudaisolutions008@gmail.com
        </p>
      </div>
    </main>
  );
}
