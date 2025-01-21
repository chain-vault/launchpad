/**
 * Add opacity information to a hex color
 * @param amount opacity value from 0 to 100
 * @param hexColor
 */
export function opacify(amount: number, hexColor: string, rgbaFormat = false): string {
  if (!hexColor.startsWith('#')) {
    return hexColor;
  }

  let normalizedHexColor = hexColor;

  // Expand short hex code to full form
  if (hexColor.length === 4) {
    normalizedHexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`;
  }

  if (normalizedHexColor.length !== 7) {
    throw new Error(
      `opacify: provided color ${hexColor} was not in hexadecimal format (e.g. #000000 or #000)`
    );
  }

  if (amount < 0 || amount > 100) {
    throw new Error('opacify: provided amount should be between 0 and 100');
  }

  if (rgbaFormat) {
    const r = parseInt(normalizedHexColor.slice(1, 3), 16);
    const g = parseInt(normalizedHexColor.slice(3, 5), 16);
    const b = parseInt(normalizedHexColor.slice(5, 7), 16);
    const opacity = amount / 100;
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
  }
  const opacityHex = Math.round((amount / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${normalizedHexColor}${opacityHex}`;
}
