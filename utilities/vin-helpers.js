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

module.exports = {
  isValidVIN,
  isValidCondition,
  normalizeCondition
}; 