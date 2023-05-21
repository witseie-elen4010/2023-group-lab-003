'use strict'


    document.getElementById('accountButton').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('emailForm').style.display = 'block';
      document.getElementById('paswordVerifide').style.display = 'none';
      document.getElementById('paswordNew').style.display = 'none';
      document.getElementById('paswordConf').style.display = 'none';
      document.getElementById('delete-form').style.display = 'none';
    });

    document.getElementById('passwordButton').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('emailForm').style.display = 'none';
      document.getElementById('paswordVerifide').style.display = 'block';
      document.getElementById('paswordNew').style.display = 'block';
      document.getElementById('paswordConf').style.display = 'block';
      document.getElementById('delete-form').style.display = 'none';

    });

    document.getElementById('DeleteAccount').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('delete-form').style.display = 'block';
      document.getElementById('emailForm').style.display = 'none';
      document.getElementById('paswordVerifide').style.display = 'none';
      document.getElementById('paswordNew').style.display = 'none';
      document.getElementById('paswordConf').style.display = 'none';
    });

    document.getElementById('deleteButton').addEventListener('click', (event) => {
      if (window.confirm('Are you sure you want to delete your account?')) {
        document.getElementById('delete').submit();
      } else {
        event.preventDefault();
      }
    });
    