// Test Business Central API endpoints
// This script helps verify that the BC API is properly deployed

const bcConfig = {
  baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev',
  apiPath: '/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)',
};

const endpoints = [
  { name: 'Staff Employees', path: '/staffEmployees' },
  { name: 'Work Locations', path: '/workLocations' },
  { name: 'Time Entry Registrations', path: '/timeEntryRegistrations' },
];

console.log('Business Central API Endpoint Test');
console.log('===================================\n');
console.log('Environment: LoyaltyIntegrationDev');
console.log('Company: CRONUS - LS Central');
console.log('API Version: v2.0\n');

console.log('Testing endpoints (Note: Authentication required):\n');

endpoints.forEach(endpoint => {
  const fullUrl = `${bcConfig.baseUrl}${bcConfig.apiPath}${endpoint.path}`;
  console.log(`${endpoint.name}:`);
  console.log(`  ${fullUrl}`);
  console.log('');
});

console.log('\nThese endpoints require OAuth 2.0 authentication.');
console.log('When accessed through Power Apps, authentication is handled automatically.');
console.log('\nTo test manually, you need to:');
console.log('1. Obtain an OAuth token from Azure AD');
console.log('2. Include it in the Authorization header: Bearer <token>');
console.log('\nThe AL extension (LSC TimeRegistration API v1.0.0.0) must be deployed to BC.');
