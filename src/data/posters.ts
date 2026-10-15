export const getVerticalPosterImage = (number: number): string | undefined => {
  if (!Number.isInteger(number) || number < 1 || number > 18) return undefined;

  return `/images/poster/vertical/${String(number).padStart(2, "0")}.webp`;
};

export const getVerticalPosterThumbnailImage = (number: number): string | undefined => {
  if (!Number.isInteger(number) || number < 1 || number > 18) return undefined;

  return `/images/poster/vertical/thumbnail/${String(number).padStart(2, "0")}.webp`;
};
