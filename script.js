document.addEventListener('DOMContentLoaded', () => {
    // --- Starfield Effect ---
    const starContainer = document.getElementById('star-container');
    const numStars = 150;
    const numShootingStars = 3;

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`; // Varied twinkle speed
        return star;
    }

    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.left = `${Math.random() * 60 + 20}%`; // Start more centered
        shootingStar.style.top = `${Math.random() * 40 + 10}%`; // Start higher up
        shootingStar.style.width = `${Math.random() * 70 + 50}px`; // Length of tail
        shootingStar.style.animationDelay = `${Math.random() * 10 + 2}s`; // Staggered start times
        shootingStar.style.animationDuration = `${Math.random() * 2 + 2}s`; // Varied speed
        return shootingStar;
    }

    if (starContainer) {
        for (let i = 0; i < numStars; i++) {
            starContainer.appendChild(createStar());
        }
        for (let i = 0; i < numShootingStars; i++) {
            starContainer.appendChild(createShootingStar());
        }
    }

    // --- Border Glow Effect ---
    const mouseGlowBorderLight = document.createElement('div');
    mouseGlowBorderLight.id = 'mouse-glow-border-light';
    document.body.appendChild(mouseGlowBorderLight);

    const glassCardForProximity = document.getElementById('glassCard');
    let glassCardRect = glassCardForProximity ? glassCardForProximity.getBoundingClientRect() : null;
    let glowBorderTimeout; // Not strictly needed if display is set directly

    function updateGlassCardRect() {
        if (glassCardForProximity) {
            glassCardRect = glassCardForProximity.getBoundingClientRect();
        }
    }
    window.addEventListener('resize', updateGlassCardRect);
    window.addEventListener('scroll', updateGlassCardRect, true); // Capture phase for accuracy
    updateGlassCardRect(); // Initial call

    document.addEventListener('mousemove', (e) => {
        // Position the global border glow light
        mouseGlowBorderLight.style.left = `${e.clientX}px`;
        mouseGlowBorderLight.style.top = `${e.clientY}px`;

        if (!glassCardRect) return;

        const proximityZone = 100; // Glow starts fading from this distance (mouse to edge)
        const fullGlowZone = 20;   // Glow is at max configured opacity when mouse is this close or closer
        const maxBorderGlowOpacity = 0.95; // Max visual opacity for the border glow (0.0 to 1.0)

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate closest point on the rectangle's perimeter to the mouse
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

        const targetOpacity = Math.min(calculatedOpacity, 1.0) * maxBorderGlowOpacity;

        mouseGlowBorderLight.style.opacity = targetOpacity.toFixed(3);

        if (targetOpacity > 0.001) {
            mouseGlowBorderLight.style.display = 'block';
        } else {
            mouseGlowBorderLight.style.display = 'none';
        }
    });

    // Initial state for the border glow light
    mouseGlowBorderLight.style.opacity = '0';
    mouseGlowBorderLight.style.display = 'none';


    // --- Glass Card Effects (Parallax & Surface Light) ---
    const glassCardElement = document.getElementById('glassCard');
    if (glassCardElement) {
        glassCardElement.addEventListener('mousemove', (e) => {
            const elementRect = glassCardElement.getBoundingClientRect(); // Get current rect on each move

            // Parallax Effect
            const xRelativeToCard = e.clientX - elementRect.left - elementRect.width / 2;
            const yRelativeToCard = e.clientY - elementRect.top - elementRect.height / 2;
            const rotateY = (xRelativeToCard / (elementRect.width / 2)) * 7; // Reduced rotation slightly
            const rotateX = (-yRelativeToCard / (elementRect.height / 2)) * 7; // Reduced rotation slightly
            glassCardElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

            // Surface Radial Light (::before pseudo-element) Position
            // Opacity is controlled by .glass-container:hover::before in CSS.
            const lightXPercent = ((e.clientX - elementRect.left) / elementRect.width) * 100;
            const lightYPercent = ((e.clientY - elementRect.top) / elementRect.height) * 100;
            glassCardElement.style.setProperty('--mouse-x', `${lightXPercent}%`);
            glassCardElement.style.setProperty('--mouse-y', `${lightYPercent}%`);
        });

        glassCardElement.addEventListener('mouseleave', () => {
            glassCardElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            // DO NOT reset --mouse-x, --mouse-y for the ::before surface light here.
            // Its opacity will go to 0 via CSS :hover, making its last position irrelevant
            // and preventing the "flash to center" issue.
        });
    }
});