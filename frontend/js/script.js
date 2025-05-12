document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form'); 
  const API_BASE_URL = 'http://localhost:5001'; 

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'home.html';
      } else {
        alert(data.message || 'Login failed');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Signup failed');
      }
    });
  }

  // Forgot Password Logic
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;

      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message || 'Request failed');
    });
  }

  // Reset Password Logic (new)
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = new URLSearchParams(window.location.search).get('token');  
      const newPassword = document.getElementById('new-password').value;

      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful!');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Password reset failed');
      }
    });
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
