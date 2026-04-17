import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
      <p>
        Welcome to BGRemover ("we," "our," or "us"). We respect your privacy and are committed to protecting it. This Privacy Policy governs your use of our AI Background Remover website and tool. By using our website, you consent to the data practices described in this statement.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
      <p>
        <strong>Image Data:</strong> When you use our tool, you upload images to our servers. These images are temporarily processed to remove the background. We <strong>do not securely store, claim ownership of, or use your uploaded images</strong> to train AI models. Images are automatically deleted from our processing servers shortly after your session.
      </p>
      <p>
        <strong>Log Data and Analytics:</strong> Like many websites, we collect information that your browser sends whenever you visit our site ("Log Data"). This may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our site that you visit, the time and date of your visit, and other diagnostic data.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Google AdSense and Third-Party Vendors</h2>
      <p>
        We use Google AdSense to display advertisements on our website to keep our tool free. 
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
        <li>Users may opt-out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Ads Settings</a>.</li>
        <li>You can also opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">www.aboutads.info</a>.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies</h2>
      <p>
        Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive. We use cookies to:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Understand and save user's preferences for future visits.</li>
        <li>Serve personalized Google AdSense advertisements.</li>
        <li>Compile aggregate data about site traffic and site interactions.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us via our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>.
      </p>
    </StaticPageLayout>
  );
}
