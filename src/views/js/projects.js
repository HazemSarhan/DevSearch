document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.getElementById('projectsContainer');

  // Fetch projects from the database
  fetch('http://localhost:3000/api/v1/projects')
    .then((response) => response.json())
    .then((projects) => {
      if (Array.isArray(projects)) {
        projects.forEach((project) => {
          const projectCard = document.createElement('div');
          projectCard.className = 'col-md-6 col-lg-4 mb-4';

          projectCard.innerHTML = `
            <div class="card shadow-lg rounded-3">
              <div class="image">
                <img class="img-fluid" src="${project.image}" alt="${
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
                    project.user.name
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
          `;

          projectsContainer.appendChild(projectCard);
        });
      } else {
        console.error('Unexpected response format:', projects);
      }
    })
    .catch((error) => {
      console.error('Error fetching projects:', error);
    });
});
