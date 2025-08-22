// --- Configuration ---
const initialText = "Hi! I'm";
const typingSpeed = 100; // Typing speed in milliseconds
const wordDelay = Math.random() * 50 + 150; // Delay/Pause of 150 to 200 ms after a word

// --- DOM Element References ---
let typewriterElement = null;
let titleElement = null;
let bottomGifElement = null;
let scrollDownTextElement = null;
let categorySelectElement = null;
let categoryDropZoneElement = null;

// --- Page State Variables ---
let animationsStarted = false;
let animationsComplete = false;
let isTyping = false;
let scrollFadeTimeout;

// --- Core Functions ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearTypewriterText() {
    if (typewriterElement) {
        typewriterElement.textContent = "";
        return true;
    }
    return false;
}

async function typewriterAnimation(textToType) {
    if (isTyping || !typewriterElement) return;

    isTyping = true;
    try {
        clearTypewriterText();

        for (const char of textToType) {
            typewriterElement.textContent += char;
            let delay = typingSpeed;

            if (char === ' ') {
                delay += wordDelay;
            }
            await sleep(delay);
        }

        triggerPageAnimations();
    } finally {
        isTyping = false;
    }
}

function setInitialState() {
    if (titleElement) {
        titleElement.style.transform = 'translateY(200px)';
        titleElement.style.opacity = '0';
    }
    if (bottomGifElement) {
        bottomGifElement.style.transform = 'translateY(100px)';
        bottomGifElement.style.opacity = '0';
    }
    if (scrollDownTextElement) {
        scrollDownTextElement.style.opacity = '0';
    }
}

function triggerPageAnimations() {
    setTimeout(() => {
        if (titleElement) {
            titleElement.style.transition = 'transform 0.7s cubic-bezier(.2,1.2,.6,1), opacity 0.5s';
            titleElement.style.transform = 'translateY(0)';
            titleElement.style.opacity = '1';
        }
        if (bottomGifElement) {
            bottomGifElement.style.transition = 'transform 1.2s cubic-bezier(.4,1.25,.6,1), opacity 0.5s';
            bottomGifElement.style.transform = 'translateY(0)';
            bottomGifElement.style.opacity = '1';
        }
        if (titleElement) {
            titleElement.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'transform') {
                    document.body.classList.remove('no-scroll');
                    if (scrollDownTextElement) {
                        scrollDownTextElement.style.transition = 'opacity 0.7s';
                        scrollDownTextElement.style.opacity = '1';
                    }
                    // This is the crucial moment, we now mark the intro as complete
                    animationsComplete = true; 
                    titleElement.removeEventListener('transitionend', handler);
                }
            });
        }
    }, 250);
}

// --- Event Listeners ---

window.addEventListener("DOMContentLoaded", (event) => {
    typewriterElement = document.querySelector(".typewriter-animation");
    titleElement = document.getElementById('scroll-title');
    bottomGifElement = document.querySelector('.bottom-gif');
    scrollDownTextElement = document.querySelector('.scroll-down-text');
    categorySelectElement = document.querySelector('.categorySelect');
    categoryDropZoneElement = document.getElementById('category-drop-zone');

    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');
    setInitialState();

    setTimeout(() => {
        window.scrollTo(0, 0);
        animationsStarted = true;
        typewriterAnimation(initialText);
    }, 250);
});

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('scroll', () => {
    if (!animationsStarted) return;

    const scrollY = window.scrollY;

    if (animationsComplete) {
        const triggerPoint = 200;

        if (scrollY > triggerPoint) {
            if (typewriterElement) {
                typewriterElement.classList.add('scrolled', 'shift-left');
                if (typewriterElement.textContent === initialText) {
                    typewriterElement.textContent += " a";
                }
            }

            if (categorySelectElement) categorySelectElement.classList.add('scrolled');
            if (categoryDropZoneElement) categoryDropZoneElement.classList.add('scrolled');
        
        } else {
            if (typewriterElement) {
                typewriterElement.textContent = initialText;
                typewriterElement.classList.remove('scrolled', 'shift-left', 'typewriter-a', 'typewriter-an');
                typewriterElement.style.borderRight = '4px solid #1e1e14';
            }
            if (categorySelectElement) categorySelectElement.classList.remove('scrolled');
            if (categoryDropZoneElement) {
                categoryDropZoneElement.classList.remove('scrolled');
                const selectedCategory = categoryDropZoneElement.querySelector('span[draggable="true"]');
                if (selectedCategory && categorySelectElement) {
                    categorySelectElement.appendChild(selectedCategory);
                    if (typeof resetWaveAnimation === 'function') {
                        resetWaveAnimation(selectedCategory);
                    }
                }
            }
        }
    }

    if (scrollDownTextElement) {
        scrollDownTextElement.style.opacity = '0';
        clearTimeout(scrollFadeTimeout);
        scrollFadeTimeout = setTimeout(() => {
            if (window.scrollY < 10 && animationsComplete) {
                scrollDownTextElement.style.opacity = '1';
            }
        }, 900);
    }

    if (titleElement && animationsComplete) {
        const fadeStart = 0;
        const fadeEnd = 200;
        let opacity = 1 - Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
        titleElement.style.opacity = opacity;
    }
});