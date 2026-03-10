const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const taskListEl = document.getElementById('task-list');
const terminalOutput = document.getElementById('terminal-output');

const loginBtn = document.getElementById('login-btn');
const fetchDataBtn = document.getElementById('fetch-data-btn');
const toggleRunnerBtn = document.getElementById('toggle-runner-btn');
const liveRunnerPanel = document.getElementById('live-runner-panel');

toggleRunnerBtn.addEventListener('click', () => {
    liveRunnerPanel.classList.toggle('collapsed');
    toggleRunnerBtn.classList.toggle('rotated');
});

const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
};

const logToTerminal = (message, type = 'system') => {
    const p = document.createElement('p');
    p.className = `log-entry ${type}`;
    p.innerHTML = `<span class="timestamp">${getTimestamp()}</span> ${message}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

let globalTaskId = 1;

const addLiveTaskUI = (id, name, isPending = false) => {
    const tr = document.createElement('div');
    tr.className = `task-item ${isPending ? 'pending' : 'active'}`;
    tr.id = `live-task-${id}`;

    tr.innerHTML = `
        <div class="task-info">
            <span class="task-number">#${id}</span>
            <span class="task-name">${name}</span>
        </div>
        <div class="task-status-container">
            <span class="task-status">${isPending ? 'Pending' : 'Running...'}</span>
            <div class="task-spinner" style="${isPending ? 'display:none;' : ''}"></div>
        </div>
    `;

    taskListEl.prepend(tr);
};

const updateLiveTaskUI = (id, statusClass, statusText) => {
    const el = document.getElementById(`live-task-${id}`);
    if (!el) return;

    el.classList.remove('active', 'done', 'failed', 'pending');
    el.classList.add(statusClass);

    const statusSpan = el.querySelector('.task-status');
    if (statusSpan) statusSpan.textContent = statusText;

    const spinner = el.querySelector('.task-spinner');
    if (spinner) {
        spinner.style.display = statusClass === 'active' ? 'block' : 'none';
    }
};

const executeSimulatedTask = (name, delayMs, shouldFail = false) => {
    const id = globalTaskId++;
    addLiveTaskUI(id, name, false);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                updateLiveTaskUI(id, 'failed', 'Failed');
                reject(new Error(`Task ${id} (${name}) simulated failure.`));
            } else {
                updateLiveTaskUI(id, 'done', 'Completed');
                resolve(`Result from ${name} (took ${delayMs}ms)`);
            }
        }, delayMs);
    });
};

const notifyPanelOpen = () => {
    if (liveRunnerPanel.classList.contains('collapsed')) {
        toggleRunnerBtn.click();
    }
};

loginBtn.addEventListener('click', () => {
    notifyPanelOpen();
    loginBtn.disabled = true;

    executeSimulatedTask('User Authentication', 1200, false)
        .then(() => executeSimulatedTask('Fetch Permissions', 800, false))
        .then(() => executeSimulatedTask('Initialize Session', 600, false))
        .catch(err => console.error(err))
        .finally(() => { loginBtn.disabled = false; });
});

fetchDataBtn.addEventListener('click', () => {
    notifyPanelOpen();
    fetchDataBtn.disabled = true;

    executeSimulatedTask('Connect to External API', 1000, false)
        .then(() => executeSimulatedTask('Retrieve Dashboard Data', 1500, false))
        .catch(err => console.error(err))
        .finally(() => { fetchDataBtn.disabled = false; });
});

let sequentialTasks = [];

const initializeSequentialTasks = () => {
    sequentialTasks = [
        { name: "Database Startup Initialization", creator: () => executeSimulatedTask("Database Startup", 1200) },
        { name: "Fetch System Configurations", creator: () => executeSimulatedTask("Fetch Configs", 1000) },
        { name: "Process Access Roles", creator: () => executeSimulatedTask("Process Roles", 800) },
        { name: "Start WebSocket Listener", creator: () => executeSimulatedTask("WebSocket Init", 1500, false) }
    ];
};

const runSequentially = async (taskArray) => {
    const results = [];

    for (const taskObj of taskArray) {
        try {
            logToTerminal(`Initiating strict sequence task: ${taskObj.name}...`, 'system');
            const taskResult = await taskObj.creator();
            results.push(taskResult);
            logToTerminal(`Task completed.`, 'success');
        } catch (error) {
            logToTerminal(`Sequence Runner caught an error: ${error.message}`, 'error');
            logToTerminal(`Halting subsequent tasks due to strict sequence failure.`, 'system');
            throw error;
        }
    }

    return results;
};

runBtn.addEventListener('click', async () => {
    notifyPanelOpen();
    runBtn.disabled = true;
    resetBtn.disabled = true;
    terminalOutput.innerHTML = '';
    logToTerminal('Initializing Strict Sequential Task Runner...', 'system');

    initializeSequentialTasks();

    try {
        logToTerminal('Starting strictly ordered execution...', 'system');
        const startTime = Date.now();

        const finalResults = await runSequentially(sequentialTasks);

        const totalTime = Date.now() - startTime;
        logToTerminal(`All tasks completed sequentially in ${totalTime}ms!`, 'success');

        logToTerminal('Aggregated ordered results:', 'system');
        finalResults.forEach((res, index) => {
            logToTerminal(`[${index + 1}] ${res}`, 'result');
        });

    } catch (e) {
        logToTerminal('Execution aborted before completing all tasks.', 'warning');
    } finally {
        runBtn.innerHTML = '<span class="btn-text">Run Again</span><span class="btn-icon">↺</span>';
        runBtn.disabled = false;
        resetBtn.disabled = false;
    }
});

resetBtn.addEventListener('click', () => {
    terminalOutput.innerHTML = '<p class="log-entry system">System ready. Waiting for execution...</p>';
    runBtn.innerHTML = '<span class="btn-text">Run Tasks Sequentially</span><span class="btn-icon">▶</span>';
    resetBtn.disabled = true;
    taskListEl.innerHTML = '';
    globalTaskId = 1;
});
