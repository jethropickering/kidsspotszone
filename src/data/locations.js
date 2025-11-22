// Australian states, territories, and major cities
export const states = [
  {
    id: 'nsw',
    name: 'New South Wales',
    slug: 'new-south-wales',
    abbreviation: 'NSW',
    capital: 'Sydney'
  },
  {
    id: 'vic',
    name: 'Victoria',
    slug: 'victoria',
    abbreviation: 'VIC',
    capital: 'Melbourne'
  },
  {
    id: 'qld',
    name: 'Queensland',
    slug: 'queensland',
    abbreviation: 'QLD',
    capital: 'Brisbane'
  },
  {
    id: 'wa',
    name: 'Western Australia',
    slug: 'western-australia',
    abbreviation: 'WA',
    capital: 'Perth'
  },
  {
    id: 'sa',
    name: 'South Australia',
    slug: 'south-australia',
    abbreviation: 'SA',
    capital: 'Adelaide'
  },
  {
    id: 'tas',
    name: 'Tasmania',
    slug: 'tasmania',
    abbreviation: 'TAS',
    capital: 'Hobart'
  },
  {
    id: 'act',
    name: 'Australian Capital Territory',
    slug: 'australian-capital-territory',
    abbreviation: 'ACT',
    capital: 'Canberra'
  },
  {
    id: 'nt',
    name: 'Northern Territory',
    slug: 'northern-territory',
    abbreviation: 'NT',
    capital: 'Darwin'
  }
];

// Major cities and regions by state
export const locations = {
  nsw: {
    cities: [
      { id: 'sydney', name: 'Sydney', slug: 'sydney', lat: -33.8688, lng: 151.2093, popular: true },
      { id: 'newcastle', name: 'Newcastle', slug: 'newcastle', lat: -32.9283, lng: 151.7817, popular: true },
      { id: 'wollongong', name: 'Wollongong', slug: 'wollongong', lat: -34.4278, lng: 150.8931, popular: true },
      { id: 'central-coast', name: 'Central Coast', slug: 'central-coast', lat: -33.3000, lng: 151.1753, popular: true },
      { id: 'blue-mountains', name: 'Blue Mountains', slug: 'blue-mountains', lat: -33.7109, lng: 150.3111, popular: false },
      { id: 'north-shore', name: 'North Shore', slug: 'north-shore', lat: -33.8000, lng: 151.2000, popular: true },
      { id: 'western-sydney', name: 'Western Sydney', slug: 'western-sydney', lat: -33.8000, lng: 150.9000, popular: true },
      { id: 'eastern-suburbs', name: 'Eastern Suburbs', slug: 'eastern-suburbs', lat: -33.8800, lng: 151.2500, popular: true },
      { id: 'inner-west', name: 'Inner West', slug: 'inner-west', lat: -33.8800, lng: 151.1500, popular: true },
      { id: 'northern-beaches', name: 'Northern Beaches', slug: 'northern-beaches', lat: -33.7500, lng: 151.2800, popular: true }
    ]
  },
  vic: {
    cities: [
      { id: 'melbourne', name: 'Melbourne', slug: 'melbourne', lat: -37.8136, lng: 144.9631, popular: true },
      { id: 'geelong', name: 'Geelong', slug: 'geelong', lat: -38.1499, lng: 144.3617, popular: true },
      { id: 'ballarat', name: 'Ballarat', slug: 'ballarat', lat: -37.5622, lng: 143.8503, popular: false },
      { id: 'bendigo', name: 'Bendigo', slug: 'bendigo', lat: -36.7570, lng: 144.2794, popular: false },
      { id: 'shepparton', name: 'Shepparton', slug: 'shepparton', lat: -36.3800, lng: 145.3986, popular: false },
      { id: 'melbourne-cbd', name: 'Melbourne CBD', slug: 'melbourne-cbd', lat: -37.8136, lng: 144.9631, popular: true },
      { id: 'bayside', name: 'Bayside', slug: 'bayside', lat: -37.9500, lng: 145.0000, popular: true },
      { id: 'eastern-melbourne', name: 'Eastern Melbourne', slug: 'eastern-melbourne', lat: -37.8500, lng: 145.2000, popular: true },
      { id: 'western-melbourne', name: 'Western Melbourne', slug: 'western-melbourne', lat: -37.8500, lng: 144.7500, popular: true },
      { id: 'northern-melbourne', name: 'Northern Melbourne', slug: 'northern-melbourne', lat: -37.6500, lng: 144.9500, popular: true }
    ]
  },
  qld: {
    cities: [
      { id: 'brisbane', name: 'Brisbane', slug: 'brisbane', lat: -27.4698, lng: 153.0251, popular: true },
      { id: 'gold-coast', name: 'Gold Coast', slug: 'gold-coast', lat: -28.0167, lng: 153.4000, popular: true },
      { id: 'sunshine-coast', name: 'Sunshine Coast', slug: 'sunshine-coast', lat: -26.6500, lng: 153.0667, popular: true },
      { id: 'townsville', name: 'Townsville', slug: 'townsville', lat: -19.2590, lng: 146.8169, popular: false },
      { id: 'cairns', name: 'Cairns', slug: 'cairns', lat: -16.9186, lng: 145.7781, popular: true },
      { id: 'toowoomba', name: 'Toowoomba', slug: 'toowoomba', lat: -27.5598, lng: 151.9507, popular: false },
      { id: 'ipswich', name: 'Ipswich', slug: 'ipswich', lat: -27.6147, lng: 152.7597, popular: false }
    ]
  },
  wa: {
    cities: [
      { id: 'perth', name: 'Perth', slug: 'perth', lat: -31.9505, lng: 115.8605, popular: true },
      { id: 'fremantle', name: 'Fremantle', slug: 'fremantle', lat: -32.0569, lng: 115.7439, popular: true },
      { id: 'mandurah', name: 'Mandurah', slug: 'mandurah', lat: -32.5269, lng: 115.7217, popular: false },
      { id: 'bunbury', name: 'Bunbury', slug: 'bunbury', lat: -33.3267, lng: 115.6397, popular: false },
      { id: 'albany', name: 'Albany', slug: 'albany', lat: -35.0275, lng: 117.8842, popular: false },
      { id: 'joondalup', name: 'Joondalup', slug: 'joondalup', lat: -31.7448, lng: 115.7661, popular: false }
    ]
  },
  sa: {
    cities: [
      { id: 'adelaide', name: 'Adelaide', slug: 'adelaide', lat: -34.9285, lng: 138.6007, popular: true },
      { id: 'mount-gambier', name: 'Mount Gambier', slug: 'mount-gambier', lat: -37.8297, lng: 140.7822, popular: false },
      { id: 'whyalla', name: 'Whyalla', slug: 'whyalla', lat: -33.0333, lng: 137.5667, popular: false },
      { id: 'glenelg', name: 'Glenelg', slug: 'glenelg', lat: -34.9800, lng: 138.5133, popular: true },
      { id: 'port-adelaide', name: 'Port Adelaide', slug: 'port-adelaide', lat: -34.8467, lng: 138.5050, popular: false }
    ]
  },
  tas: {
    cities: [
      { id: 'hobart', name: 'Hobart', slug: 'hobart', lat: -42.8821, lng: 147.3272, popular: true },
      { id: 'launceston', name: 'Launceston', slug: 'launceston', lat: -41.4332, lng: 147.1441, popular: true },
      { id: 'devonport', name: 'Devonport', slug: 'devonport', lat: -41.1789, lng: 146.3500, popular: false },
      { id: 'burnie', name: 'Burnie', slug: 'burnie', lat: -41.0520, lng: 145.9036, popular: false }
    ]
  },
  act: {
    cities: [
      { id: 'canberra', name: 'Canberra', slug: 'canberra', lat: -35.2809, lng: 149.1300, popular: true },
      { id: 'belconnen', name: 'Belconnen', slug: 'belconnen', lat: -35.2388, lng: 149.0656, popular: false },
      { id: 'tuggeranong', name: 'Tuggeranong', slug: 'tuggeranong', lat: -35.4244, lng: 149.0656, popular: false },
      { id: 'woden', name: 'Woden', slug: 'woden', lat: -35.3444, lng: 149.0869, popular: false }
    ]
  },
  nt: {
    cities: [
      { id: 'darwin', name: 'Darwin', slug: 'darwin', lat: -12.4634, lng: 130.8456, popular: true },
      { id: 'alice-springs', name: 'Alice Springs', slug: 'alice-springs', lat: -23.6980, lng: 133.8807, popular: false },
      { id: 'palmerston', name: 'Palmerston', slug: 'palmerston', lat: -12.4897, lng: 130.9833, popular: false }
    ]
  }
};

export const getStateBySlug = (slug) => {
  return states.find(state => state.slug === slug);
};

export const getCitiesByState = (stateId) => {
  return locations[stateId]?.cities || [];
};

export const getAllCities = () => {
  return Object.values(locations).flatMap(state => state.cities);
};

export const getPopularCities = () => {
  return Object.values(locations)
    .flatMap(state => state.cities)
    .filter(city => city.popular);
};

export const getCityBySlug = (slug) => {
  return Object.values(locations)
    .flatMap(state => state.cities)
    .find(city => city.slug === slug);
};
