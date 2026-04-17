import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      // Mock mode if no API key is provided
      // Wait for 2 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const fileBlob = imageFile as Blob;
      const arrayBuffer = await fileBlob.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        headers: {
          'Content-Type': fileBlob.type || 'image/jpeg',
          'X-Mock-Mode': 'true' 
        }
      });
    }

    // Call Remove.bg API
    const apiReqBody = new FormData();
    apiReqBody.append('image_file', imageFile);
    apiReqBody.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: apiReqBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg api error:', errorText);
      return NextResponse.json({ error: 'Failed to process image' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
