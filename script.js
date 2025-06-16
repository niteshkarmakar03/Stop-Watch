let timer;
let startTime;
let elapsedTime = 0;
let running = false;
let lapNumber = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');
const darkModeToggle = document.getElementById('darkModeToggle');
const soundToggleBtn = document.getElementById('soundToggle');
const beepSound = document.getElementById('beep');

let soundEnabled = true;

function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${minutes}:${seconds}:${milliseconds}`;
}

function updateDisplay(time) {
  display.textContent = formatTime(time);
}

function startTimer() {
  if (running) return;
  startTime = Date.now();
  timer = setInterval(() => {
    updateDisplay(Date.now() - startTime + elapsedTime);
  }, 10);
  running = true;
  playSound();
}

function stopTimer() {
  if (!running) return;
  clearInterval(timer);
  elapsedTime += Date.now() - startTime;
  running = false;
  playSound();
}

function resetTimer() {
  clearInterval(timer);
  elapsedTime = 0;
  running = false;
  lapNumber = 0;
  updateDisplay(elapsedTime);
  lapsList.innerHTML = '';
  localStorage.removeItem('laps');
  playSound();
}

function addLap() {
  if (running && lapNumber < 10) {
    lapNumber++;
    const lapTime = formatTime(Date.now() - startTime + elapsedTime);
    const li = document.createElement('li');
    li.textContent = `Lap ${lapNumber}: ${lapTime}`;
    lapsList.appendChild(li);
    lapsList.scrollTop = lapsList.scrollHeight;
    saveLaps();
    playSound();
  } else if (lapNumber >= 10) {
    alert('Maximum of 10 laps reached.');
  }
}

function playSound() {
  if (soundEnabled) {
    beepSound.currentTime = 0;
    beepSound.play();
  }
}

function saveLaps() {
  const laps = Array.from(lapsList.children).map(li => li.textContent);
  localStorage.setItem('laps', JSON.stringify(laps));
}

function loadLaps() {
  const stored = localStorage.getItem('laps');
  if (stored) {
    const laps = JSON.parse(stored);
    lapNumber = laps.length;
    laps.forEach(lap => {
      const li = document.createElement('li');
      li.textContent = lap;
      lapsList.appendChild(li);
    });
  }
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
});

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', addLap);

// Initialize
updateDisplay(elapsedTime);
loadLaps();
