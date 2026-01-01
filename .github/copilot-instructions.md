# GitHub Copilot Instructions for Global Countdown

## Project Overview
This is a Svelte + Vite application that displays a global New Year countdown for multiple timezones. The app shows real-time countdowns to midnight on December 31st and January 1st.

## Technology Stack
- **Frontend Framework**: Svelte 5
- **Build Tool**: Vite 7
- **Styling**: Component-scoped CSS with global animations
- **State Management**: Svelte reactive stores and component state
- **Storage**: Browser localStorage for user preferences

## Project Structure
```
/
├── src/
│   ├── App.svelte           # Main application component
│   ├── main.js              # Application entry point
│   ├── global.css           # Global styles and animations
│   └── lib/
│       ├── TimezoneCard.svelte   # Individual timezone card component
│       ├── CityModal.svelte      # City selection modal component
│       ├── timezones.js          # Timezone data and utilities
│       ├── storage.js            # LocalStorage utilities
│       ├── dateUtils.js          # Date/time calculation utilities
│       └── effects.js            # Confetti and notification effects
├── public/
│   └── vite.svg             # Favicon
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── index.html               # HTML entry point
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration
└── svelte.config.js         # Svelte configuration
```

## Key Concepts

### Date/Time Handling
- All timezone calculations use `Intl.DateTimeFormat` API for accuracy
- New Year detection happens only on December 31st and January 1st
- Celebration mode lasts 10 minutes after midnight
- Confetti triggers within 5 seconds of midnight

### Component Architecture
- **App.svelte**: Main container, handles state and lifecycle
- **TimezoneCard.svelte**: Displays individual timezone countdowns
- **CityModal.svelte**: Modal for adding/removing cities

### State Management
- User's selected cities stored in localStorage
- Countdown updates every second via setInterval
- Confetti and notification tracking with Sets to prevent duplicates

## Development Guidelines

### Adding New Features
1. **New Timezone**: Add to `availableTimezones` array in `src/lib/timezones.js`
2. **New Animation**: Add keyframe to `src/global.css` and function to `src/lib/effects.js`
3. **New Component**: Create in `src/lib/` and import in parent components

### Styling Conventions
- Use component-scoped CSS in `<style>` blocks
- Global animations in `src/global.css`
- Colors: Purple gradient background (#667eea to #764ba2)
- User timezone highlighted with gold/yellow (#FFD700)

### Testing Locally
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### Deployment
- Automatic deployment via GitHub Actions on push to main branch
- Builds to `/dist` directory
- Base path set to `/global-countdown/` for GitHub Pages

## Common Tasks

### Modifying Countdown Logic
Edit `src/lib/dateUtils.js`:
- `getNextNewYear()` - Calculates next midnight in timezone
- `formatCountdown()` - Formats time remaining
- `isDecember31stOrJanuary1st()` - Date check

### Changing Visual Effects
Edit `src/lib/effects.js`:
- `createConfetti()` - Confetti animation
- `showNotificationPopup()` - Toast notifications
- `updateTabTitle()` - Browser tab updates

### Adding Cities
Edit `src/lib/timezones.js`:
- Add to `availableTimezones` array with format: `{ name: 'City', zone: 'Continent/City' }`

## Important Notes
- The app only displays content on Dec 31 and Jan 1
- User's timezone is auto-detected and highlighted
- localStorage preserves user's city selections
- Confetti and notifications trigger only once per timezone per session
- Build artifact is in `/dist` (gitignored)
- Node modules are in `/node_modules` (gitignored)

## Debugging Tips
1. Check browser console for timezone calculation errors
2. Verify localStorage has `selectedCities` array
3. Test with system date temporarily set to Dec 31 or Jan 1
4. Use browser DevTools to simulate different timezones

## Code Style
- Use Svelte 5 runes syntax where appropriate
- Prefer reactive statements (`$:`) for derived values
- Keep components small and focused
- Comment complex timezone calculations
- Use async/await for any future API calls
