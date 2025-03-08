const taskbar = document.querySelector('.taskbar');
const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height'));

let windows = {}; // Stores window states by ID

function openWindow(windowId, iconSrc) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    if (!windows[windowId]) {
        windows[windowId] = {
            isOpen: false,
            isMaximized: false,
            taskbarItem: null,
            previousStyles: {}
        };
    }

    const windowState = windows[windowId];

    if (!windowState.isOpen) {
        windowElement.style.display = 'block';
        fitWindow(windowId);

        // Ensure taskbar icon exists
        if (!windowState.taskbarItem || !document.body.contains(windowState.taskbarItem)) {
            const taskbarItem = document.createElement('div');
            taskbarItem.classList.add('taskbar-item');
            taskbarItem.innerHTML = `<img src="${iconSrc}" alt="${windowId} Icon" class="taskbar-icon-img" />`;

            taskbarItem.addEventListener('click', () => {
                if (windowElement.style.display === 'none') {
                    windowElement.style.display = 'block';
                } else {
                    windowElement.style.display = 'none';
                }
            });

            taskbar.appendChild(taskbarItem);
            windowState.taskbarItem = taskbarItem;
        }

        windowState.isOpen = true;
    }
}

function fitWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    windowElement.style.width = 'var(--window-width)';
    windowElement.style.height = `calc(100vh - ${taskbarHeight + 20}px)`;
    windowElement.style.top = `${taskbarHeight + 10}px`;
    windowElement.style.left = '50%';
    windowElement.style.transform = 'translate(-50%, 0)';
}

function maximizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    const windowState = windows[windowId];
    if (!windowState) return;

    if (!windowState.isMaximized) {
        windowState.previousStyles = {
            width: windowElement.style.width,
            height: windowElement.style.height,
            top: windowElement.style.top,
            left: windowElement.style.left,
            transform: windowElement.style.transform,
            boxShadow: windowElement.style.boxShadow
        };

        const taskbarRect = taskbar.getBoundingClientRect();
        const availableHeight = taskbarRect.top;

        windowElement.style.width = '100vw';
        windowElement.style.height = `${availableHeight}px`;
        windowElement.style.top = '0';
        windowElement.style.left = '0';
        windowElement.style.transform = 'none';
        windowElement.style.boxShadow = 'none';

        windowState.isMaximized = true;
    } else {
        Object.assign(windowElement.style, windowState.previousStyles);
        windowState.isMaximized = false;
    }
}

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.style.display = 'none';
    }
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    windowElement.style.display = 'none';
    if (windows[windowId]) {
        windows[windowId].isOpen = false;

        // Remove taskbar icon when closed
        if (windows[windowId].taskbarItem && taskbar.contains(windows[windowId].taskbarItem)) {
            taskbar.removeChild(windows[windowId].taskbarItem);
            windows[windowId].taskbarItem = null;
        }
    }
}

// Dragging logic
document.addEventListener('mousedown', (event) => {
    const header = event.target.closest('.window-header');
    if (!header || event.target.closest('.minimize-btn, .maximize-btn, .close-btn')) return;

    const windowElement = header.parentElement;
    const windowId = windowElement.id;
    if (!windowElement || windows[windowId]?.isMaximized) return;

    let offsetX = event.clientX - windowElement.getBoundingClientRect().left;
    let offsetY = event.clientY - windowElement.getBoundingClientRect().top;

    function drag(event) {
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const taskbarRect = taskbar.getBoundingClientRect();
        const windowRect = windowElement.getBoundingClientRect();

        if (newX < 0) newX = 0;
        if (newX + windowRect.width > screenWidth) newX = screenWidth - windowRect.width;
        if (newY < 0) newY = 0;
        if (newY + windowRect.height > taskbarRect.top) newY = taskbarRect.top - windowRect.height;

        windowElement.style.left = `${newX}px`;
        windowElement.style.top = `${newY}px`;
        windowElement.style.transform = 'none';
    }

    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
});

document.getElementById('resumeIcon').addEventListener('click', () => {
    openWindow('resumeWindow', 'static/images/pdf.svg');
});

document.getElementById('minimizeBtn').addEventListener('click', () => minimizeWindow('resumeWindow'));
document.getElementById('maximizeBtn').addEventListener('click', () => maximizeWindow('resumeWindow'));
document.getElementById('closeBtn').addEventListener('click', () => closeWindow('resumeWindow'));