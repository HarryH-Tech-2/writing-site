// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateMobileThemeText(savedTheme);

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateMobileThemeText(newTheme);

    // Update particles colors
    updateParticlesTheme(newTheme);

    // Add a subtle flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${newTheme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
        pointer-events: none;
        z-index: 10003;
        animation: flashFade 0.5s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
}

function updateMobileThemeText(theme) {
    const themeText = document.querySelector('.theme-text');
    if (themeText) {
        themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

function updateParticlesTheme(theme) {
    if (window.pJSDom && window.pJSDom[0]) {
        const particles = window.pJSDom[0].pJS.particles;
        const interactivity = window.pJSDom[0].pJS.interactivity;

        if (theme === 'light') {
            particles.color.value = ['#0284c7', '#0369a1', '#075985', '#0c4a6e'];
            particles.line_linked.color = '#0369a1';
            particles.opacity.value = 0.3;
        } else {
            particles.color.value = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#e0f2fe'];
            particles.line_linked.color = '#0ea5e9';
            particles.opacity.value = 0.4;
        }

        // Refresh particles
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// Add flash animation
const flashStyle = document.createElement('style');
flashStyle.textContent = `
    @keyframes flashFade {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(flashStyle);

themeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);

// ===== Initialize AOS (Animate On Scroll) =====
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

// ===== Particles.js Configuration - Futuristic Blue =====
const isDarkMode = () => htmlElement.getAttribute('data-theme') !== 'light';

// Get initial theme colors
const getParticleColors = () => savedTheme === 'light'
    ? ['#0284c7', '#0369a1', '#075985', '#0c4a6e']
    : ['#0ea5e9', '#38bdf8', '#7dd3fc', '#e0f2fe'];

const getLineColor = () => savedTheme === 'light' ? '#0369a1' : '#0ea5e9';
const getOpacity = () => savedTheme === 'light' ? 0.3 : 0.4;

particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 900
            }
        },
        color: {
            value: getParticleColors()
        },
        shape: {
            type: ['circle', 'triangle'],
            stroke: {
                width: 0,
                color: getLineColor()
            }
        },
        opacity: {
            value: getOpacity(),
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.5,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: getLineColor(),
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 180,
                line_linked: {
                    opacity: 0.6
                }
            },
            push: {
                particles_nb: 6
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// ===== Custom Cursor with Trail =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let cursorTrails = [];

if (window.innerWidth > 768) {
    // Create cursor trail elements
    for (let i = 0; i < 5; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: ${8 - i}px;
            height: ${8 - i}px;
            background: rgba(14, 165, 233, ${0.4 - i * 0.08});
            border-radius: 50%;
            pointer-events: none;
            z-index: ${9998 - i};
            transition: transform 0.1s ease;
            box-shadow: 0 0 ${10 - i * 2}px rgba(14, 165, 233, ${0.3 - i * 0.05});
        `;
        document.body.appendChild(trail);
        cursorTrails.push(trail);
    }

    let mouseX = 0, mouseY = 0;
    let trailPositions = cursorTrails.map(() => ({ x: 0, y: 0 }));

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = mouseX - 20 + 'px';
            cursorFollower.style.top = mouseY - 20 + 'px';
        }, 50);
    });

    // Animate cursor trails
    function animateTrails() {
        trailPositions.forEach((pos, i) => {
            const target = i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i - 1];
            pos.x += (target.x - pos.x) * (0.3 - i * 0.03);
            pos.y += (target.y - pos.y) * (0.3 - i * 0.03);
            cursorTrails[i].style.left = pos.x + 'px';
            cursorTrails[i].style.top = pos.y + 'px';
        });
        requestAnimationFrame(animateTrails);
    }
    animateTrails();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .work-card, .faq-item, .skill-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
        });
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Navigation Links =====
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

// ===== Counter Animation with Easing =====
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2500;
        let startTime = null;

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutExpo(progress);

            counter.textContent = Math.floor(easedProgress * target);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
};

animateCounters();

// ===== Work Filter with Stagger Animation =====
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        let visibleIndex = 0;

        workCards.forEach((card) => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${visibleIndex * 0.08}s`;
                visibleIndex++;
            } else {
                card.style.animation = 'fadeOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 400);
            }
        });
    });
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
    }
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.6;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes electricPulse {
        0%, 100% {
            box-shadow: 0 0 5px rgba(14, 165, 233, 0.5),
                        0 0 10px rgba(14, 165, 233, 0.3),
                        0 0 15px rgba(14, 165, 233, 0.2);
        }
        50% {
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.8),
                        0 0 20px rgba(14, 165, 233, 0.6),
                        0 0 30px rgba(14, 165, 233, 0.4),
                        0 0 40px rgba(14, 165, 233, 0.2);
        }
    }
`;
document.head.appendChild(style);

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Magnetic Button Effect with Ripple =====
const magneticBtns = document.querySelectorAll('.btn-primary, .contact-btn.primary');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });

    // Ripple effect on click
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            left: ${e.clientX - rect.left - 10}px;
            top: ${e.clientY - rect.top - 10}px;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Advanced Tilt Effect on Work Cards =====
const tiltCards = document.querySelectorAll('.work-card');

tiltCards.forEach(card => {
    let bounds;

    const rotateCard = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        card.style.transform = `
            perspective(1000px)
            rotateX(${center.y / 15}deg)
            rotateY(${-center.x / 15}deg)
            translateY(-10px)
            scale3d(1.03, 1.03, 1.03)
        `;

        // Dynamic glow position
        card.style.setProperty('--mouse-x', `${leftX}px`);
        card.style.setProperty('--mouse-y', `${topY}px`);
    };

    card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        card.addEventListener('mousemove', rotateCard);
    });

    card.addEventListener('mouseleave', () => {
        card.removeEventListener('mousemove', rotateCard);
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
    });

    // Click handler for cards with URLs
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
        }
    });
});

// ===== Parallax Effect on Hero (orbit ring only) =====
const heroSection = document.querySelector('.hero');
const orbitRing = document.querySelector('.orbit-ring');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight) {
        if (orbitRing) {
            orbitRing.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
        }
    }
});

// ===== Text Reveal Animation =====
const revealText = () => {
    const heroTitle = document.querySelector('.hero-title');
    const lines = heroTitle.querySelectorAll('.title-line');

    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(60px) rotateX(-15deg)';
        line.style.transformOrigin = 'bottom center';

        setTimeout(() => {
            line.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0) rotateX(0)';
        }, 300 + (index * 200));
    });
};

// ===== Loading Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    revealText();

    // Add electric pulse to featured cards
    const featuredCards = document.querySelectorAll('.work-card.featured');
    featuredCards.forEach(card => {
        card.style.animation = 'electricPulse 3s ease-in-out infinite';
    });
});

// ===== Intersection Observer for Section Animations =====
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ===== Dynamic Glow Effect on Mouse Move =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.work-card, .skill-card, .stat-item');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== Scroll Progress Indicator =====
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(14, 165, 233, 0.5), 0 0 20px rgba(14, 165, 233, 0.3);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
};

createScrollProgress();

// ===== Skill Card Hover Animation =====
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.5)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.2)';
        }
    });
});

// ===== Electric Border Animation for Stats =====
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach((stat, index) => {
    stat.style.animationDelay = `${index * 0.5}s`;
});

// ===== Typing Effect for Badge =====
const badge = document.querySelector('.hero-badge');
if (badge) {
    const originalText = badge.textContent.trim();
    const textSpan = document.createElement('span');
    textSpan.textContent = originalText;
    badge.innerHTML = '';
    badge.appendChild(document.createElement('span'));
    badge.firstChild.className = 'badge-dot';
    badge.appendChild(document.createTextNode(' '));
    badge.appendChild(textSpan);
}

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Matrix rain effect
            createMatrixRain();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10002;
        pointer-events: none;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0ea5e9';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const interval = setInterval(draw, 33);

    setTimeout(() => {
        clearInterval(interval);
        canvas.remove();
    }, 5000);
}

// ===== Console Easter Egg =====
console.log('%c Welcome to Harry\'s Portfolio! ', 'background: linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc); color: #030712; font-size: 20px; padding: 10px; border-radius: 5px; font-weight: bold;');
console.log('%c Looking for a great writer? Let\'s connect! ', 'color: #38bdf8; font-size: 14px;');
console.log('%c Try the Konami Code for a surprise... ', 'color: #7dd3fc; font-size: 12px; font-style: italic;');

// ===== Smooth reveal for work cards on scroll =====
const revealOnScroll = () => {
    const cards = document.querySelectorAll('.work-card:not(.revealed)');

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight * 0.85) {
            card.classList.add('revealed');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== Footer Typing Animation =====
const footerTyping = document.getElementById('footer-typing');
if (footerTyping) {
    const phrases = [
        'blog posts',
        'email campaigns',
        'video scripts',
        'whitepapers',
        'content strategies',
        'case studies',
        'technical docs',
        'landing pages'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            footerTyping.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            footerTyping.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typeLoop, delay);
    };

    typeLoop();
}

// ===== Footer Easter Egg =====
const footerEgg = document.getElementById('footer-egg');
if (footerEgg) {
    const emojis = ['H', '✍️', '🚀', '💡', '⚡', '🎯', '📝', '🔥'];
    let clickCount = 0;

    footerEgg.addEventListener('click', () => {
        clickCount++;
        footerEgg.classList.add('spinning');
        const icon = footerEgg.querySelector('.egg-icon');
        icon.textContent = emojis[clickCount % emojis.length];

        setTimeout(() => footerEgg.classList.remove('spinning'), 600);
    });
}
