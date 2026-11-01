import { writable } from 'svelte/store';

export const now = writable(Date.now());

let intervalId = null;

export function startTick() {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    now.set(Date.now());
  }, 1000);
}

export function stopTick() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}