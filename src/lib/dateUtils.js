import { getUserTimezone } from './timezones.js';
import { getSelectedCities } from './storage.js';

const CELEBRATION_DURATION_MINUTES = 10;
const CONFETTI_TRIGGER_SECONDS = 5;
const DATE_CHECK_CACHE_DURATION = 60000; // 1 minute

let cachedIsNYEorNYD = null;
let lastDateCheckTime = 0;

export function isDecember31stOrJanuary1st() {
  const now = Date.now();
  const cacheExpired = now - lastDateCheckTime >= DATE_CHECK_CACHE_DURATION;
  
  if (cachedIsNYEorNYD !== null && !cacheExpired) {
    return cachedIsNYEorNYD;
  }
  
  const date = new Date();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  
  // December is month 11, January is month 0
  const isNYEorNYD = (month === 11 && day === 31) || (month === 0 && day === 1);
  
  cachedIsNYEorNYD = isNYEorNYD;
  lastDateCheckTime = now;
  
  return cachedIsNYEorNYD;
}

export function getTimeInTimezone(timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const year = parseInt(parts.find(p => p.type === 'year').value);
    const month = parseInt(parts.find(p => p.type === 'month').value) - 1; // 0-indexed
    const day = parseInt(parts.find(p => p.type === 'day').value);
    const hour = parseInt(parts.find(p => p.type === 'hour').value);
    const minute = parseInt(parts.find(p => p.type === 'minute').value);
    const second = parseInt(parts.find(p => p.type === 'second').value);
    
    return new Date(year, month, day, hour, minute, second);
  } catch (e) {
    console.error('Error getting time in timezone:', e);
    return null;
  }
}

export function getNextNewYear(timezone) {
  const now = getTimeInTimezone(timezone);
  if (!now) return null;

  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  let newYearYear;
  if (month === 11 && date === 31) {
    newYearYear = year + 1;
  } else if (month === 0 && date === 1) {
    const totalMinutesSinceMidnight = hours * 60 + minutes;
    if (totalMinutesSinceMidnight <= CELEBRATION_DURATION_MINUTES) {
      newYearYear = year;
    } else {
      newYearYear = year + 1;
    }
  } else {
    newYearYear = year + 1;
  }
  
  // Find the exact UTC moment when it's midnight in the target timezone
  for (let i = -12; i <= 14; i++) {
    const testTime = new Date(Date.UTC(newYearYear, 0, 1, -i, 0, 0));
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(testTime);
    const testYear = parseInt(parts.find(p => p.type === 'year').value);
    const testMonth = parseInt(parts.find(p => p.type === 'month').value) - 1;
    const testDay = parseInt(parts.find(p => p.type === 'day').value);
    const testHour = parseInt(parts.find(p => p.type === 'hour').value);
    
    if ((testHour === 0 || testHour === 24) && testMonth === 0 && testDay === 1 && testYear === newYearYear) {
      return testTime;
    }
  }
  
  return new Date(Date.UTC(newYearYear, 0, 1, 0, 0, 0));
}

export function formatCountdown(milliseconds, timezone) {
  if (milliseconds <= 0) {
    const secondsPast = Math.abs(milliseconds) / 1000;
    const minutesPast = secondsPast / 60;
    if (minutesPast <= CELEBRATION_DURATION_MINUTES) {
      return { display: '🎊 HAPPY NEW YEAR! 🎊', isCelebrating: true, justHitMidnight: secondsPast <= CONFETTI_TRIGGER_SECONDS };
    }
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;
  const displaySeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${displayHours.toString().padStart(2, '0')}h`);
  parts.push(`${displayMinutes.toString().padStart(2, '0')}m`);
  parts.push(`${displaySeconds.toString().padStart(2, '0')}s`);

  return { display: parts.join(' '), isCelebrating: false, justHitMidnight: false };
}

export function userTimezonePassedNoon() {
  const userTimezone = getUserTimezone();
  const userTime = getTimeInTimezone(userTimezone);
  if (!userTime) return false;
  
  const month = userTime.getMonth();
  const date = userTime.getDate();
  const hours = userTime.getHours();
  
  return month === 0 && date === 1 && hours >= 12;
}

export function getCitiesInRange() {
  const selectedCities = getSelectedCities();
  const citiesInRange = [];
  
  for (const city of selectedCities) {
    const cityTime = getTimeInTimezone(city.zone);
    if (!cityTime) continue;
    
    const month = cityTime.getMonth();
    const date = cityTime.getDate();
    const hours = cityTime.getHours();
    
    if (month === 0 && date === 1 && hours < 12) {
      citiesInRange.push(city);
    }
  }
  
  return citiesInRange;
}

export function getNextDec31() {
  const userTz = getUserTimezone();
  const now = getTimeInTimezone(userTz);
  if (!now) return null;
  
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  
  let targetYear = year;
  if (month !== 0 || date !== 1) {
    if (month === 11 && date === 31) {
      targetYear = year + 1;
    }
  }
  
  for (let i = -12; i <= 14; i++) {
    const testTime = new Date(Date.UTC(targetYear, 11, 31, -i, 0, 0));
    const testTimeInTz = new Date(testTime.toLocaleString('en-US', { timeZone: userTz }));
    const testHour = testTimeInTz.getHours();
    const testMonth = testTimeInTz.getMonth();
    const testDay = testTimeInTz.getDate();
    const testYear = testTimeInTz.getFullYear();
    
    if (testHour === 0 && testMonth === 11 && testDay === 31 && testYear === targetYear) {
      return testTime;
    }
  }
  
  return new Date(Date.UTC(targetYear, 11, 31, 0, 0, 0));
}
