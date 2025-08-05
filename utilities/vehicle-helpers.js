/**
 * Vehicle data processing and structuring utilities
 */

/**
 * Structures raw vehicle specs from auto.dev API into a consistent format
 * @param {Object} rawVehicleSpecs - Raw vehicle data from auto.dev API
 * @param {string} vin - The VIN for squish VIN generation
 * @returns {Object} - Structured vehicle data
 */
const structureVehicleData = (rawVehicleSpecs, vin = '') => {
  
  // Helper function to safely get submodel data
  const getSubmodel = () => {
    const submodel = rawVehicleSpecs.years?.[0]?.styles?.[0]?.submodel;
    return submodel ? { ...submodel } : {};
  };

  // Helper function to safely spread objects with fallbacks
  const safeSpread = (obj, fallback = {}) => {
    return obj ? { ...obj } : fallback;
  };

  // Convert string numbers to actual numbers where appropriate
  const parseNumeric = (value) => {
    if (typeof value === 'string' && !isNaN(value) && value !== '') {
      return Number(value);
    }
    return value;
  };

  return {
    // === BASIC VEHICLE IDENTIFICATION ===
    vin: vin || 'Unknown',
    year: rawVehicleSpecs.years?.[0]?.year || 'Unknown',
    make: safeSpread(rawVehicleSpecs.make, { id: 'Unknown', name: 'Unknown', niceName: 'Unknown' }),
    model: safeSpread(rawVehicleSpecs.model, { id: 'Unknown', name: 'Unknown', niceName: 'Unknown' }),
    trim: rawVehicleSpecs.years?.[0]?.styles?.[0]?.trim || 'Unknown',
    
    // More descriptive names
    fullStyleDescription: rawVehicleSpecs.years?.[0]?.styles?.[0]?.name || 'Unknown',
    bodyStyle: getSubmodel(),
    
    // === POWERTRAIN SPECIFICATIONS ===
    engine: { ...safeSpread(rawVehicleSpecs.engine) },
    transmission: { ...safeSpread(rawVehicleSpecs.transmission) },
    driveType: rawVehicleSpecs.drivenWheels || 'Unknown',
    
    // === VEHICLE CHARACTERISTICS ===
    specifications: {
      doors: parseNumeric(rawVehicleSpecs.numOfDoors) || 'Unknown',
      ...safeSpread(rawVehicleSpecs.categories)
    },
    
    // === FUEL ECONOMY ===
    fuelEconomy: { ...safeSpread(rawVehicleSpecs.mpg) },
    
    // === PRICING INFORMATION ===
    pricing: { ...safeSpread(rawVehicleSpecs.price) },
    
    // === METADATA ===
    metadata: {
      manufacturerCode: rawVehicleSpecs.manufacturerCode || 'Unknown',
      matchingType: rawVehicleSpecs.matchingType || 'Unknown',
      squishVin: rawVehicleSpecs.squishVin || 'Unknown',
      styleId: rawVehicleSpecs.years?.[0]?.styles?.[0]?.id || 'Unknown',
      yearId: rawVehicleSpecs.years?.[0]?.id || 'Unknown'
    }
  };
};

/**
 * Formats vehicle data for API response
 * @param {Object} vehicleData - Structured vehicle data
 * @returns {Object} - Formatted vehicle data for response
 */
const formatVehicleForResponse = (vehicleData) => {
  return {
    year: vehicleData.year,
    make: vehicleData.make?.name || vehicleData.make,
    model: vehicleData.model?.name || vehicleData.model,
    trim: vehicleData.trim?.name || vehicleData.trim,
    style: vehicleData.style?.name || vehicleData.style,
    engine: vehicleData.engine?.name || vehicleData.engine,
    transmission: vehicleData.transmission?.name || vehicleData.transmission,
    drivetrain: vehicleData.drivenWheels || vehicleData.drivetrain,
    fuel_type: vehicleData.fuel_type,
    msrp: vehicleData.msrp,
    // Enhanced specs
    engine_specs: vehicleData.engine,
    mpg: vehicleData.mpg,
    categories: vehicleData.categories
  };
};

/**
 * Formats enhanced vehicle data for premium API response
 * @param {Object} vehicleData - Structured vehicle data
 * @returns {Object} - Enhanced formatted vehicle data for response
 */
const formatEnhancedVehicleForResponse = (vehicleData) => {
  return {
    year: vehicleData.year,
    make: vehicleData.make?.name || vehicleData.make,
    model: vehicleData.model?.name || vehicleData.model,
    trim: vehicleData.trim?.name || vehicleData.trim,
    style: vehicleData.style?.name || vehicleData.style,
    engine_specs: vehicleData.engine,
    transmission_specs: vehicleData.transmission,
    drivetrain: vehicleData.drivenWheels || vehicleData.drivetrain,
    fuel_economy: vehicleData.mpg,
    categories: vehicleData.categories,
    options: vehicleData.options,
    colors: vehicleData.colors,
    msrp: vehicleData.msrp
  };
};

/**
 * Validates if vehicle data is complete and usable
 * @param {Object} vehicleData - Vehicle data to validate
 * @returns {boolean} - True if vehicle data is valid, false otherwise
 */
const isValidVehicleData = (vehicleData) => {
  return vehicleData && 
         vehicleData.year && 
         vehicleData.make && 
         vehicleData.model;
};

/**
 * Extracts key vehicle identifiers for logging and debugging
 * @param {Object} vehicleData - Vehicle data
 * @returns {string} - Formatted vehicle identifier string
 */
const getVehicleIdentifier = (vehicleData) => {
  const year = vehicleData.year || 'Unknown';
  const make = vehicleData.make?.name || vehicleData.make || 'Unknown';
  const model = vehicleData.model?.name || vehicleData.model || 'Unknown';
  return `${year} ${make} ${model}`;
};

module.exports = {
  structureVehicleData,
  // formatVehicleForResponse,
  // formatEnhancedVehicleForResponse,
  // isValidVehicleData,
  // getVehicleIdentifier
}; 