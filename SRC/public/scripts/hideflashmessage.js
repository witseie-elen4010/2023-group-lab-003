
const flashMessages = document.querySelectorAll('.alert');

flashMessages.forEach(function(message) {
  setTimeout(function() {
    message.classList.add('hide');
    setTimeout(function() {
      message.remove();
    }, 300);
  }, 2000);
});
