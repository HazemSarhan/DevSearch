document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');
  const addProjectNavItem = document.getElementById('addProjectNavItem');
  const dashboardNavItem = document.getElementById('dashboardNavItem');

  // Fetch the current user from the backend
  fetch('http://localhost:3000/api/v1/users/current-user', {
    method: 'GET',
    credentials: 'include', // Include cookies with the request
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return response.json();
    })
    .then((data) => {
      if (data.authenticated) {
        // User is authenticated
        const { role } = data.user;

        // Hide login and register buttons
        loginButton.classList.add('d-none');
        registerButton.classList.add('d-none');

        // Show logout button
        logoutButton.classList.remove('d-none');

        // Show "Add Project" link for all authenticated users
        addProjectNavItem.classList.remove('d-none');

        // Show "Dashboard" link only for admin users
        if (role === 'ADMIN') {
          dashboardNavItem.classList.remove('d-none');
        } else {
          // Ensure the dashboard link remains hidden for non-admin users
          dashboardNavItem.classList.add('d-none');
        }
      } else {
        // User is not authenticated
        throw new Error('Not authenticated');
      }
    })
    .catch(() => {
      // User is not authenticated
      loginButton.classList.remove('d-none');
      registerButton.classList.remove('d-none');

      logoutButton.classList.add('d-none');
      addProjectNavItem.classList.add('d-none');
      dashboardNavItem.classList.add('d-none');
    });

  // Logout functionality
  logoutButton.addEventListener('click', () => {
    // Clear the authToken cookie
    document.cookie =
      'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login.html'; // Redirect to login page
  });
});
