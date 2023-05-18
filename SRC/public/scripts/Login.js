
function togglePasswordVisibility(passwordId, toggleId) {
    const passwordElement = document.querySelector(passwordId);
    const togglePasswordElement = document.querySelector(toggleId);
  
    togglePasswordElement.addEventListener('click', function () {
        const type = passwordElement.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordElement.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    togglePasswordVisibility('#password', '#togglePassword')
  });