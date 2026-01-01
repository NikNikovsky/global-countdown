import { availableTimezones, getUserTimezone, getFriendlyTimezoneName } from './timezones.js';

// Get user's selected cities from localStorage
export function getSelectedCities() {
  try {
    const stored = localStorage.getItem('selectedCities');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old format (array of timezone strings) to new format (array of city objects)
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        const migrated = parsed.map(tzZone => {
          const found = availableTimezones.find(tz => tz.zone === tzZone);
          return found || { name: getFriendlyTimezoneName(tzZone), zone: tzZone };
        });
        saveSelectedCities(migrated);
        return migrated;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  
  // Default: user timezone + 2 others (New York and Tokyo)
  const userTz = getUserTimezone();
  const userCity = availableTimezones.find(tz => tz.zone === userTz) || 
    { name: getFriendlyTimezoneName(userTz), zone: userTz };
  const defaults = [userCity];
  
  // Add New York if not user's timezone
  if (userTz !== 'America/New_York') {
    const nyCity = availableTimezones.find(tz => tz.zone === 'America/New_York');
    if (nyCity) defaults.push(nyCity);
  }
  
  // Add Tokyo if not user's timezone
  if (userTz !== 'Asia/Tokyo') {
    const tokyoCity = availableTimezones.find(tz => tz.zone === 'Asia/Tokyo');
    if (tokyoCity) defaults.push(tokyoCity);
  }
  
  // If user is in both NY and Tokyo (impossible but safe), add London
  if (defaults.length === 1) {
    const londonCity = availableTimezones.find(tz => tz.zone === 'Europe/London');
    if (londonCity) defaults.push(londonCity);
  }
  
  return defaults;
}

// Save selected cities to localStorage
export function saveSelectedCities(cities) {
  localStorage.setItem('selectedCities', JSON.stringify(cities));
}
