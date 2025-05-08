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
    if (glassCard) {
        glassCard.addEventListener('mousemove', (e) => {
            const mouseXGlobal = e.clientX;
            const mouseYGlobal = e.clientY;
            const elementRect = glassCard.getBoundingClientRect();

            // --- Parallax Effect ---
            const xRelativeToCard = mouseXGlobal - elementRect.left - elementRect.width / 2;
            const yRelativeToCard = mouseYGlobal - elementRect.top - elementRect.height / 2;
            const rotateY = (xRelativeToCard / (elementRect.width / 2)) * 8;
            const rotateX = (-yRelativeToCard / (elementRect.height / 2)) * 8;
            glassCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

            // --- Radial Lighting on Surface (::before pseudo-element) ---
            const lightXPercent = ((mouseXGlobal - elementRect.left) / elementRect.width) * 100;
            const lightYPercent = ((mouseYGlobal - elementRect.top) / elementRect.height) * 100;
            glassCard.style.setProperty('--mouse-x', `${lightXPercent}%`);
            glassCard.style.setProperty('--mouse-y', `${lightYPercent}%`);

            // --- New Edge Lighting with Mask (::after pseudo-element) ---
            const mouseXInElement = mouseXGlobal - elementRect.left;
            const mouseYInElement = mouseYGlobal - elementRect.top;

            const edgeProximityThreshold = 90; // How close mouse needs to be to an edge for full glow (px)
            const minProximityForAnyGlow = 160; // Mouse must be at least this close to see any glow
            const maxGlowIntensity = 1.0;

            let minDistToEdge = Infinity;
            let finalMaskX = '50%'; // Default to center if not near an edge
            let finalMaskY = '50%';
            let calculatedOpacity = 0;

            // Distances to each edge's line
            const distTop = Math.abs(mouseYInElement);
            const distBottom = Math.abs(mouseYInElement - elementRect.height);
            const distLeft = Math.abs(mouseXInElement);
            const distRight = Math.abs(mouseXInElement - elementRect.width);

            // Check Top Edge
            if (mouseXInElement >= 0 && mouseXInElement <= elementRect.width) { // Is mouse horizontally within card?
                if (distTop < minDistToEdge) minDistToEdge = distTop;
                if (distTop < minProximityForAnyGlow) {
                    const currentOpacity = (1 - Math.max(0, distTop - 0) / edgeProximityThreshold) * maxGlowIntensity;
                    if (currentOpacity > calculatedOpacity) {
                        calculatedOpacity = currentOpacity;
                        finalMaskX = `${(mouseXInElement / elementRect.width) * 100}%`;
                        finalMaskY = `0%`; // Project mask center onto the top edge
                    }
                }
            }
            // Check Bottom Edge
            if (mouseXInElement >= 0 && mouseXInElement <= elementRect.width) {
                if (distBottom < minDistToEdge) minDistToEdge = distBottom;
                if (distBottom < minProximityForAnyGlow) {
                    const currentOpacity = (1 - Math.max(0, distBottom - 0) / edgeProximityThreshold) * maxGlowIntensity;
                    if (currentOpacity > calculatedOpacity) {
                        calculatedOpacity = currentOpacity;
                        finalMaskX = `${(mouseXInElement / elementRect.width) * 100}%`;
                        finalMaskY = `100%`; // Project mask center onto the bottom edge
                    }
                }
            }
            // Check Left Edge
            if (mouseYInElement >= 0 && mouseYInElement <= elementRect.height) { // Is mouse vertically within card?
                if (distLeft < minDistToEdge) minDistToEdge = distLeft;
                if (distLeft < minProximityForAnyGlow) {
                    const currentOpacity = (1 - Math.max(0, distLeft - 0) / edgeProximityThreshold) * maxGlowIntensity;
                    if (currentOpacity > calculatedOpacity) {
                        calculatedOpacity = currentOpacity;
                        finalMaskX = `0%`; // Project mask center onto the left edge
                        finalMaskY = `${(mouseYInElement / elementRect.height) * 100}%`;
                    }
                }
            }
            // Check Right Edge
            if (mouseYInElement >= 0 && mouseYInElement <= elementRect.height) {
                if (distRight < minDistToEdge) minDistToEdge = distRight;
                if (distRight < minProximityForAnyGlow) {
                    const currentOpacity = (1 - Math.max(0, distRight - 0) / edgeProximityThreshold) * maxGlowIntensity;
                    if (currentOpacity > calculatedOpacity) {
                        calculatedOpacity = currentOpacity;
                        finalMaskX = `100%`; // Project mask center onto the right edge
                        finalMaskY = `${(mouseYInElement / elementRect.height) * 100}%`;
                    }
                }
            }

            // If the closest calculated distance is still too far, no glow.
            if (minDistToEdge > minProximityForAnyGlow) {
                calculatedOpacity = 0;
            }

            glassCard.style.setProperty('--edge-mask-x', finalMaskX);
            glassCard.style.setProperty('--edge-mask-y', finalMaskY);
            glassCard.style.setProperty('--edge-mask-opacity', `${Math.max(0, Math.min(calculatedOpacity, maxGlowIntensity))}`);
        });

        glassCard.addEventListener('mouseleave', () => {
            glassCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            // Reset radial surface light
            glassCard.style.setProperty('--mouse-x', '50%');
            glassCard.style.setProperty('--mouse-y', '50%');
            // Reset edge mask
            glassCard.style.setProperty('--edge-mask-opacity', '0');
            glassCard.style.setProperty('--edge-mask-x', '50%'); // Reset position for consistency
            glassCard.style.setProperty('--edge-mask-y', '50%');
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
        // Position the global glow light
        mouseGlowBorderLight.style.left = `${e.clientX}px`;
        mouseGlowBorderLight.style.top = `${e.clientY}px`;

        if (!glassCardRect) return;

        const proximityZone = 200; // px: How far from card's edge the glow starts fading in
        const fullGlowZone = 50;   // px: Distance at which glow is at max configured opacity

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate closest point on the rectangle's perimeter to the mouse
        const closestX = Math.max(glassCardRect.left, Math.min(mouseX, glassCardRect.right));
        const closestY = Math.max(glassCardRect.top, Math.min(mouseY, glassCardRect.bottom));

        const distanceX = mouseX - closestX;
        const distanceY = mouseY - closestY;
        const distanceToEdge = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let targetOpacity = 0;
        if (distanceToEdge < proximityZone) {
            // Calculate opacity: 1 when very close (<= fullGlowZone), fading to 0 at proximityZone
            targetOpacity = 1 - Math.max(0, (distanceToEdge - fullGlowZone)) / (proximityZone - fullGlowZone);
            // Clamp opacity to a max desired visual strength for the border glow (e.g., 0.3-0.5 for white)
            targetOpacity = Math.min(targetOpacity, 0.35);
        }

        mouseGlowBorderLight.style.opacity = targetOpacity.toFixed(2);

        // This ensures the display:block is set if opacity becomes > 0
        if (targetOpacity > 0) {
            mouseGlowBorderLight.style.display = 'block';
        } else if (mouseGlowBorderLight.style.opacity === '0.00' || mouseGlowBorderLight.style.opacity === '0') {
            // Only hide if opacity is truly zero after calculations.
            // A timeout can prevent flickering if mouse jitters at the edge of opacity change.
            clearTimeout(glowBorderTimeout);
            glowBorderTimeout = setTimeout(() => {
                if (parseFloat(mouseGlowBorderLight.style.opacity) === 0) {
                    mouseGlowBorderLight.style.display = 'none';
                }
            }, 50); // Short delay
        }
    });

    // Initial state
    mouseGlowBorderLight.style.opacity = '0';
    mouseGlowBorderLight.style.display = 'none';
});