// Hand-drawn chrome for the sub-pages: a wobbling squircle around every
// .stage, the boiling-line filters the CSS animations reference, and the
// shared footer. index.html carries its own copy, built around its
// full-screen stage and the cut-out trinkets.

// The three distortions .wiggle hops between, same seeds as index.html
const FILTER_DEFS = `
	<svg width="0" height="0" style="position: absolute" aria-hidden="true">
		<defs>
			<filter id="wiggle-1" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
				<feDisplacementMap in="SourceGraphic" scale="2.5" />
			</filter>
			<filter id="wiggle-2" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="17" />
				<feDisplacementMap in="SourceGraphic" scale="2.5" />
			</filter>
			<filter id="wiggle-3" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="42" />
				<feDisplacementMap in="SourceGraphic" scale="2.5" />
			</filter>
		</defs>
	</svg>
`;

// Same links as the footer on index.html; edit them in both places
const FOOTER_LINKS = [
	{
		href: "https://github.com/SwiftWinds",
		label: "GitHub",
		external: true,
		path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
	},
	{
		href: "mailto:hey@mateowang.dev",
		label: "Email",
		path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
	},
	{
		href: "https://linkedin.com/in/mateo-wang",
		label: "LinkedIn",
		external: true,
		path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
	},
	{
		href: "/resume.pdf",
		label: "Resume",
		external: true,
		path: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
	},
];

document.body.insertAdjacentHTML("beforeend", FILTER_DEFS);

const footer = document.querySelector("footer.footer");
if (footer) {
	footer.innerHTML = FOOTER_LINKS.map(
		({ href, label, external, path }) => `
		<a
			href="${href}"
			class="footer-link"
			${external ? 'target="_blank" rel="noopener"' : ""}
			aria-label="${label}"
		>
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path d="${path}" />
			</svg>
			<span class="footer-label">${label}</span>
		</a>`,
	).join("");
}

// How far along the outline the waves have crept. Shared by every stage on the
// page so their lines boil in step.
let wavePhase = 0;

// Hand-drawn squircle around one .stage. The wobble is a function of position
// along the outline, shifted by wavePhase so the waves creep clockwise.
function squircleFor(stage) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("class", "squircle");
	svg.setAttribute("aria-hidden", "true");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	svg.append(path);
	stage.prepend(svg);

	return function draw() {
		const w = stage.clientWidth;
		const h = stage.clientHeight;
		if (!w || !h) return;
		const r = Math.min(w, h) * 0.3;
		const n = 4; // superellipse exponent for the corners

		// Outline as a list of points: straight edges plus superellipse corners
		const outline = [];
		const corner = (cx, cy, startAngle) => {
			for (let i = 0; i <= 24; i++) {
				const a = startAngle + (i / 24) * (Math.PI / 2);
				const c = Math.cos(a);
				const s = Math.sin(a);
				outline.push([
					cx + r * Math.sign(c) * Math.abs(c) ** (2 / n),
					cy + r * Math.sign(s) * Math.abs(s) ** (2 / n),
				]);
			}
		};
		corner(w - r, r, -Math.PI / 2);
		corner(w - r, h - r, 0);
		corner(r, h - r, Math.PI / 2);
		corner(r, r, Math.PI);
		outline.push(outline[0]);

		// Cumulative length, for sampling evenly by distance
		const lengths = [0];
		for (let i = 1; i < outline.length; i++) {
			const [ax, ay] = outline[i - 1];
			const [bx, by] = outline[i];
			lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
		}
		const total = lengths[lengths.length - 1];
		// Start the stroke at the bottom-left, away from the heading
		const start = lengths[50];

		const pointAt = (d) => {
			d = ((d % total) + total) % total;
			let i = 1;
			while (lengths[i] < d) i++;
			const t = (d - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
			const [ax, ay] = outline[i - 1];
			const [bx, by] = outline[i];
			return [ax + (bx - ax) * t, ay + (by - ay) * t];
		};

		// t increases clockwise, so subtracting the phase moves waves clockwise
		const wobble = (u) => {
			const t = u - wavePhase;
			return (
				4.5 * Math.sin(2 * Math.PI * 2 * t + 0.7) +
				3.2 * Math.sin(2 * Math.PI * 5 * t + 2.1) +
				2.2 * Math.sin(2 * Math.PI * 9 * t + 4.4) +
				1.4 * Math.sin(2 * Math.PI * 17 * t + 1.3) +
				0.8 * Math.sin(2 * Math.PI * 29 * t + 5.2)
			);
		};

		// Sample a little past the start so the line overlaps itself, drifting
		// outward as it goes, like a pen that doesn't land where it began
		const overlap = 0.04;
		const count = Math.max(48, Math.round(total / 14));
		const points = [];
		for (let i = 0; i <= count * (1 + overlap); i++) {
			const t = i / count;
			const [px, py] = pointAt(start + t * total);
			const [qx, qy] = pointAt(start + t * total + 1);
			const len = Math.hypot(qx - px, qy - py) || 1;
			const nx = (qy - py) / len;
			const ny = -(qx - px) / len;
			const off = wobble(t) + (5 * Math.max(0, t - 1)) / overlap;
			points.push([px + nx * off, py + ny * off]);
		}

		// Catmull-Rom through the points, as cubic Beziers.
		let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
		for (let i = 0; i < points.length - 1; i++) {
			const p0 = points[Math.max(0, i - 1)];
			const p1 = points[i];
			const p2 = points[i + 1];
			const p3 = points[Math.min(points.length - 1, i + 2)];
			const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
			const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
			d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
		}
		path.setAttribute("d", d);
	};
}

const draws = [...document.querySelectorAll(".stage")].map((stage) => {
	const draw = squircleFor(stage);
	new ResizeObserver(draw).observe(stage);
	return draw;
});

// Step the waves along in small hops (~12fps), like hand-drawn frames
const WAVE_STEP = 0.004; // fraction of the outline per hop
const WAVE_FRAME_MS = 1000 / 12;
if (draws.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
	let lastHop = 0;
	const tick = (now) => {
		if (now - lastHop >= WAVE_FRAME_MS) {
			lastHop = now;
			wavePhase = (wavePhase + WAVE_STEP) % 1;
			for (const draw of draws) draw();
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}
