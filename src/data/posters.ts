export const getVerticalPosterImage = (number: number): string | undefined => {
  if (!Number.isInteger(number) || number < 1 || number > 18) return undefined;

  const extension = number === 11 ? "jpg" : "png";
  return `/images/poster/vertical/${String(number).padStart(2, "0")}.${extension}`;
};
