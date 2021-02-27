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

export const array = <T>(length: number, fn: () => T) =>
  Array.from({ length }).map(fn);

export const easeIn = (t: number): number => t * t * t * t;

export const easeOut = (t: number): number => easeIn(1.0 - t);
