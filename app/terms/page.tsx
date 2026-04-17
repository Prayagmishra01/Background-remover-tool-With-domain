import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function Terms() {
  return (
    <StaticPageLayout title="Terms and Conditions">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>
        By accessing and using PromptCraft, you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Use of the Service</h2>
      <p>
        Our AI tool is provided for personal and commercial use to remove backgrounds from images. You agree not to:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Use the service for any illegal or unauthorized purpose.</li>
        <li>Upload images that contain illegal, explicit, or highly sensitive content.</li>
        <li>Attempt to overload, hack, or disrupt the processing servers.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Intellectual Property</h2>
      <p>
        We do not claim any copyright or intellectual property rights over the images you upload. The processed images belong entirely to you. However, the software, branding, UI, and code of the PromptCraft app are the intellectual property of the site owners.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
      <p>
        The PromptCraft service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties that the service will be entirely error-free or uninterrupted. We are not liable for any damages or losses related to your use of this service.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Advertisements</h2>
      <p>
        To maintain our free tool, this site displays third-party advertisements served via Google AdSense. We do not personally endorse the products or services advertised.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Your continued use of the website following any changes denotes your agreement with the updated terms.
      </p>
    </StaticPageLayout>
  );
}
