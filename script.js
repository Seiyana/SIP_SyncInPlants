// CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8',
    TABLE_NAME: 'moisture_readings',
    CUSTOM_PLANTS_TABLE: 'custom_plants',
    PLANTS_BUCKET: 'plant-images',
    LIVE_REFRESH_INTERVAL: 3000,
    CHART_DATA_INTERVAL: 600000,
    TIME_RANGE_HOURS: 24
};

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
let customPlants = [];

// SUPABASE CLIENT
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    applyTheme();
    initChart();
    await loadCustomPlants();
    await populatePlants();
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
<<<<<<< HEAD
<<<<<<< HEAD
    
=======
>>>>>>> parent of dd6e02b (v5)
=======
>>>>>>> parent of dd6e02b (v5)
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

// Custom Plants - Load from Supabase
async function loadCustomPlants() {
    try {
        const { data, error } = await supabase
            .from(CONFIG.CUSTOM_PLANTS_TABLE)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        customPlants = data || [];
    } catch (err) {
        console.error('Error loading custom plants:', err);
        customPlants = [];
    }
}

async function populatePlants() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    
<<<<<<< HEAD
    try {
        // Fetch both default and custom plants from Supabase
        const { data: defaultPlants, error: defaultError } = await supabase
            .from('default_plants')
            .select('*')
            .order('name', { ascending: true });
        
        if (defaultError && defaultError.code !== 'PGRST116') throw defaultError;
        
        const { data: customPlantsData, error: customError } = await supabase
            .from('custom_plants')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (customError && customError.code !== 'PGRST116') throw customError;
        
        // Combine all plants
        const allPlants = [...(defaultPlants || []), ...(customPlantsData || [])];
        
        // Get filter value
        const filter = document.getElementById('plantFilter')?.value || 'all';
        
        // Apply filters and sorting
        let filtered = [...allPlants];
        
        if (filter === 'az') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filter === 'rarity') {
            const order = { Common: 1, Uncommon: 2, Rare: 3, Custom: 4 };
            filtered.sort((a, b) => (order[a.rarity] || 5) - (order[b.rarity] || 5));
        } else if (filter === 'moisture') {
            const order = { Low: 1, Medium: 2, High: 3 };
            filtered.sort((a, b) => (order[a.moisture] || 5) - (order[b.moisture] || 5));
        }
        
        // Generate HTML for plant cards
        grid.innerHTML = filtered.map(p => {
            const isCustom = p.rarity === 'Custom';
            const deleteBtn = isCustom 
                ? `<button class="delete-plant-btn" onclick="event.stopPropagation(); deletePlant(${p.id})">×</button>` 
                : '';
            
            // Parse threshold if it's a string (from database)
            const threshold = typeof p.threshold === 'string' 
                ? JSON.parse(p.threshold) 
                : p.threshold;
            
            return `
                <div class="plant-card" onclick='selectPlant(${JSON.stringify(p).replace(/'/g, "\\'")})'> 
                    ${deleteBtn}
                    <img 
                        src="${p.image}" 
                        alt="${p.name}" 
                        onerror="this.src='https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'"
                    >
                    <div class="plant-card-info">
                        <h3>${p.name}</h3>
                        <div class="plant-badges">
                            <span class="rarity-badge ${p.rarity.toLowerCase()}">${p.rarity}</span>
                            <span class="moisture-badge">${p.moisture} Moisture</span>
                        </div>
                        <p class="plant-threshold">${threshold.min}% - ${threshold.max}%</p>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log(`✅ Loaded ${filtered.length} plants (${defaultPlants?.length || 0} default, ${customPlantsData?.length || 0} custom)`);
        
    } catch (err) {
        console.error('Error populating plants:', err);
        grid.innerHTML = `<p style="color: red; grid-column: 1/-1; text-align: center;">Error loading plants: ${err.message}</p>`;
    }
=======
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
<<<<<<< HEAD
>>>>>>> parent of dd6e02b (v5)
=======
>>>>>>> parent of dd6e02b (v5)
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

// Add Custom Plant - Save to Supabase
async function addCustomPlant() {
    const name = document.getElementById('customPlantName').value;
    const min = parseInt(document.getElementById('customPlantMinThreshold').value);
    const max = parseInt(document.getElementById('customPlantMaxThreshold').value);
    const imageFile = document.getElementById('customPlantImage').files[0];
    
    if (!name || !min || !max) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!imageFile) {
        alert('Please upload an image');
        return;
    }
    
<<<<<<< HEAD
<<<<<<< HEAD
    try {
        // Show loading state
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Uploading...';
        btn.disabled = true;
        
        // Upload image to Supabase bucket
        const timestamp = Date.now();
        const fileName = `${timestamp}_${imageFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(CONFIG.PLANTS_BUCKET)
            .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(CONFIG.PLANTS_BUCKET)
            .getPublicUrl(fileName);
        
        const imageUrl = publicUrlData.publicUrl;
        
        // Save plant to Supabase
        const plant = {
            name,
            rarity: 'Custom',
            moisture: min < 35 ? 'Low' : (min < 55 ? 'Medium' : 'High'),
            threshold: { min, max },
            image: imageUrl
        };
        
        const { data: dbData, error: dbError } = await supabase
            .from(CONFIG.CUSTOM_PLANTS_TABLE)
            .insert([plant])
            .select();
        
        if (dbError) throw dbError;
        
        // Add to local customPlants array
        if (dbData && dbData.length > 0) {
            customPlants.push(dbData[0]);
        }
        
        // Select the new plant
        selectPlant(plant);
        await populatePlants();
        
        // Reset form
        document.getElementById('customPlantName').value = '';
        document.getElementById('customPlantMinThreshold').value = '';
        document.getElementById('customPlantMaxThreshold').value = '';
        document.getElementById('customPlantImage').value = '';
        document.getElementById('customImagePreview').style.display = 'none';
        
        alert('Plant added successfully!');
        btn.textContent = originalText;
        btn.disabled = false;
        
    } catch (err) {
        console.error('Error adding plant:', err);
        alert('Error adding plant: ' + err.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Delete Custom Plant
async function deletePlant(plantId) {
    if (!confirm('Delete this plant?')) return;
    
    try {
        const { error } = await supabase
            .from(CONFIG.CUSTOM_PLANTS_TABLE)
            .delete()
            .eq('id', plantId);
        
        if (error) throw error;
        
        // Remove from local array
        customPlants = customPlants.filter(p => p.id !== plantId);
        
        // Clear selected plant if it was deleted
        if (settings.selectedPlant?.id === plantId) {
            settings.selectedPlant = null;
            saveSettings();
            document.getElementById('plantInfo').style.display = 'none';
            const card = document.getElementById('currentReadingCard');
            card.style.backgroundImage = '';
            card.style.background = 'var(--accent-gradient)';
        }
        
        await populatePlants();
    } catch (err) {
        console.error('Error deleting plant:', err);
        alert('Error deleting plant: ' + err.message);
    }
}

=======
=======
>>>>>>> parent of dd6e02b (v5)
    PLANTS_DATABASE.push(plant);
    selectPlant(plant);
    
    // Reset form
    document.getElementById('customPlantName').value = '';
    document.getElementById('customPlantMinThreshold').value = '';
    document.getElementById('customPlantMaxThreshold').value = '';
    preview.style.display = 'none';
}

<<<<<<< HEAD
>>>>>>> parent of dd6e02b (v5)
=======
>>>>>>> parent of dd6e02b (v5)
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
        
<<<<<<< HEAD
<<<<<<< HEAD
        if (settings.timeRange === 168) {
            const dayGroups = {};
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            data.forEach(r => {
                const date = new Date(r.created_at);
                const dayKey = date.toDateString();
                if (!dayGroups[dayKey]) {
                    dayGroups[dayKey] = { values: [], day: days[date.getDay()] };
                }
                dayGroups[dayKey].values.push(r.value);
            });
            
            Object.keys(dayGroups).sort((a, b) => new Date(a) - new Date(b)).forEach(key => {
                const group = dayGroups[key];
                const avg = group.values.reduce((a, b) => a + b, 0) / group.values.length;
                chartData.labels.push(group.day);
                chartData.values.push(rawToPercentage(Math.round(avg)));
            });
        } else if (settings.timeRange === 24) {
            const hourGroups = {};
            
            data.forEach(r => {
                const date = new Date(r.created_at);
                const hour = date.getHours();
                if (!hourGroups[hour]) {
                    hourGroups[hour] = { values: [], times: [] };
                }
                hourGroups[hour].values.push(r.value);
                hourGroups[hour].times.push(date.getTime());
            });
            
            const now = new Date();
            const currentHour = now.getHours();
            
            for (let i = 0; i < 24; i++) {
                const hour = (currentHour - 23 + i + 24) % 24;
                if (hourGroups[hour]) {
                    const avg = hourGroups[hour].values.reduce((a, b) => a + b, 0) / hourGroups[hour].values.length;
                    const label = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}am` : `${hour-12}pm`;
                    chartData.labels.push(label);
                    chartData.values.push(rawToPercentage(Math.round(avg)));
                }
            }
        } else {
            let lastTime = 0;
            data.forEach(r => {
                const time = new Date(r.created_at).getTime();
                if (time - lastTime >= CONFIG.CHART_DATA_INTERVAL) {
                    chartData.labels.push(formatTime(new Date(r.created_at)));
                    chartData.values.push(rawToPercentage(r.value));
                    lastTime = time;
                }
            });
        }
=======
        let lastTime = 0;
        data.forEach(r => {
            const time = new Date(r.created_at).getTime();
            if (time - lastTime >= CONFIG.CHART_DATA_INTERVAL) {
                chartData.labels.push(formatTime(new Date(r.created_at)));
                chartData.values.push(rawToPercentage(r.value));
                lastTime = time;
            }
        });
>>>>>>> parent of dd6e02b (v5)
=======
        let lastTime = 0;
        data.forEach(r => {
            const time = new Date(r.created_at).getTime();
            if (time - lastTime >= CONFIG.CHART_DATA_INTERVAL) {
                chartData.labels.push(formatTime(new Date(r.created_at)));
                chartData.values.push(rawToPercentage(r.value));
                lastTime = time;
            }
        });
>>>>>>> parent of dd6e02b (v5)
        
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