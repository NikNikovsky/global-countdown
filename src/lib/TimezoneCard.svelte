<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { getNextNewYear, formatCountdown, getTimeInTimezone } from './dateUtils.js';
  import { createConfetti } from './effects.js';

  export let city;
  export let isUser;
  export let userTimezone;
  export let confettiShown = new Set();

  const dispatch = createEventDispatcher();
  
  let countdown = { display: '', isCelebrating: false, justHitMidnight: false };
  let localTimeStr = '';
  let updateInterval;

  function updateCard() {
    const newYear = getNextNewYear(city.zone);
    if (!newYear) return;
    
    const now = Date.now();
    const timeRemaining = newYear.getTime() - now;
    countdown = formatCountdown(timeRemaining, city.zone);
    
    // Trigger confetti if just hit midnight
    if (countdown.justHitMidnight && !confettiShown.has(city.zone)) {
      confettiShown.add(city.zone);
      confettiShown = confettiShown; // Trigger reactivity
      createConfetti();
    }
    
    // Update local time
    localTimeStr = new Date().toLocaleString('en-US', {
      timeZone: city.zone,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  onMount(() => {
    updateCard();
    updateInterval = setInterval(updateCard, 1000);
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  function handleRemove() {
    dispatch('remove', city);
  }
</script>

<div class="timezone-card" class:user-timezone={isUser}>
  <div class="timezone-name">
    {city.name}
    {#if isUser}
      <span class="user-badge">YOUR TIMEZONE</span>
    {/if}
  </div>
  
  <div class="countdown" class:celebration={countdown.isCelebrating}>
    {countdown.display}
    {#if !countdown.isCelebrating}
      <span class="countdown-label">until New Year</span>
    {/if}
  </div>
  
  <div class="local-time">{localTimeStr}</div>
  
  {#if !isUser}
    <button class="delete-btn" on:click={handleRemove}>🗑️ Remove</button>
  {/if}
</div>

<style>
  .timezone-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.3s ease;
  }

  .timezone-card:hover {
    transform: translateY(-5px);
  }

  .timezone-card.user-timezone {
    background: rgba(255, 215, 0, 0.3);
    border: 3px solid rgba(255, 215, 0, 0.8);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  }

  .timezone-name {
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-badge {
    background: #FFD700;
    color: #333;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.6em;
    font-weight: bold;
  }

  .countdown {
    font-size: 2em;
    font-weight: bold;
    text-align: center;
    margin: 15px 0;
    font-family: 'Courier New', monospace;
  }

  .countdown.celebration {
    font-size: 1.2em;
    color: #FFD700;
  }

  .countdown-label {
    font-size: 0.5em;
    opacity: 0.8;
    display: block;
    margin-top: 5px;
  }

  .local-time {
    text-align: center;
    opacity: 0.8;
    font-size: 0.9em;
    margin-top: 10px;
  }

  .delete-btn {
    background: rgba(255, 59, 48, 0.8);
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8em;
    margin-top: 10px;
    transition: all 0.3s ease;
  }

  .delete-btn:hover {
    background: rgba(255, 59, 48, 1);
  }

  @media (max-width: 768px) {
    .countdown {
      font-size: 1.5em;
    }
  }
</style>
