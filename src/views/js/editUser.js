document.addEventListener('DOMContentLoaded', () => {
  const userId = new URLSearchParams(window.location.search).get('id');
  const editUserForm = document.getElementById('edit-user-form');

  // Fetch and populate user data
  fetch(`http://localhost:3000/api/v1/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('bio').value = user.bio || '';
      document.getElementById('role').value = user.role || 'USER';
      document.getElementById('devRole').value =
        user.devRole || 'FULLSTACK_DEVELOPER';
    })
    .catch((error) => console.error('Error fetching user data:', error));

  // Handle form submission
  editUserForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(editUserForm);

    fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      method: 'PATCH', // Match the method used in the controller
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update user.');
        }
        return response.json();
      })
      .then((data) => {
        alert('User updated successfully.');
        window.location.href = 'users.html'; // Redirect to the users page
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        alert('Error updating user. Please try again.');
      });
  });
});
