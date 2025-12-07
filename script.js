// CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8',
    TABLE_NAME: 'moisture_readings',
    LIVE_REFRESH_INTERVAL: 3000,
    CHART_DATA_INTERVAL: 600000,
    TIME_RANGE_HOURS: 24
};

async function loadTimeRangeData(hours, dataObj) {
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);
    
    dataObj.labels = [];
    dataObj.values = [];
    
    console.log(`Loading ${hours}h data for sensor:`, selectedSensorId, 'user:', currentUser?.id);
    
    let data, error;

// PLANT DATABASE
const PLANTS_DATABASE = [
    // Common Plants
    { name: 'Snake Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Snake_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvU25ha2VfUGxhbnQucG5nIiwiaWF0IjoxNzY0NTkwMjI2LCJleHAiOjE3OTYxMjYyMjZ9.1Yd1dstFFEv4_oUvRgqk1Ni5q3m2J1qfRREqFbvumE4' },
    { name: 'Pothos', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Pothos.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvUG90aG9zLnBuZyIsImlhdCI6MTc2NDU5MDI0NywiZXhwIjoxNzk2MTI2MjQ3fQ.EOisGgPJEhbBAO4i0iMGyNlb9F-hoIJm1jRPdhR-cNI' },
    { name: 'Spider Plant', rarity: 'Common', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Spider_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvU3BpZGVyX1BsYW50LnBuZyIsImlhdCI6MTc2NDU5MDI2NiwiZXhwIjoxNzk2MTI2MjY2fQ.JUyeeJop5wU2-xoYXO1NBAUtsKkyIyuqEtVtv5Zbbsg' },
    { name: 'Aloe Vera', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 35 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Aloe_Vera.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvQWxvZV9WZXJhLnBuZyIsImlhdCI6MTc2NDU5MDI4MCwiZXhwIjoxNzk2MTI2MjgwfQ.r_P5F2_upqArrQK4rquStzphMtYTMjL7vQnn6TOklAk' },
    { name: 'Peace Lily', rarity: 'Common', moisture: 'High', threshold: { min: 60, max: 80 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Peace_Lily.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvUGVhY2VfTGlseS5wbmciLCJpYXQiOjE3NjQ1OTAwMzcsImV4cCI6MTc5NjEyNjAzN30.jPFIxmrhjISpNZKroTgcMFve4NJmBJuC-jw_0ruWgk0' },
    { name: 'ZZ Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 20, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/ZZ_plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvWlpfcGxhbnQucG5nIiwiaWF0IjoxNzY0NTkwMjk2LCJleHAiOjE3OTYxMjYyOTZ9.Kyp68RrcZwq-7V4-EU8AQkYOifXNYUmRIdFKbPHubms' },
    { name: 'Jade Plant', rarity: 'Common', moisture: 'Low', threshold: { min: 25, max: 40 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Jade_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvSmFkZV9QbGFudC5wbmciLCJpYXQiOjE3NjQ1OTAwODUsImV4cCI6MTc5NjEyNjA4NX0.Y9Da6gCGgM9kQHswfGpSs4_ftipxbjOKlA0OIRxEkVw' },
    // Uncommon Plants
    { name: 'Monstera Deliciosa', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Monstera_Deliciosa.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvTW9uc3RlcmFfRGVsaWNpb3NhLnBuZyIsImlhdCI6MTc2NDU5MDEyMSwiZXhwIjoxNzk2MTI2MTIxfQ.4iFHYIYtjpDGDvnde0mu8_VHUV4hf5pfG6xCY2jOEHo' },
    { name: 'Fiddle Leaf Fig', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 45, max: 65 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Fiddle_Leaf_Fig.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvRmlkZGxlX0xlYWZfRmlnLnBuZyIsImlhdCI6MTc2NDU5MDE2NSwiZXhwIjoxNzk2MTI2MTY1fQ.wRos2qGJFWMMN4_zVq27VIheOvaTDDkIouSJfaMTowA' },
    { name: 'Rubber Plant', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 40, max: 60 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Rubber_Plant.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvUnViYmVyX1BsYW50LnBuZyIsImlhdCI6MTc2NDU5MDM0MCwiZXhwIjoxNzk2MTI2MzQwfQ.o5HJp4m32lVX0vS8gIfF40kSjW5qNcWkcAdhS7Ns_JE' },
    { name: 'Calathea', rarity: 'Uncommon', moisture: 'High', threshold: { min: 65, max: 85 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Calathea.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvQ2FsYXRoZWEucG5nIiwiaWF0IjoxNzY0NTkwMzU5LCJleHAiOjE3OTYxMjYzNTl9.PaW-tQC5GODZ1otElKFx7umv28zxSa5oD9tTcJBWN5Q' },
    { name: 'Boston Fern', rarity: 'Uncommon', moisture: 'High', threshold: { min: 70, max: 90 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Fiddle_Leaf_Fig.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvRmlkZGxlX0xlYWZfRmlnLnBuZyIsImlhdCI6MTc2NDU5MDE2NSwiZXhwIjoxNzk2MTI2MTY1fQ.wRos2qGJFWMMN4_zVq27VIheOvaTDDkIouSJfaMTowA' },
    { name: 'Philodendron', rarity: 'Uncommon', moisture: 'Medium', threshold: { min: 45, max: 65 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Philodendron.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvUGhpbG9kZW5kcm9uLnBuZyIsImlhdCI6MTc2NDU5MDM4NCwiZXhwIjoxNzk2MTI2Mzg0fQ.LOtrFrVphyPe97g37zX8evSxp_BUeBS3DcxDUk2aqJU' },
    // Rare Plants
    { name: 'Variegated Monstera', rarity: 'Rare', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Variegated_Monstera.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvVmFyaWVnYXRlZF9Nb25zdGVyYS5wbmciLCJpYXQiOjE3NjQ1OTA0MDAsImV4cCI6MTc5NjEyNjQwMH0.ojKjLgt-IvAWt_xc1nZsgXEgEWIUSPADpAkXkFXNUhw' },
    { name: 'Alocasia Polly', rarity: 'Rare', moisture: 'High', threshold: { min: 65, max: 85 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Alocasia_Polly.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvQWxvY2FzaWFfUG9sbHkucG5nIiwiaWF0IjoxNzY0NTkwNDE0LCJleHAiOjE3OTYxMjY0MTR9.1OVpWooqeye50faVCIuqkV9TkTZutxLqZ_O-Ce990yo' },
    { name: 'String of Hearts', rarity: 'Rare', moisture: 'Low', threshold: { min: 25, max: 45 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/String_of_Hearts.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvU3RyaW5nX29mX0hlYXJ0cy5wbmciLCJpYXQiOjE3NjQ1OTA0MjcsImV4cCI6MTc5NjEyNjQyN30.eYxf8qhPEwaXrFYruAZV3ViAy-OIsuoksBedrtC-vsA' },
    { name: 'Pink Princess Philodendron', rarity: 'Rare', moisture: 'Medium', threshold: { min: 50, max: 70 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Pink_Princess_Philodendron.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvUGlua19QcmluY2Vzc19QaGlsb2RlbmRyb24ucG5nIiwiaWF0IjoxNzY0NTkwNDQ2LCJleHAiOjE3OTYxMjY0NDZ9.axp4Yqffsowc_EAQJuRqkZ3CpB-dro5NafZkLj2okv0' },
    { name: 'Anthurium Clarinervium', rarity: 'Rare', moisture: 'High', threshold: { min: 60, max: 80 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Anthurium_Clarinervium.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvQW50aHVyaXVtX0NsYXJpbmVydml1bS5wbmciLCJpYXQiOjE3NjQ1OTA0NjIsImV4cCI6MTc5NjEyNjQ2Mn0.i453VttmuoJmcIppgkWlYmoQ8H8C1CljUTd-mX0J6xA' },
    { name: 'Hoya Carnosa', rarity: 'Rare', moisture: 'Low', threshold: { min: 30, max: 50 }, image: 'https://clluovsscjmlhcbvsgcz.supabase.co/storage/v1/object/sign/plant-images/Hoya_Carnosa.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MTA0N2NiNy1lN2IxLTQ5YzUtYjdhMS00YThiZGRlZjEzZDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFudC1pbWFnZXMvSG95YV9DYXJub3NhLnBuZyIsImlhdCI6MTc2NDU5MDQ3MiwiZXhwIjoxNzk2MTI2NDcyfQ.fwgG4NFjnY5iBQmabwVaGuW-eFc4GRLKs-fRQ5xiK2E' }
];

// GLOBAL STATE
let currentUser = null;
let currentSession = null;
let selectedSensorId = null;
let hourChart, dayChart, weekChart, realtimeSubscription, liveDataInterval;
let hourData = { labels: [], values: [] };
let dayData = { labels: [], values: [] };
let weekData = { labels: [], values: [] };
let currentFilter = 'all';
let settings = {
    theme: 'light',
    notificationsEnabled: false,
    calibration: { dry: 3200, wet: 1200 },
    selectedPlant: null
};

let currentRawValue = 0;
let lastThresholdState = 'normal';
let currentCustomPlantId = null; // For multi-step custom plant process

// SUPABASE CLIENT
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndInit();
});

// ==================== AUTHENTICATION ====================

async function checkAuthAndInit() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
        window.location.href = 'auth.html';
        return;
    }
    
    currentSession = session;
    currentUser = session.user;
    
    await loadUserSettings();
    applyTheme();
    initCharts();
    await loadUserPlants();
    await loadUserSensors();
    await loadUserApiKey();
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
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'auth.html';
    }
}

// ==================== API KEY MANAGEMENT ====================

async function loadUserApiKey() {
    try {
        const { data, error } = await supabase
            .from('sensors')
            .select('api_key')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            document.getElementById('menuApiKey').textContent = data.api_key;
        } else {
            // Create first sensor entry with pending device_id
            await generateNewApiKey();
        }
    } catch (err) {
        console.error('Error loading API key:', err);
    }
}

function copyMenuApiKey() {
    const key = document.getElementById('menuApiKey').textContent;
    if (key && key !== 'Loading...') {
        navigator.clipboard.writeText(key);
        alert('API key copied to clipboard!');
    }
}

async function generateNewApiKey() {
    if (!confirm('Generate a new API key? This will create a new sensor slot. Your existing sensors will continue to work.')) {
        return;
    }
    
    try {
        const { data: newSensor, error } = await supabase
            .from('sensors')
            .insert({
                user_id: currentUser.id,
                sensor_name: 'Sensor ' + (new Date().getTime()),
                device_id: 'pending_' + (new Date().getTime())
            })
            .select()
            .single();
        
        if (error) throw error;
        
        document.getElementById('menuApiKey').textContent = newSensor.api_key;
        alert('New API key generated! Use this key to pair a new sensor.');
        
        // Reload sensors list
        await loadUserSensors();
    } catch (err) {
        console.error('Error generating API key:', err);
        alert('Failed to generate new API key: ' + err.message);
    }
}

function showAddSensorInstructions() {
    showPage('setup');
    // Scroll to pairing instructions
    setTimeout(() => {
        const setupPage = document.getElementById('setupPage');
        if (setupPage) {
            const pairingSection = setupPage.querySelectorAll('.about-section')[2];
            if (pairingSection) {
                pairingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, 100);
}

// ==================== USER SETTINGS ====================

async function loadUserSettings() {
    try {
        const { data, error } = await supabase
            .from('user_plant_settings')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            settings.theme = data.theme || 'light';
            settings.notificationsEnabled = data.notifications_enabled || false;
            settings.calibration = {
                dry: data.calibration_dry || 3200,
                wet: data.calibration_wet || 1200
            };
            settings.selectedPlant = data.selected_plant_data || null;
            
            const themeToggle = document.getElementById('themeToggle');
            const notifToggle = document.getElementById('notificationsEnabled');
            
            if (themeToggle) themeToggle.value = settings.theme;
            if (notifToggle) notifToggle.checked = settings.notificationsEnabled;
            
            if (settings.selectedPlant) {
                displaySelectedPlant(settings.selectedPlant);
            }
        } else {
            await saveUserSettings();
        }
    } catch (err) {
        console.error('Error loading user settings:', err);
    }
}

async function saveUserSettings() {
    try {
        const { error } = await supabase
            .from('user_plant_settings')
            .upsert({
                user_id: currentUser.id,
                theme: settings.theme,
                notifications_enabled: settings.notificationsEnabled,
                calibration_dry: settings.calibration.dry,
                calibration_wet: settings.calibration.wet,
                selected_plant_data: settings.selectedPlant,
                selected_plant_name: settings.selectedPlant?.name || null
            });
        
        if (error) throw error;
        console.log('Settings saved to database');
    } catch (err) {
        console.error('Error saving settings:', err);
    }
}

function updateSettings() {
    settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    saveUserSettings();
}

function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) return;
    
    settings = {
        theme: 'light',
        notificationsEnabled: false,
        calibration: { dry: 3200, wet: 1200 },
        selectedPlant: null
    };
    
    saveUserSettings();
    loadUserSettings();
    applyTheme();
    
    document.getElementById('plantInfo').style.display = 'none';
    const card = document.getElementById('currentReadingCard');
    card.style.backgroundImage = '';
    card.style.background = 'var(--accent-gradient)';
    
    alert('Settings reset');
}

// ==================== SENSORS MANAGEMENT ====================

async function loadUserSensors() {
    try {
        const { data, error } = await supabase
            .from('sensors')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('is_active', true)
            .not('device_id', 'like', 'pending%');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            selectedSensorId = data[0].id;
            console.log('Using sensor:', data[0].sensor_name, selectedSensorId);
        } else {
            showNoSensorMessage();
        }
    } catch (err) {
        console.error('Error loading sensors:', err);
    }
}

function showNoSensorMessage() {
    const notificationBox = document.getElementById('notificationBox');
    if (notificationBox) {
        notificationBox.className = 'notification-box warning show';
        notificationBox.innerHTML = `
            <strong>No Sensor Found</strong><br>
            Please pair your ESP32 sensor to start monitoring.
            Check the Setup Instructions page for guidance.
        `;
    }
}

// ==================== CUSTOM PLANTS (3-STEP PROCESS) ====================

let customPlantStep = 1;
let customPlantData = {};

function goToCustomStep(step) {
    customPlantStep = step;
    document.querySelectorAll('.custom-plant-step').forEach(s => s.classList.remove('active'));
    document.getElementById('customStep' + step).classList.add('active');
}

async function submitPlantName() {
    const name = document.getElementById('customPlantName').value.trim();
    
    if (!name) {
        alert('Please enter a plant name');
        return;
    }
    
    try {
        // Create plant entry in database with minimal data
        const { data, error } = await supabase
            .from('custom_plants')
            .insert({
                user_id: currentUser.id,
                name: name,
                min_threshold: 0,
                max_threshold: 100,
                moisture_level: 'Medium'
            })
            .select()
            .single();
        
        if (error) throw error;
        
        customPlantData.id = data.id;
        customPlantData.name = name;
        currentCustomPlantId = data.id;
        
        // Move to step 2
        goToCustomStep(2);
        
    } catch (err) {
        console.error('Error creating plant:', err);
        alert('Failed to create plant: ' + err.message);
    }
}

async function submitPlantThresholds() {
    const min = parseInt(document.getElementById('customPlantMinThreshold').value);
    const max = parseInt(document.getElementById('customPlantMaxThreshold').value);
    
    if (isNaN(min) || isNaN(max)) {
        alert('Please enter valid thresholds');
        return;
    }
    
    if (min >= max) {
        alert('Minimum threshold must be less than maximum threshold');
        return;
    }
    
    if (min < 0 || max > 100) {
        alert('Thresholds must be between 0 and 100');
        return;
    }
    
    try {
        const moistureLevel = min < 35 ? 'Low' : (min < 55 ? 'Medium' : 'High');
        
        // Update plant entry with thresholds
        const { error } = await supabase
            .from('custom_plants')
            .update({
                min_threshold: min,
                max_threshold: max,
                moisture_level: moistureLevel
            })
            .eq('id', currentCustomPlantId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        customPlantData.min = min;
        customPlantData.max = max;
        customPlantData.moistureLevel = moistureLevel;
        
        // Move to step 3
        goToCustomStep(3);
        
    } catch (err) {
        console.error('Error updating thresholds:', err);
        alert('Failed to update thresholds: ' + err.message);
    }
}

async function submitPlantImage() {
    const fileInput = document.getElementById('customPlantImage');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please upload a plant image');
        return;
    }
    
    try {
        // Upload image to Supabase Storage with unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentCustomPlantId}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('plant-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from('plant-images')
            .getPublicUrl(filePath);
        
        const imageUrl = urlData.publicUrl;
        
        // Update plant entry with image URL
        const { error: updateError } = await supabase
            .from('custom_plants')
            .update({
                image_url: imageUrl
            })
            .eq('id', currentCustomPlantId)
            .eq('user_id', currentUser.id);
        
        if (updateError) throw updateError;
        
        // Add to local plants database
        const plant = {
            name: customPlantData.name,
            rarity: 'Custom',
            moisture: customPlantData.moistureLevel,
            threshold: { min: customPlantData.min, max: customPlantData.max },
            image: imageUrl,
            dbId: currentCustomPlantId
        };
        
        PLANTS_DATABASE.push(plant);
        selectPlant(plant);
        populatePlants();
        
        // Reset form and close panel
        resetCustomPlantForm();
        closePlantPanel();
        
        alert('Plant added successfully!');
        
    } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image: ' + err.message);
    }
}

function resetCustomPlantForm() {
    customPlantStep = 1;
    customPlantData = {};
    currentCustomPlantId = null;
    
    document.getElementById('customPlantName').value = '';
    document.getElementById('customPlantMinThreshold').value = '';
    document.getElementById('customPlantMaxThreshold').value = '';
    document.getElementById('customPlantImage').value = '';
    const previewElem = document.getElementById('customImagePreview');
    if (previewElem) previewElem.style.display = 'none';
    
    goToCustomStep(1);
}

async function loadUserPlants() {
    try {
        const { data, error } = await supabase
            .from('custom_plants')
            .select('*')
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            data.forEach(plant => {
                const customPlant = {
                    name: plant.name,
                    rarity: 'Custom',
                    moisture: plant.moisture_level,
                    threshold: {
                        min: plant.min_threshold,
                        max: plant.max_threshold
                    },
                    image: plant.image_url,
                    dbId: plant.id
                };
                
                const exists = PLANTS_DATABASE.find(p => p.dbId === plant.id);
                if (!exists) {
                    PLANTS_DATABASE.push(customPlant);
                }
            });
        }
        
        populatePlants();
    } catch (err) {
        console.error('Error loading custom plants:', err);
    }
}

async function deletePlant(plantName) {
    if (!confirm(`Delete "${plantName}"?`)) return;
    
    const plant = PLANTS_DATABASE.find(p => p.name === plantName && p.rarity === 'Custom');
    if (!plant || !plant.dbId) return;
    
    try {
        // Delete from database
        const { error } = await supabase
            .from('custom_plants')
            .delete()
            .eq('id', plant.dbId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        // Delete image from storage if exists
        if (plant.image) {
            const fileName = plant.image.split('/').pop();
            await supabase.storage
                .from('plant-images')
                .remove([fileName]);
        }
        
        // Remove from local array
        const idx = PLANTS_DATABASE.findIndex(p => p.dbId === plant.dbId);
        if (idx > -1) {
            PLANTS_DATABASE.splice(idx, 1);
        }
        
        // Clear selected plant if it was deleted
        if (settings.selectedPlant?.name === plantName) {
            settings.selectedPlant = null;
            await saveUserSettings();
            const plantInfoEl = document.getElementById('plantInfo');
            if (plantInfoEl) plantInfoEl.style.display = 'none';
            const card = document.getElementById('currentReadingCard');
            if (card) {
                card.style.backgroundImage = '';
                card.style.background = 'var(--accent-gradient)';
            }
        }
        
        populatePlants();
    } catch (err) {
        console.error('Error deleting plant:', err);
        alert('Failed to delete plant: ' + err.message);
    }
}

// ==================== DATA LOADING (USER-SPECIFIC) ====================

async function loadHistoricalData() {
    if (!selectedSensorId) {
        console.log('No sensor selected');
        return;
    }
    
    try {
        updateConnectionStatus('connecting');
        
        await loadTimeRangeData(1, hourData);
        updateChart(hourChart, hourData);
        
        await loadTimeRangeData(24, dayData);
        updateChart(dayChart, dayData);
        
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
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 7);
        
        const result = await supabase
            .from('moisture_avg_day')
            .select('bucket_start, avg_value')
            .eq('user_id', currentUser.id)
            .eq('sensor_id', selectedSensorId)
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
        const result = await supabase
            .from('moisture_avg_hour')
            .select('bucket_start, avg_value')
            .eq('user_id', currentUser.id)
            .eq('sensor_id', selectedSensorId)
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
        const result = await supabase
            .from('moisture_avg_5min')
            .select('bucket_start, avg_value')
            .eq('user_id', currentUser.id)
            .eq('sensor_id', selectedSensorId)
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
    
    const { data: latestData } = await supabase
        .from(CONFIG.TABLE_NAME)
        .select('value, created_at')
        .eq('user_id', currentUser.id)
        .eq('sensor_id', selectedSensorId)
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (latestData && latestData.length > 0) {
        const latest = latestData[0];
        currentRawValue = latest.value;
        updateCurrentValue(rawToPercentage(latest.value), new Date(latest.created_at));
    }
}

function setupRealtimeSubscription() {
    if (!selectedSensorId) return;
    
    realtimeSubscription = supabase
        .channel('moisture_changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: CONFIG.TABLE_NAME,
            filter: `sensor_id=eq.${selectedSensorId}`
        }, (payload) => handleNewReading(payload.new))
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') updateConnectionStatus('connected');
        });
}

function startLiveDataFetch() {
    if (!selectedSensorId) return;
    
    liveDataInterval = setInterval(async () => {
        try {
            const { data } = await supabase
                .from(CONFIG.TABLE_NAME)
                .select('value, created_at')
                .eq('user_id', currentUser.id)
                .eq('sensor_id', selectedSensorId)
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

function handleNewReading(reading) {
    const time = new Date(reading.created_at);
    const pct = rawToPercentage(reading.value);
    
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
    
    if (pct < threshold.min) {
        currentState = 'too-dry';
    } else if (pct > threshold.max) {
        currentState = 'too-wet';
    }
    
    if (currentState !== lastThresholdState) {
        if (currentState === 'too-dry') {
            showNotification(`${name} needs water!`, `Moisture at ${pct}%, below ${threshold.min}%`, 'danger');
        } else if (currentState === 'too-wet') {
            showNotification(`${name} is too wet!`, `Moisture at ${pct}%, above ${threshold.max}%`, 'warning');
        } else if (lastThresholdState !== 'normal') {
            showNotification(`${name} moisture is good!`, `Back to normal at ${pct}%`, 'success');
        }
        
        lastThresholdState = currentState;
    }
}

function showNotification(title, msg, type = 'warning') {
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
    
    showCustomNotification(title, msg, type);
}

function showCustomNotification(title, msg, type) {
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
    
    const iconEl = modal.querySelector('.notification-icon');
    const titleEl = modal.querySelector('.notification-title');
    const messageEl = modal.querySelector('.notification-message');
    const content = modal.querySelector('.notification-modal-content');
    
    content.className = 'notification-modal-content';
    content.classList.add(type);
    
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
    
    modal.classList.add('show');
    
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

// Theme
function toggleTheme() {
    const themeElem = document.getElementById('themeToggle');
    if (themeElem) settings.theme = themeElem.value;
    saveUserSettings();
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
        if (chart && chart.options && chart.options.scales) {
            if (chart.options.scales.x) {
                if (!chart.options.scales.x.ticks) chart.options.scales.x.ticks = {};
                chart.options.scales.x.ticks.color = textColor;
                if (!chart.options.scales.x.grid) chart.options.scales.x.grid = {};
                chart.options.scales.x.grid.color = gridColor;
            }
            if (chart.options.scales.y) {
                if (!chart.options.scales.y.ticks) chart.options.scales.y.ticks = {};
                chart.options.scales.y.ticks.color = textColor;
                if (!chart.options.scales.y.grid) chart.options.scales.y.grid = {};
                chart.options.scales.y.grid.color = gridColor;
            }
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
    const overlay = document.getElementById('menuOverlay');
    if (overlay) overlay.classList.add('active');
}
function closeMenu() {
    const overlay = document.getElementById('menuOverlay');
    if (overlay) overlay.classList.remove('active');
}
function handleMenuOverlayClick(event) {
    if (event.target.id === 'menuOverlay') {
        closeMenu();
    }
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
    if (event && event.target) event.target.classList.add('active');

    populatePlants();
}
function selectPlant(plant) {
    settings.selectedPlant = plant;
    saveUserSettings();
    displaySelectedPlant(plant);
    closePlantPanel();
}
function displaySelectedPlant(plant) {
    const card = document.getElementById('currentReadingCard');
    if (card) {
        card.style.backgroundImage = `linear-gradient(135deg, rgba(95, 171, 149, 0.9) 0%, rgba(126, 200, 180, 0.9) 100%), url('${plant.image}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    }
    const plantInfoEl = document.getElementById('plantInfo');
    if (plantInfoEl) plantInfoEl.style.display = 'block';
    const nameEl = document.getElementById('plantName');
    if (nameEl) nameEl.textContent = plant.name;
    const thresholdEl = document.getElementById('plantThreshold');
    if (thresholdEl) thresholdEl.textContent = `Ideal: ${plant.threshold.min}% - ${plant.threshold.max}%`;
}
function openPlantPanel() {
    const panel = document.getElementById('plantPanel');
    if (panel) panel.classList.add('active');
}
function closePlantPanel() {
    const panel = document.getElementById('plantPanel');
    if (panel) panel.classList.remove('active');
}
function handlePanelClick(event) {
    if (event.target.id === 'plantPanel') {
        closePlantPanel();
    }
}
function switchTab(tab) {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    const tabElem = document.getElementById(tab + 'Tab');
    if (tabElem) tabElem.classList.add('active');

    if (tab === 'browse') {
        currentFilter = 'all';
        document.querySelectorAll('.filter-bubble').forEach(btn => btn.classList.remove('active'));
        const allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        populatePlants();
    } else if (tab === 'custom') {
        resetCustomPlantForm();
    }
}
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('customImagePreview');
        if (preview) {
            preview.src = event.target.result;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

// Calibration
function startCalibration() {
    const modal = document.getElementById('calibrationModal');
    if (modal) modal.style.display = 'flex';
    document.querySelectorAll('.calibration-step').forEach(s => s.classList.remove('active'));
    const step1 = document.getElementById('calibrationStep1');
    if (step1) step1.classList.add('active');
    const interval = setInterval(() => {
        const dryEl = document.getElementById('dryReading');
        const wetEl = document.getElementById('wetReading');
        if (dryEl) dryEl.textContent = currentRawValue;
        if (wetEl) wetEl.textContent = currentRawValue;
    }, 500);

    if (modal) modal.dataset.interval = interval;
}
function calibrateDry() {
    settings.calibration.dry = currentRawValue;
    const finalDry = document.getElementById('finalDry');
    if (finalDry) finalDry.textContent = currentRawValue;
    const step1 = document.getElementById('calibrationStep1');
    const step2 = document.getElementById('calibrationStep2');
    if (step1) step1.classList.remove('active');
    if (step2) step2.classList.add('active');
}
function calibrateWet() {
    settings.calibration.wet = currentRawValue;
    const finalWet = document.getElementById('finalWet');
    if (finalWet) finalWet.textContent = currentRawValue;
    saveUserSettings();
    const step2 = document.getElementById('calibrationStep2');
    const step3 = document.getElementById('calibrationStep3');
    if (step2) step2.classList.remove('active');
    if (step3) step3.classList.add('active');
}
function closeCalibration() {
    const modal = document.getElementById('calibrationModal');
    if (modal) {
        const interval = modal.dataset.interval;
        if (interval) clearInterval(parseInt(interval));
        modal.style.display = 'none';
    }
}

// Conversion
function rawToPercentage(raw) {
    const { dry, wet } = settings.calibration;
    const pct = ((dry - raw) / (dry - wet)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
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

    const hourCtx = document.getElementById('hourChart');
    const dayCtx = document.getElementById('dayChart');
    const weekCtx = document.getElementById('weekChart');

    if (hourCtx && hourCtx.getContext) hourChart = new Chart(hourCtx.getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
    if (dayCtx && dayCtx.getContext) dayChart = new Chart(dayCtx.getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
    if (weekCtx && weekCtx.getContext) weekChart = new Chart(weekCtx.getContext('2d'), JSON.parse(JSON.stringify(chartConfig)));
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
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (settings.theme === 'auto') applyTheme();
    });
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (realtimeSubscription && supabase && typeof supabase.removeChannel === 'function') {
        try { supabase.removeChannel(realtimeSubscription); } catch (e) { /* ignore */ }
    }
    if (liveDataInterval) clearInterval(liveDataInterval);
});
