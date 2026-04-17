import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function Disclaimer() {
  return (
    <StaticPageLayout title="Disclaimer">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. General Information</h2>
      <p>
        The information and tools provided by PromptCraft are for general informational and utility purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any automated AI outputs.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. AI Processing Disclaimer</h2>
      <p>
        Our tool utilizes Artificial Intelligence algorithms to estimate and remove backgrounds. Due to the nature of machine learning:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Cutouts may not be 100% accurate or precise in all scenarios (e.g., fine hair, transparent glass, complex foregrounds).</li>
        <li>We cannot guarantee perfect utility for highly sensitive professional tasks without manual review.</li>
        <li>Users assume full responsibility for how they use the exported image outputs.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. External Links Disclaimer</h2>
      <p>
        The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not continuously investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Advertising Disclaimer</h2>
      <p>
        This site uses Google AdSense to generate revenue. Some links or advertisements may result in compensation for the website owners if purchases or clicks are made. We do not individually endorse the entities fulfilling these third-party ads.
      </p>
    </StaticPageLayout>
  );
}
