const NOTIFICATION_DISPLAY_DURATION = 5000; // 5 seconds
const FADE_OUT_DURATION = 500; // 0.5 seconds
const TAB_TITLE_DURATION = 10000; // 10 seconds

export function createConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animation = 'confetti-fall 3s linear forwards';
      
      const delay = Math.random() * 0.5;
      confetti.style.animationDelay = delay + 's';
      const duration = Math.random() * 2 + 2; // 2-4 seconds
      confetti.style.animationDuration = duration + 's';
      
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }, i * 30);
  }
}

export function showNotificationPopup(cityName) {
  const popup = document.createElement('div');
  popup.className = 'notification-popup';
  popup.textContent = `🎉 Happy New Year to ${cityName}! 🎉`;
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  popup.style.color = 'white';
  popup.style.padding = '20px 30px';
  popup.style.borderRadius = '15px';
  popup.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
  popup.style.fontSize = '1.2em';
  popup.style.fontWeight = 'bold';
  popup.style.zIndex = '10000';
  popup.style.animation = 'slideDown 0.5s ease-out';
  popup.style.border = '2px solid rgba(255, 215, 0, 0.8)';
  popup.style.backdropFilter = 'blur(10px)';
  popup.style.textAlign = 'center';
  popup.style.maxWidth = '90%';
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => popup.remove(), FADE_OUT_DURATION);
  }, NOTIFICATION_DISPLAY_DURATION);
}

export function updateTabTitle(cityName, originalTitle) {
  document.title = `🎊 Happy New Year to ${cityName}! 🎊`;
  
  setTimeout(() => {
    document.title = originalTitle;
  }, TAB_TITLE_DURATION);
}
