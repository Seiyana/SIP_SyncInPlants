// CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8',
    TABLE_NAME: 'moisture_readings',
    LIVE_REFRESH_INTERVAL: 3000,
    CHART_DATA_INTERVAL: 600000,
    TIME_RANGE_HOURS: 24
};

// PASTE PLANT DATABASE HERE
const PLANTS_DATABASE = [
    // Your plant database array goes here
];

// STATE
let hourChart, dayChart, weekChart, realtimeSubscription, liveDataInterval;
let hourData = { labels: [], values: [] };
let dayData = { labels: [], values: [] };
let weekData = { labels: [], values: [] };
let currentFilter = 'all';
let currentUser = null;
let settings = {
    theme: 'light',
    notificationsEnabled: false,
    calibration: { dry: 3200, wet: 1200 },
    selectedPlant: null,
    customPlants: []
};

let currentRawValue = 0;
let lastNotificationTime = 0;
let lastThresholdState = 'normal';

// SUPABASE CLIENT
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await loadUserProfile();
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
    
    const plantPanel = document.getElementById('plantPanel');
    if (plantPanel) {
        plantPanel.addEventListener('click', handlePanelClick);
    }
});

// AUTH FUNCTIONS
async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }
    
    currentUser = session.user;
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'auth.html';
        } else if (event === 'USER_UPDATED') {
            currentUser = session?.user || null;
        }
    });
}

async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Profile load error:', error);
            return;
        }
        
        // If profile doesn't exist, create it
        if (!data) {
            const { error: createError } = await supabase
                .from('profiles')
                .insert([{
                    id: currentUser.id,
                    full_name: currentUser.user_metadata?.full_name || 'User',
                    email: currentUser.email,
                    theme: 'light',
                    notifications_enabled: false
                }]);
            
            if (createError) {
                console.error('Profile creation error:', createError);
            }
        } else {
            // Load settings from profile
            if (data.settings) {
                settings = { ...settings, ...data.settings };
            }
            if (data.theme) {
                settings.theme = data.theme;
            }
            if (typeof data.notifications_enabled === 'boolean') {
                settings.notificationsEnabled = data.notifications_enabled;
            }
        }
    } catch (err) {
        console.error('Load profile error:', err);
    }
}

async function saveUserProfile() {
    if (!currentUser) return;
    
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                theme: settings.theme,
                notifications_enabled: settings.notificationsEnabled,
                settings: settings,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);
        
        if (error) {
            console.error('Profile save error:', error);
        }
    } catch (err) {
        console.error('Save profile error:', err);
    }
}

async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        window.location.href = 'auth.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    }
}

async function handleDeleteAccount() {
    const passwordInput = document.getElementById('deleteAccountPassword');
    if (!passwordInput) return;
    
    const password = passwordInput.value;
    
    if (!password) {
        alert('Please enter your password to confirm account deletion.');
        return;
    }
    
    if (!confirm('Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.')) {
        return;
    }
    
    try {
        // Verify password by attempting to re-authenticate
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: currentUser.email,
            password: password
        });
        
        if (signInError) {
            alert('Incorrect password. Account deletion cancelled.');
            passwordInput.value = '';
            return;
        }
        
        // Delete user profile from database
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', currentUser.id);
        
        if (profileError) {
            console.error('Profile deletion error:', profileError);
        }
        
        // Delete user account (requires admin privileges or RLS policy)
        // Note: This might need to be done via a Supabase function
        alert('Account deletion initiated. You will be logged out.');
        
        await supabase.auth.signOut();
        window.location.href = 'auth.html';
        
    } catch (error) {
        console.error('Delete account error:', error);
        alert('Failed to delete account. Please contact support.');
        passwordInput.value = '';
    }
}

// Settings
function loadSettings() {
    // Settings are now loaded from user profile
    // Keep localStorage as fallback for custom plants
    const saved = localStorage.getItem('moistureMonitorSettings');
    if (saved) {
        const localSettings = JSON.parse(saved);
        if (localSettings.customPlants && localSettings.customPlants.length > 0) {
            settings.customPlants = localSettings.customPlants;
            PLANTS_DATABASE.push(...settings.customPlants);
        }
    }
    
    const themeToggle = document.getElementById('themeToggle');
    const notifToggle = document.getElementById('notificationsEnabled');
    
    if (themeToggle) themeToggle.value = settings.theme;
    if (notifToggle) notifToggle.checked = settings.notificationsEnabled;
    
    if (settings.selectedPlant) displaySelectedPlant(settings.selectedPlant);
}

async function saveSettings() {
    // Save to localStorage as backup
    localStorage.setItem('moistureMonitorSettings', JSON.stringify(settings));
    
    // Save to Supabase profile
    await saveUserProfile();
}

async function updateSettings() {
    settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    await saveSettings();
}

async function resetSettings() {
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
    
    await saveSettings();
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
async function toggleTheme() {
    settings.theme = document.getElementById('themeToggle').value;
    await saveSettings();
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
    
    document.querySelectorAll('.filter-bubble').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    populatePlants();
}

async function selectPlant(plant) {
    settings.selectedPlant = plant;
    await saveSettings();
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
    if (event.target.id === 'plantPanel') {
        closePlantPanel();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
    
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

async function addCustomPlant() {
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
    
    PLANTS_DATABASE.push(plant);
    if (!settings.customPlants) settings.customPlants = [];
    settings.customPlants.push(plant);
    await saveSettings();
    
    await selectPlant(plant);
    populatePlants();
    
    document.getElementById('customPlantName').value = '';
    document.getElementById('customPlantMinThreshold').value = '';
    document.getElementById('customPlantMaxThreshold').value = '';
    document.getElementById('customPlantImage').value = '';
    preview.style.display = 'none';
}

async function deletePlant(plantName) {
    if (!confirm(`Delete "${plantName}"?`)) return;
    
    const idx = PLANTS_DATABASE.findIndex(p => p.name === plantName && p.rarity === 'Custom');
    if (idx > -1) {
        PLANTS_DATABASE.splice(idx, 1);
    }
    
    if (settings.customPlants) {
        settings.customPlants = settings.customPlants.filter(p => p.name !== plantName);
    }
    
    if (settings.selectedPlant?.name === plantName) {
        settings.selectedPlant = null;
        document.getElementById('plantInfo').style.display = 'none';
        const card = document.getElementById('currentReadingCard');
        card.style.backgroundImage = '';
        card.style.background = 'var(--accent-gradient)';
    }
    
    await saveSettings();
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

async function calibrateDry() {
    settings.calibration.dry = currentRawValue;
    await saveSettings();
    document.getElementById('finalDry').textContent = currentRawValue;
    document.getElementById('calibrationStep1').classList.remove('active');
    document.getElementById('calibrationStep2').classList.add('active');
}

async function calibrateWet() {
    settings.calibration.wet = currentRawValue;
    await saveSettings();
    document.getElementById('finalWet').textContent = currentRawValue;
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
    
    dataObj.labels = [];
    dataObj.values = [];
    
    let data, error;
    
    if (hours === 168) {
        // 7 days - use daily aggregates
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 7);
        
        const result = await supabase
            .from('moisture_avg_day')
            .select('bucket_start, avg_value')
            .gte('bucket_start', daysAgo.toISOString())
            .order('bucket_start', { ascending: true });
        
        data = result.data;
        error = result.error;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            data.forEach(row => {
                const date = new Date(row.bucket_start);
                dataObj.labels.push(days[date.getDay()]);
                dataObj.values.push(rawToPercentage(Math.round(row.avg_value)));
            });
        }
    } else if (hours === 24) {
        // 24 hours - use hourly aggregates
        const result = await supabase
            .from('moisture_avg_hour')
            .select('bucket_start, avg_value')
            .gte('bucket_start', hoursAgo.toISOString())
            .order('bucket_start', { ascending: true });
        
        data = result.data;
        error = result.error;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            data.forEach(row => {
                const date = new Date(row.bucket_start);
                const hour = date.getHours();
                const label = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}am` : `${hour-12}pm`;
                dataObj.labels.push(label);
                dataObj.values.push(rawToPercentage(Math.round(row.avg_value)));
            });
        }
    } else {
        // 1 hour - use 5-minute aggregates
        const result = await supabase
            .from('moisture_avg_5min')
            .select('bucket_start, avg_value')
            .gte('bucket_start', hoursAgo.toISOString())
            .order('bucket_start', { ascending: true });
        
        data = result.data;
        error = result.error;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            data.forEach(row => {
                const date = new Date(row.bucket_start);
                const label = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                dataObj.labels.push(label);
                dataObj.values.push(rawToPercentage(Math.round(row.avg_value)));
            });
        }
    }
    
    // Update current value from latest raw reading
    const { data: latestData } = await supabase
        .from(CONFIG.TABLE_NAME)
        .select('value, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (latestData && latestData.length > 0) {
        const latest = latestData[0];
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
    
    const { name, threshold } = settings.selectedPlant;
    let currentState = 'normal';
    
    // Determine current state
    if (pct < threshold.min) {
        currentState = 'too-dry';
    } else if (pct > threshold.max) {
        currentState = 'too-wet';
    }
    
    // Only notify if state has changed
    if (currentState !== lastThresholdState) {
        if (currentState === 'too-dry') {
            showNotification(`${name} needs water!`, `Moisture at ${pct}%, below ${threshold.min}%`, 'danger');
        } else if (currentState === 'too-wet') {
            showNotification(`${name} is too wet!`, `Moisture at ${pct}%, above ${threshold.max}%`, 'warning');
        } else if (lastThresholdState !== 'normal') {
            // Back to normal - show success notification
            showNotification(`${name} moisture is good!`, `Back to normal at ${pct}%`, 'success');
        }
        
        lastThresholdState = currentState;
    }
}

function showNotification(title, msg, type = 'warning') {
    // Browser notification (if supported and permitted)
    if ('Notification' in window) {
        Notification.requestPermission().then(p => {
            if (p === 'granted') {
                new Notification(title, { 
                    body: msg,
                    tag: 'moisture-alert'
                });
            }
        });
    }
    
    // Custom modal notification
    showCustomNotification(title, msg, type);
}

function showCustomNotification(title, msg, type) {
    // Create notification modal if it doesn't exist
    let modal = document.getElementById('notificationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notificationModal';
        modal.className = 'notification-modal';
        modal.innerHTML = `
            <div class="notification-modal-content">
                <div class="notification-icon"></div>
                <h3 class="notification-title"></h3>
                <p class="notification-message"></p>
                <button class="notification-close-btn" onclick="closeNotificationModal()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update content
    const iconEl = modal.querySelector('.notification-icon');
    const titleEl = modal.querySelector('.notification-title');
    const messageEl = modal.querySelector('.notification-message');
    const content = modal.querySelector('.notification-modal-content');
    
    // Reset classes
    content.className = 'notification-modal-content';
    content.classList.add(type);
    
    // Set icon based on type
    if (type === 'success') {
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        iconEl.style.color = 'var(--success-color)';
    } else if (type === 'danger') {
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        iconEl.style.color = 'var(--danger-color)';
    } else {
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        iconEl.style.color = 'var(--warning-color)';
    }
    
    titleEl.textContent = title;
    messageEl.textContent = msg;
    
    // Show modal
    modal.classList.add('show');
    
    // Auto-close success notifications after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            closeNotificationModal();
        }, 5000);
    }
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('show');
    }
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