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
    { name: 'Snake Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Snake_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9TbmFrZV9QbGFudC5wbmciLCJpYXQiOjE3NjQxODMyMTIsImV4cCI6MTc5NTcxOTIxMn0.mMhWuc5qUFIZ9XDbn-9NuU5Hp_-SueFrTwjHi2_JyQ4' },
    { name: 'Pothos', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Pothos.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9Qb3Rob3MucG5nIiwiaWF0IjoxNzY0MTgzMjQ5LCJleHAiOjE3OTU3MTkyNDl9.4T6tl4f_JVodFQ8GtuIzQ8B7qy50Kc6CmCcIR2EBVGs' },
    { name: 'Spider Plant', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/SIP_Assets/Plants/Spider_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTSVBfQXNzZXRzL1BsYW50cy9TcGlkZXJfUGxhbnQucG5nIiwiaWF0IjoxNzY0MTgzMjg2LCJleHAiOjE3OTU3MTkyODZ9.aYzrtDMURW2eYbjwDzfoHAcFFcjgu8x07VlzjQZWM64' }
];

// STATE
let hourChart, dayChart, weekChart, realtimeSubscription, liveDataInterval;
let hourData = { labels: [], values: [] };
let dayData = { labels: [], values: [] };
let weekData = { labels: [], values: [] };
let currentFilter = 'all';
let settings = {
    theme: 'light',
    notificationsEnabled: false,
    calibration: { dry: 3200, wet: 1200 },
    selectedPlant: null,
    customPlants: []
};

let currentRawValue = 0;
let lastNotificationTime = 0;

// SUPABASE CLIENT
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    applyTheme();
    initCharts();
    populatePlants();
    await loadHistoricalData();
    setupRealtimeSubscription();
    startLiveDataFetch();
    showPage('dashboard');
    
    const imgInput = document.getElementById('customPlantImage');
    if (imgInput) imgInput.addEventListener('change', handleImagePreview);
    
    // Close panel when clicking outside
    const plantPanel = document.getElementById('plantPanel');
    if (plantPanel) {
        plantPanel.addEventListener('click', handlePanelClick);
    }
});

// Settings
function loadSettings() {
    const saved = localStorage.getItem('moistureMonitorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        
        // Load custom plants
        if (settings.customPlants && settings.customPlants.length > 0) {
            PLANTS_DATABASE.push(...settings.customPlants);
        }
        
        const themeToggle = document.getElementById('themeToggle');
        const notifToggle = document.getElementById('notificationsEnabled');
        
        if (themeToggle) themeToggle.value = settings.theme;
        if (notifToggle) notifToggle.checked = settings.notificationsEnabled;
        
        if (settings.selectedPlant) displaySelectedPlant(settings.selectedPlant);
    }
}

function saveSettings() {
    localStorage.setItem('moistureMonitorSettings', JSON.stringify(settings));
}

function updateSettings() {
    settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    saveSettings();
}

function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) return;
    
    // Remove custom plants from database
    const customPlants = settings.customPlants || [];
    customPlants.forEach(cp => {
        const idx = PLANTS_DATABASE.findIndex(p => p.name === cp.name && p.rarity === 'Custom');
        if (idx > -1) PLANTS_DATABASE.splice(idx, 1);
    });
    
    settings = {
        theme: 'light',
        notificationsEnabled: false,
        calibration: { dry: 3200, wet: 1200 },
        selectedPlant: null,
        customPlants: []
    };
    saveSettings();
    loadSettings();
    applyTheme();
    populatePlants();
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
    if (hourChart) updateChartTheme();
}

function updateChartTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f0f5f4' : '#0a0f0e';
    const gridColor = isDark ? 'rgba(240, 245, 244, 0.1)' : 'rgba(10, 15, 14, 0.1)';
    
    [hourChart, dayChart, weekChart].forEach(chart => {
        if (chart) {
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.update();
        }
    });
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
    
    // Filter plants
    if (currentFilter === 'az') {
        plants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentFilter === 'rarity') {
        const order = { Common: 1, Uncommon: 2, Rare: 3, Custom: 4 };
        plants.sort((a, b) => order[a.rarity] - order[b.rarity]);
    } else if (currentFilter === 'moisture') {
        const order = { Low: 1, Medium: 2, High: 3 };
        plants.sort((a, b) => order[a.moisture] - order[b.moisture]);
    }
    
    grid.innerHTML = plants.map(p => {
        const isCustom = p.rarity === 'Custom';
        const deleteBtn = isCustom ? `<button class="delete-plant-btn" onclick="event.stopPropagation(); deletePlant('${p.name}')">×</button>` : '';
        
        return `
        <div class="plant-card" onclick='selectPlant(${JSON.stringify(p).replace(/'/g, "\\'")})'> 
            ${deleteBtn}
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
    `;
    }).join('');
}

function filterPlants(filter) {
    currentFilter = filter;
    
    // Update active filter bubble
    document.querySelectorAll('.filter-bubble').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
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
    card.style.backgroundImage = `linear-gradient(135deg, rgba(95, 171, 149, 0.9) 0%, rgba(126, 200, 180, 0.9) 100%), url('${plant.image}')`;
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

function handlePanelClick(event) {
    // Close panel if clicking outside the panel content
    if (event.target.id === 'plantPanel') {
        closePlantPanel();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
    
    // Reset filter to 'all' when switching tabs
    if (tab === 'browse') {
        currentFilter = 'all';
        document.querySelectorAll('.filter-bubble').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        populatePlants();
    }
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('customImagePreview');
        preview.src = event.target.result;
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
    
    if (!preview.src || preview.style.display === 'none') {
        alert('Please upload a plant image');
        return;
    }
    
    const plant = {
        name,
        rarity: 'Custom',
        moisture: min < 35 ? 'Low' : (min < 55 ? 'Medium' : 'High'),
        threshold: { min, max },
        image: preview.src
    };
    
    // Add to database and custom plants list
    PLANTS_DATABASE.push(plant);
    if (!settings.customPlants) settings.customPlants = [];
    settings.customPlants.push(plant);
    saveSettings();
    
    selectPlant(plant);
    populatePlants();
    
    // Reset form
    document.getElementById('customPlantName').value = '';
    document.getElementById('customPlantMinThreshold').value = '';
    document.getElementById('customPlantMaxThreshold').value = '';
    document.getElementById('customPlantImage').value = '';
    preview.style.display = 'none';
}

function deletePlant(plantName) {
    if (!confirm(`Delete "${plantName}"?`)) return;
    
    // Find and remove from database
    const idx = PLANTS_DATABASE.findIndex(p => p.name === plantName && p.rarity === 'Custom');
    if (idx > -1) {
        PLANTS_DATABASE.splice(idx, 1);
    }
    
    // Remove from custom plants list
    if (settings.customPlants) {
        settings.customPlants = settings.customPlants.filter(p => p.name !== plantName);
    }
    
    // Clear selected plant if it was deleted
    if (settings.selectedPlant?.name === plantName) {
        settings.selectedPlant = null;
        document.getElementById('plantInfo').style.display = 'none';
        const card = document.getElementById('currentReadingCard');
        card.style.backgroundImage = '';
        card.style.background = 'var(--accent-gradient)';
    }
    
    saveSettings();
    populatePlants();
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
        
        // Load last hour
        await loadTimeRangeData(1, hourData);
        updateChart(hourChart, hourData);
        
        // Load last 24 hours
        await loadTimeRangeData(24, dayData);
        updateChart(dayChart, dayData);
        
        // Load last 7 days
        await loadTimeRangeData(168, weekData);
        updateChart(weekChart, weekData);
        
        updateConnectionStatus('connected');
    } catch (err) {
        console.error('Load error:', err);
        updateConnectionStatus('disconnected');
    }
}

async function loadTimeRangeData(hours, dataObj) {
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);
    
    const { data, error } = await supabase
        .from(CONFIG.TABLE_NAME)
        .select('value, created_at')
        .gte('created_at', hoursAgo.toISOString())
        .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    dataObj.labels = [];
    dataObj.values = [];
    
    if (!data || data.length === 0) {
        return;
    }
    
    if (hours === 168) {
        // 7 days - one point per day
        const dayGroups = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        data.forEach(r => {
            const date = new Date(r.created_at);
            const dayKey = date.toDateString();
            if (!dayGroups[dayKey]) {
                dayGroups[dayKey] = { values: [], day: days[date.getDay()], date: date };
            }
            dayGroups[dayKey].values.push(r.value);
        });
        
        Object.values(dayGroups)
            .sort((a, b) => a.date - b.date)
            .forEach(group => {
                const avg = group.values.reduce((a, b) => a + b, 0) / group.values.length;
                dataObj.labels.push(group.day);
                dataObj.values.push(rawToPercentage(Math.round(avg)));
            });
    } else if (hours === 24) {
        // 24 hours - one point per hour
        const hourGroups = {};
        
        data.forEach(r => {
            const date = new Date(r.created_at);
            const hourKey = `${date.getDate()}-${date.getHours()}`;
            if (!hourGroups[hourKey]) {
                hourGroups[hourKey] = { values: [], hour: date.getHours(), time: date.getTime() };
            }
            hourGroups[hourKey].values.push(r.value);
        });
        
        Object.values(hourGroups)
            .sort((a, b) => a.time - b.time)
            .forEach(group => {
                const avg = group.values.reduce((a, b) => a + b, 0) / group.values.length;
                const hour = group.hour;
                const label = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}am` : `${hour-12}pm`;
                dataObj.labels.push(label);
                dataObj.values.push(rawToPercentage(Math.round(avg)));
            });
    } else {
        // 1 hour - one point every 5 minutes
        const minuteGroups = {};
        
        data.forEach(r => {
            const date = new Date(r.created_at);
            const minute = Math.floor(date.getMinutes() / 5) * 5;
            const key = `${date.getHours()}:${minute}`;
            if (!minuteGroups[key]) {
                minuteGroups[key] = { values: [], time: date.getTime(), hour: date.getHours(), minute: minute };
            }
            minuteGroups[key].values.push(r.value);
        });
        
        Object.values(minuteGroups)
            .sort((a, b) => a.time - b.time)
            .forEach(group => {
                const avg = group.values.reduce((a, b) => a + b, 0) / group.values.length;
                const label = `${group.hour.toString().padStart(2, '0')}:${group.minute.toString().padStart(2, '0')}`;
                dataObj.labels.push(label);
                dataObj.values.push(rawToPercentage(Math.round(avg)));
            });
    }
    
    // Update current value from latest reading
    if (data.length > 0) {
        const latest = data[data.length - 1];
        currentRawValue = latest.value;
        updateCurrentValue(rawToPercentage(latest.value), new Date(latest.created_at));
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
    
    // Update all charts
    addDataPoint(hourData, time, pct, 1);
    updateChart(hourChart, hourData);
    
    addDataPoint(dayData, time, pct, 24);
    updateChart(dayChart, dayData);
    
    addDataPoint(weekData, time, pct, 168);
    updateChart(weekChart, weekData);
    
    currentRawValue = reading.value;
    updateCurrentValue(pct, time);
    checkThreshold(pct);
    flashNewData();
}

function addDataPoint(dataObj, time, pct, hours) {
    const label = hours === 1 ? formatTime(time) : 
                  hours === 24 ? (time.getHours() === 0 ? '12am' : time.getHours() === 12 ? '12pm' : time.getHours() < 12 ? `${time.getHours()}am` : `${time.getHours()-12}pm`) :
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][time.getDay()];
    
    dataObj.labels.push(label);
    dataObj.values.push(pct);
    
    // Keep only relevant data points
    const maxPoints = hours === 1 ? 12 : hours === 24 ? 24 : 7;
    if (dataObj.labels.length > maxPoints) {
        dataObj.labels.shift();
        dataObj.values.shift();
    }
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
function initCharts() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f0f5f4' : '#0a0f0e';
    const gridColor = isDark ? 'rgba(240, 245, 244, 0.1)' : 'rgba(10, 15, 14, 0.1)';
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Moisture',
                data: [],
                borderColor: '#5fab95',
                backgroundColor: 'rgba(95, 171, 149, 0.1)',
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
    };
    
    hourChart = new Chart(document.getElementById('hourChart').getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
    dayChart = new Chart(document.getElementById('dayChart').getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
    weekChart = new Chart(document.getElementById('weekChart').getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
}

function updateChart(chart, dataObj) {
    if (!chart) return;
    chart.data.labels = dataObj.labels;
    chart.data.datasets[0].data = dataObj.values;
    chart.update('none');
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