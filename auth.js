// CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://clluovsscjmlhcbvsgcz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVvdnNzY2ptbGhjYnZzZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI5NTYsImV4cCI6MjA3OTYzODk1Nn0.5MDrr1886qiUCyCLUB2BxLBSviQ-Ehs47-CGJi_95C8'
};

// Initialize Supabase client
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User is already logged in, redirect to main page
        window.location.href = 'index.html';
    }
});

// Switch between tabs
function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else if (tab === 'signup') {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
    
    // Clear alert
    hideAlert();
}

// Show reset password form
function showResetPassword() {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('resetForm').classList.add('active');
    hideAlert();
}

// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const eyeOpen = button.querySelector('.eye-open');
    const eyeClosed = button.querySelector('.eye-closed');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    }
}

// Show alert message
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;
}

// Hide alert message
function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('show');
}

// Create user profile
async function createUserProfile(userId, email, fullName) {
    try {
        const { error } = await supabase
            .from('profiles')
            .insert([{
                id: userId,
                email: email,
                full_name: fullName,
                theme: 'light',
                notifications_enabled: false,
                settings: {}
            }]);
        
        if (error) {
            // If it's a duplicate key error, that's okay - profile already exists
            if (error.code === '23505') {
                console.log('Profile already exists');
                return true;
            }
            throw error;
        }
        
        return true;
    } catch (err) {
        console.error('Error creating profile:', err);
        return false;
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    
    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>Signing In...';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Success - redirect to main page
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Show user-friendly error message
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please verify your email before logging in.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert(errorMessage, 'error');
        
        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
    }
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupPasswordConfirm').value;
    const btn = document.getElementById('signupBtn');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>Creating Account...';
    
    try {
        // Attempt to sign up
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                },
                emailRedirectTo: `${window.location.origin}/index.html`
            }
        });
        
        if (error) throw error;
        
        // Check if this is a duplicate signup attempt
        // Supabase returns a user object even for existing emails but with identities: []
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            // This email is already registered
            showAlert('An account with this email already exists. Please login or use password reset if you forgot your password.', 'error');
            
            // Switch to login form after showing error
            setTimeout(() => {
                switchAuthTab('login');
                document.getElementById('loginEmail').value = email;
            }, 3000);
            
            btn.disabled = false;
            btn.innerHTML = 'Create Account';
            return;
        }
        
        // If user was created, ensure profile exists
        if (data.user) {
            // Wait a moment for trigger to execute
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if profile exists
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();
            
            // If profile doesn't exist, create it manually
            if (!profileData) {
                console.log('Profile not found, creating manually...');
                await createUserProfile(data.user.id, email, name);
            }
        }
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
            showAlert('Account created! Please check your email to verify your account.', 'success');
            
            // Switch to login form after 3 seconds
            setTimeout(() => {
                switchAuthTab('login');
                document.getElementById('loginEmail').value = email;
            }, 3000);
        } else {
            // Auto-login successful (email confirmation disabled)
            showAlert('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Show user-friendly error message
        let errorMessage = 'Signup failed. Please try again.';
        
        if (error.message.includes('User already registered')) {
            errorMessage = 'An account with this email already exists. Please login instead.';
            // Switch to login tab
            setTimeout(() => {
                switchAuthTab('login');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else if (error.message.includes('Password should be at least 6 characters')) {
            errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('already been registered')) {
            errorMessage = 'This email is already registered. Please login or reset your password.';
            setTimeout(() => {
                switchAuthTab('login');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert(errorMessage, 'error');
        
        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
    }
}

// Handle password reset
async function handleResetPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const btn = document.getElementById('resetBtn');
    
    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>Sending...';
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });
        
        if (error) throw error;
        
        showAlert('Password reset link sent! Check your email.', 'success');
        
        // Switch back to login after 3 seconds
        setTimeout(() => {
            switchAuthTab('login');
        }, 3000);
        
    } catch (error) {
        console.error('Reset password error:', error);
        
        let errorMessage = 'Failed to send reset link. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert(errorMessage, 'error');
        
        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = 'Send Reset Link';
    }
}