// DAZED Interaction Script v2 - Glassmorphism & Album Details

document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passcodeInput = document.getElementById('passcode');
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    const navbarLogo = document.getElementById('navbar-logo');
    const glowCursor = document.getElementById('glow-cursor');

    // Live Runner Elements
    const toggleRunnerBtn = document.getElementById('toggle-runner-btn');
    const liveRunnerPanel = document.getElementById('live-runner-panel');
    const liveTaskList = document.getElementById('live-task-list');
    const liveTerminalOutput = document.getElementById('live-terminal-output');
    const runnerStatusText = document.getElementById('runner-status-text');
    const runSeqBtn = document.getElementById('run-seq-btn');

    // --- Live Runner UI Toggle ---
    toggleRunnerBtn.addEventListener('click', () => {
        if (liveRunnerPanel.classList.contains('collapsed')) {
            liveRunnerPanel.classList.remove('collapsed');
            liveRunnerPanel.classList.add('expanded');
            toggleRunnerBtn.textContent = 'HIDE RUNNER';
        } else {
            liveRunnerPanel.classList.remove('expanded');
            liveRunnerPanel.classList.add('collapsed');
            toggleRunnerBtn.textContent = 'SHOW RUNNER';
        }
    });

    // --- Live Runner Promise Engine ---
    const updateTerminal = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString();
        let prefix = '[SYS]';
        if (type === 'success') prefix = '[OK]';
        if (type === 'error') prefix = '[ERR]';
        if (type === 'warn') prefix = '[WARN]';

        liveTerminalOutput.textContent += `${time} ${prefix} ${message}\n`;
        liveTerminalOutput.scrollTop = liveTerminalOutput.scrollHeight;
    };

    const simulateLiveTask = (taskName, duration = 1500, shouldFail = false) => {
        // Expand panel if collapsed when a task starts spontaneously
        if (liveRunnerPanel.classList.contains('collapsed')) {
            toggleRunnerBtn.click();
        }

        runnerStatusText.textContent = "Processing Async Tasks...";
        updateTerminal(`Initializing Task: ${taskName}`, 'info');

        const li = document.createElement('li');
        li.className = 'task-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'task-name gothic-font';
        nameSpan.textContent = taskName;

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'status-badge pending outfit-font';
        badgeSpan.textContent = 'Pending';

        li.appendChild(nameSpan);
        li.appendChild(badgeSpan);
        liveTaskList.appendChild(li);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    badgeSpan.className = 'status-badge rejected outfit-font';
                    badgeSpan.textContent = 'Rejected';
                    updateTerminal(`Task Failed: ${taskName}`, 'error');
                    runnerStatusText.textContent = "Task Execution Interrupted.";
                    reject(new Error(`Failed to complete: ${taskName}`));
                } else {
                    badgeSpan.className = 'status-badge resolved outfit-font';
                    badgeSpan.textContent = 'Resolved';
                    updateTerminal(`Task Completed: ${taskName}`, 'success');
                    runnerStatusText.textContent = "Awaiting Interaction...";
                    resolve(`${taskName} Success`);
                }
            }, duration);
        });
    };

    // Toggle Yellow Glow upon hovering interactive elements
    document.addEventListener('mouseover', (e) => {
        const interactable = e.target.closest('a, button, .artist-card, .logo-container, .close-btn, input');
        if (interactable) {
            glowCursor.classList.add('hover-glow');
        } else {
            glowCursor.classList.remove('hover-glow');
        }
    });

    // Custom Glowing Cursor Tracking
    document.addEventListener('mousemove', (e) => {
        glowCursor.style.left = `${e.clientX}px`;
        glowCursor.style.top = `${e.clientY}px`;
    });

    // Scroll to Top on Logo Click
    navbarLogo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Modal Elements
    const albumModal = document.getElementById('album-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalAlbumImg = document.getElementById('modal-album-img');
    const modalArtistName = document.getElementById('modal-artist-name');
    const modalAlbumName = document.getElementById('modal-album-name');
    const modalAlbumYear = document.getElementById('modal-album-year');
    const modalAlbumDesc = document.getElementById('modal-album-desc');

    // Artist / Album Data Dictionary
    const albumData = {
        'pink-floyd': {
            artistName: 'Pink Floyd',
            albumName: 'The Dark Side of the Moon',
            year: 'Released: 1973',
            description: 'One of the most critically acclaimed albums in history. It explores themes of conflict, greed, time, death, and mental illness, blending progressive rock with experimental tape loops, synthesizers, and philosophical lyrics.',
            imgSrc: 'images/darksideofmoon.jpg',
            audioSrc: 'audio/The_Great_Gig_In_The_Sky.mp3'
        },
        'the-beatles': {
            artistName: 'The Beatles',
            albumName: 'Please Please Me',
            year: 'Released: 1963',
            description: 'The explosive debut studio album that launched Beatlemania in the UK. Capturing the raw, energetic sound of their live club performances, it features defining early hits like "Love Me Do" and "Twist and Shout".',
            imgSrc: 'images/pleaseme.jpg',
            audioSrc: 'audio/Twist_And_Shout.mp3'
        },
        'frank-sinatra': {
            artistName: 'Frank Sinatra',
            albumName: 'The World We Knew',
            year: 'Released: 1967',
            description: 'Featuring the iconic track "Somethin\' Stupid", this album showcases Sinatra navigating contemporary pop arrangements and soft-rock styles while retaining his signature swinging vocals amidst the changing musical landscape of the late 60s.',
            imgSrc: 'images/theworldweknew.jpg',
            audioSrc: 'audio/The-world-we-knew.mp3'
        },
        'nirvana': {
            artistName: 'Nirvana',
            albumName: 'Bleach',
            year: 'Released: 1989',
            description: 'The debut studio album from the architects of grunge. Bleach introduces Nirvana\'s heavy, sludgy, punk-infused riffs and Kurt Cobain\'s visceral songwriting, laying the groundwork for the alternative rock explosion of the 1990s.',
            imgSrc: 'images/bleach.jpg',
            audioSrc: 'audio/The_Man_Who_Sold_The_World.mp3'
        },
        'led-zeppelin': {
            artistName: 'Led Zeppelin',
            albumName: 'Dazed and Confused',
            year: 'Released: 1969',
            description: 'A heavy blues-rock masterpiece featured on their debut album "Led Zeppelin I". Famous for Jimmy Page playing his guitar with a cello bow, it cemented the band\'s reputation for virtuosic, improvisational, stadium-shaking hard rock.',
            imgSrc: 'images/dazed&confused.jpg',
            audioSrc: 'audio/Dazed_And_Confused.mp3'
        },
        'kiss': {
            artistName: 'KISS',
            albumName: 'Dynasty',
            year: 'Released: 1979',
            description: 'Known for their face paint and stage outfits, KISS released "Dynasty" featuring the massive disco-infused hard rock hit "I Was Made for Lovin\' You".',
            imgSrc: 'images/dynasty.jpg',
            audioSrc: 'audio/I_Was_Made_For_Lovin_You.mp3'
        },
        'abba': {
            artistName: 'ABBA',
            albumName: 'Super Trouper',
            year: 'Released: 1980',
            description: 'The Swedish pop supergroup achieved massive global success. "Super Trouper" includes the emotionally resonant "The Winner Takes It All".',
            imgSrc: 'images/super_trouper.jpg',
            audioSrc: 'audio/The_Winner_Takes_It_All.mp3'
        },
        'radiohead': {
            artistName: 'Radiohead',
            albumName: 'OK Computer',
            year: 'Released: 1997',
            description: 'An expansive and atmospheric masterpiece of alternative rock that propelled the band to international fame, expanding upon the early success of their hit "Creep".',
            imgSrc: 'images/ok_computer.jpg',
            audioSrc: 'audio/Creep.mp3'
        },
        'black-sabbath': {
            artistName: 'Black Sabbath',
            albumName: 'Paranoid',
            year: 'Released: 1970',
            description: 'The definitive heavy metal album that shaped an entire genre. With crushing riffs and dark themes, it cemented Sabbath\'s legacy and profoundly influenced generations to come.',
            imgSrc: 'images/paranoid.jpg',
            audioSrc: 'audio/Paranoid.mp3'
        }
    };

    // --- Authentication Flow ---

    const savedUser = localStorage.getItem('dazed_user');
    if (savedUser) {
        showMainView(savedUser);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const passcode = passcodeInput.value.trim();

        if (username !== '' && passcode !== '') {
            // Integration: Fire promises then login
            simulateLiveTask(`Authenticating User: ${username}`, 1500)
                .then(() => {
                    return simulateLiveTask('Fetching Golden Era Catalog...', 1200);
                })
                .then(() => {
                    localStorage.setItem('dazed_user', username);
                    showMainView(username);
                    loginForm.reset();
                })
                .catch(err => {
                    alert('Authentication failed.');
                });
        } else {
            alert('Please enter both username and passcode to enter the era.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('dazed_user');

        mainView.classList.remove('active');
        mainView.classList.add('hidden');
        logoutBtn.classList.add('hidden');

        loginView.classList.remove('hidden');
        loginView.classList.add('active');
    });

    function showMainView(username) {
        userDisplay.textContent = username.toUpperCase();

        loginView.classList.remove('active');
        loginView.classList.add('hidden');

        setTimeout(() => {
            mainView.classList.remove('hidden');
            mainView.classList.add('active');
            logoutBtn.classList.remove('hidden');
        }, 100);
    }

    // --- Modal & Audio Logic ---

    let currentAudio = null;

    // Open Modal and Populate Data
    const openModal = (artistKey) => {
        const data = albumData[artistKey];
        if (!data) return;

        modalAlbumImg.src = data.imgSrc;
        modalAlbumImg.alt = data.albumName;

        modalArtistName.textContent = data.artistName;
        modalAlbumName.textContent = data.albumName;
        modalAlbumYear.textContent = data.year;
        modalAlbumDesc.textContent = data.description;

        // Stop existing audio if playing
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Play new audio
        if (data.audioSrc) {
            currentAudio = new Audio(data.audioSrc);
            currentAudio.play().catch(e => console.warn('Audio playback prevented by browser:', e));
        }

        albumModal.classList.remove('hidden');
    };

    // Close Modal
    const closeModal = () => {
        albumModal.classList.add('hidden');

        // Stop audio when modal closes
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    };

    // Attach Click Listeners to Artist Cards
    const artistCards = document.querySelectorAll('.artist-card');
    artistCards.forEach(card => {
        card.addEventListener('click', () => {
            const artistKey = card.getAttribute('data-artist');
            const data = albumData[artistKey];

            simulateLiveTask(`Querying DB for: ${data.artistName}`, 800)
                .then(() => {
                    return simulateLiveTask(`Buffering Audio: ${data.audioSrc}`, 1500);
                })
                .then(() => {
                    openModal(artistKey);
                })
                .catch(err => console.error(err));
        });
    });

    // --- Sequential Task Execution (Assignment Requirement) ---
    const runSequentially = async (tasks) => {
        updateTerminal('Starting Sequential Array Execution...', 'warn');
        let results = [];

        for (const task of tasks) {
            try {
                const result = await task(); // task is a function returning a Promise
                results.push(result);
            } catch (error) {
                updateTerminal(`Sequence halted at error: ${error.message}`, 'error');
                throw error; // Stop sequence on error
            }
        }

        updateTerminal('Sequential Array Execution Finished Succesfully!', 'success');
        return results;
    };

    runSeqBtn.addEventListener('click', () => {
        liveTaskList.innerHTML = '';
        updateTerminal('--- NEW SEQUENCE ---', 'info');

        // Array of task factory functions as required
        const taskArray = [
            () => simulateLiveTask('Initialize System Protocol', 1000),
            () => simulateLiveTask('Establish Secure Connection', 1200),
            () => simulateLiveTask('Pre-fetch Metadata', 800),
            () => simulateLiveTask('Mount Virtual Drive', 1500)
        ];

        runSequentially(taskArray)
            .then(res => console.log('All tasks done:', res))
            .catch(err => console.error('Runner aborted:', err));
    });

    // Close Modal Button
    closeModalBtn.addEventListener('click', closeModal);

    // Close Modal when clicking outside the content
    albumModal.addEventListener('click', (e) => {
        if (e.target === albumModal) {
            closeModal();
        }
    });
});
