
/* =========================================
   AKHIRANANDH — PORTFOLIO INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* PAGE LOADER */

    const loader = document.getElementById("page-loader");

    function hideLoader() {
        if (loader) {
            loader.classList.add("loaded");
        }
    }

    window.addEventListener("load", hideLoader);

    setTimeout(hideLoader, 2500);


    /* NAVIGATION */

    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    function updateNavbar() {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        }
    }

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });


    /* ACTIVE NAVIGATION */

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {

        const navObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navItems.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${entry.target.id}`
                        );

                    });

                }

            });

        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        sections.forEach(section => navObserver.observe(section));
    }


    /* SCROLL REVEAL */

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {

        const revealObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        revealItems.forEach(item => revealObserver.observe(item));

    } else {

        revealItems.forEach(item => item.classList.add("visible"));

    }


    /* PARTICLE NETWORK */

    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && !reduceMotion) {

        let width = 0;
        let height = 0;
        let particles = [];

        const particleCount = window.innerWidth < 600 ? 25 : 42;
        const connectionDistance = 130;

        function resizeCanvas() {

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            particles = Array.from({ length: particleCount }, () => ({

                x: Math.random() * width,
                y: Math.random() * height,

                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,

                radius: Math.random() * 1.2 + 0.5

            }));

        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        function animateParticles() {

            ctx.clearRect(0, 0, width, height);

            particles.forEach((particle, index) => {

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > width) {
                    particle.vx *= -1;
                }

                if (particle.y < 0 || particle.y > height) {
                    particle.vy *= -1;
                }

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "rgba(255, 105, 70, 0.65)";
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {

                    const other = particles[j];

                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {

                        ctx.beginPath();

                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);

                        ctx.strokeStyle =
                            `rgba(255, 100, 65, ${0.10 * (1 - distance / connectionDistance)})`;

                        ctx.lineWidth = 0.6;
                        ctx.stroke();

                    }

                }

            });

            requestAnimationFrame(animateParticles);

        }

        animateParticles();

    } else if (canvas) {

        canvas.style.display = "none";

    }


    /* SUBTLE PORTRAIT PARALLAX */

    const heroVisual = document.getElementById("hero-visual");

    if (
        heroVisual &&
        !reduceMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener("pointermove", event => {

            targetX = (event.clientX / window.innerWidth - 0.5) * 7;
            targetY = (event.clientY / window.innerHeight - 0.5) * 5;

        }, { passive: true });

        function movePortrait() {

            currentX += (targetX - currentX) * 0.025;
            currentY += (targetY - currentY) * 0.025;

            heroVisual.style.setProperty("--parallax-x", `${currentX}px`);
            heroVisual.style.setProperty("--parallax-y", `${currentY}px`);

            heroVisual.style.translate = `${currentX}px ${currentY}px`;

            requestAnimationFrame(movePortrait);

        }

        movePortrait();

    }


    /* PROJECT CARD TILT */

    const projectCards = document.querySelectorAll(".project-card");

    if (
        !reduceMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        projectCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 3;
                const rotateX = (0.5 - y) * 3;

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            });

            card.addEventListener("pointerleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* FINAL INITIALIZATION */

    console.log(
        "%c AKHIRANANDH PORTFOLIO ",
        "background:#ff3935;color:white;padding:8px;font-weight:bold;"
    );

    console.log("Portfolio initialized successfully.");

});
