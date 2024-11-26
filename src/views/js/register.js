const skillsDropdown = document.getElementById('skills');
const successToast = new bootstrap.Toast(
  document.getElementById('successToast'),
);
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

// Fetch skills from the server and populate the dropdown
fetch('http://localhost:3000/api/v1/skills')
  .then((response) => response.json())
  .then((data) => {
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach((skill) => {
        const option = document.createElement('option');
        option.value = skill.name;
        option.textContent = skill.name;
        skillsDropdown.appendChild(option);
      });
    } else {
      console.error('Unexpected response format:', data);
    }
  })
  .catch((error) => console.error('Error fetching skills:', error));

// Handle form submission
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);

  fetch('http://localhost:3000/api/v1/auth/register', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Registration successful:', data);

      // Show success toast
      successToast.show();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 2000);
    })
    .catch((error) => {
      console.error('Error during registration:', error);

      // Show error toast
      errorToast.show();
    });
});
