# global-countdown-

A global New Year's countdown timer that shows real-time countdowns to midnight across 20+ timezones around the world.

## Features

- 🌍 **Global Coverage**: Displays countdowns for 20+ major timezones worldwide
- 📍 **Auto-Detection**: Automatically detects your browser's timezone and highlights it at the top
- 📅 **Date-Specific**: Only active on December 31st and January 1st
- ⏱️ **Real-Time**: Updates every second with live countdowns
- 🎊 **Celebration Mode**: Shows special message when midnight arrives in each timezone
- 📱 **Responsive**: Beautiful design that works on both desktop and mobile devices

## Live Demo

Visit the live countdown at: [https://niknikovsky.github.io/global-countdown-/](https://niknikovsky.github.io/global-countdown-/)

## How It Works

The application:
1. Detects your current timezone using the browser's Intl API
2. Calculates the exact moment of midnight (00:00:00) on January 1st for each timezone
3. Displays real-time countdowns showing days, hours, minutes, and seconds remaining
4. Shows a celebration message when New Year arrives in each timezone
5. Only displays content on December 31st and January 1st (shows a notice on other dates)

## Timezones Included

- Baker Island (UTC-12)
- Hawaii (UTC-10)
- Alaska (UTC-9)
- Los Angeles/PST (UTC-8)
- Denver/MST (UTC-7)
- Chicago/CST (UTC-6)
- New York/EST (UTC-5)
- São Paulo (UTC-3)
- London/GMT (UTC+0)
- Paris (UTC+1)
- Cairo (UTC+2)
- Moscow (UTC+3)
- Dubai (UTC+4)
- Mumbai (UTC+5:30)
- Bangkok (UTC+7)
- Hong Kong (UTC+8)
- Tokyo (UTC+9)
- Sydney (UTC+11)
- Auckland (UTC+13)
- Kiribati (UTC+14)

## Technologies Used

- Pure HTML, CSS, and JavaScript (no dependencies)
- JavaScript Intl API for timezone handling
- CSS Grid for responsive layout
- GitHub Actions for automated deployment to GitHub Pages

## License

This project is open source and available for anyone to use.

