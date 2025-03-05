// Get elements
const openResumeBtn = document.getElementById('openResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const closeBtn = document.getElementById('closeBtn');

// Open the modal when the button is clicked
openResumeBtn.addEventListener('click', function() {
  resumeModal.style.display = 'block';
});

// Close the modal when the close button (X) is clicked
closeBtn.addEventListener('click', function() {
  resumeModal.style.display = 'none';
});

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', function(event) {
  if (event.target === resumeModal) {
    resumeModal.style.display = 'none';
  }
});
