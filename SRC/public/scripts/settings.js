'use strict'


    document.getElementById('accountButton').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('emailForm').style.display = 'block';
      document.getElementById('paswordVerifide').style.display = 'none';
      document.getElementById('paswordNew').style.display = 'none';
      document.getElementById('paswordConf').style.display = 'none';
    });

    document.getElementById('passwordButton').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('emailForm').style.display = 'none';
      document.getElementById('paswordVerifide').style.display = 'block';
      document.getElementById('paswordNew').style.display = 'block';
      document.getElementById('paswordConf').style.display = 'block';
    });
