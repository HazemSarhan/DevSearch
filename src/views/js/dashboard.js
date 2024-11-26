document.addEventListener('DOMContentLoaded', () => {
  const totalUsersElement = document.getElementById('totalUsers');
  const totalProjectsElement = document.getElementById('totalProjects');
  const latestUsersTableBody = document.getElementById('latestUsersTableBody');
  const projectsContainer = document.getElementById('projectsContainer');

  // Helper function to create project cards
  const createProjectCard = (project) => {
    return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-lg rounded-3">
          <div class="image">
            <img class="img-fluid" src="${
              project.image || '/imgs/default_project_image.jpg'
            }" alt="${
      project.name
    }" onerror="this.onerror=null; this.src='/imgs/default_project_image.jpg';" />
          </div>
          <div class="card-body mt-3">
            <a href="single-project.html?id=${
              project.id
            }" class="card-title fw-bold fs-4">
              ${project.name}
            </a>
            <p class="text-muted">
              By <a class="text-decoration-none" href="#">${
                project.user?.name || 'Unknown'
              }</a>
            </p>
            <div class="skills">
              ${project.skills
                .map(
                  (skill) =>
                    `<span class="badge btn-main">${skill.name}</span>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Fetch and display dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('http://localhost:3000/api/v1/users');
      const usersData = await usersResponse.json();
      const users = usersData?.users || [];
      totalUsersElement.textContent = users.length;

      latestUsersTableBody.innerHTML = users
        .map(
          (user, index) => `
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${user.name || 'N/A'}</td>
              <td>${user.email || 'N/A'}</td>
              <td>${user.role || 'N/A'}</td>
            </tr>
          `,
        )
        .join('');

      // Fetch projects
      const projectsResponse = await fetch(
        'http://localhost:3000/api/v1/projects',
      );
      const projectsData = await projectsResponse.json();
      const projects = projectsData?.projects || [];
      totalProjectsElement.textContent = projects.length;
      console.log(projectsData);

      projectsContainer.innerHTML = projects.map(createProjectCard).join('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  fetchDashboardData();
});
