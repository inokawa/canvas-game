export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
};

export const degToRad = (degrees: number): number =>
  (degrees / 360) * Math.PI * 2;
