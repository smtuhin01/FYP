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
      
      // Get form values 
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Basic validation
      if (!name || !email || !password) {
        showAlert('Please fill in all required fields', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
      }

      // Password strength validation
      if (password.length < 8) {
        showAlert('Password must be at least 8 characters long', 'error');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          showAlert('Registration successful! Redirecting to login...', 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
        } else {
          throw new Error(data.message || 'Registration failed');
        }

      } catch (error) {
        console.error('Signup error:', error);
        showAlert(error.message || 'Registration failed. Please try again.', 'error');
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

// Helper function for showing alerts
function showAlert(message, type) {
  const alertMessage = document.getElementById('alertMessage');
  if (alertMessage) {
    alertMessage.textContent = message;
    alertMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    
    if (type === 'error') {
      alertMessage.classList.add('bg-red-100', 'text-red-700');
    } else {
      alertMessage.classList.add('bg-green-100', 'text-green-700');
    }

    // Hide alert after 5 seconds
    setTimeout(() => {
      alertMessage.classList.add('hidden');
    }, 5000);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
