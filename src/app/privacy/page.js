// app/privacy/page.jsx
export const metadata = {
  title: "Privacy Policy – AI CLOUD SOLUTIONS",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4"><strong>Developer:</strong> AI CLOUD SOLUTIONS</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how AI CLOUD SOLUTIONS handles user data in our applications,
          including AI chat, image generation, voice input, and editing tools. We are committed to
          protecting your privacy. We keep the amount of data we process to a minimum and do not collect
          any personally identifiable information unless explicitly stated.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Personal Data Collection</h2>
        <p className="mb-4">
          We do not collect, store, or share any personally identifiable information such as names,
          emails, phone numbers, addresses, or account information. The app does not require login or
          registration. We do not use third-party analytics or advertising SDKs.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Image & Photo Processing</h2>
        <p className="mb-4">
          Some features of the app allow you to upload or capture photos for editing, AI generation,
          transformations, or recognition. Images may be temporarily sent to AI model providers (such as
          OpenAI, Google, Anthropic, or Runway) for processing. 
        </p>
        <p className="mb-4 font-semibold">
          We do not store your images on our servers. Images are processed only for the purpose of
          generating AI results and then immediately discarded.
        </p>
        <p className="mb-4">
          Face data contained within uploaded images is processed only to perform the requested feature
          (e.g., transforming the user's photo, applying styles, or generating AI-based edits). We do not
          use face data for identification, verification, facial recognition, or profiling.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Camera Usage</h2>
        <p className="mb-4">
          If you choose to take a photo using your device's camera, the image is used only inside the app
          for the selected feature. Camera data is not stored, shared, or used for any other purpose.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Microphone & Speech Recognition</h2>
        <p className="mb-4">
          The app may request access to the microphone to enable voice input, speech-to-text, and voice
          commands. Audio is processed only to convert speech into text or to handle your voice request.
        </p>
        <p className="mb-4 font-semibold">
          We do not store or save your audio recordings. They may be temporarily sent to a speech
          recognition provider solely for transcription and are deleted after processing.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. AI Processing (Text, Images, Audio)</h2>
        <p className="mb-4">
          When you submit text, voice, or images to the app for AI responses, the data is sent securely
          to third-party AI model providers (e.g., OpenAI, Google, Anthropic, Runway). These providers
          process the data to generate responses.
        </p>
        <p className="mb-4">
          We do not store your prompts, messages, images, or audio on our servers. All processing occurs
          in real time and is not retained after the result is delivered to your device.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Local Storage</h2>
        <p className="mb-4">
          Some optional data—such as your chat history, generated images, or saved content—may be stored
          locally on your device to improve your experience. This information never leaves your device
          unless you choose to export or share it.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Childrens Privacy</h2>
        <p className="mb-4">
          Our app is not intended for children under the age of 13. We do not knowingly collect data from
          children. If any such data is discovered, we will delete it immediately.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to secure all temporary and local data. However, no system can
          guarantee perfect security. We recommend keeping your device updated and protected.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Your Rights</h2>
        <p className="mb-4">
          Since we do not collect or store personal data, there is no personal information for us to
          access, modify, or delete. You can remove all locally stored app data by deleting the app from
          your device.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy occasionally. Any changes will be reflected on this page with
          a new Effective Date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p className="mb-1">If you have any questions, please contact us:</p>
        <p className="text-blue-600 underline mb-10">
          cloudaisolutions008@gmail.com
        </p>

        <p className="text-sm text-gray-500">Last updated: November 20, 2025</p>
      </div>
    </main>
  );
}
