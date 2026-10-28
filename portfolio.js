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
const ctx = canvas.getContext('2d');
const mouse = {x: null, y: null};
const hero = document.querySelector('.hero');

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

function syncCanvasSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) {
        canvasVisible = false;
        return;
    }

    canvas.width = width;
    canvas.height = height;

    particles.forEach((particle) => {
        particle.x = Math.min(particle.x, width);
        particle.y = Math.min(particle.y, height);
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
    requestAnimationFrame(animate);
}
syncCanvasSize();

if (canvasVisible) {
    animate();
}