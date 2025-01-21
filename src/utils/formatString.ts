export const trimContent = (
  content: string,
  maxLength: number = 60,
  delimiter: string = '...'
): string => {
  if (content && content.length > maxLength) {
    return `${content.substring(0, maxLength)}${delimiter}`;
  }
  return content;
};

export function capitalizeFirstLetter(value?: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}
