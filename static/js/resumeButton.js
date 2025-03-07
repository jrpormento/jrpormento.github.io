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
let previousStyles = {};

const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height'));
const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));

function openResumeWindow() {
    if (!isWindowOpen) {
        resumeWindow.style.display = 'block';
        fitResumeWindow();

        if (!taskbarItem) {
            taskbarItem = document.createElement('div');
            taskbarItem.classList.add('taskbar-item');
            taskbarItem.innerHTML = `<img src="static/images/pdf.svg" alt="Resume Icon" class="taskbar-icon-img" />`;

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

resumeIcon.addEventListener('click', openResumeWindow);
window.addEventListener('resize', fitResumeWindow);
minimizeBtn.addEventListener('click', () => resumeWindow.style.display = 'none');
maximizeBtn.addEventListener('click', maximizeResumeWindow);
closeBtn.addEventListener('click', () => { resumeWindow.style.display = 'none'; taskbar.removeChild(taskbarItem); isWindowOpen = false; });