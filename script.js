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
    const savedMusic = localStorage.getItem('greetingMusic');
    if (savedMusic) {
        elements.backgroundMusic.src = savedMusic;
    }
}

function startGreeting() {
    pages.initial.classList.remove('active');
    
    setTimeout(() => {
        pages.card.classList.add('active');
        elements.navigationControls.style.display = 'flex';
        
        playMusic();
        
        showPage(0);
    }, 300);
}

function playMusic() {
    if (elements.backgroundMusic.src) {
        elements.backgroundMusic.play().catch(err => {
            console.log('Music autoplay prevented:', err);
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
    elements.cardPages.forEach((page, index) => {
        page.classList.remove('active', 'prev');
        
        if (index === pageIndex) {
            page.classList.add('active');
        } else if (index < pageIndex) {
            page.classList.add('prev');
        }
    });
}

function updateNavigation() {
    const totalPages = elements.cardPages.length;
    
    elements.prevBtn.style.display = state.currentPage > 0 ? 'block' : 'none';
    
    if (state.currentPage === totalPages - 1) {
        elements.nextBtn.textContent = 'Complete ✨';
    } else {
        elements.nextBtn.textContent = 'Next →';
    }
}

function completeGreeting() {
    pages.card.classList.remove('active');
    
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
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

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
