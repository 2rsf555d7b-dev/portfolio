const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.header1')

menuButton.addEventListener ('click', function() {
    navigation.classList.toggle("open")

    const isOpen = navigation.classList.contains("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
})

const links = document.querySelectorAll('.header1 a')

links.forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
})

const canvas = document.querySelector('#particles');
const hero = document.querySelector('.hero');

if (canvas && hero) {
    const ctx = canvas.getContext('2d');
    const mouse = {x: null, y: null};  

hero.addEventListener('pointermove', function(event) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
})
hero.addEventListener('pointerleave', function() {
    mouse.x = null;
    mouse.y = null;
})

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const particles = [];

for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 2
    });
}

//Этот код управляет размером и запуском canvas-анимации в .hero.
let canvasVisible = false;
let animationFrameId = null;

function syncCanvasSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const wasVisible = canvasVisible;

    if (!width || !height) {
        canvasVisible = false;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        return;
    }

    canvas.width = width;
    canvas.height = height;

    particles.forEach((particle) => {
        if (!wasVisible) {
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
        } else {
            particle.x = Math.min(particle.x, width);
            particle.y = Math.min(particle.y, height);
        }
    });

    canvasVisible = true;
}

window.addEventListener('resize', () => {
    const wasVisible = canvasVisible;

    syncCanvasSize();

    if (!wasVisible && canvasVisible) {
        animate();
    }
});
function animate() {
    if (!canvasVisible) {
    return;
}
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function(particle) {
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (mouse.x !== null) {
            const differenceX = particle.x - mouse.x;
            const differenceY = particle.y - mouse.y;

            const distance = Math.hypot(differenceX, differenceY);
            const radius = 100;

            if (distance > 0 && distance < radius) {
                const force = 1 - distance / radius;

                particle.x += (differenceX / distance) * force * 2;
                particle.y += (differenceY / distance) * force * 2;
            }
        }
        if (particle.x <= particle.size) {
            particle.x = particle.size;
            particle.dx = Math.abs(particle.dx);
        }
        if (particle.x >= canvas.width - particle.size) {
            particle.x = canvas.width - particle.size;
            particle.dx = -Math.abs(particle.dx);
        }
        if (particle.y <= particle.size) {
            particle.y = particle.size;
            particle.dy = Math.abs(particle.dy);
        }
        if (particle.y >= canvas.height - particle.size) {
            particle.y = canvas.height - particle.size;
            particle.dy = -Math.abs(particle.dy)
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "#4da6ff";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#1c56d4"
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++){
            const p1 = particles[i];
            const p2 = particles[j];

            const distance = Math.hypot(
                p1.x - p2.x,
                p1.y - p2.y
            );
            const maxDistance = 80;
            if (distance < maxDistance) {
                const opacity = 1 - distance / maxDistance;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(28, 86, 212, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke()
            }
        }
    }
    animationFrameId = requestAnimationFrame(animate);
}
syncCanvasSize();

if (canvasVisible) {
    animate();
}
}
const techStack = document.querySelector('.techStack-section');
const moreToolsButton = techStack?.querySelector('.more-tools');

if (techStack && moreToolsButton) {
    const desktopWidth = window.matchMedia('(min-width: 1024px)');
    const moreToolsLabel = moreToolsButton.querySelector('.more-tools-label');

    function updateMoreTools() {
        if (desktopWidth.matches) {
            techStack.classList.remove('is-expanded');
        }

        const isExpanded = techStack.classList.contains('is-expanded');

        moreToolsButton.disabled = desktopWidth.matches;

        if (desktopWidth.matches) {
            moreToolsButton.removeAttribute('aria-expanded');
        } else {
            moreToolsButton.setAttribute('aria-expanded', String(isExpanded));
        }

        moreToolsLabel.textContent = isExpanded
            ? 'Show Less'
            : 'More Tools';
    }

    moreToolsButton.addEventListener('click', () => {
        techStack.classList.toggle('is-expanded');
        updateMoreTools();
    });

    desktopWidth.addEventListener('change', updateMoreTools);

    updateMoreTools();
    techStack.classList.add('is-ready');
    moreToolsButton.hidden = false;
}
// Движение точки в секции How I Work.
const processSteps = document.querySelector('.about-process__steps');

if (processSteps) {
    const track = processSteps.querySelector('.about-process__track');
    const dot = processSteps.querySelector('.about-process__dot');
    const numbers = processSteps.querySelectorAll('.about-process__number');

    const mobileLayout = window.matchMedia('(max-width: 599px)');
    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    let dotAnimation;

    function updateProcessAnimation() {
        if (!track || !dot || numbers.length !== 3) return;

        dotAnimation?.cancel();

        const container = processSteps.getBoundingClientRect();
        const first = numbers[0].getBoundingClientRect();
        const last = numbers[2].getBoundingClientRect();
        const isMobile = mobileLayout.matches;

        // Соединяем центры первого и третьего номеров.
        track.style.left = `${first.left - container.left + first.width / 2}px`;
        track.style.top = `${first.top - container.top + first.height / 2}px`;
        track.style.right = 'auto';
        track.style.bottom = 'auto';

        track.style.width = isMobile
            ? '1px'
            : `${last.left + last.width / 2 - first.left - first.width / 2}px`;

        track.style.height = isMobile
            ? `${last.top + last.height / 2 - first.top - first.height / 2}px`
            : '1px';

        // При настройке «уменьшить движение» оставляем точку неподвижной.
        if (reducedMotion.matches) return;

        const frames = isMobile
            ? [
                { left: '50%', top: '0%' },
                { left: '50%', top: '100%' }
            ]
            : [
                { left: '0%', top: '50%' },
                { left: '100%', top: '50%' }
            ];

        dotAnimation = dot.animate(frames, {
            duration: 8000,
            iterations: Infinity,
            easing: 'linear'
        });
    }

    const processResizeObserver = new ResizeObserver(
        updateProcessAnimation
    );

    processResizeObserver.observe(processSteps);
    mobileLayout.addEventListener('change', updateProcessAnimation);
    reducedMotion.addEventListener('change', updateProcessAnimation);

    updateProcessAnimation();
}

/* Анимация главной страницы */

(() => {
    const root = document.documentElement;

    if (!document.body.classList.contains('home-page') || !window.matchMedia) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let observer = null;

    function onMotionPreferenceChange(event) {
        /* Обновляем canvas, чтобы частицы остановились или запустились. */
        window.dispatchEvent(new Event('resize'));

        if (event.matches) {
            root.classList.remove('home-motion-pending');
            animations.forEach(animation => animation.cancel());
            animations.clear();

            if (observer) observer.disconnect();
        }
    }

    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', onMotionPreferenceChange);
    } else if (typeof reducedMotion.addListener === 'function') {
        reducedMotion.addListener(onMotionPreferenceChange);
    }

    if (!root.classList.contains('home-motion-pending')) return;

    if (reducedMotion.matches || typeof Element.prototype.animate !== 'function') {
        root.classList.remove('home-motion-pending');
        return;
    }

    function animateElement(element, fromTransform, duration, delay) {
        if (!element) return;

        const opacity = getComputedStyle(element).opacity;

        const animation = element.animate(
            [
                { opacity: 0, transform: fromTransform },
                { opacity: opacity, transform: 'none' }
            ],
            {
                duration: duration,
                delay: delay,
                easing: 'cubic-bezier(.2, .7, .2, 1)',
                fill: 'both'
            }
        );

        animations.add(animation);

        animation.addEventListener('finish', () => {
            animations.delete(animation);
            animation.cancel();
        }, { once: true });
    }

    root.classList.remove('home-motion-pending');

    try {
        /* Вступление при открытии страницы */

        const entrance = [
            ['.header', 'translateY(-12px)', 650, 40],
            ['.hero-content > .hello', 'translateY(22px)', 650, 160],
            ['.hero-content > .daniel1', 'translateY(22px)', 720, 240],
            ['.hero-content > .bernovskyi', 'translateY(22px)', 720, 360],
            ['.hero-content > .webDeveloper', 'translateY(22px)', 650, 480],
            ['.hero-content > .description', 'translateY(22px)', 650, 560],
            ['.hero-content > .buttons', 'translateY(22px)', 650, 680],
            ['.hero .my-photo3d', 'translateX(28px) scale(.97)', 950, 370],
            ['.hero-particles', 'none', 800, 1000]
        ];

        entrance.forEach(([selector, transform, duration, delay]) => {
            animateElement(
                document.querySelector(selector),
                transform,
                duration,
                delay
            );
        });

        /* Блоки с навыками появляются по очереди */

        document.querySelectorAll('.hero-content .skills > span')
            .forEach((element, index) => {
                animateElement(
                    element,
                    'translate(16px, 12px)',
                    650,
                    790 + index * 80
                );
            });

        /* Появление элементов при прокрутке */

        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const element = entry.target;
                    observer.unobserve(element);

                    const delay = Number(element.dataset.homeMotionDelay || 0);
                    animateElement(element, 'translateY(24px)', 720, delay);
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -8% 0px'
            });

            const cards = document.querySelectorAll(
                '.featured-work .projects > div'
            );

            cards.forEach((element, index) => {
                element.dataset.homeMotionDelay = String((index % 3) * 110);
                observer.observe(element);
            });

            [
                '.featured-work .featured-projects',
                '.featured-work .some',
                '.contact-section .lets-work',
                '.contact-section .icons'
            ].forEach((selector, index) => {
                const element = document.querySelector(selector);

                if (!element) return;

                element.dataset.homeMotionDelay = String((index % 2) * 100);
                observer.observe(element);
            });
        }
    } catch (error) {
        animations.forEach(animation => animation.cancel());
        animations.clear();

        if (observer) observer.disconnect();

        console.error('Home animation could not start:', error);
    }
})();