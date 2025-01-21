/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 *
 * reffered from : https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
 */
export function humanFileSize(bytes: number, si: boolean = false, dp: number = 1) {
  if (bytes === 0) return '0 Bytes';

  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units =
    si ?
      ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    u += 1;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

const separateFileNameAndExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return { extension: '', name: fileName }; // No extension found
  }
  return {
    extension: fileName.slice(lastDotIndex + 1),
    name: fileName.slice(0, lastDotIndex),
  };
};

// Utility function to format file name
export const formatFileName = (fileName: string) => {
  const { extension, name } = separateFileNameAndExtension(fileName);
  if (name.length > 10) {
    return `${name.slice(0, 5)}...${name.slice(-3)}.${extension.split('.').pop()}`;
  }
  return fileName;
};
