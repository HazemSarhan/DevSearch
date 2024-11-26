document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id'); // Get project ID from URL query string

  // Select DOM elements
  const projectTitle = document.querySelector('.project-title');
  const projectOwner = document.querySelector('.project-owner');
  const projectImage = document.querySelector('.project img');
  const projectDescription = document.querySelector('.project-description');
  const projectSkillsContainer = document.querySelector('.skills');
  const reviewsContainer = document.querySelector('.reviews');

  if (!projectId) {
    console.error('No project ID found in URL');
    if (projectDescription) {
      projectDescription.textContent = 'No project ID provided in the URL.';
    }
    return;
  }

  try {
    // Fetch project details
    const response = await fetch(
      `http://localhost:3000/api/v1/projects/${projectId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch project details');
    }

    const { project } = await response.json();

    // Check if project exists
    if (!project) {
      if (projectDescription) {
        projectDescription.textContent = 'Project not found.';
      }
      return;
    }

    // Update project information
    projectTitle.textContent = project.name || 'Unknown Project';
    projectOwner.textContent = project.user?.name || 'Unknown User';
    projectOwner.href = `/user-profile.html?id=${project.user?.id || '#'}`;
    projectImage.src = project.image || '/imgs/default_project_image.jpg';
    projectDescription.textContent =
      project.description || 'No description available.';

    // Populate skills
    projectSkillsContainer.innerHTML = (project.skills || [])
      .map(
        (skill) =>
          `<span class="badge btn-main px-3 py-2">${skill.name}</span>`,
      )
      .join('');

    // Update reviews
    const reviews = project.reviews || [];
    reviewsContainer.innerHTML = reviews.length
      ? reviews
          .map(
            (review) => `
              <div class="card my-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <h5 class="card-title">
                      Review by <a href="/user-profile.html?id=${
                        review.user.id
                      }" class="text-decoration-none">${review.user.name}</a>
                    </h5>
                    <div class="icon">
                      ${review.rating.toFixed(1)}
                      <i class="fa-solid fa-star text-warning"></i>
                    </div>
                  </div>
                  <p class="card-text">${
                    review.comment || 'No comment provided.'
                  }</p>
                </div>
              </div>
            `,
          )
          .join('')
      : '<p class="text-muted">No reviews available for this project.</p>';

    // Add average rating if reviews exist
    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;
      reviewsContainer.innerHTML += `
        <div class="card text-center w-50 m-auto mt-4 p-5">
          <div class="card-body">
            <h5 class="card-title">Average Rating ${averageRating.toFixed(
              1,
            )}</h5>
            <div class="icon">
              ${[...Array(5)]
                .map((_, i) => {
                  if (i < Math.round(averageRating)) {
                    return '<i class="fa-solid fa-star text-warning"></i>';
                  }
                  return '<i class="fa-regular fa-star"></i>';
                })
                .join('')}
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    if (projectDescription) {
      projectDescription.textContent = 'Unable to load project details.';
    }
  }
});
