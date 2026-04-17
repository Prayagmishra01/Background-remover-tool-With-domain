export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    if (!url.startsWith('blob:') && !url.startsWith('data:')) {
      img.crossOrigin = 'anonymous'; // Important for CORS
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image into canvas'));
    img.src = url;
  });
};

export const compositeImageWithBackground = async (
  fgUrl: string,
  bgType: 'transparent' | 'color' | 'image',
  bgColor: string,
  bgImageUrl: string | null,
  width: number,
  height: number
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      } else if (bgType === 'image' && bgImageUrl) {
        const bgImg = await loadImage(bgImageUrl);
        // Draw bg image (cover)
        const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
        ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
      }

      const fgImg = await loadImage(fgUrl);
      ctx.drawImage(fgImg, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('Canvas is empty'));
        else resolve(blob);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
};

export const getCroppedImg = async (
  image: HTMLImageElement,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = pixelCrop.width * scaleX;
  canvas.height = pixelCrop.height * scaleY;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'));
      resolve(blob);
    }, 'image/png');
  });
};
