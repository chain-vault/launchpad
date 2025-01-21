export const formatTemplate = (
  string: string,
  placeholderReplacer: (number | string)[] = []
): string => string.replace(/%s/g, () => (placeholderReplacer.shift() as string) ?? '');
