export function parseJsonArrayFromText(text: any) {
  let jsonData = null;

  // Check for json block
  const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;
  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    // Extract and parse json block content
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      // If parsing fails, return null
      return null;
    }
  } else {
    // Check for array-like structure without json block
    const arrayPattern = /\[\s*{[\s\S]*?}\s*\]/;
    const arrayMatch = text.match(arrayPattern);

    if (arrayMatch) {
      // Extract and parse array content
      try {
        jsonData = JSON.parse(arrayMatch[0]);
      } catch (e) {
        // If parsing fails, return null
        return null;
      }
    }
  }

  // Check if parsed data is an array and has the expected structure
  if (Array.isArray(jsonData) && jsonData.every(item => typeof item === 'object' && 'claim' in item && 'type' in item)) {
    return jsonData;
  } else {
    // If data is invalid or does not meet the expected structure, return null
    return null;
  }
}

export function parseJSONObjectFromText(text: any) {
  let jsonData = null;

  // Check for json block
  const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;
  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    // Extract and parse json block content
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      // If parsing fails, return null
      return null;
    }
  } else {
    // Check for object-like structure without json block
    const objectPattern = /{[\s\S]*?}/;
    const objectMatch = text.match(objectPattern);

    if (objectMatch) {
      // Extract and parse object content
      try {
        jsonData = JSON.parse(objectMatch[0]);
      } catch (e) {
        // If parsing fails, return null
        return null;
      }
    }
  }

  // Check if parsed data is an object (and not an array)
  if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
    return jsonData;
  } else if (typeof jsonData === 'object' && Array.isArray(jsonData)) {
    return parseJsonArrayFromText(text);
  } else {
    // If data is invalid or is not an object, return null
    return null;
  }
}
