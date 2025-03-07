const resumeIcon = document.getElementById('resumeIcon');
const taskbar = document.querySelector('.taskbar');
const resumeWindow = document.getElementById('resumeWindow');
const pdfViewer = document.getElementById('pdfViewer');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');
const windowHeader = document.querySelector('.window-header');

let isWindowOpen = false;
let isWindowMaximized = false;
let taskbarItem = null;
let previousStyles = {};
let isDragging = false;
let offsetX, offsetY;

const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height'));
const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));

function openResumeWindow() {
    if (!isWindowOpen) {
        resumeWindow.style.display = 'block';
        fitResumeWindow();

        // Ensure taskbar item is recreated if missing
        if (!taskbarItem || !document.body.contains(taskbarItem)) {
            taskbarItem = document.createElement('div');
            taskbarItem.classList.add('taskbar-item');
            taskbarItem.innerHTML = `
                <div class="taskbar-icon-wrapper">
                    <img src="static/images/pdf.svg" alt="Resume Icon" class="taskbar-icon-img" />
                </div>
            `;

            taskbarItem.addEventListener('click', () => {
                resumeWindow.style.display = resumeWindow.style.display === 'none' ? 'block' : 'none';
            });

            taskbar.appendChild(taskbarItem);
        }

        isWindowOpen = true;
    }
}

function fitResumeWindow() {
    resumeWindow.style.width = 'var(--window-width)';
    resumeWindow.style.height = `calc(100vh - ${taskbarHeight + 20}px)`;
    resumeWindow.style.top = `${taskbarHeight + 10}px`;
    resumeWindow.style.left = '50%';
    resumeWindow.style.transform = 'translate(-50%, 0)';

    pdfViewer.style.width = '100%';
    pdfViewer.style.height = '100%';
}

function maximizeResumeWindow() {
    if (!isWindowMaximized) {
        previousStyles = {
            width: resumeWindow.style.width,
            height: resumeWindow.style.height,
            top: resumeWindow.style.top,
            left: resumeWindow.style.left,
            transform: resumeWindow.style.transform,
            boxShadow: resumeWindow.style.boxShadow
        };

        const taskbarRect = taskbar.getBoundingClientRect(); // Get taskbar position
        const availableHeight = taskbarRect.top; // Distance from top of screen to taskbar

        resumeWindow.style.width = '100vw';
        resumeWindow.style.height = `${availableHeight}px`; // Ensures it stops at the taskbar
        resumeWindow.style.top = '0';
        resumeWindow.style.left = '0';
        resumeWindow.style.transform = 'none';
        resumeWindow.style.boxShadow = 'none';

        isWindowMaximized = true;
    } else {
        Object.assign(resumeWindow.style, previousStyles);
        isWindowMaximized = false;
    }
}

// Ensure dragging doesn't occur when clicking minimize, maximize, or close buttons
windowHeader.addEventListener('mousedown', (event) => {
    if (event.target.closest('.minimize-btn, .maximize-btn, .close-btn')) return; // Stops drag if clicking a button

    isDragging = true;

    // Get the initial mouse position relative to the window
    const rect = resumeWindow.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', dragWindow);
    document.addEventListener('mouseup', stopDrag);
});

function dragWindow(event) {
    if (!isDragging || isWindowMaximized) return;

    // Calculate new window position
    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    // Get screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const taskbarRect = taskbar.getBoundingClientRect();
    const windowRect = resumeWindow.getBoundingClientRect();

    // Prevent moving past the left and right screen borders
    if (newX < 0) newX = 0;
    if (newX + windowRect.width > screenWidth) newX = screenWidth - windowRect.width;

    // Prevent moving above the screen
    if (newY < 0) newY = 0;

    // Prevent moving into the taskbar
    if (newY + windowRect.height > taskbarRect.top) newY = taskbarRect.top - windowRect.height;

    // Apply new position
    resumeWindow.style.left = `${newX}px`;
    resumeWindow.style.top = `${newY}px`;
    resumeWindow.style.transform = 'none'; // Remove centering transform
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', dragWindow);
    document.removeEventListener('mouseup', stopDrag);
}

resumeIcon.addEventListener('click', openResumeWindow);
window.addEventListener('resize', fitResumeWindow);
minimizeBtn.addEventListener('click', () => resumeWindow.style.display = 'none');
maximizeBtn.addEventListener('click', maximizeResumeWindow);
closeBtn.addEventListener('click', () => {
    resumeWindow.style.display = 'none';
    isWindowOpen = false;

    // Remove the taskbar icon when closing
    if (taskbarItem && taskbar.contains(taskbarItem)) {
        taskbar.removeChild(taskbarItem);
        taskbarItem = null; // Ensure it's recreated on next open
    }
});