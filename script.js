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

let chart = null;
let realtimeSubscription = null;
let liveDataInterval = null;
let chartData = {
    labels: [],
    values: []
};
let settings = {
    theme: 'light',
    timeRange: 24,
    notificationsEnabled: false,
    calibration: {
        dry: 3200,
        wet: 1200
    },
    selectedPlant: null
};
let currentRawValue = 0;
let lastNotificationTime = 0;

// SUPABASE CLIENT

const supabase = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
);

// INITIALIZATION

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Soil Moisture Monitor...');
    
    loadSettings();
    applyTheme();
    initChart();
    populatePlants();
    
    await loadHistoricalData();
    setupRealtimeSubscription();
    startLiveDataFetch();
    
    showPage('dashboard');
    
    console.log('Initialization complete!');
});

// SETTINGS MANAGEMENT

function loadSettings() {
    const saved = localStorage.getItem('moistureMonitorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        
        document.getElementById('themeToggle').value = settings.theme;
        document.getElementById('timeRange').value = settings.timeRange;
        document.getElementById('notificationsEnabled').checked = settings.notificationsEnabled;
        
        if (settings.selectedPlant) {
            displaySelectedPlant(settings.selectedPlant);
        }
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
    
    console.log('Settings updated:', settings);
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
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
        document.getElementById('currentReadingCard').style.backgroundImage = '';
        document.getElementById('currentReadingCard').style.background = 'var(--accent-gradient)';
        
        alert('Settings reset to defaults');
    }
}

// THEME MANAGEMENT

function toggleTheme() {
    const themeSelect = document.getElementById('themeToggle');
    settings.theme = themeSelect.value;
    saveSettings();
    applyTheme();
}

function applyTheme() {
    if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.body.setAttribute('data-theme', settings.theme);
    }
    
    if (chart) {
        updateChartTheme();
    }
}

function updateChartTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    chart.options.scales.x.ticks.color = isDark ? '#e2e8f0' : '#4a5568';
    chart.options.scales.y.ticks.color = isDark ? '#e2e8f0' : '#4a5568';
    chart.options.scales.x.grid.color = isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    chart.options.scales.y.grid.color = isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    chart.update();
}

// PAGE NAVIGATION

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const page = document.getElementById(pageName + 'Page');
    if (page) {
        page.classList.add('active');
    }
    
    closeMenu();
}

function openMenu() {
    document.getElementById('menuOverlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('menuOverlay').classList.remove('active');
}

document.getElementById('menuOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'menuOverlay') {
        closeMenu();
    }
});

// PLANT MANAGEMENT

function populatePlants() {
    const grid = document.getElementById('plantsGrid');
    grid.innerHTML = '';
    
    let plants = [...PLANTS_DATABASE];
    
    const filter = document.getElementById('plantFilter')?.value || 'all';
    
    if (filter === 'az') {
        plants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === 'rarity') {
        const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3 };
        plants.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
    } else if (filter === 'moisture') {
        const moistureOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        plants.sort((a, b) => moistureOrder[a.moisture] - moistureOrder[b.moisture]);
    }
    
    plants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.onclick = () => selectPlant(plant);
        
        card.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}" onerror="this.src='https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'">
            <div class="plant-card-info">
                <h3>${plant.name}</h3>
                <div class="plant-badges">
                    <span class="rarity-badge ${plant.rarity.toLowerCase()}">${plant.rarity}</span>
                    <span class="moisture-badge">${plant.moisture} Moisture</span>
                </div>
                <p class="plant-threshold">${plant.threshold.min}% - ${plant.threshold.max}%</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function filterPlants() {
    populatePlants();
}

function selectPlant(plant) {
    settings.selectedPlant = plant;
    saveSettings();
    displaySelectedPlant(plant);
    closePlantPanel();
    
    console.log('Selected plant:', plant);
}

function displaySelectedPlant(plant) {
    const card = document.getElementById('currentReadingCard');
    const plantInfo = document.getElementById('plantInfo');
    const plantName = document.getElementById('plantName');
    const plantThreshold = document.getElementById('plantThreshold');
    
    card.style.backgroundImage = `linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('${plant.image}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    
    plantInfo.style.display = 'block';
    plantName.textContent = plant.name;
    plantThreshold.textContent = `Ideal: ${plant.threshold.min}% - ${plant.threshold.max}%`;
}

function openPlantPanel() {
    document.getElementById('plantPanel').classList.add('active');
}

function closePlantPanel() {
    document.getElementById('plantPanel').classList.remove('active');
}

// CALIBRATION

function startCalibration() {
    document.getElementById('calibrationModal').style.display = 'flex';
    document.getElementById('calibrationStep1').classList.add('active');
    document.getElementById('calibrationStep2').classList.remove('active');
    document.getElementById('calibrationStep3').classList.remove('active');
    
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

// CONVERSION

function rawToPercentage(rawValue) {
    const { dry, wet } = settings.calibration;
    const percentage = ((dry - rawValue) / (dry - wet)) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
}

// DATA LOADING

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
        
        if (error) {
            console.error('Error loading data:', error);
            updateConnectionStatus('disconnected');
            return;
        }
        
        console.log(`Loaded ${data.length} historical readings`);
        
        chartData.labels = [];
        chartData.values = [];
        
        const filteredData = [];
        let lastTimestamp = 0;
        
        data.forEach(reading => {
            const timestamp = new Date(reading.created_at).getTime();
            if (timestamp - lastTimestamp >= CONFIG.CHART_DATA_INTERVAL) {
                filteredData.push(reading);
                lastTimestamp = timestamp;
            }
        });
        
        filteredData.forEach(reading => {
            const timestamp = new Date(reading.created_at);
            chartData.labels.push(formatTime(timestamp));
            chartData.values.push(rawToPercentage(reading.value));
        });
        
        updateChart();
        
        if (data.length > 0) {
            const latest = data[data.length - 1];
            currentRawValue = latest.value;
            updateCurrentValue(rawToPercentage(latest.value), new Date(latest.created_at));
        }
        
        updateConnectionStatus('connected');
        
    } catch (err) {
        console.error('Failed to load data:', err);
        updateConnectionStatus('disconnected');
    }
}

function startLiveDataFetch() {
    liveDataInterval = setInterval(async () => {
        try {
            const { data, error } = await supabase
                .from(CONFIG.TABLE_NAME)
                .select('value, created_at')
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (!error && data.length > 0) {
                const latest = data[0];
                currentRawValue = latest.value;
                updateCurrentValue(rawToPercentage(latest.value), new Date(latest.created_at));
                checkThreshold(rawToPercentage(latest.value));
            }
        } catch (err) {
            console.error('Error fetching live data:', err);
        }
    }, CONFIG.LIVE_REFRESH_INTERVAL);
}

// REALTIME SUBSCRIPTION

function setupRealtimeSubscription() {
    console.log('Setting up realtime subscription...');
    
    realtimeSubscription = supabase
        .channel('moisture_readings_changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: CONFIG.TABLE_NAME
            },
            (payload) => {
                console.log('New reading received:', payload);
                handleNewReading(payload.new);
            }
        )
        .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
                updateConnectionStatus('connected');
            }
        });
}

function handleNewReading(reading) {
    const timestamp = new Date(reading.created_at);
    const percentage = rawToPercentage(reading.value);
    
    const lastChartTime = chartData.labels.length > 0 ? 
        new Date(`${new Date().toDateString()} ${chartData.labels[chartData.labels.length - 1]}`).getTime() : 0;
    const currentTime = timestamp.getTime();
    
    if (currentTime - lastChartTime >= CONFIG.CHART_DATA_INTERVAL) {
        const timeLabel = formatTime(timestamp);
        chartData.labels.push(timeLabel);
        chartData.values.push(percentage);
        
        updateChart();
    }
    
    currentRawValue = reading.value;
    updateCurrentValue(percentage, timestamp);
    checkThreshold(percentage);
    flashNewData();
}

// THRESHOLD CHECKING

function checkThreshold(currentPercentage) {
    if (!settings.notificationsEnabled || !settings.selectedPlant) return;
    
    const now = Date.now();
    if (now - lastNotificationTime < 300000) return;
    
    const plant = settings.selectedPlant;
    
    if (currentPercentage < plant.threshold.min) {
        showNotification(`${plant.name} needs water!`, `Moisture is at ${currentPercentage}%, below ${plant.threshold.min}%`);
        lastNotificationTime = now;
    } else if (currentPercentage > plant.threshold.max) {
        showNotification(`${plant.name} too wet!`, `Moisture is at ${currentPercentage}%, above ${plant.threshold.max}%`);
        lastNotificationTime = now;
    }
}

function showNotification(title, message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: message, icon: '🌱' });
            }
        });
    }
    
    alert(`${title}\n${message}`);
}

// CHART MANAGEMENT

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
                label: 'Moisture Level',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Moisture: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function updateChart() {
    if (!chart) chart = new Chart();
    
    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.values;
    chart.update('none');
}

function changeTimeRange() {
    settings.timeRange = parseInt(document.getElementById('timeRange').value);
    saveSettings();
    loadHistoricalData();
}

// UI UPDATES

function updateCurrentValue(percentage, timestamp) {
    const valueElement = document.querySelector('.current-value .value');
    if (valueElement) {
        valueElement.textContent = percentage;
    }
    
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        updateElement.textContent = `Updated ${formatTimeAgo(timestamp)}`;
    }
    
    const indicatorFill = document.getElementById('indicatorFill');
    if (indicatorFill) {
        indicatorFill.style.width = `${percentage}%`;
    }
}

function updateConnectionStatus(status) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');
    
    if (!statusDot || !statusText) return;
    
    statusDot.className = 'status-dot';
    
    switch (status) {
        case 'connected':
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
            break;
        case 'connecting':
            statusText.textContent = 'Connecting...';
            break;
        case 'disconnected':
            statusDot.classList.add('disconnected');
            statusText.textContent = 'Disconnected';
            break;
    }
}

function flashNewData() {
    const currentValue = document.querySelector('.current-value');
    if (currentValue) {
        currentValue.style.transform = 'scale(1.05)';
        setTimeout(() => {
            currentValue.style.transform = 'scale(1)';
        }, 300);
    }
}

// UTILITY FUNCTIONS

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 minute ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return '1 hour ago';
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return date.toLocaleDateString();
}

// AUTO THEME DETECTION

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.theme === 'auto') {
        applyTheme();
    }
});

// CLEANUP ON PAGE UNLOAD

window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
    }
    if (liveDataInterval) {
        clearInterval(liveDataInterval);
    }
});