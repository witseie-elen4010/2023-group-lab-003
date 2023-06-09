'use strict'
const { validateEmail } = require('../SRC/public/scripts/signup')
const { validatePassword } = require('../SRC/public/scripts/signup')
const { confirmPassword } = require('../SRC/public/scripts/signup')
const {togglePasswordVisibility} =  require('../SRC/public/scripts/signup')


describe('ValidateEmail', () => {
  test('Should return true for valid email addresses', () => {
    const validEmail = 'john.doe@example.co.za';
    const emailField = { value: validEmail };
    const emailError = { innerHTML: '' };
    const result = validateEmail(emailField, emailError);
    expect(result).toBe(true);
  });

  test('Should return false for invalid email addresses', () => {
    const invalidEmail = 'john.doe@example';
    const emailField = { value: invalidEmail };
    const emailError = { innerHTML: '' };
    const result = validateEmail(emailField, emailError);
    expect(result).toBe(false);
  });
});


describe('ValidatePassword', () => {   
    test('Should return "Your password must contain at least one number"', () => {
      const validPassword = 'ManBat@@'
      const valid = { value: validPassword }
      const passwordErrors = { innerHTML: '' };
      const result = validatePassword(valid, passwordErrors)
      expect(passwordErrors.innerHTML).toEqual('<ul><ul style=\"color: red;\"><li>Your password must contain at least one number.</li></ul>');
    });

    test('Should return "Your password must contain a special character, must contain an uppercase letter"', () => {
      const validPassword = 'darthvader90'
      const valid = { value: validPassword }
      const passwordErrors = { innerHTML: '' };
      const result = validatePassword(valid, passwordErrors)
      expect(passwordErrors.innerHTML).toEqual('<ul><ul style=\"color: red;\"><li>Must contain a special character.</li><li>Must contain an uppercase letter.</li></ul>');
    });;
    

    test('Should return "Your password must contain a special character, ust contain an uppercase letter, Must have 8 or more characters. Must contain a lowercase letter."', () => {
      const validPassword = '1234'
      const valid = { value: validPassword }
      const passwordErrors = { innerHTML: '' };
      const result = validatePassword(valid, passwordErrors)
      expect(passwordErrors.innerHTML).toEqual('<ul><ul style=\"color: red;\"><li>Must contain a special character.</li><li>Must contain an uppercase letter.</li><li>Must have 8 or more characters.</li><li>Must contain a lowercase letter.</li></ul>');
    });
  });

  describe('ConfirmPassword', () => {
    test('Should return true for password confirmation',() =>{
      const value1 = 'Rsep@90Ml'
      const Password = {value : value1}
      const value2 = 'Rsep@90Ml'
      const ConfirmPassword = {value : value2}
      const ErrorMessage = { innerHTML: '' };
      const result = confirmPassword(Password, ConfirmPassword,ErrorMessage)
      expect(result).toBe(true)
    })

    test('Should return false for password confirmation',() =>{
      const value1 = 'PowerOfTheDarkSide'
      const Password = {value: value1}
      const value2 = 'powerofthedarkSIDE'
      const ConfirmPassword = {value : value2}
      const ErrorMessage = { innerHTML: '' };
      const result = confirmPassword(Password, ConfirmPassword,ErrorMessage)
      expect(result).toBe(false)
    })

  })

  
  describe('togglePasswordVisibility', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <input id="password" type="password" />
        <button id="togglePassword" class="fa-eye"></button>
      `;
      togglePasswordVisibility('#password', '#togglePassword')
    });
  
    it('toggles password visibility on click', () => {
      const passwordElement = document.querySelector('#password')
      const togglePasswordElement = document.querySelector('#togglePassword')
      togglePasswordElement.click()
  
      expect(passwordElement.getAttribute('type')).toBe('text')
      expect(togglePasswordElement.classList.contains('fa-eye-slash')).toBe(true)
      togglePasswordElement.click()
  
      expect(passwordElement.getAttribute('type')).toBe('password')
      expect(togglePasswordElement.classList.contains('fa-eye-slash')).toBe(false)
    });
  });

