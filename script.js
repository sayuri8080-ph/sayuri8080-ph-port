// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2000);
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#0099FF' : '#00E5FF';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = '#0099FF';
                ctx.globalAlpha = 0.1 * (1 - distance / 150);
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== MOUSE GLOW EFFECT =====
const mouseGlow = document.getElementById('mouse-glow');

document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});

// ===== NAVIGATION TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .section-title').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ===== SKILL BARS ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// ===== TYPING ANIMATION =====
const typingText = document.querySelector('.typing-text');
const typingPhrases = [
    '• BSIT Student',
    '• Future IT Professional',
    '• Learning Every Day',
    '• God First'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentPhrase = typingPhrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWriter, typeSpeed);
}

setTimeout(typeWriter, 3000);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION LINK =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#00E5FF';
        }
    });
});

// ===== GAMES =====
let currentGame = null;
let gameInterval = null;
let score = 0;

function openGame(gameType) {
    const modal = document.getElementById('game-modal');
    const container = document.getElementById('game-container');
    
    modal.classList.add('active');
    score = 0;
    
    switch(gameType) {
        case 'chicken':
            container.innerHTML = getChickenGameHTML();
            startChickenGame();
            break;
        case 'burger':
            container.innerHTML = getBurgerGameHTML();
            startBurgerGame();
            break;
        case 'bug':
            container.innerHTML = getBugGameHTML();
            startBugGame();
            break;
        case 'rice':
            container.innerHTML = getRiceGameHTML();
            startRiceGame();
            break;
        case 'spin':
            container.innerHTML = getSpinGameHTML();
            break;
    }
}

function closeGame() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('active');
    
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    
    currentGame = null;
}

// ===== CHICKEN GAME =====
function getChickenGameHTML() {
    return `
        <h2 class="game-score">🐔 Catch the Chicken!</h2>
        <p class="game-instructions">Click the chickens before they fly away!</p>
        <div class="game-area" id="chicken-game"></div>
        <button class="btn btn-primary" onclick="restartGame('chicken')">Restart Game</button>
    `;
}

function startChickenGame() {
    currentGame = 'chicken';
    const gameArea = document.getElementById('chicken-game');
    
    function spawnChicken() {
        const chicken = document.createElement('div');
        chicken.className = 'game-target';
        chicken.textContent = '🐔';
        chicken.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        chicken.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';
        
        chicken.addEventListener('click', () => {
            score += 10;
            updateScore();
            playSound('catch');
            chicken.remove();
        });
        
        gameArea.appendChild(chicken);
        
        setTimeout(() => {
            if (chicken.parentNode) {
                chicken.remove();
            }
        }, 2000);
    }
    
    gameInterval = setInterval(spawnChicken, 1000);
    updateScore();
}

// ===== BURGER GAME =====
function getBurgerGameHTML() {
    return `
        <h2 class="game-score">🍔 Eat the Burger!</h2>
        <p class="game-instructions">Click burgers before they disappear!</p>
        <div class="game-area" id="burger-game"></div>
        <button class="btn btn-primary" onclick="restartGame('burger')">Restart Game</button>
    `;
}

function startBurgerGame() {
    currentGame = 'burger';
    const gameArea = document.getElementById('burger-game');
    
    function spawnBurger() {
        const burger = document.createElement('div');
        burger.className = 'game-target';
        burger.textContent = '🍔';
        burger.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        burger.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';
        
        burger.addEventListener('click', () => {
            score += 15;
            updateScore();
            playSound('eat');
            burger.remove();
        });
        
        gameArea.appendChild(burger);
        
        setTimeout(() => {
            if (burger.parentNode) {
                burger.remove();
            }
        }, 1500);
    }
    
    gameInterval = setInterval(spawnBurger, 800);
    updateScore();
}

// ===== BUG GAME =====
function getBugGameHTML() {
    return `
        <h2 class="game-score">🐛 Find the Bug!</h2>
        <p class="game-instructions">Find the hidden bug among the code!</p>
        <div class="game-area" id="bug-game" style="display: flex; flex-wrap: wrap; gap: 10px; padding: 20px; align-content: flex-start;"></div>
        <button class="btn btn-primary" onclick="restartGame('bug')">Restart Game</button>
    `;
}

function startBugGame() {
    currentGame = 'bug';
    const gameArea = document.getElementById('bug-game');
    gameArea.innerHTML = '';
    
    const symbols = ['💻', '🔧', '⚙️', '📱', '💾', '🖥️', '⌨️', '🖱️', '📊', '🔌'];
    const bugIndex = Math.floor(Math.random() * 20);
    
    for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.className = 'game-target';
        item.style.position = 'relative';
        item.style.fontSize = '2rem';
        
        if (i === bugIndex) {
            item.textContent = '🐛';
            item.addEventListener('click', () => {
                score += 50;
                updateScore();
                playSound('found');
                alert('🎉 You found the bug! +50 points!');
                gameArea.innerHTML = '<p style="color: #00E5FF; font-size: 1.5rem; text-align: center; width: 100%;">Bug Found! Great job!</p>';
                clearInterval(gameInterval);
            });
        } else {
            item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            item.addEventListener('click', () => {
                playSound('miss');
                item.style.opacity = '0.3';
                item.style.pointerEvents = 'none';
            });
        }
        
        gameArea.appendChild(item);
    }
    
    updateScore();
}

// ===== RICE GAME =====
function getRiceGameHTML() {
    return `
        <h2 class="game-score">🍚 Rice Collector!</h2>
        <p class="game-instructions">Collect rice bowls, avoid vegetables!</p>
        <div class="game-area" id="rice-game"></div>
        <button class="btn btn-primary" onclick="restartGame('rice')">Restart Game</button>
    `;
}

function startRiceGame() {
    currentGame = 'rice';
    const gameArea = document.getElementById('rice-game');
    
    function spawnItem() {
        const item = document.createElement('div');
        item.className = 'game-target';
        const isRice = Math.random() > 0.3;
        
        if (isRice) {
            item.textContent = '🍚';
            item.dataset.type = 'rice';
        } else {
            const veggies = ['🥦', '🥕', '🥬', '🌽'];
            item.textContent = veggies[Math.floor(Math.random() * veggies.length)];
            item.dataset.type = 'veggie';
        }
        
        item.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        item.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';
        
        item.addEventListener('click', () => {
            if (item.dataset.type === 'rice') {
                score += 20;
                playSound('collect');
            } else {
                score -= 10;
                playSound('avoid');
            }
            updateScore();
            item.remove();
        });
        
        gameArea.appendChild(item);
        
        setTimeout(() => {
            if (item.parentNode) {
                item.remove();
            }
        }, 2500);
    }
    
    gameInterval = setInterval(spawnItem, 1200);
    updateScore();
}

// ===== SPIN GAME =====
function getSpinGameHTML() {
    return `
        <h2 class="game-score">🎰 Lucky Spin!</h2>
        <p class="game-instructions">Spin the wheel for funny prizes!</p>
        <div class="spin-wheel" id="spin-wheel">
            <div class="spin-pointer"></div>
        </div>
        <button class="btn btn-primary" onclick="spinWheel()">SPIN!</button>
        <p id="spin-result" style="margin-top: 20px; font-size: 1.5rem; color: #00E5FF;"></p>
    `;
}

function spinWheel() {
    const wheel = document.getElementById('spin-wheel');
    const result = document.getElementById('spin-result');
    
    const prizes = [
        '🍚 Free Rice!',
        '📚 More Homework',
        '😴 Sleep Token',
        '🅟️ Instant A+',
        '☕ Unlimited Coffee',
        '🐛 Extra Bugs',
        '🎉 Lucky Day!',
        '💻 New Laptop'
    ];
    
    const randomDegree = Math.floor(Math.random() * 360) + 720;
    wheel.style.transform = `rotate(${randomDegree}deg)`;
    
    setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        result.textContent = prizes[prizeIndex];
        playSound('win');
    }, 3000);
}

// ===== GAME UTILITIES =====
function updateScore() {
    const scoreElement = document.querySelector('.game-score');
    if (scoreElement) {
        const gameName = scoreElement.textContent.split('!')[0];
        scoreElement.textContent = `${gameName}! Score: ${score}`;
    }
}

function restartGame(gameType) {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    score = 0;
    openGame(gameType);
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'catch':
        case 'collect':
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            break;
        case 'eat':
            oscillator.frequency.value = 600;
            oscillator.type = 'triangle';
            break;
        case 'found':
        case 'win':
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            break;
        case 'miss':
        case 'avoid':
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            break;
        default:
            oscillator.frequency.value = 440;
            oscillator.type = 'sine';
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});
