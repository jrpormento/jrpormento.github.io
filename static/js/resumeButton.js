const resumeIcon = document.getElementById('resumeIcon');
const taskbar = document.querySelector('.taskbar');
const resumeWindow = document.getElementById('resumeWindow');
const pdfViewer = document.getElementById('pdfViewer');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');

let isWindowOpen = false;
let isWindowMaximized = false;
let taskbarItem = null;

function openResumeWindow() {
    if (!isWindowOpen) {
        resumeWindow.style.display = 'block';

        // Create a taskbar item for the opened window
        taskbarItem = document.createElement('div');
        taskbarItem.classList.add('taskbar-item');
        taskbarItem.innerHTML = `
            <img src="static/images/pdf.svg" alt="Resume Icon" class="taskbar-icon-img" />
        `;

        // When the taskbar item is clicked, toggle the visibility of the window
        taskbarItem.addEventListener('click', () => {
            if (resumeWindow.style.display === 'none') {
                resumeWindow.style.display = 'block';
            } else {
                resumeWindow.style.display = 'none';
            }
        });

        // Append the taskbar item to the taskbar
        taskbar.appendChild(taskbarItem);

        isWindowOpen = true;
    }
}

resumeIcon.addEventListener('click', openResumeWindow);

//Autofit to window size
window.addEventListener('resize', () => {
    pdfViewer.style.height = `${resumeWindow.clientHeight - 40}px`;
});

minimizeBtn.addEventListener('click', () => {
    resumeWindow.style.display = 'none';
});

maximizeBtn.addEventListener('click', () => {
    if (isWindowMaximized) {
        resumeWindow.style.width = '80%';
        resumeWindow.style.height = '80%';
        resumeWindow.style.top = '50%';
        resumeWindow.style.left = '50%';
        resumeWindow.style.transform = 'translate(-50%, -50%)';
        isWindowMaximized = false;
    } else {
        resumeWindow.style.width = '100%';
        resumeWindow.style.height = '100%';
        resumeWindow.style.top = '0';
        resumeWindow.style.left = '0';
        resumeWindow.style.transform = 'none';
        isWindowMaximized = true;
    }
});

closeBtn.addEventListener('click', () => {
    resumeWindow.style.display = 'none';

    // Remove the taskbar icon
    if (taskbarItem) {
        taskbar.removeChild(taskbarItem);
    }

    // Reset the state
    isWindowMaximized = false;
    isWindowOpen = false;
});
