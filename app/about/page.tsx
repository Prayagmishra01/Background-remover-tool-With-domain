import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function About() {
  return (
    <StaticPageLayout title="About Us">
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Who We Are</h2>
      <p>
        Welcome to BGRemover — a passionate team of developers and digital creators dedicated to making high-quality photo editing accessible to everyone. We believe that professional-grade design tools shouldn't be locked behind prohibitive paywalls or steep learning curves.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
      <p>
        Our mission is straightforward: to provide the fastest, simplest, and most accurate AI background removal experience on the internet. Whether you are an e-commerce seller preparing product photos, a marketer crafting a presentation, or just an individual making a meme, we want to save you hours of manual clicking and tracing.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Why Trust Us?</h2>
      <p>
        We built BGRemover with privacy and transparency at its core. 
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li><strong>No Hidden Fees:</strong> Our core standard-res service is 100% free. We sustain server costs transparently through display advertising and optional sponsored videos.</li>
        <li><strong>Privacy First:</strong> Your photos belong to you. We process them instantly in temporary memory and do not harvest, store, or sell your personal images.</li>
        <li><strong>Modern Tech:</strong> We leverage best-in-class, state-of-the-art vision models to ensure your subject remains intact and edges remain crisp.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Get In Touch</h2>
      <p>
        We are constantly iterating and improving our algorithms based on your feedback. If you have any suggestions, bug reports, or business inquiries, we'd love to hear from you. Please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> to send us a message.
      </p>
    </StaticPageLayout>
  );
}
