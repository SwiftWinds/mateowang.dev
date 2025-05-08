document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const glassCard = document.getElementById('glassCard');

    const numStars = 150;
    const numShootingStarsMax = 3;
    let activeShootingStars = 0;

    // ... (Star generation code - keep as is) ...
    // Create twinkling stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        starContainer.appendChild(star);
    }

    // Create shooting stars
    function createShootingStar() {
        if (activeShootingStars >= numShootingStarsMax) return;
        activeShootingStars++;

        const star = document.createElement('div');
        star.classList.add('shooting-star');

        const fromLeft = Math.random() > 0.5;
        const startY = Math.random() * window.innerHeight * 0.6;
        const startX = fromLeft ? -100 : window.innerWidth + 100;

        star.style.top = `${startY}px`;
        star.style.left = `${startX}px`;

        const travelX = (fromLeft ? 1 : -1) * (window.innerWidth * (Math.random() * 0.5 + 0.5) + 200);
        const travelY = (Math.random() * 0.4 + 0.1) * window.innerHeight;
        const duration = Math.random() * 3 + 2.5;
        const tailLength = Math.random() * 150 + 100;

        star.style.width = `${tailLength}px`;
        star.style.setProperty('--start-x', '0px');
        star.style.setProperty('--start-y', '0px');
        star.style.setProperty('--travel-x', `${travelX}px`);
        star.style.setProperty('--travel-y', `${travelY}px`);
        star.style.animationDuration = `${duration}s`;

        star.addEventListener('animationstart', () => {
            star.style.opacity = '1';
        });

        star.addEventListener('animationend', () => {
            star.remove();
            activeShootingStars--;
        });
        starContainer.appendChild(star);
    }
    setInterval(createShootingStar, () => Math.random() * 4000 + 1000);


    // Glass card effects
    if (glassCard) { // glassCard is already defined as glassCardForProximity, or get it again
        const glassCardElement = document.getElementById('glassCard'); // Use a distinct variable if needed

        glassCardElement.addEventListener('mousemove', (e) => {
            const elementRect = glassCardElement.getBoundingClientRect();

            // --- Parallax Effect ---
            const xRelativeToCard = e.clientX - elementRect.left - elementRect.width / 2;
            const yRelativeToCard = e.clientY - elementRect.top - elementRect.height / 2;
            const rotateY = (xRelativeToCard / (elementRect.width / 2)) * 8;
            const rotateX = (-yRelativeToCard / (elementRect.height / 2)) * 8;
            glassCardElement.style.transform = `rotateX(<span class="math-inline">\{rotateX\}deg\) rotateY\(</span>{rotateY}deg) scale(1.03)`;

            // --- Radial Lighting on Surface (::before pseudo-element) ---
            // Position is updated only when mouse is over glassCardElement.
            // Opacity is controlled by .glass-container:hover::before in CSS.
            const lightXPercent = ((e.clientX - elementRect.left) / elementRect.width) * 100;
            const lightYPercent = ((e.clientY - elementRect.top) / elementRect.height) * 100;
            glassCardElement.style.setProperty('--mouse-x', `${lightXPercent}%`);
            glassCardElement.style.setProperty('--mouse-y', `${lightYPercent}%`);
        });

        glassCardElement.addEventListener('mouseenter', () => {
            // Parallax scale is handled in mousemove for continuous effect while over.
            // Opacity of ::before is handled by CSS :hover.
            // No specific actions needed here unless you want a one-time scale on enter.
        });

        glassCardElement.addEventListener('mouseleave', () => {
            glassCardElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            // DO NOT reset --mouse-x, --mouse-y for the ::before surface light here.
            // Its opacity will go to 0 via CSS :hover, making its last position irrelevant
            // and preventing the "flash to center" issue.
        });
    }

    // Create and append the global mouse glow element
    const mouseGlowBorderLight = document.createElement('div');
    mouseGlowBorderLight.id = 'mouse-glow-border-light';
    document.body.appendChild(mouseGlowBorderLight);

    const glassCardForProximity = document.getElementById('glassCard');
    let glassCardRect = glassCardForProximity ? glassCardForProximity.getBoundingClientRect() : null;
    let glowBorderTimeout;

    function updateGlassCardRect() {
        if (glassCardForProximity) {
            glassCardRect = glassCardForProximity.getBoundingClientRect();
        }
    }
    window.addEventListener('resize', updateGlassCardRect);
    window.addEventListener('scroll', updateGlassCardRect, true);
    updateGlassCardRect(); // Initial call

    document.addEventListener('mousemove', (e) => {
        mouseGlowBorderLight.style.left = `${e.clientX}px`;
        mouseGlowBorderLight.style.top = `${e.clientY}px`;

        if (!glassCardRect) return;

        const proximityZone = 100; // Glow starts fading from this distance (mouse to edge)
        const fullGlowZone = 20;   // Glow is at max configured opacity when mouse is this close or closer
        // Range for fade: proximityZone - fullGlowZone (e.g., 100-20 = 80px)
        const maxBorderGlowOpacity = 0.95; // Max visual opacity for the border glow (0.0 to 1.0)


        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const closestX = Math.max(glassCardRect.left, Math.min(mouseX, glassCardRect.right));
        const closestY = Math.max(glassCardRect.top, Math.min(mouseY, glassCardRect.bottom));

        const distanceX = mouseX - closestX;
        const distanceY = mouseY - closestY;
        const distanceToEdge = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let calculatedOpacity = 0;
        if (distanceToEdge < proximityZone) {
            if (distanceToEdge <= fullGlowZone) {
                calculatedOpacity = 1.0; // Raw opacity is 1 within fullGlowZone
            } else {
                // Linear fade from 1.0 down to 0.0 over the range (proximityZone - fullGlowZone)
                calculatedOpacity = 1.0 - (distanceToEdge - fullGlowZone) / (proximityZone - fullGlowZone);
            }
        }

        const targetOpacity = Math.min(calculatedOpacity, 1.0) * maxBorderGlowOpacity; // Apply overall max opacity

        mouseGlowBorderLight.style.opacity = targetOpacity.toFixed(3);

        if (targetOpacity > 0.001) { // Use a small threshold to avoid floating point issues with === 0
            mouseGlowBorderLight.style.display = 'block';
        } else {
            clearTimeout(glowBorderTimeout); // Clear any pending hide
            // Only hide if opacity calculation is effectively zero
            // No timeout needed if opacity transition in CSS is removed or very fast
            mouseGlowBorderLight.style.display = 'none';
        }
    });

    // Initial state
    mouseGlowBorderLight.style.opacity = '0';
    mouseGlowBorderLight.style.display = 'none';
});