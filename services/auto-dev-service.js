const axios = require('axios');
const { structureVehicleData } = require('../utilities/vehicle-helpers');

require('dotenv').config();

/**
 * Analyzes a vehicle with Auto.dev and returns raw vehicle data
 * @param {string} vin - The VIN of the vehicle to analyze
 * @returns {Object} - Raw vehicle data from Auto.dev API
 */
const analyzeVehicleWithAutoDev = async (vin) => {
  console.log(`🧠 Generating vehicle analysis with Auto.dev: ${vin}...`);
  
  try {
    // const autoDevURL = `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    const autoDevURL = `https://api.auto.dev/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}&domains=true`
    console.log(`Auto.dev URL: ${autoDevURL}`)
    const autoDevResponse = await axios.get(autoDevURL);

    // Check for payment required error in response data before processing
    if (autoDevResponse.data && autoDevResponse.data.errorType === 'PAYMENT_REQUIRED') {
      throw new Error('Auto.dev API requires Scale plan upgrade. Please upgrade at https://auto.dev/pricing');
    }

    const rawVehicleSpecs = autoDevResponse.data;
    const vehicleData = structureVehicleData(rawVehicleSpecs, vin);
    
    return vehicleData;
  } catch (error) {
    console.error('❌ Auto.dev API error:', error);
    
    // Check for payment required error (402 status or specific error response)
    if (error.status === 402 || 
        (error.response && error.response.data && error.response.data.errorType === 'PAYMENT_REQUIRED')) {
      throw new Error('Auto.dev API requires Scale plan upgrade. Please upgrade at https://auto.dev/pricing');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Auto.dev');
    } else if (error.status === 401) {
      throw new Error('Invalid Auto.dev API key');
    } else if (error.status === 400) {
      throw new Error('Invalid request to Auto.dev API');
    } else {
      throw new Error(`Auto.dev generation failed: ${error.message}`);
    }
  }
};

module.exports = {
  analyzeVehicleWithAutoDev
}; 