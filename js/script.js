document.addEventListener('DOMContentLoaded', () => {
    // 0. Micro-Interaction: Cursor Glow Tracking
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX);
        document.documentElement.style.setProperty('--mouse-y', e.clientY);
    }, { passive: true });

    // 1. Theme Toggle & Mobile Menu Logic
    const themeToggle = document.querySelector('#theme-toggle');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Set new theme
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            // Force browser repaint to overcome WebKit variable invalidation bug
            document.body.style.display = 'none';
            void document.body.offsetHeight; 
            document.body.style.display = '';
        });
    }

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. The Signature Visual: Incident Trace Logic
    const traceLine = document.querySelector('#incident-trace');
    const systemCards = document.querySelectorAll('.system-card');
    const navLogo = document.querySelector('#nav-progress-logo');

    const updateScrollVisuals = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const scrollY = window.scrollY;

        // 1. Decoupled Branding Engine
        const journeyFollower = document.querySelector('.logo-journey-follower');
        const journeyImage = document.querySelector('.logo-journey-image');
        const heroSection = document.querySelector('#hero');
        
        if (journeyFollower && journeyImage && heroSection) {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
            const totalAfterHero = totalScrollable - heroHeight;
            
            // --- A. Progress Calculations ---
            // Global progress (0 to 1 over entire page) for the Zoom Pulse
            const pGlobal = Math.min(scrollY / totalScrollable, 1);
            
            // Segment progress (Starts after Hero) for the Path Motion
            const pMotion = (scrollY > heroHeight)
                ? Math.min((scrollY - heroHeight) / totalAfterHero, 1)
                : 0;
            
            // --- B. Engineered Pacing (Path Only) ---
            const remapMotion = (val) => {
                if (val < 0.3) return val * 0.6; 
                if (val < 0.6) return 0.18 + (val - 0.3) * 2.1;
                return 0.81 + (val - 0.6) * 0.475;
            };
            
            const adjustedMotion = remapMotion(pMotion);
            const snap = (v) => Math.round(v * 1000) / 1000;
            
            // Set Path Distance on PARENT (Reverse Trace: 100 -> 0)
            const currentDistance = (scrollY > heroHeight) 
                ? (1 - snap(adjustedMotion)) * 100 
                : 100;
            
            journeyFollower.style.offsetDistance = `${currentDistance}%`;

            // --- C. Super-Zoom Pulse on CHILD (Double-Pulse) ---
            /* Previous Logic:
            const maxScale = 55;
            const minScale = 7;
            const pulseScale = (pGlobal <= 0.5)
                ? minScale + (pGlobal * 2) * (maxScale - minScale)
                : maxScale - ((pGlobal - 0.5) * 2) * (maxScale - minScale);
            */
            
            // New Double-Pulse Engine: minScale -> maxScale -> minScale -> maxScale -> minScale
            const maxScale = 15;
            const minScale = 7;
            let pulseScale;
            if (pGlobal < 0.25) {
                // Phase 1: minScale -> maxScale
                pulseScale = minScale + (pGlobal / 0.25) * (maxScale - minScale);
            } else if (pGlobal < 0.50) {
                // Phase 2: maxScale -> minScale
                pulseScale = maxScale - ((pGlobal - 0.25) / 0.25) * (maxScale - minScale);
            } else if (pGlobal < 0.75) {
                // Phase 3: minScale -> maxScale
                pulseScale = minScale + ((pGlobal - 0.50) / 0.25) * (maxScale - minScale);
            } else {
                // Phase 4: maxScale -> minScale
                pulseScale = maxScale - ((pGlobal - 0.75) / 0.25) * (maxScale - minScale);
            }
            
            journeyImage.style.transform = `scale(${pulseScale}) translateZ(0)`;
            
            // Visibility
            const themeOpacity = document.documentElement.getAttribute('data-theme') === 'light' ? '0.08' : '0.12';
            journeyImage.style.opacity = themeOpacity;
        }
        
        // 2. Update vertical trace height
        if (traceLine) {
            traceLine.style.height = `${scrollPercent}%`;
            
            // Check for 'warning' zones (Red-shift logic for Incidents & Triage)
            let inWarningZone = false;
            
            // Re-target elements that signify a failure response (Timeline & Post-Mortems)
            const warningZones = document.querySelectorAll('#timeline, #work');
            
            warningZones.forEach(zone => {
                const rect = zone.getBoundingClientRect();
                // If the top third of the screen is within this section
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 3) {
                    inWarningZone = true;
                }
            });
            
            if (inWarningZone) {
                traceLine.classList.add('glitch');
            } else {
                traceLine.classList.remove('glitch');
            }
        }

        // Nav Logo Progress (Subtle opacity shift)
        if (navLogo) {
            navLogo.style.opacity = 0.5 + (scrollPercent / 200); 
        }
    };

    window.addEventListener('scroll', updateScrollVisuals, { passive: true });
    updateScrollVisuals(); // Initial call

    // 3. Staggered Blur-Reveal Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Custom High-Fidelity Smooth Scroll Engine
    const smoothScroll = (targetSelector, duration = 1000) => {
        const target = document.querySelector(targetSelector);
        if (!target) return;
        
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Cubic Easing for 'Humane' intentional feel
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            smoothScroll(targetId);
        });
    });

    // 5. Console Signature (Production Tier)
    console.log(
        "%c PRODUCTION SYSTEMS %c TELEMETRY STREAM ACTIVE v6.0 ",
        "background: #111113; color: white; border: 1px solid #EF4444; padding: 4px 12px; font-family: monospace; font-weight: bold;",
        "background: #EF4444; color: white; padding: 4px 12px; font-family: monospace;"
    );
});