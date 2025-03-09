const taskbar = document.querySelector('.taskbar');
const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height'));

let windows = {}; // Stores window states by ID
let windowCounts = {}; // Stores numbering per window type

function setupWindowControls(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    const maximizeBtn = windowElement.querySelector('.maximize-btn');
    const closeBtn = windowElement.querySelector('.close-btn');

    minimizeBtn.addEventListener('click', () => minimizeWindow(windowId));
    maximizeBtn.addEventListener('click', () => maximizeWindow(windowId));
    closeBtn.addEventListener('click', () => closeWindow(windowId));

    setupDragFunctionality(windowId);
}

function openWindow(baseId, iconSrc, baseTitle = "resume.pdf") {
    if (!windowCounts[baseId]) {
        windowCounts[baseId] = 1;
    }

    // Generate window title
    let windowTitle = baseTitle;
    if (windowCounts[baseId] > 1) {
        windowTitle = `${baseTitle} (${windowCounts[baseId]})`;
    }
    
    const instanceId = `${baseId}-${Date.now()}`;
    const baseWindow = document.getElementById(baseId);
    if (!baseWindow) return;

    const newWindow = baseWindow.cloneNode(true);
    newWindow.id = instanceId;
    newWindow.style.display = 'block';
    document.body.appendChild(newWindow);

    // Assign window title
    newWindow.dataset.windowTitle = windowTitle;
    
    if (!windows[baseId]) {
        windows[baseId] = {
            instances: [],
            taskbarItem: null
        };
    }

    windows[baseId].instances.push({ id: instanceId, title: windowTitle });
    windowCounts[baseId]++;
    
    fitWindow(instanceId);

    // If no taskbar item exists, create one
    if (!windows[baseId].taskbarItem) {
        const taskbarItem = document.createElement('div');
        taskbarItem.classList.add('taskbar-item');
        taskbarItem.innerHTML = `<img src="${iconSrc}" alt="${baseId} Icon" class="taskbar-icon-img" />`;

        taskbarItem.addEventListener('click', () => {
            if (windows[baseId].instances.length === 1) {
                toggleWindow(windows[baseId].instances[0].id);
            } else {
                showWindowSelectionMenu(baseId, taskbarItem);
            }
        });

        taskbar.appendChild(taskbarItem);
        windows[baseId].taskbarItem = taskbarItem;
    }

    setupWindowControls(instanceId);
}

function showWindowSelectionMenu(baseId, taskbarItem) {
    let menu = document.getElementById(`menu-${baseId}`);
    if (menu) {
        menu.remove();
        document.removeEventListener('click', closeMenuOnClickOutside);
        return;
    }

    menu = document.createElement('div');
    menu.id = `menu-${baseId}`;
    menu.classList.add('window-selection-menu');
    menu.style.position = 'absolute';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '5px';
    menu.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
    menu.style.zIndex = '1000';

    windows[baseId].instances.forEach(({ id, title }) => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('window-selection-item');
        menuItem.textContent = title;
        menuItem.style.padding = '5px 10px';
        menuItem.style.cursor = 'pointer';

        menuItem.addEventListener('click', () => {
            toggleWindow(id);
            menu.remove();
            document.removeEventListener('click', closeMenuOnClickOutside);
        });

        menu.appendChild(menuItem);
    });

    positionMenu(menu, taskbarItem);
    setTimeout(() => {
        document.addEventListener('click', closeMenuOnClickOutside);
    }, 0);
}

function closeMenuOnClickOutside(event) {
    const menus = document.querySelectorAll('.window-selection-menu');
    menus.forEach(menu => {
        if (!menu.contains(event.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    });
}

function positionMenu(menu, taskbarItem) {
    document.body.appendChild(menu); // Append first to get correct size

    requestAnimationFrame(() => { // Wait for rendering
        const rect = taskbarItem.getBoundingClientRect();
        menu.style.left = `${rect.left}px`;
        menu.style.top = `${rect.top - menu.offsetHeight}px`;
    });
}

function toggleWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    windowElement.style.display = windowElement.style.display === 'none' ? 'block' : 'none';
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

    // Extract the base ID (e.g., "resumeWindow" from "resumeWindow-123456789")
    const baseId = windowId.split('-')[0];
    const windowState = windows[baseId]?.instances.find(id => id === windowId);

    if (!windowState) return;

    if (!windowElement.dataset.isMaximized || windowElement.dataset.isMaximized === "false") {
        // Save current window styles before maximizing
        windowElement.dataset.previousStyles = JSON.stringify({
            width: windowElement.style.width,
            height: windowElement.style.height,
            top: windowElement.style.top,
            left: windowElement.style.left,
            transform: windowElement.style.transform,
            boxShadow: windowElement.style.boxShadow
        });

        // Get available screen space (excluding taskbar)
        const taskbarRect = taskbar.getBoundingClientRect();
        const availableHeight = taskbarRect.top;

        // Apply full-screen styles
        windowElement.style.width = '100vw';
        windowElement.style.height = `${availableHeight}px`;
        windowElement.style.top = '0';
        windowElement.style.left = '0';
        windowElement.style.transform = 'none';
        windowElement.style.boxShadow = 'none';

        windowElement.dataset.isMaximized = "true";
    } else {
        // Restore previous window position and size
        const previousStyles = JSON.parse(windowElement.dataset.previousStyles);
        Object.assign(windowElement.style, previousStyles);

        windowElement.dataset.isMaximized = "false";
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

    windowElement.remove();
    const baseId = windowId.split('-')[0];

    if (windows[baseId]) {
        windows[baseId].instances = windows[baseId].instances.filter(instance => instance.id !== windowId);
        
        if (windows[baseId].instances.length === 0) {
            if (windows[baseId].taskbarItem && taskbar.contains(windows[baseId].taskbarItem)) {
                taskbar.removeChild(windows[baseId].taskbarItem);
            }
            delete windows[baseId];
            delete windowCounts[baseId];
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

function updateTaskbarTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes} ${ampm}`;

    document.getElementById("taskbar-time").textContent = timeString;
}

setInterval(updateTaskbarTime, 1000);
updateTaskbarTime();