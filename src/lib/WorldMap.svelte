<script>
  import { onMount, onDestroy } from 'svelte';
  import countries, { VIEW_BOX } from 'world-map-country-shapes';
  import * as ct from 'countries-and-timezones';

  let greenCountries = new Set();
  let interval;

  function getOffsetMinutes(timeZone, date) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset'
    }).formatToParts(date);
    const off = parts.find(p => p.type === 'timeZoneName')?.value || '';
    const m = off.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === '+' ? 1 : -1;
    const hours = parseInt(m[2], 10) || 0;
    const mins = parseInt(m[3] || '0', 10) || 0;
    return sign * (hours * 60 + mins);
  }

  function updateColors() {
    const now = new Date();
    const green = new Set();
    for (const country of Object.values(ct.getAllCountries())) {
      const zones = country.timezones || [];
      if (!zones.length) continue;
      // Consider the country as having entered the new year once its
      // easternmost (earliest-celebrating) timezone has left December.
      let easternmost = zones[0];
      let maxOffset = getOffsetMinutes(easternmost, now);
      for (const tz of zones.slice(1)) {
        const off = getOffsetMinutes(tz, now);
        if (off > maxOffset) {
          maxOffset = off;
          easternmost = tz;
        }
      }
      const month = new Intl.DateTimeFormat('en-US', { timeZone: easternmost, month: '2-digit' }).format(now);
      if (month !== '12') {
        green.add(country.id);
      }
    }
    greenCountries = green;
  }

  onMount(() => {
    updateColors();
    interval = setInterval(updateColors, 30000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="world-map-wrap">
  <svg class="world-map" viewBox={VIEW_BOX} role="img" aria-label="World map showing which countries have reached the new year">
    {#each countries as c (c.id)}
      <path
        d={c.shape}
        fill={greenCountries.has(c.id) ? '#2ecc71' : '#e74c3c'}
        stroke="rgba(255,255,255,0.4)"
        stroke-width="0.5"
      />
    {/each}
  </svg>
  <div class="map-legend">
    <span class="legend-item"><span class="swatch green"></span> New year arrived</span>
    <span class="legend-item"><span class="swatch red"></span> Still waiting</span>
  </div>
</div>

<style>
  .world-map-wrap {
    margin: 30px auto;
    max-width: 1000px;
  }
  .world-map {
    width: 100%;
    height: auto;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
  }
  .map-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
    font-size: 0.9em;
    opacity: 0.9;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    display: inline-block;
  }
  .swatch.green { background: #2ecc71; }
  .swatch.red { background: #e74c3c; }
</style>