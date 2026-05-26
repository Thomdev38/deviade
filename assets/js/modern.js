/* ============================================================
   DEVIADE — Modern Interactions & Animations
   ============================================================ */
(() => {
	'use strict';

	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

	/* ---------- Sticky nav ---------- */
	const nav = $('.nav');
	if (nav) {
		const onScroll = () => {
			if (window.scrollY > 30) nav.classList.add('scrolled');
			else nav.classList.remove('scrolled');
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		const burger = $('.nav-burger');
		const links = $('.nav-links');
		if (burger && links) {
			burger.addEventListener('click', () => {
				burger.classList.toggle('open');
				links.classList.toggle('open');
			});
			$$('.nav-links a').forEach(a =>
				a.addEventListener('click', () => {
					burger.classList.remove('open');
					links.classList.remove('open');
				})
			);
		}
	}

	/* ---------- Scroll reveal ---------- */
	const revealEls = $$('.reveal');
	if ('IntersectionObserver' in window && revealEls.length) {
		const io = new IntersectionObserver(
			entries => {
				entries.forEach(e => {
					if (e.isIntersecting) {
						e.target.classList.add('in');
						io.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
		);
		revealEls.forEach(el => io.observe(el));
	} else {
		revealEls.forEach(el => el.classList.add('in'));
	}

	/* ---------- App card spotlight (mouse follow) ---------- */
	$$('.app-card').forEach(card => {
		card.addEventListener('mousemove', e => {
			const rect = card.getBoundingClientRect();
			const mx = ((e.clientX - rect.left) / rect.width) * 100;
			const my = ((e.clientY - rect.top) / rect.height) * 100;
			card.style.setProperty('--mx', mx + '%');
			card.style.setProperty('--my', my + '%');
		});
	});

	/* ---------- Cursor glow ---------- */
	const hasHover = window.matchMedia('(hover: hover)').matches;
	if (hasHover) {
		const glow = document.createElement('div');
		glow.className = 'cursor-glow';
		document.body.appendChild(glow);
		let tx = window.innerWidth / 2;
		let ty = window.innerHeight / 2;
		let cx = tx;
		let cy = ty;

		window.addEventListener('mousemove', e => {
			tx = e.clientX;
			ty = e.clientY;
		});

		const animate = () => {
			cx += (tx - cx) * 0.08;
			cy += (ty - cy) * 0.08;
			glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
			requestAnimationFrame(animate);
		};
		animate();
	}

	/* ---------- Hero phone parallax (subtle) ---------- */
	const phones = $$('.phone');
	if (phones.length && hasHover) {
		const visual = $('.hero-visual');
		if (visual) {
			visual.addEventListener('mousemove', e => {
				const rect = visual.getBoundingClientRect();
				const x = (e.clientX - rect.left) / rect.width - 0.5;
				const y = (e.clientY - rect.top) / rect.height - 0.5;
				phones.forEach((p, i) => {
					const factor = i === 0 ? 12 : i === 1 ? 18 : 18;
					const base = p.dataset.base || '';
					p.style.transform = `${base} translate(${x * factor}px, ${y * factor}px)`;
				});
			});
			visual.addEventListener('mouseleave', () => {
				phones.forEach(p => {
					const base = p.dataset.base || '';
					p.style.transform = base;
				});
			});
			phones.forEach(p => {
				const cs = getComputedStyle(p);
				p.dataset.base = cs.transform === 'none' ? '' : cs.transform;
			});
		}
	}

	/* ---------- Counter animation ---------- */
	const counters = $$('[data-count]');
	if (counters.length && 'IntersectionObserver' in window) {
		const animateCount = el => {
			const target = parseInt(el.dataset.count, 10);
			const suffix = el.dataset.suffix || '';
			const duration = 1600;
			const start = performance.now();
			const tick = now => {
				const p = Math.min((now - start) / duration, 1);
				const eased = 1 - Math.pow(1 - p, 3);
				el.textContent = Math.round(target * eased) + suffix;
				if (p < 1) requestAnimationFrame(tick);
				else el.textContent = target + suffix;
			};
			requestAnimationFrame(tick);
		};

		const cIo = new IntersectionObserver(
			entries => {
				entries.forEach(e => {
					if (e.isIntersecting) {
						animateCount(e.target);
						cIo.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.6 }
		);
		counters.forEach(c => cIo.observe(c));
	}

	/* ---------- Magnetic buttons ---------- */
	if (hasHover) {
		$$('[data-magnetic]').forEach(btn => {
			btn.addEventListener('mousemove', e => {
				const rect = btn.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;
				btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = '';
			});
		});
	}

	/* ---------- Smooth scroll for anchor links ---------- */
	$$('a[href^="#"]').forEach(a => {
		a.addEventListener('click', e => {
			const id = a.getAttribute('href');
			if (id.length <= 1) return;
			const target = $(id);
			if (!target) return;
			e.preventDefault();
			const top = target.getBoundingClientRect().top + window.scrollY - 80;
			window.scrollTo({ top, behavior: 'smooth' });
		});
	});

	/* ---------- Year ---------- */
	$$('.js-year').forEach(el => (el.textContent = new Date().getFullYear()));
})();
