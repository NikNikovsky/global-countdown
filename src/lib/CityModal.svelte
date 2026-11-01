<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { availableTimezones } from './timezones.js';

  export let selectedCities = [];

  const dispatch = createEventDispatcher();
  let searchTerm = '';
  let searchInput;

  onMount(() => {
    searchInput?.focus();
  });

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const modal = event.currentTarget;
    const focusable = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleClose() {
    dispatch('close');
  }

  function handleAddCity(cityObj) {
    const exists = selectedCities.some(city => city.name === cityObj.name && city.zone === cityObj.zone);
    if (!exists) {
      dispatch('add', cityObj);
    }
  }

  $: filteredCities = availableTimezones.filter(tz => 
    tz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: cityIsSelected = (cityObj) => {
    return selectedCities.some(city => city.name === cityObj.name && city.zone === cityObj.zone);
  };
</script>

<div
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-label="Add a city"
  tabindex="-1"
  on:click={(e) => e.target === e.currentTarget && handleClose()}
  on:keydown={handleKeydown}
>
  <div class="modal-content">
    <div class="modal-header">Add a City</div>
    <input
      type="text"
      class="search-input"
      placeholder="🔍 Search cities..."
      aria-label="Search cities"
      bind:value={searchTerm}
      bind:this={searchInput}
    />
    <div class="city-list">
      {#each filteredCities as city}
        <button
          type="button"
          class="city-option"
          class:selected={cityIsSelected(city)}
          disabled={cityIsSelected(city)}
          on:click={() => handleAddCity(city)}
        >
          {city.name} {cityIsSelected(city) ? '✓' : ''}
        </button>
      {/each}
    </div>
    <button class="modal-close" on:click={handleClose}>Close</button>
  </div>
</div>

<style>
  .modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    animation: modalFade 0.2s ease;
  }

  .modal-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    animation: modalScale 0.25s ease;
  }

  .modal-header {
    font-size: 1.5em;
    margin-bottom: 20px;
    font-weight: bold;
    color: white;
  }

  .search-input {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1em;
    backdrop-filter: blur(10px);
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .search-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
  }

  .city-list {
    display: grid;
    gap: 10px;
    margin-bottom: 20px;
  }

  .city-option {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
    color: white;
    font: inherit;
    text-align: left;
    width: 100%;
  }

  .city-option:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .city-option.selected {
    opacity: 0.5;
    cursor: default;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
