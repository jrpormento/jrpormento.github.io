const openResumeBtn = document.getElementById('openResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const closeBtn = document.getElementById('closeBtn');

// Opens modal
openResumeBtn.addEventListener('click', function() {
  resumeModal.style.display = 'block';
});

// Closes modal when exit clicked
closeBtn.addEventListener('click', function() {
  resumeModal.style.display = 'none';
});

// Closes modal if content outside modal is clicked
window.addEventListener('click', function(event) {
  if (event.target === resumeModal) {
    resumeModal.style.display = 'none';
  }
});
