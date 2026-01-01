<script>
  import { createEventDispatcher } from 'svelte';
  import { availableTimezones } from './timezones.js';

  export let selectedCities = [];

  const dispatch = createEventDispatcher();
  let searchTerm = '';

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

<div class="modal" on:click={handleClose}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">Add a City</div>
    <input 
      type="text" 
      class="search-input" 
      placeholder="🔍 Search cities..." 
      aria-label="Search cities" 
      bind:value={searchTerm}
      autofocus
    />
    <div class="city-list">
      {#each filteredCities as city}
        <div 
          class="city-option" 
          class:selected={cityIsSelected(city)}
          on:click={() => !cityIsSelected(city) && handleAddCity(city)}
        >
          {city.name} {cityIsSelected(city) ? '✓' : ''}
        </div>
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
