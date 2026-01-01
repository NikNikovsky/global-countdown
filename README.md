# global-countdown

A global New Year's countdown timer built with Svelte + Vite that shows real-time countdowns to midnight across multiple timezones around the world.

## Features

- 🌍 **Global Coverage**: Choose from 130+ cities worldwide
- 📍 **Auto-Detection**: Automatically detects your browser's timezone and highlights it
- 🎨 **Modern UI**: Built with Svelte for reactive, component-based architecture
- 📅 **Date-Specific**: Only active on December 31st and January 1st
- ⏱️ **Real-Time**: Updates every second with live countdowns
- 🎊 **Celebration Mode**: Shows special message and confetti when midnight arrives
- 💾 **Persistent**: Remembers your selected cities via localStorage
- 📱 **Responsive**: Beautiful design that works on both desktop and mobile devices

## Live Demo

Visit the live countdown at: [https://niknikovsky.github.io/global-countdown/](https://niknikovsky.github.io/global-countdown/)

## Technologies Used

- **Svelte 5** - Modern, reactive UI framework
- **Vite 7** - Fast build tool and development server
- **JavaScript Intl API** - Accurate timezone handling
- **CSS Grid** - Responsive layout
- **GitHub Actions** - Automated deployment to GitHub Pages

## Development

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/NikNikovsky/global-countdown.git
cd global-countdown

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── src/
│   ├── App.svelte              # Main application component
│   ├── main.js                 # Application entry point
│   ├── global.css              # Global styles and animations
│   └── lib/
│       ├── TimezoneCard.svelte # Timezone card component
│       ├── CityModal.svelte    # City selection modal
│       ├── timezones.js        # Timezone data
│       ├── storage.js          # LocalStorage utilities
│       ├── dateUtils.js        # Date calculations
│       └── effects.js          # Visual effects
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # CI/CD pipeline
│   └── copilot-instructions.md # GitHub Copilot guidelines
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## How It Works

The application:
1. Detects your current timezone using the browser's Intl API
2. Calculates the exact moment of midnight (00:00:00) on January 1st for each timezone
3. Displays real-time countdowns showing days, hours, minutes, and seconds remaining
4. Shows celebration messages and confetti when New Year arrives in each timezone
5. Only displays content on December 31st and January 1st (shows a notice on other dates)
6. Allows you to add/remove cities and saves your preferences

## Cities Included

Over 130 cities from around the world, including:
- Pacific: Auckland, Sydney, Tokyo, Hong Kong, Singapore, etc.
- Asia: Mumbai, Dubai, Bangkok, Seoul, etc.
- Europe: London, Paris, Berlin, Moscow, etc.
- Africa: Cairo, Johannesburg, Lagos, etc.
- Americas: New York, Los Angeles, São Paulo, Buenos Aires, etc.

## Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to the `main` branch.

## License

This project is open source and available for anyone to use.


