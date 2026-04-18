import { Metadata } from 'next';
import Home from '@/app/page';

const programmaticData: Record<string, { title: string; description: string; h1: string }> = {
  'remove-background-from-image': {
    title: 'Remove Background From Image Offline | PromptCraft',
    description: 'A 100% private client-side tool to remove image backgrounds directly in your web browser. Try our HD exporter now.',
    h1: 'Remove Background From Image (HD)',
  },
  'remove-background-hd': {
    title: 'HD Background Remover Free (No Watermark) | PromptCraft',
    description: 'Download crisp, high-resolution cutouts natively in your browser. Totally free HD export with no subscriptions.',
    h1: 'HD Background Remover Free',
  },
  'background-remover-free-online': {
    title: 'Background Remover Free Online | No Uploads | PromptCraft',
    description: 'The secure online background remover that never uploads your images. Free edge-side AI processing.',
    h1: 'Background Remover Free Online',
  },
  'remove-background-from-logo': {
    title: 'Remove Background from Logo Free | Transparent PNG | PromptCraft',
    description: 'Isolate brand logos to pure transparent PNGs easily. Precision masking built right natively into your device.',
    h1: 'Remove Background from Logo',
  },
  'transparent-background-maker-hd': {
    title: 'Transparent Background Maker HD | PromptCraft',
    description: 'Transform any photo into a transparent web-ready PNG instantly. The smartest free transparent background creator.',
    h1: 'Transparent Background Maker HD',
  },
  'bulk-background-remover': {
    title: 'Bulk Image Background Remover Free | PromptCraft',
    description: 'Remove backgrounds from dozens of photos simultaneously. 100% free batch image background remover.',
    h1: 'Bulk Image Background Remover Free',
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = programmaticData[resolvedParams.slug];
  
  if (!data) {
    return {
      title: 'Free HD Background Remover',
    };
  }

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `https://promptcraftin.in/${resolvedParams.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://promptcraftin.in/${resolvedParams.slug}`,
      type: 'website',
    },
    twitter: {
      title: data.title,
      description: data.description,
    }
  };
}

export default async function ProgrammaticToolPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  return <Home />;
}
