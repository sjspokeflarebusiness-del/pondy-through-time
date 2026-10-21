document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU TOGGLE ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate Hamburger lines to 'X'
            const spans = hamburger.querySelectorAll('span');
            if(navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // --- 2. SCROLL PROGRESS BAR & TOP BUTTON ---
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '↑';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
        
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 3. SMOOTH PAGE TRANSITIONS ---
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'page-transition';
    document.body.appendChild(transitionOverlay);
    
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            transitionOverlay.style.opacity = '1';
            setTimeout(() => window.location.href = link.href, 400);
        });
    });
    setTimeout(() => transitionOverlay.style.opacity = '0', 100);

    // --- 4. SCROLL REVEAL & 3D TILT ---
    const reveals = document.querySelectorAll('.chapter-card, .game-card, .section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        reveal.classList.add('reveal');
        observer.observe(reveal);
        
        // 3D Tilt Effect on Hover
        reveal.addEventListener('mousemove', (e) => {
            const rect = reveal.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            reveal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });
        reveal.addEventListener('mouseleave', () => {
            reveal.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // --- 5. CHAPTER MODALS (Home Page) ---
    const chapterCards = document.querySelectorAll('.chapter-card');
    if (chapterCards.length > 0) {
        const modalHTML = `<div class="modal-overlay" id="story-modal"><div class="modal-content"><div class="close-modal">&times;</div><img src="" class="modal-img" id="modal-img"><div class="modal-text"><span class="chapter-date" id="modal-date"></span><h3 id="modal-title"></h3><p id="modal-desc"></p></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('story-modal');
        const closeModal = document.querySelector('.close-modal');

        chapterCards.forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('modal-img').src = card.querySelector('.chapter-img').src;
                document.getElementById('modal-date').innerText = card.querySelector('.chapter-date').innerText;
                document.getElementById('modal-title').innerText = card.querySelector('.chapter-title').innerText;
                document.getElementById('modal-desc').innerText = card.querySelector('.chapter-desc').innerText;
                modal.classList.add('active');
            });
        });
        
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
    }

    // --- 6. ARCADE GAMES LOGIC (Play Page) ---
    
    // Game 1: Timeline Quiz
    const g1Buttons = document.querySelectorAll('#game-quiz .option-btn');
    g1Buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            g1Buttons.forEach(b => b.classList.remove('correct', 'wrong'));
            const isCorrect = btn.getAttribute('data-correct') === 'true';
            if (isCorrect) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
                document.querySelector('#game-quiz .option-btn[data-correct="true"]').classList.add('correct');
            }
        });
    });

    // Game 2: True or False
    const g2BtnTrue = document.getElementById('btn-true');
    const g2BtnFalse = document.getElementById('btn-false');
    const g2Result = document.getElementById('g2-result');
    if(g2BtnTrue) {
        g2BtnTrue.addEventListener('click', () => {
            g2Result.classList.add('show');
            g2Result.innerHTML = "❌ False! Poduke was mentioned in the 1st Century CE, which is ancient history.";
            g2Result.style.background = "var(--accent-coral)";
        });
        g2BtnFalse.addEventListener('click', () => {
            g2Result.classList.add('show');
            g2Result.innerHTML = "✅ Correct! It is an ancient text from the 1st Century CE.";
            g2Result.style.background = "var(--accent-teal)";
        });
    }

    // Game 3: Guess the Image
    const g3Images = document.querySelectorAll('.game-image-choice');
    const g3Result = document.getElementById('g3-result');
    if(g3Images.length > 0) {
        g3Images.forEach(img => {
            img.addEventListener('click', () => {
                const isCorrect = img.getAttribute('data-correct') === 'true';
                
                if (isCorrect) {
                    g3Result.classList.add('show');
                    g3Result.innerHTML = "🎉 You got it! That's the Arikamedu excavation site.";
                    g3Result.style.background = "var(--accent-teal)";
                    img.style.borderColor = "var(--accent-teal)";
                } else {
                    g3Result.classList.add('show');
                    g3Result.innerHTML = "❌ Oops! That's actually the Promenade Beach.";
                    g3Result.style.background = "var(--accent-coral)";
                    img.style.borderColor = "var(--accent-coral)";
                }
            });
        });
    }
    // Game 4: Personality Quiz
    const vibeBtns = document.querySelectorAll('.vibe-btn');
    const vibeResult = document.getElementById('vibe-result');
    if(vibeBtns.length > 0) {
        vibeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const vibe = btn.getAttribute('data-vibe');
                vibeResult.classList.add('show');
                if(vibe === 'ancient') {
                    vibeResult.innerHTML = "🏺 <strong>You are Arikamedu!</strong> You are a deep thinker, love history, and appreciate the roots of things. You're a rare treasure.";
                    vibeResult.style.background = "var(--accent-gold)";
                    vibeResult.style.color = "var(--bg-dark)";
                } else if (vibe === 'french') {
                    vibeResult.innerHTML = "🎨 <strong>You are the French Quarter!</strong> You are stylish, love aesthetics, romance, and a good cup of coffee. You appreciate the finer things.";
                    vibeResult.style.background = "var(--accent-coral)";
                    vibeResult.style.color = "white";
                } else {
                    vibeResult.innerHTML = "🌊 <strong>You are the Rock Beach!</strong> You are free-spirited, energetic, and always ready for an adventure. You go with the flow!";
                    vibeResult.style.background = "var(--accent-teal)";
                    vibeResult.style.color = "white";
                }
            });
        });
    }

    // Game 5: Word Scramble
    const scrambleInput = document.getElementById('scramble-input');
    const scrambleBtn = document.getElementById('scramble-btn');
    const scrambleResult = document.getElementById('scramble-result');
    if(scrambleBtn) {
        scrambleBtn.addEventListener('click', () => {
            const guess = scrambleInput.value.toUpperCase().trim();
            if(guess === 'PUDUCHERRY') {
                scrambleResult.classList.add('show');
                scrambleResult.innerHTML = "🎉 Correct! Puducherry is the official name.";
                scrambleResult.style.background = "var(--accent-teal)";
            } else {
                scrambleResult.classList.add('show');
                scrambleResult.innerHTML = "❌ Not quite. Hint: It starts with P and is the official name of Pondicherry.";
                scrambleResult.style.background = "var(--accent-coral)";
            }
        });
    }
});
// ==========================================
// 7. EXPLORE PAGE FEATURES
// ==========================================

// --- Custom Cursor Logic ---
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const hoverElements = document.querySelectorAll('a, button, .flip-card, .carousel-dot');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.backgroundColor = 'var(--accent-coral)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--accent-gold)';
        });
    });
}

// --- Fact Carousel Logic ---
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');

function showSlides(n) {
    if (slides.length === 0) return;
    
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function currentSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
    resetTimer(); // Reset auto-play timer when user manually clicks
}

// Auto-play functionality
let slideTimer;
function startTimer() {
    slideTimer = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000); // Changes slide every 5 seconds
}
function resetTimer() {
    clearInterval(slideTimer);
    startTimer();
}

if (slides.length > 0) {
    startTimer();
}