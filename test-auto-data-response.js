const SUBARU_WRX_STI_TEST_DATA = {
  years: [ { id: 100531510, year: 2011, styles: [Array] } ],
  make: { id: 200004491, name: 'Subaru', niceName: 'subaru' },
  model: { id: 'Subaru_Impreza', name: 'Impreza', niceName: 'impreza' },
  engine: {
    id: '200347391',
    name: 'Engine',
    equipmentType: 'ENGINE',
    availability: 'STANDARD',
    compressionRatio: 8.2,
    cylinder: 4,
    size: 2.5,
    displacement: 2457,
    configuration: 'flat',
    fuelType: 'premium unleaded (required)',
    horsepower: 305,
    torque: 290,
    totalValves: 16,
    type: 'gas',
    code: '4HTCG2.5',
    compressorType: 'turbocharger',
    rpm: { horsepower: 6000, torque: 4000 },
    valve: {
      timing: 'variable valve timing',
      gear: 'double overhead camshaft'
    }
  },
  transmission: {
    id: '200347392',
    name: '6M',
    equipmentType: 'TRANSMISSION',
    availability: 'STANDARD',
    transmissionType: 'MANUAL',
    numberOfSpeeds: '6'
  },
  drivenWheels: 'all wheel drive',
  categories: {
    primaryBodyType: 'Car',
    market: 'Factory Tuner,High-Performance,Hatchback',
    epaClass: 'Midsize Station Wagons',
    vehicleSize: 'Compact',
    vehicleType: 'Car',
    vehicleStyle: '4dr Hatchback'
  },
  mpg: { highway: '23', city: '17' },
  squishVin: 'JF1GR8H6BL',
  options: [
    { category: 'Interior', options: [Array] },
    { category: 'Exterior', options: [Array] },
    { category: 'Mechanical', options: [Array] },
    { category: 'Safety', options: [Array] },
    { category: 'Package', options: [Array] }
  ],
  colors: [
    { category: 'Interior', options: [Array] },
    { category: 'Exterior', options: [Array] }
  ],
  year: 2011,
  trim: undefined,
  style: undefined,
  fuel_type: undefined,
  made_in: 'Unknown',
  msrp: 'Unknown'
}