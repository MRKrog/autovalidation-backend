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
  
  return {
    // === BASIC VEHICLE IDENTIFICATION ===
    vin: rawVehicleSpecs.vin || vin || 'Unknown',
    year: rawVehicleSpecs.vehicle?.year || 'Unknown',
    make: {
      name: rawVehicleSpecs.make || 'Unknown',
      id: rawVehicleSpecs.wmi || 'Unknown',
      niceName: rawVehicleSpecs.make || 'Unknown'
    },
    model: {
      name: rawVehicleSpecs.model || 'Unknown',
      id: rawVehicleSpecs.model || 'Unknown',
      niceName: rawVehicleSpecs.model || 'Unknown'
    },
    trim: rawVehicleSpecs.trim || 'Unknown',
    
    // More descriptive names
    fullStyleDescription: rawVehicleSpecs.style || 'Unknown',
    bodyStyle: {
      body: rawVehicleSpecs.style || 'Unknown',
      modelName: rawVehicleSpecs.model || 'Unknown'
    },
    
    // === VEHICLE CHARACTERISTICS ===
    specifications: {
      type: rawVehicleSpecs.type || 'Unknown',
      origin: rawVehicleSpecs.origin || 'Unknown'
    },
    
    // === METADATA ===
    metadata: {
      manufacturerCode: rawVehicleSpecs.wmi || 'Unknown',
      squishVin: rawVehicleSpecs.squishVin || 'Unknown',
      vinValid: rawVehicleSpecs.vinValid || false,
      checkDigit: rawVehicleSpecs.checkDigit || 'Unknown',
      checksum: rawVehicleSpecs.checksum || false,
      manufacturer: rawVehicleSpecs.vehicle?.manufacturer || 'Unknown'
    }
  };
};


module.exports = {
  structureVehicleData
}; 


// const oldStructureVehicleData = {
//   // === BASIC VEHICLE IDENTIFICATION ===
//   vin: vin || 'Unknown',
//   year: rawVehicleSpecs.years?.[0]?.year || 'Unknown',
//   make: safeSpread(rawVehicleSpecs.make, { id: 'Unknown', name: 'Unknown', niceName: 'Unknown' }),
//   model: safeSpread(rawVehicleSpecs.model, { id: 'Unknown', name: 'Unknown', niceName: 'Unknown' }),
//   trim: rawVehicleSpecs.years?.[0]?.styles?.[0]?.trim || 'Unknown',
  
//   // More descriptive names
//   fullStyleDescription: rawVehicleSpecs.years?.[0]?.styles?.[0]?.name || 'Unknown',
//   bodyStyle: rawVehicleSpecs.years?.[0]?.styles?.[0]?.submodel || {},
  
//   // === POWERTRAIN SPECIFICATIONS ===
//   engine: { ...safeSpread(rawVehicleSpecs.engine) },
//   transmission: { ...safeSpread(rawVehicleSpecs.transmission) },
//   driveType: rawVehicleSpecs.drivenWheels || 'Unknown',
  
//   // === VEHICLE CHARACTERISTICS ===
//   specifications: {
//     doors: parseNumeric(rawVehicleSpecs.numOfDoors) || 'Unknown',
//     ...safeSpread(rawVehicleSpecs.categories)
//   },
  
//   // === FUEL ECONOMY ===
//   fuelEconomy: { ...safeSpread(rawVehicleSpecs.mpg) },
  
//   // === PRICING INFORMATION ===
//   pricing: { ...safeSpread(rawVehicleSpecs.price) },
  
//   // === METADATA ===
//   metadata: {
//     manufacturerCode: rawVehicleSpecs.manufacturerCode || 'Unknown',
//     matchingType: rawVehicleSpecs.matchingType || 'Unknown',
//     squishVin: rawVehicleSpecs.squishVin || 'Unknown',
//     styleId: rawVehicleSpecs.years?.[0]?.styles?.[0]?.id || 'Unknown',
//     yearId: rawVehicleSpecs.years?.[0]?.id || 'Unknown'
//   }
// };