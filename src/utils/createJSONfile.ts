const createJSONFile = (data: Record<string, unknown>): File | null => {
  try {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const jsonFile = new File([blob], 'metadata.json', { type: 'application/json' });
    return jsonFile;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default createJSONFile;
