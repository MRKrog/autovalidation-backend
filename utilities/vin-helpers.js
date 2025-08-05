/**
 * VIN (Vehicle Identification Number) validation and processing utilities
 */

/**
 * Validates if a VIN is in the correct format
 * @param {string} vin - The VIN to validate
 * @returns {boolean} - True if VIN is valid, false otherwise
 */
const isValidVIN = (vin) => {
  return vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

/**
 * Normalizes a VIN to uppercase format
 * @param {string} vin - The VIN to normalize
 * @returns {string} - Normalized VIN in uppercase
 */
const normalizeVIN = (vin) => {
  return vin ? vin.toUpperCase() : '';
};

/**
 * Extracts the first 11 characters of a VIN (squish VIN)
 * @param {string} vin - The VIN to process
 * @returns {string} - First 11 characters of the VIN
 */
const getSquishVIN = (vin) => {
  return vin ? vin.substring(0, 11) : '';
};

/**
 * Validates vehicle condition
 * @param {string} condition - The condition to validate
 * @returns {boolean} - True if condition is valid, false otherwise
 */
const isValidCondition = (condition) => {
  const validConditions = ['excellent', 'good', 'fair', 'poor'];
  return condition && validConditions.includes(condition.toLowerCase());
};

/**
 * Normalizes vehicle condition to lowercase with default fallback
 * @param {string} condition - The condition to normalize
 * @returns {string} - Normalized condition (defaults to 'good')
 */
const normalizeCondition = (condition) => {
  return condition ? condition.toLowerCase() : 'good';
};

/**
 * Generates a unique report ID
 * @param {string} prefix - Optional prefix for the report ID
 * @returns {string} - Generated report ID
 */
const generateReportId = (prefix = 'VVP') => {
  return `${prefix}-${Date.now()}`;
};

module.exports = {
  isValidVIN,
  normalizeVIN,
  getSquishVIN,
  isValidCondition,
  normalizeCondition,
  generateReportId
}; 