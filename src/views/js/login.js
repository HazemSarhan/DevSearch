const successToast = new bootstrap.Toast(
  document.getElementById('successToast'),
);
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This ensures cookies are sent
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Login successful:', data);

      // Show success toast
      successToast.show();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    })
    .catch((error) => {
      console.error('Error during login:', error);

      // Show error toast
      errorToast.show();
    });
});
