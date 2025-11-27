// CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8',
    TABLE_NAME: 'moisture_readings',
    LIVE_REFRESH_INTERVAL: 3000,
    CHART_DATA_INTERVAL: 600000,
    TIME_RANGE_HOURS: 24
};

// PLANT DATABASE
const PLANTS_DATABASE = [
    // Common Plants
    { name: 'Snake Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Snake_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9TbmFrZV9QbGFudC5wbmciLCJpYXQiOjE3NjQxODMyMTIsImV4cCI6MTc5NTcxOTIxMn0.mMhWuc5qUFIZ9XDbn-9NuU5Hp_-SueFrTwjHi2_JyQ4' },
    { name: 'Pothos', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Pothos.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9Qb3Rob3MucG5nIiwiaWF0IjoxNzY0MTgzMjQ5LCJleHAiOjE3OTU3MTkyNDl9.4T6tl4f_JVodFQ8GtuIzQ8B7qy50Kc6CmCcIR2EBVGs' },
    { name: 'Spider Plant', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Spider_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9TcGlkZXJfUGxhbnQucG5nIiwiaWF0IjoxNzY0MTgzMjg2LCJleHAiOjE3OTU3MTkyODZ9.aYzrtDMURW2eYbjwDzfoHAcFFcjgu8x07VlzjQZWM64' },
    { name: 'Aloe Vera', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 35 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Aloe_Vera.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9BbG9lX1ZlcmEucG5nIiwiaWF0IjoxNzY0MTgzMzExLCJleHAiOjE3OTU3MTkzMTF9.VP0U4yJh289w7SbVKxHdP9EMAkJJcSTMuOi1XOoUnzE' },
    { name: 'Peace Lily', rarity: 'Common', moisture: 'High', threshold: { min: 60, max: 80 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Peace_Lily.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9QZWFjZV9MaWx5LnBuZyIsImlhdCI6MTc2NDE4MzMzMywiZXhwIjoxNzk1NzE5MzMzfQ.OYeM4MR9v-owVi0JfXE-NoIrJ1P76Ydqb2rHdsq_J-s' },
    { name: 'ZZ Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/ZZ_plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9aWl9wbGFudC5wbmciLCJpYXQiOjE3NjQxODM0MTcsImV4cCI6MTc5NTcxOTQxN30.GKrEVbk9siWIsHqtdpT_iEJk4QFYavB6Hzj-M7pP7ws' },
    { name: 'Jade Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 25, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Jade_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9KYWRlX1BsYW50LnBuZyIsImlhdCI6MTc2NDE4MzQzMCwiZXhwIjoxNzk1NzE5NDMwfQ.q_R3d2P_hsPdBIHHu5f6akVEJhI4vH389FoQVLWvGJ4' },
    // Uncommon Plants
    { name: 'Monstera Deliciosa', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Monstera_Deliciosa.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9Nb25zdGVyYV9EZWxpY2lvc2EucG5nIiwiaWF0IjoxNzY0MTgzNDQwLCJleHAiOjE3OTU3MTk0NDB9.bDAi8kKgaSwckFPiqQsViLrPcDN3-Bs8ds310fKbTOk' },
    { name: 'Fiddle Leaf Fig', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 45, max: 65 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Fiddle_Leaf_Fig.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9GaWRkbGVfTGVhZl9GaWcucG5nIiwiaWF0IjoxNzY0MTgzNDQ5LCJleHAiOjE3OTU3MTk0NDl9.XjSFbc_Ul96u16lzAQNGH45XP1MUmVtheJ9csK6uNwk' },
    { name: 'Rubber Plant', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Rubber_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9SdWJiZXJfUGxhbnQucG5nIiwiaWF0IjoxNzY0MTgzNDYxLCJleHAiOjE3OTU3MTk0NjF9.zhE1Ci0-C93YPch4K2RyE_DoHPIvpKipNbsTtIZvb1w' },
    { name: 'Calathea', rarity: 'Uncommon', moisture: 'High', threshold: { min: 65, max: 85 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Calathea.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9DYWxhdGhlYS5wbmciLCJpYXQiOjE3NjQxODM0NzcsImV4cCI6MTc5NTcxOTQ3N30.J8CK8H61EkAZzkVHq2Hnn2oUpLH4LgzJvYTL-AtIqJc' },
    { name: 'Boston Fern', rarity: 'Uncommon', moisture: 'High', threshold: { min: 70, max: 90 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Boston_Fern.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9Cb3N0b25fRmVybi5wbmciLCJpYXQiOjE3NjQxODM0ODgsImV4cCI6MTc5NTcxOTQ4OH0.gq6z-fjTlTpt-XDBWSJrTGYCGgobehwLy-ww-ZssDOk' },
    { name: 'Philodendron', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 45, max: 65 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Philodendron.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9QaGlsb2RlbmRyb24ucG5nIiwiaWF0IjoxNzY0MTgzNDk2LCJleHAiOjE3OTU3MTk0OTZ9.T7Dh3YoI5aWBqiSGgEMiLrHpAqAbmxbjbw7dg51da-8' },
    // Rare Plants
    { name: 'Variegated Monstera', rarity: 'Rare', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Variegated_Monstera.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9WYXJpZWdhdGVkX01vbnN0ZXJhLnBuZyIsImlhdCI6MTc2NDE4MzUwNiwiZXhwIjoxNzk1NzE5NTA2fQ.VKQtQ905lzVSaHIs6vnjCGPOAVl67JACYiOSX9zdiTg' },
    { name: 'Alocasia Polly', rarity: 'Rare', moisture: 'High', threshold: { min: 65, max: 85 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Alocasia_Polly.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9BbG9jYXNpYV9Qb2xseS5wbmciLCJpYXQiOjE3NjQxODM1MTUsImV4cCI6MTc5NTcxOTUxNX0.QaWkQEPqGnEjJz6ehdviHLj6HCWMIzCxbH_1rNv-4Ms' },
    { name: 'String of Hearts', rarity: 'Rare', moisture: 'Low', threshold: { min: 25, max: 45 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/String_of_Hearts.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9TdHJpbmdfb2ZfSGVhcnRzLnBuZyIsImlhdCI6MTc2NDE4MzUyNCwiZXhwIjoxNzk1NzE5NTI0fQ.Src9ZTRM8nDqSm8F7WcdNAd4X2-3jzGwDl-qqH_aqaI' },
    { name: 'Pink Princess Philodendron', rarity: 'Rare', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Pink_Princess_Philodendron.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9QaW5rX1ByaW5jZXNzX1BoaWxvZGVuZHJvbi5wbmciLCJpYXQiOjE3NjQxODM1MzUsImV4cCI6MTc5NTcxOTUzNX0.QqjwUBdl9gQ-AFQequHPlC1poWQXzd4ughDpw67c85k' },
    { name: 'Anthurium Clarinervium', rarity: 'Rare', moisture: 'High', threshold: { min: 60, max: 80 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Anthurium_Clarinervium.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9BbnRodXJpdW1fQ2xhcmluZXJ2aXVtLnBuZyIsImlhdCI6MTc2NDE4MzU0MywiZXhwIjoxNzk1NzE5NTQzfQ.vArQ6vsMQQ5wBOegLfEEfj-2Z1xXyT7_EKjH7keMej8' },
    { name: 'Hoya Carnosa', rarity: 'Rare', moisture: 'Low', threshold: { min: 30, max: 50 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Hoya_Carnosa.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9Ib3lhX0Nhcm5vc2EucG5nIiwiaWF0IjoxNzY0MTgzNTUxLCJleHAiOjE3OTU3MTk1NTF9.7pRzRFTWegfnvjM5dXSgg5nj4l3btfgYIHWCJVPDrFY' }
];

// STATE
let chart, realtimeSubscription, liveDataInterval;
let chartData = { labels: [], values: [] };
let settings = {
    theme: 'light',
    timeRange: 24,
    notificationsEnabled: false,
    calibration: { dry: 3200, wet: 1200 },
    selectedPlant: null
};
let currentRawValue = 0;
let lastNotificationTime = 0;

// SUPABASE CLIENT
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    applyTheme();
    initChart();
    populatePlants();
    await loadHistoricalData();
    setupRealtimeSubscription();
    startLiveDataFetch();
    showPage('dashboard');
    
    const imgInput = document.getElementById('customPlantImage');
    if (imgInput) imgInput.addEventListener('change', handleImagePreview);
});

// Settings
function loadSettings() {
    const saved = localStorage.getItem('moistureMonitorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        document.getElementById('themeToggle').value = settings.theme;
        document.getElementById('timeRange').value = settings.timeRange;
        document.getElementById('notificationsEnabled').checked = settings.notificationsEnabled;
        if (settings.selectedPlant) displaySelectedPlant(settings.selectedPlant);
    }
}

function saveSettings() {
    localStorage.setItem('moistureMonitorSettings', JSON.stringify(settings));
}

function updateSettings() {
    settings.timeRange = parseInt(document.getElementById('timeRange').value);
    settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    saveSettings();
    loadHistoricalData();
}

function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) return;
    settings = {
        theme: 'light',
        timeRange: 24,
        notificationsEnabled: false,
        calibration: { dry: 3200, wet: 1200 },
        selectedPlant: null
    };
    saveSettings();
    loadSettings();
    applyTheme();
    document.getElementById('plantInfo').style.display = 'none';
    const card = document.getElementById('currentReadingCard');
    card.style.backgroundImage = '';
    card.style.background = 'var(--accent-gradient)';
    alert('Settings reset');
}

// Theme
function toggleTheme() {
    settings.theme = document.getElementById('themeToggle').value;
    saveSettings();
    applyTheme();
}

function applyTheme() {
    const theme = settings.theme === 'auto' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme;
    document.body.setAttribute('data-theme', theme);
    if (chart) updateChartTheme();
}

function updateChartTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#4a5568';
    const gridColor = isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.update();
}

// Navigation
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(name + 'Page');
    if (page) page.classList.add('active');
    closeMenu();
}

function openMenu() {
    document.getElementById('menuOverlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('menuOverlay').classList.remove('active');
}

// Plants
function populatePlants() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    
    let plants = [...PLANTS_DATABASE];
    const filter = document.getElementById('plantFilter')?.value || 'all';
    
    if (filter === 'az') plants.sort((a, b) => a.name.localeCompare(b.name));
    else if (filter === 'rarity') {
        const order = { Common: 1, Uncommon: 2, Rare: 3 };
        plants.sort((a, b) => order[a.rarity] - order[b.rarity]);
    } else if (filter === 'moisture') {
        const order = { Low: 1, Medium: 2, High: 3 };
        plants.sort((a, b) => order[a.moisture] - order[b.moisture]);
    }
    
    grid.innerHTML = plants.map(p => `
        <div class="plant-card" onclick="selectPlant(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'">
            <div class="plant-card-info">
                <h3>${p.name}</h3>
                <div class="plant-badges">
                    <span class="rarity-badge ${p.rarity.toLowerCase()}">${p.rarity}</span>
                    <span class="moisture-badge">${p.moisture} Moisture</span>
                </div>
                <p class="plant-threshold">${p.threshold.min}% - ${p.threshold.max}%</p>
            </div>
        </div>
    `).join('');
}

function filterPlants() {
    populatePlants();
}

function selectPlant(plant) {
    settings.selectedPlant = plant;
    saveSettings();
    displaySelectedPlant(plant);
    closePlantPanel();
}

function displaySelectedPlant(plant) {
    const card = document.getElementById('currentReadingCard');
    card.style.backgroundImage = `linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('${plant.image}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    
    document.getElementById('plantInfo').style.display = 'block';
    document.getElementById('plantName').textContent = plant.name;
    document.getElementById('plantThreshold').textContent = `Ideal: ${plant.threshold.min}% - ${plant.threshold.max}%`;
}

function openPlantPanel() {
    document.getElementById('plantPanel').classList.add('active');
}

function closePlantPanel() {
    document.getElementById('plantPanel').classList.remove('active');
}

function switchTab(tab) {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('customImagePreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function addCustomPlant() {
    const name = document.getElementById('customPlantName').value;
    const min = parseInt(document.getElementById('customPlantMinThreshold').value);
    const max = parseInt(document.getElementById('customPlantMaxThreshold').value);
    const preview = document.getElementById('customImagePreview');
    
    if (!name || !min || !max) {
        alert('Please fill in all fields');
        return;
    }
    
    const plant = {
        name,
        rarity: 'Custom',
        moisture: min < 35 ? 'Low' : (min < 55 ? 'Medium' : 'High'),
        threshold: { min, max },
        image: preview.src || 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'
    };
    
    PLANTS_DATABASE.push(plant);
    selectPlant(plant);
    
    // Reset form
    document.getElementById('customPlantName').value = '';
    document.getElementById('customPlantMinThreshold').value = '';
    document.getElementById('customPlantMaxThreshold').value = '';
    preview.style.display = 'none';
}

// Calibration
function startCalibration() {
    document.getElementById('calibrationModal').style.display = 'flex';
    document.querySelectorAll('.calibration-step').forEach(s => s.classList.remove('active'));
    document.getElementById('calibrationStep1').classList.add('active');
    
    const interval = setInterval(() => {
        document.getElementById('dryReading').textContent = currentRawValue;
        document.getElementById('wetReading').textContent = currentRawValue;
    }, 500);
    
    document.getElementById('calibrationModal').dataset.interval = interval;
}

function calibrateDry() {
    settings.calibration.dry = currentRawValue;
    document.getElementById('finalDry').textContent = currentRawValue;
    document.getElementById('calibrationStep1').classList.remove('active');
    document.getElementById('calibrationStep2').classList.add('active');
}

function calibrateWet() {
    settings.calibration.wet = currentRawValue;
    document.getElementById('finalWet').textContent = currentRawValue;
    saveSettings();
    document.getElementById('calibrationStep2').classList.remove('active');
    document.getElementById('calibrationStep3').classList.add('active');
}

function closeCalibration() {
    const interval = document.getElementById('calibrationModal').dataset.interval;
    if (interval) clearInterval(parseInt(interval));
    document.getElementById('calibrationModal').style.display = 'none';
}

// Conversion
function rawToPercentage(raw) {
    const { dry, wet } = settings.calibration;
    const pct = ((dry - raw) / (dry - wet)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
}

// Data
async function loadHistoricalData() {
    try {
        updateConnectionStatus('connecting');
        
        const hoursAgo = new Date();
        hoursAgo.setHours(hoursAgo.getHours() - settings.timeRange);
        
        const { data, error } = await supabase
            .from(CONFIG.TABLE_NAME)
            .select('value, created_at')
            .gte('created_at', hoursAgo.toISOString())
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        chartData.labels = [];
        chartData.values = [];
        
        let lastTime = 0;
        data.forEach(r => {
            const time = new Date(r.created_at).getTime();
            if (time - lastTime >= CONFIG.CHART_DATA_INTERVAL) {
                chartData.labels.push(formatTime(new Date(r.created_at)));
                chartData.values.push(rawToPercentage(r.value));
                lastTime = time;
            }
        });
        
        updateChart();
        
        if (data.length > 0) {
            const latest = data[data.length - 1];
            currentRawValue = latest.value;
            updateCurrentValue(rawToPercentage(latest.value), new Date(latest.created_at));
        }
        
        updateConnectionStatus('connected');
    } catch (err) {
        console.error('Load error:', err);
        updateConnectionStatus('disconnected');
    }
}

function startLiveDataFetch() {
    liveDataInterval = setInterval(async () => {
        try {
            const { data } = await supabase
                .from(CONFIG.TABLE_NAME)
                .select('value, created_at')
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (data?.length) {
                currentRawValue = data[0].value;
                const pct = rawToPercentage(data[0].value);
                updateCurrentValue(pct, new Date(data[0].created_at));
                checkThreshold(pct);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, CONFIG.LIVE_REFRESH_INTERVAL);
}

function setupRealtimeSubscription() {
    realtimeSubscription = supabase
        .channel('moisture_changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: CONFIG.TABLE_NAME
        }, (payload) => handleNewReading(payload.new))
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') updateConnectionStatus('connected');
        });
}

function handleNewReading(reading) {
    const time = new Date(reading.created_at);
    const pct = rawToPercentage(reading.value);
    
    const lastTime = chartData.labels.length > 0 ? 
        new Date(`${new Date().toDateString()} ${chartData.labels[chartData.labels.length - 1]}`).getTime() : 0;
    
    if (time.getTime() - lastTime >= CONFIG.CHART_DATA_INTERVAL) {
        chartData.labels.push(formatTime(time));
        chartData.values.push(pct);
        updateChart();
    }
    
    currentRawValue = reading.value;
    updateCurrentValue(pct, time);
    checkThreshold(pct);
    flashNewData();
}

function checkThreshold(pct) {
    if (!settings.notificationsEnabled || !settings.selectedPlant) return;
    
    const now = Date.now();
    if (now - lastNotificationTime < 300000) return;
    
    const { name, threshold } = settings.selectedPlant;
    
    if (pct < threshold.min) {
        showNotification(`${name} needs water!`, `Moisture at ${pct}%, below ${threshold.min}%`);
        lastNotificationTime = now;
    } else if (pct > threshold.max) {
        showNotification(`${name} too wet!`, `Moisture at ${pct}%, above ${threshold.max}%`);
        lastNotificationTime = now;
    }
}

function showNotification(title, msg) {
    if ('Notification' in window) {
        Notification.requestPermission().then(p => {
            if (p === 'granted') new Notification(title, { body: msg, icon: '🌱' });
        });
    }
    alert(`${title}\n${msg}`);
}

// Chart
function initChart() {
    const ctx = document.getElementById('moistureChart').getContext('2d');
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#4a5568';
    const gridColor = isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Moisture',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    callbacks: {
                        label: (ctx) => `Moisture: ${ctx.parsed.y}%`
                    }
                }
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: (v) => v + '%'
                    },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;
    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.values;
    chart.update('none');
}

function changeTimeRange() {
    settings.timeRange = parseInt(document.getElementById('timeRange').value);
    saveSettings();
    loadHistoricalData();
}

// UI Updates
function updateCurrentValue(pct, time) {
    const val = document.querySelector('.current-value .value');
    if (val) val.textContent = pct;
    
    const upd = document.getElementById('lastUpdate');
    if (upd) upd.textContent = `Updated ${formatTimeAgo(time)}`;
    
    const fill = document.getElementById('indicatorFill');
    if (fill) fill.style.width = `${pct}%`;
}

function updateConnectionStatus(status) {
    const dot = document.querySelector('.status-dot');
    const txt = document.getElementById('statusText');
    if (!dot || !txt) return;
    
    dot.className = 'status-dot';
    if (status === 'connected') {
        dot.classList.add('connected');
        txt.textContent = 'Connected';
    } else if (status === 'disconnected') {
        dot.classList.add('disconnected');
        txt.textContent = 'Disconnected';
    } else {
        txt.textContent = 'Connecting...';
    }
}

function flashNewData() {
    const val = document.querySelector('.current-value');
    if (val) {
        val.style.transform = 'scale(1.05)';
        setTimeout(() => val.style.transform = 'scale(1)', 300);
    }
}

// Utils
function formatTime(d) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatTimeAgo(d) {
    const sec = Math.floor((new Date() - d) / 1000);
    if (sec < 60) return 'just now';
    if (sec < 120) return '1 minute ago';
    if (sec < 3600) return `${Math.floor(sec / 60)} minutes ago`;
    if (sec < 7200) return '1 hour ago';
    if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
    return d.toLocaleDateString();
}

// Auto theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.theme === 'auto') applyTheme();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) supabase.removeChannel(realtimeSubscription);
    if (liveDataInterval) clearInterval(liveDataInterval);
});