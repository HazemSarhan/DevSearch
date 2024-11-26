document.addEventListener('DOMContentLoaded', () => {
  const addProjectForm = document.getElementById('add-project-form');
  const skillsSelect = document.getElementById('skills');
  const userSelect = document.getElementById('userId');

  // Fetch skills from the API
  fetch('http://localhost:3000/api/v1/skills')
    .then((response) => response.json())
    .then((data) => {
      if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach((skill) => {
          const option = document.createElement('option');
          option.value = skill.id; // Use skill ID as the value
          option.textContent = skill.name; // Display skill name
          skillsSelect.appendChild(option);
        });
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching skills:', error);
    });

  // Fetch users from the API
  fetch('http://localhost:3000/api/v1/users')
    .then((response) => response.json())
    .then((data) => {
      if (data.users && Array.isArray(data.users)) {
        data.users.forEach((user) => {
          const option = document.createElement('option');
          option.value = user.id; // Use user ID as the value
          option.textContent = user.name; // Display user name
          userSelect.appendChild(option);
        });
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });

  // Handle form submission
  addProjectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addProjectForm);

    fetch('http://localhost:3000/api/v1/projects', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.project) {
          alert('Project added successfully!');
          window.location.href = '/projects.html'; // Redirect to projects page
        } else {
          alert('Error adding project. Please try again.');
          console.error('Error response:', data);
        }
      })
      .catch((error) => {
        console.error('Error during project creation:', error);
        alert('Error adding project. Please try again.');
      });
  });
});
