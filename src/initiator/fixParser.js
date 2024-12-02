import { parseStringPromise } from 'xml2js';

// Function to parse FIX XML and extract field definitions
export const loadFixSpec = async (filePath) => {
  const response = await fetch(filePath);
  const xml = await response.text();
  const parsedXml = await parseStringPromise(xml);

  const fields = {};
  const enums = {};

  // Extract field definitions
  parsedXml.repository.fields[0].field.forEach((field) => {
    const tag = field.$.number;
    const name = field.$.name;
    fields[tag] = name;

    // Extract enum values if present
    if (field.value) {
      enums[tag] = field.value.reduce((acc, enumObj) => {
        acc[enumObj.$.enum] = enumObj.$.description;
        return acc;
      }, {});
    }
  });

  return { fields, enums };
};
