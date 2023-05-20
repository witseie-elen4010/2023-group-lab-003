'use strict'

document.getElementById('DeleteAccount').addEventListener('click', () => {
  if (window.confirm('Are you sure you want to delete your account?')) {
    window.location.replace("/goodbye")
  }
})

document.getElementById('accountButton').addEventListener('click', () => {
  loadContent('/account')
})

document.getElementById('passwordButton').addEventListener('click', () => {
  loadContent('password')
})

async function loadContent (filePath) {
  const response = await fetch(filePath)
  const content = await response.text()
  document.getElementById('contentContainer').innerHTML = content
}

//Trying to import this function from signup does not work, need to investigate
 function validateEmail(emailField, emailError) {
            if (!emailField.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
              emailError.innerHTML = 'Please enter a valid email';
              return false;
            }
            emailError.innerHTML = '';
            return true;
        }
        
        function validateEmailWrapper() {
            const emailField = document.getElementById('email-field');
            const emailError = document.getElementById('email-error');
            validateEmail(emailField, emailError);
        }




//