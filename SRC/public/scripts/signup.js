'use strict'

function validateEmail(emailField, emailError) {
  if (!emailField.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    emailError.innerHTML = 'Please enter a valid email'
    return false;
  }
  emailError.innerHTML = ''
  return true;
}

function validateEmailWrapper(event) {
  const emailField = document.getElementById('email-field');
  const emailError = document.getElementById('email-error');
  return validateEmail(emailField, emailError);
}

function validatePassword(Passwords, PasswordsError) {
  let errorMessage = ''

  if (!Passwords.value.match(/[0-9]/)) {
    errorMessage += '<li>Your password must contain at least one number.</li>'
  }

  if (!Passwords.value.match(/[!\@\#\$\%\^\&\*\(\)\-\_\+\=\~\?\.\,\?\<\>\{\}\\]/)) {
    errorMessage += '<li>Must contain a special character.</li>'
  }

  if (!Passwords.value.match(/[A-Z]/)) {
    errorMessage += '<li>Must contain an uppercase letter.</li>'
  }

  if (Passwords.value.length < 8) {
    errorMessage += '<li>Must have 8 or more characters.</li>'
  }

  if (!Passwords.value.match(/[a-z]/)) {
    errorMessage += '<li>Must contain a lowercase letter.</li>'
  }

  if (errorMessage !== '') {
    PasswordsError.innerHTML = '<ul>' + errorMessage + '</ul>'

    // Gives error "Cannot read properties of undefined (reading 'add')" during testing, the if statement seems to deal with the issue
    if (PasswordsError.classList) {
      PasswordsError.classList.add('error-message');
    }
    return false


  } else {
    PasswordsError.innerHTML = ''
    return true
  }
}

function validatePasswordWrapper(event) {
  const password_error = document.getElementById('password-error')
  const password = document.getElementById('password')
  return validatePassword(password, password_error)
}

function confirmPassword(password1, password2, errormes) {
  if (password1.value !== password2.value) {
    errormes.innerHTML = 'Passwords do not match'
    return false;

  } else {
    errormes.innerHTML = ''
    return true;
  }
}

function confirmPasswordWrapper(event) {
  const password_confirm = document.getElementById('password_confirm')
  const password = document.getElementById('password')
  const password_fail = document.getElementById('password-fail')

  return confirmPassword(password_confirm, password, password_fail)
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const clickedButton = event.submitter;
      if (clickedButton.id === 'SignUpButtonStudent') {
        window.location.href = 'dummy1.html';
      } else if (clickedButton.id === 'loginButtonLectuer') {
        window.location.href = 'dummy2.html';
      }
    })
  }
})



// This is for testing purpose //
module.exports = {
  validateEmail,
  validatePassword,
  confirmPassword,
};

