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


module.exports = {
  structureVehicleData
}; 