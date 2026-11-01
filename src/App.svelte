<script>
  import { onMount, onDestroy } from 'svelte';
  import TimezoneCard from './lib/TimezoneCard.svelte';
  import CityModal from './lib/CityModal.svelte';
  import WorldMap from './lib/WorldMap.svelte';
  import { availableTimezones, getUserTimezone, getFriendlyTimezoneName } from './lib/timezones.js';
  import { getSelectedCities, saveSelectedCities } from './lib/storage.js';
  import { 
    isDecember31stOrJanuary1st, 
    getNextNewYear,
    formatCountdown,
    userTimezonePassedNoon,
    getCitiesInRange,
    getNextDec31
  } from './lib/dateUtils.js';
  import { createConfetti, showNotificationPopup, updateTabTitle, isSoundEnabled, setSoundEnabled, playChime } from './lib/effects.js';
  import { startTick, stopTick } from './lib/tick.js';

  let showModal = false;
  let debugMode = false;
  let soundEnabled = true;
  let selectedCities = [];
  let userTimezone = '';
  let contentType = 'countdown'; // 'countdown', 'goodbye', 'not-active'
  let countdownData = [];
  let goodbyeCountdown = '';
  let citiesInRange = [];
  let confettiShown = new Set();
  let offScreenNotificationsShown = new Set();
  let originalTitle = '';
  let updateInterval;

  onMount(() => {
    originalTitle = document.title;
    const params = new URLSearchParams(window.location.search);
    debugMode = params.get('debug') === '1' || params.get('debug') === 'true';

    const citiesParam = params.get('cities');
    if (citiesParam) {
      const parsed = citiesParam.split(',').map(part => {
        const [name, zone] = part.split('::');
        if (!name || !zone) return null;
        return { name: decodeURIComponent(name), zone: decodeURIComponent(zone) };
      }).filter(Boolean);
      if (parsed.length) {
        selectedCities = parsed;
        saveSelectedCities(parsed);
      } else {
        selectedCities = getSelectedCities();
      }
    } else {
      selectedCities = getSelectedCities();
    }

    userTimezone = getUserTimezone();
    soundEnabled = isSoundEnabled();
    if (debugMode && selectedCities.length === 0) {
      selectedCities = availableTimezones.slice(0, 6);
    }

    startTick();
    renderContent();

    if (isDecember31stOrJanuary1st() || debugMode) {
      updateInterval = setInterval(() => {
        updateCountdowns();
      }, 1000);
    }
  });

  onDestroy(() => {
    stopTick();
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  function openCityModal() {
    showModal = true;
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    setSoundEnabled(soundEnabled);
  }

  function copyShareLink() {
    const cities = selectedCities.map(c => `${encodeURIComponent(c.name)}::${encodeURIComponent(c.zone)}`).join(',');
    const url = `${window.location.origin}${window.location.pathname}?cities=${cities}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  function closeCityModal() {
    showModal = false;
  }

  function handleAddCity(event) {
    const cityObj = event.detail;
    const selected = getSelectedCities();
    const exists = selected.some(city => city.name === cityObj.name && city.zone === cityObj.zone);
    if (!exists) {
      selected.push(cityObj);
      saveSelectedCities(selected);
      selectedCities = selected;
      renderContent();
    }
    closeCityModal();
  }

  function handleRemoveCity(event) {
    const cityObj = event.detail;
    const selected = getSelectedCities();
    const filtered = selected.filter(city => !(city.name === cityObj.name && city.zone === cityObj.zone));
    saveSelectedCities(filtered);
    selectedCities = filtered;
    renderContent();
  }

  function renderContent() {
    if (!debugMode && !isDecember31stOrJanuary1st()) {
      contentType = 'not-active';
      return;
    }

    if (userTimezonePassedNoon()) {
      const cities = getCitiesInRange();
      
      if (cities.length === 0) {
        contentType = 'goodbye';
        const nextDec31 = getNextDec31();
        if (nextDec31) {
          const now = Date.now();
          const timeRemaining = nextDec31.getTime() - now;
          const countdown = formatCountdown(timeRemaining, userTimezone);
          goodbyeCountdown = countdown.display;
        }
        
        // Show user's timezone card
        citiesInRange = [{
          name: getFriendlyTimezoneName(userTimezone),
          zone: userTimezone,
          isUser: true
        }];
      } else {
        contentType = 'goodbye';
        const nextDec31 = getNextDec31();
        if (nextDec31) {
          const now = Date.now();
          const timeRemaining = nextDec31.getTime() - now;
          const countdown = formatCountdown(timeRemaining, userTimezone);
          goodbyeCountdown = countdown.display;
        }
        citiesInRange = cities.map(c => ({ ...c, isUser: false }));
      }
    } else {
      contentType = 'countdown';
      const now = Date.now();
      
      // Sort: user timezone first, then by time to New Year
      const sorted = [...selectedCities].sort((a, b) => {
        const aIsUser = a.zone === userTimezone;
        const bIsUser = b.zone === userTimezone;
        
        if (aIsUser && !bIsUser) return -1;
        if (!aIsUser && bIsUser) return 1;
        
        const aNewYear = getNextNewYear(a.zone);
        const bNewYear = getNextNewYear(b.zone);
        
        if (!aNewYear || !bNewYear) return 0;
        
        const aTime = aNewYear.getTime() - now;
        const bTime = bNewYear.getTime() - now;
        
        return aTime - bTime;
      });
      
      const userCities = sorted.filter(c => c.zone === userTimezone);
      const otherCities = sorted.filter(c => c.zone !== userTimezone);
      
      countdownData = {
        userCity: userCities[0],
        otherCities: [...userCities.slice(1), ...otherCities]
      };
    }
  }

  function updateCountdowns() {
    // Check for timezone changes
    renderContent();
    
    // Check off-screen cities for midnight
    checkOffScreenCitiesMidnight();
  }

  function checkOffScreenCitiesMidnight() {
    if (!isDecember31stOrJanuary1st()) return;
    
    const now = Date.now();
    const MIDNIGHT_CHECK_WINDOW_MS = 10000;
    const CONFETTI_TRIGGER_SECONDS = 5;
    
    availableTimezones.forEach(tz => {
      const timezone = tz.zone;
      const cityName = tz.name;
      
      if (selectedCities.some(c => c.zone === timezone)) return;
      if (offScreenNotificationsShown.has(timezone)) return;
      
      const newYear = getNextNewYear(timezone);
      if (!newYear) return;
      
      const timeRemaining = newYear.getTime() - now;
      
      if (timeRemaining > MIDNIGHT_CHECK_WINDOW_MS || timeRemaining < -(CONFETTI_TRIGGER_SECONDS * 1000)) return;
      
      const countdown = formatCountdown(timeRemaining, timezone);
      
      if (countdown.justHitMidnight) {
        offScreenNotificationsShown.add(timezone);
        createConfetti();
        playChime();
        updateTabTitle(cityName, originalTitle);
        showNotificationPopup(cityName);
      }
    });
  }

  $: userCityName = getFriendlyTimezoneName(userTimezone);
</script>

<div class="confetti-container" id="confettiContainer"></div>

<div class="container">
  <header>
    <h1>🎉 Global New Year Countdown 🎉</h1>
    <p class="subtitle">Watch the New Year arrive around the world!</p>
    <p class="detected-timezone">Your location: {userCityName}</p>
    {#if debugMode}
      <p class="detected-timezone">Debug mode enabled</p>
    {/if}
  </header>

  <WorldMap />

  {#if contentType === 'not-active'}
    <div class="message">
      <p>🗓️ The Global New Year Countdown is only available on December 31st and January 1st.</p>
      <p style="margin-top: 20px; font-size: 0.8em;">Come back during the New Year celebration!</p>
    </div>
  {:else if contentType === 'goodbye'}
    <div class="controls">
      <button class="add-city-btn" on:click={openCityModal}>➕ Add City</button>
      <button class="add-city-btn" on:click={copyShareLink}>🔗 Copy link</button>
      <button class="add-city-btn" on:click={toggleSound}>{soundEnabled ? '🔊 Sound on' : '🔇 Sound off'}</button>
    </div>
    
    <div class="message">
      <p>👋 See you next year!</p>
      {#if goodbyeCountdown}
        <div class="countdown" style="margin-top: 20px;">{goodbyeCountdown}</div>
        <p style="margin-top: 10px; font-size: 0.8em;">until the next New Year's Eve</p>
      {/if}
    </div>
    
    {#if citiesInRange.length > 0}
      <div class="other-timezones-label" style="margin-top: 30px;">
        {citiesInRange.length === 1 && citiesInRange[0].isUser ? 'Your Location' : 'Cities Still Celebrating'}
      </div>
      <div class="timezone-list">
        {#each citiesInRange as city}
          <TimezoneCard 
            city={city} 
            isUser={city.isUser}
            on:remove={handleRemoveCity}
            bind:confettiShown
          />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="controls">
      <button class="add-city-btn" on:click={openCityModal}>➕ Add City</button>
      <button class="add-city-btn" on:click={copyShareLink}>🔗 Copy link</button>
      <button class="add-city-btn" on:click={toggleSound}>{soundEnabled ? '🔊 Sound on' : '🔇 Sound off'}</button>
    </div>

    {#if countdownData.userCity}
      <div class="user-timezone-section">
        <TimezoneCard 
          city={countdownData.userCity} 
          isUser={true}
          on:remove={handleRemoveCity}
          bind:confettiShown
        />
      </div>
    {/if}

    {#if countdownData.otherCities && countdownData.otherCities.length > 0}
      <div class="other-timezones-label">Other Locations</div>
      <div class="timezone-list">
        {#each countdownData.otherCities as city}
          <TimezoneCard 
            city={city} 
            isUser={false}
            on:remove={handleRemoveCity}
            bind:confettiShown
          />
        {/each}
      </div>
    {/if}
  {/if}
</div>

{#if showModal}
  <CityModal 
    selectedCities={selectedCities}
    on:add={handleAddCity}
    on:close={closeCityModal}
  />
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 200% 200%;
    animation: gradientShift 12s ease infinite;
    color: #fff;
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px 0;
  }

  h1 {
    font-size: 3em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.2em;
    opacity: 0.9;
  }

  .detected-timezone {
    text-align: center;
    margin-top: 10px;
    font-size: 0.9em;
    opacity: 0.8;
  }

  .controls {
    text-align: center;
    margin-bottom: 30px;
  }

  .add-city-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
    padding: 12px 24px;
    font-size: 1em;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .add-city-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .message {
    text-align: center;
    font-size: 1.5em;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }

  .countdown {
    font-size: 2em;
    font-weight: bold;
    text-align: center;
    margin: 15px 0;
    font-family: 'Courier New', monospace;
  }

  .user-timezone-section {
    margin-bottom: 30px;
  }

  .other-timezones-label {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 15px;
    opacity: 0.9;
  }

  .timezone-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2em;
    }

    .timezone-list {
      grid-template-columns: 1fr;
    }

    .countdown {
      font-size: 1.5em;
    }
  }
</style>
