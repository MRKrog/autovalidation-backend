// test-api.js - Test your VIN API
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test VINs
const TEST_VINS = [
  '1G1ZD5ST8JF134138', // 2018 Chevrolet Malibu
  '1HGBH41JXMN109186', // Honda Civic
  'INVALID_VIN_TEST'    // Invalid VIN for error testing
];

async function testAPI() {
  console.log('🧪 Testing VinValuation API...\n');

  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', health.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: VIN validation
  console.log('\n2️⃣ Testing VIN validation...');
  for (const vin of TEST_VINS.slice(0, 2)) {
    try {
      const validation = await axios.post(`${API_BASE}/validate-vin`, { vin });
      console.log(`✅ VIN ${vin}: ${validation.data.valid ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      console.log(`❌ VIN validation failed for ${vin}:`, error.message);
    }
  }

  // Test 3: Invalid VIN validation
  try {
    const invalidValidation = await axios.post(`${API_BASE}/validate-vin`, { 
      vin: 'INVALID_VIN_TEST' 
    });
    console.log(`✅ Invalid VIN test: ${invalidValidation.data.valid ? 'Valid' : 'Invalid'}`);
  } catch (error) {
    console.log('❌ Invalid VIN validation failed:', error.message);
  }

  // Test 4: Sample VINs endpoint
  try {
    console.log('\n3️⃣ Testing sample VINs endpoint...');
    const samples = await axios.get(`${API_BASE}/sample-vins`);
    console.log('✅ Sample VINs retrieved:', samples.data.sample_vins.length, 'samples');
  } catch (error) {
    console.log('❌ Sample VINs failed:', error.message);
  }

  // Test 5: Full valuation (only if Claude API key is set)
  console.log('\n4️⃣ Testing full valuation...');
  console.log('⚠️  Make sure your CLAUDE_API_KEY is set in .env file');
  
  try {
    const testVin = TEST_VINS[0];
    console.log(`🔍 Analyzing VIN: ${testVin}`);
    console.log('⏳ This may take 10-30 seconds...');
    
    const start = Date.now();
    const valuation = await axios.post(`${API_BASE}/valuation`, { 
      vin: testVin 
    }, {
      timeout: 60000 // 60 second timeout
    });
    
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    
    console.log(`✅ Valuation completed in ${duration} seconds`);
    console.log('📊 Report ID:', valuation.data.report_id);
    console.log('🚗 Vehicle:', `${valuation.data.vehicle.year} ${valuation.data.vehicle.make} ${valuation.data.vehicle.model}`);
    console.log('📝 Analysis length:', valuation.data.market_analysis.length, 'characters');
    
    // Show first 200 chars of analysis
    console.log('📋 Analysis preview:', 
      valuation.data.market_analysis.substring(0, 200) + '...'
    );
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timed out - this is normal for the first request');
    } else if (error.response) {
      console.log('❌ Valuation failed:', error.response.status, error.response.data);
    } else {
      console.log('❌ Valuation failed:', error.message);
    }
  }

  // Test 6: Mock valuation (fast testing)
  console.log('\n5️⃣ Testing mock valuation (fast)...');
  
  try {
    const testVin = TEST_VINS[0];
    console.log(`🔍 Testing mock VIN: ${testVin}`);
    
    const start = Date.now();
    const mockValuation = await axios.post(`${API_BASE}/test-valuation`, { 
      vin: testVin 
    });
    
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    
    console.log(`✅ Mock valuation completed in ${duration} seconds`);
    console.log('📊 Report ID:', mockValuation.data.report_id);
    console.log('🚗 Vehicle:', `${mockValuation.data.vehicle.year} ${mockValuation.data.vehicle.make} ${mockValuation.data.vehicle.model}`);
    console.log('📝 Analysis length:', mockValuation.data.market_analysis.length, 'characters');
    
    // Show first 200 chars of analysis
    console.log('📋 Analysis preview:', 
      mockValuation.data.market_analysis.substring(0, 200) + '...'
    );
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Mock valuation failed:', error.response.status, error.response.data);
    } else {
      console.log('❌ Mock valuation failed:', error.message);
    }
  }

  console.log('\n🏁 API testing complete!');
}

// Run tests
if (require.main === module) {
  testAPI().catch(console.error);
}

module.exports = { testAPI };