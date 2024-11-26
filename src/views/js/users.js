document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.getElementById('usersTableBody');
  const totalUsers = document.getElementById('totalUsers');

  // Fetch users from the database
  fetch('http://localhost:3000/api/v1/users')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched data:', data); // Debugging

      const users = data.users || []; // Adjust for `users` array in response

      if (Array.isArray(users)) {
        totalUsers.textContent = users.length;

        // Populate the table
        users.forEach((user, index) => {
          const row = document.createElement('tr');

          row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${user.name || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td>${user.devRole || 'N/A'}</td> <!-- Developer Role -->
            <td>
              <a href="edit-user.html?id=${user.id}">
                <button class="btn btn-primary btn-sm">Edit</button>
              </a>
              <button class="btn btn-danger btn-sm" onclick="deleteUser('${
                user.id
              }')">Delete</button>
            </td>
          `;

          usersTableBody.appendChild(row);
        });
      } else {
        console.error(
          'Unexpected response format. Expected an array of users.',
          users,
        );
      }
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again later.');
    });
});

// Function to delete a user
function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete user.');
        }
        alert('User deleted successfully.');
        window.location.reload(); // Refresh the page to reflect changes
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      });
  }
}
