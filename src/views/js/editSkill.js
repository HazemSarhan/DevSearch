document.addEventListener('DOMContentLoaded', () => {
  const skillForm = document.getElementById('edit-skill-form');
  const skillNameInput = document.getElementById('skillName');
  const skillDescriptionInput = document.getElementById('skillDescription');

  // Extract skill ID from query parameters (e.g., edit-skill.html?id=123)
  const urlParams = new URLSearchParams(window.location.search);
  const skillId = urlParams.get('id');

  if (!skillId) {
    alert('No skill ID provided.');
    window.location.href = 'skills.html'; // Redirect to skills page
    return;
  }

  // Fetch current skill details
  fetch(`http://localhost:3000/api/v1/skills/${skillId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        skillNameInput.value = data.name || '';
        skillDescriptionInput.value = data.description || '';
      } else {
        console.error('Skill not found:', data);
        alert('Skill not found.');
        window.location.href = 'skills.html';
      }
    })
    .catch((error) => {
      console.error('Error fetching skill:', error);
      alert('Error fetching skill details.');
      window.location.href = 'skills.html';
    });

  // Handle form submission
  skillForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedSkill = {
      name: skillNameInput.value,
      description: skillDescriptionInput.value || null,
    };

    fetch(`http://localhost:3000/api/v1/skills/${skillId}`, {
      method: 'PATCH', // Corrected to PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSkill),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update skill.');
        }
        return response.json();
      })
      .then((data) => {
        alert('Skill updated successfully!');
        window.location.href = 'skills.html'; // Redirect to skills page
      })
      .catch((error) => {
        console.error('Error updating skill:', error);
        alert('Error updating skill. Please try again.');
      });
  });
});
