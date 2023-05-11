'use strict'

document.getElementById('DeleteAccount').addEventListener('click', () => {
  if (window.confirm('Are you sure you want to delete your account?')) {
    window.location.replace("goodbye.html")
  }
})

document.getElementById('accountButton').addEventListener('click', () => {
  loadContent('account.html')
})

document.getElementById('passwordButton').addEventListener('click', () => {
  loadContent('password.html')
})

async function loadContent (filePath) {
  const response = await fetch(filePath)
  const content = await response.text()
  document.getElementById('contentContainer').innerHTML = content
}
