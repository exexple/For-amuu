// State Management
const state = {
    currentPage: 0,
    isPlaying: false,
    imageUploaded: false
};

const pages = {
    initial: document.getElementById('initialScreen'),
    card: document.getElementById('cardScreen'),
    final: document.getElementById('finalScreen')
};

const elements = {
    yesBtn: document.getElementById('yesBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    cardPages: document.querySelectorAll('.card-page'),
    navigationControls: document.querySelector('.navigation-controls'),
    circularDisplay: document.getElementById('circularDisplay'),
    mainImage: document.getElementById('mainImage'),
    confettiContainer: document.getElementById('confettiContainer')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupMusicInput();
});

function setupEventListeners() {
    elements.yesBtn.addEventListener('click', startGreeting);
    elements.nextBtn.addEventListener('click', nextPage);
    elements.prevBtn.addEventListener('click', previousPage);
}

function setupMusicInput() {
    // Try to load from localStorage or user input
    const savedMusic = localStorage.getItem('greetingMusic');
    if (savedMusic) {
        elements.backgroundMusic.src = savedMusic;
    }
}

function startGreeting() {
    // Fade out initial screen
    pages.initial.classList.remove('active');

    // Show card screen
    setTimeout(() => {
        pages.card.classList.add('active');
        elements.navigationControls.classList.add('show');

        // Try to play music
        playMusic();

        // Show cover page
        showPage(0);
    }, 300);
}

function playMusic() {
    if (elements.backgroundMusic.src) {
        elements.backgroundMusic.play().catch(err => {
            console.log('Music autoplay prevented:', err);
            // User can click to play
            document.addEventListener('click', () => {
                if (!state.isPlaying && elements.backgroundMusic.src) {
                    elements.backgroundMusic.play().catch(e => console.log('Play error:', e));
                    state.isPlaying = true;
                }
            }, { once: true });
        });
        state.isPlaying = true;
    }
}

function nextPage() {
    if (state.currentPage < elements.cardPages.length - 1) {
        state.currentPage++;
        showPage(state.currentPage);
        updateNavigation();
    } else if (state.currentPage === elements.cardPages.length - 1) {
        // Show final screen
        completeGreeting();
    }
}

function previousPage() {
    if (state.currentPage > 0) {
        state.currentPage--;
        showPage(state.currentPage);
        updateNavigation();
    }
}

function showPage(pageIndex) {
    // Remove active class from all pages
    elements.cardPages.forEach((page, index) => {
        page.classList.remove('active', 'prev');

        if (index === pageIndex) {
            page.classList.add('active');
        } else if (index < pageIndex) {
            page.classList.add('prev');
        }
    });

    // Update circular display visibility
    if (pageIndex === 0) {
        elements.circularDisplay.classList.add('show');
    } else {
        elements.circularDisplay.classList.remove('show');
    }
}

function updateNavigation() {
    const totalPages = elements.cardPages.length;

    // Show/hide previous button
    elements.prevBtn.style.display = state.currentPage > 0 ? 'block' : 'none';

    // Update next button text
    if (state.currentPage === totalPages - 1) {
        elements.nextBtn.textContent = 'Complete ✨';
    } else {
        elements.nextBtn.textContent = 'Next →';
    }
}

function completeGreeting() {
    // Hide card screen
    pages.card.classList.remove('active');

    // Show final screen
    setTimeout(() => {
        pages.final.classList.add('active');
        createConfetti();
    }, 300);
}

function createConfetti() {
    const confettiCount = 50;
    const colors = ['#ffd700', '#ffb347', '#ffa500', '#ff69b4', '#ff1493'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confettiFall ${2 + Math.random() * 1.5}s ease-in forwards`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        elements.confettiContainer.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 3500);
    }
}

// Image handling
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'i') {
        // Allow developer to set image via console
        console.log('To add image: uploadCardImage(imageUrl)');
    }
});

window.uploadCardImage = function(imageUrl) {
    if (!imageUrl) {
        console.error('Please provide an image URL');
        return;
    }

    elements.mainImage.src = imageUrl;
    state.imageUploaded = true;
    localStorage.setItem('cardImage', imageUrl);
    console.log('Image uploaded successfully');
};

window.setBackgroundMusic = function(musicUrl) {
    if (!musicUrl) {
        console.error('Please provide a music URL');
        return;
    }

    elements.backgroundMusic.src = musicUrl;
    localStorage.setItem('greetingMusic', musicUrl);
    console.log('Music set successfully');
};

// Load saved image and music on page load
window.addEventListener('load', () => {
    const savedImage = localStorage.getItem('cardImage');
    const savedMusic = localStorage.getItem('greetingMusic');

    if (savedImage) {
        elements.mainImage.src = savedImage;
        state.imageUploaded = true;
    }

    if (savedMusic) {
        elements.backgroundMusic.src = savedMusic;
    }
});
