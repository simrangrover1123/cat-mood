// Sections
const questionnaire = document.getElementById('questionnaire');
const result = document.getElementById('result');
const historySection = document.getElementById('historySection');

// Elements
const catImage = document.getElementById('catImage');
const resultText = document.getElementById('resultText');
const historyList = document.getElementById('historyList');

// Buttons
const findCatBtn = document.getElementById('findCat');
const anotherCatBtn = document.getElementById('anotherCat');
const backBtn = document.getElementById('back');
const viewHistoryBtn = document.getElementById('viewHistory');
const backFromHistoryBtn = document.getElementById('backFromHistory');
const clearHistoryBtn = document.getElementById('clearHistory');

// Data
let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

// // Fetch cat image
// async function fetchCat() {
//   try {
//     // const res = await fetch('https://api.thecatapi.com/v1/images/search');
    
//     const data = await res.json();
//     return data[0].url;
//   } catch (e) {
//     console.error("Cat fetch error", e);
//     return 'https://placekitten.com/400/300';
//   }
// }
async function fetchCat() {
  try {
    const res = await fetch('https://api.thecatapi.com/v1/images/search', {
      headers: {
        'x-api-key': 'live_olLcL2cj9l21osyTIKWa63TIck4F9gtw219I9LnFlehHOGUoeH95fEyP0GI13SJz'
      }
    });
    const data = await res.json();
    return data[0].url;
  } catch (e) {
    console.error("Cat fetch error", e);
    return 'https://placekitten.com/400/300'; // fallback image
  }
}


// Save mood entry
function saveHistory(mood, energy) {
  const entry = { date: new Date().toLocaleString(), mood, energy };
  moodHistory.push(entry);
  localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
}

// Render history list
function renderHistory() {
  historyList.innerHTML = '';
  moodHistory.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: ${entry.mood} (${entry.energy})`;
    historyList.appendChild(li);
  });
  renderChart();
}

// Render chart
function renderChart() {
  const counts = {};
  moodHistory.forEach(entry => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
  });
  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const ctx = document.getElementById('moodChart').getContext('2d');
  if (window.moodChartInstance) window.moodChartInstance.destroy();
  window.moodChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Mood Count', data, backgroundColor: '#ff6f61' }] },
    options: { plugins: { legend: { display: false } } }
  });
}

// Events
findCatBtn.addEventListener('click', async () => {
  const mood = document.getElementById('mood').value;
  const energy = document.getElementById('energy').value;

  resultText.textContent = `Your mood cat is: ${mood.toUpperCase()} (${energy})`;
  saveHistory(mood, energy);

  questionnaire.classList.add('hidden');
  result.classList.remove('hidden');

  const imgUrl = await fetchCat();
  catImage.src = imgUrl;
});

anotherCatBtn.addEventListener('click', async () => {
  const imgUrl = await fetchCat();
  catImage.src = imgUrl;
});

backBtn.addEventListener('click', () => {
  result.classList.add('hidden');
  questionnaire.classList.remove('hidden');
});

viewHistoryBtn.addEventListener('click', () => {
  renderHistory();
  questionnaire.classList.add('hidden');
  historySection.classList.remove('hidden');
});

backFromHistoryBtn.addEventListener('click', () => {
  historySection.classList.add('hidden');
  questionnaire.classList.remove('hidden');
});

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('moodHistory');
  moodHistory = [];
  renderHistory();
});
