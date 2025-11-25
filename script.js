// CONFIGURATION

const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8',
    TABLE_NAME: 'moisture_readings',
    MAX_DATA_POINTS: 100,
    REFRESH_INTERVAL: 5000,
    TIME_RANGE_HOURS: 24
};

// STATE

let chart = null;
let realtimeSubscription = null;
let chartData = {
    labels: [],
    values: []
};
let settings = {
    refreshInterval: 5000,
    maxDataPoints: 100,
    theme: 'light',
    timeRange: 24
};

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
    
    await loadHistoricalData();
    
    setupRealtimeSubscription();
    
    updateStatistics();
    
    showPage('dashboard');
    
    console.log('Initialization complete!');
});

// SETTINGS MANAGEMENT

function loadSettings() {
    const saved = localStorage.getItem('moistureMonitorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        
        
        document.getElementById('refreshInterval').value = settings.refreshInterval;
        document.getElementById('maxDataPoints').value = settings.maxDataPoints;
        document.getElementById('themeToggle').value = settings.theme;
        document.getElementById('timeRange').value = settings.timeRange;
    }
}

function saveSettings() {
    localStorage.setItem('moistureMonitorSettings', JSON.stringify(settings));
}

function updateSettings() {
    settings.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    settings.maxDataPoints = parseInt(document.getElementById('maxDataPoints').value);
    settings.timeRange = parseInt(document.getElementById('timeRange').value);
    
    saveSettings();
    
    
    loadHistoricalData();
    
    console.log('Settings updated:', settings);
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        settings = {
            refreshInterval: 5000,
            maxDataPoints: 100,
            theme: 'light',
            timeRange: 24
        };
        
        saveSettings();
        loadSettings();
        applyTheme();
        
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
            .order('created_at', { ascending: true })
            .limit(settings.maxDataPoints);
        
        if (error) {
            console.error('Error loading data:', error);
            updateConnectionStatus('disconnected');
            return;
        }
        
        console.log(`Loaded ${data.length} historical readings`);
        
        
        chartData.labels = [];
        chartData.values = [];
        
        
        data.forEach(reading => {
            const timestamp = new Date(reading.created_at);
            chartData.labels.push(formatTime(timestamp));
            chartData.values.push(reading.value);
        });
        
        
        updateChart();
        
        
        if (data.length > 0) {
            const latest = data[data.length - 1];
            updateCurrentValue(latest.value, new Date(latest.created_at));
        }
        
        updateConnectionStatus('connected');
        
    } catch (err) {
        console.error('Failed to load data:', err);
        updateConnectionStatus('disconnected');
    }
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
    const timeLabel = formatTime(timestamp);
    
    
    chartData.labels.push(timeLabel);
    chartData.values.push(reading.value);
    
    
    if (chartData.labels.length > settings.maxDataPoints) {
        chartData.labels.shift();
        chartData.values.shift();
    }
    
    
    updateChart();
    updateCurrentValue(reading.value, timestamp);
    updateStatistics();
    
    
    flashNewData();
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
                pointRadius: 2,
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
                            return `Moisture: ${context.parsed.y} ADC`;
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
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value;
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

// UI UPDATES

function updateCurrentValue(value, timestamp) {
    
    const valueElement = document.querySelector('.current-value .value');
    if (valueElement) {
        valueElement.textContent = value;
    }
    
    
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        updateElement.textContent = `Updated ${formatTimeAgo(timestamp)}`;
    }
    
    const percentage = (value / 4095) * 100;
    const indicatorFill = document.getElementById('indicatorFill');
    if (indicatorFill) {
        indicatorFill.style.width = `${percentage}%`;
    }
}

function updateStatistics() {
    if (chartData.values.length === 0) return;
    
    const values = chartData.values;
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    document.getElementById('avgValue').textContent = avg;
    document.getElementById('maxValue').textContent = max;
    document.getElementById('minValue').textContent = min;
    document.getElementById('totalReadings').textContent = values.length;
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

// ERROR HANDLING

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// CLEANUP ON PAGE UNLOAD

window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
    }
});