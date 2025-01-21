export const isExternalUrl = (url: string) => {
  const parsedUrl = new URL(url, window.location.origin);
  return parsedUrl.origin !== window.location.origin;
};
