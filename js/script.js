document.addEventListener('DOMContentLoaded', () => {
    // 0. Micro-Interaction: Cursor Glow Tracking
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX);
        document.documentElement.style.setProperty('--mouse-y', e.clientY);
    }, { passive: true });

    // 1. Theme Toggle Logic
    const themeToggle = document.querySelector('#theme-toggle');
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

    // 2. The Signature Visual: Incident Trace Logic
    const traceLine = document.querySelector('#incident-trace');
    const systemCards = document.querySelectorAll('.system-card');
    const navLogo = document.querySelector('#nav-progress-logo');

    const updateScrollVisuals = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const scrollY = window.scrollY;

        // 1. Hero Logo Parallax (Top 1% Depth)
        const heroLogo = document.querySelector('.hero-logo-bg');
        if (heroLogo) {
            // Translate logo down at 40% of scroll speed to create parallax offset
            const yPos = scrollY * 0.4;
            heroLogo.style.transform = `translate3d(0, ${yPos}px, 0)`;
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

    // 4. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Console Signature (Production Tier)
    console.log(
        "%c PRODUCTION SYSTEMS %c TELEMETRY STREAM ACTIVE v6.0 ",
        "background: #111113; color: white; border: 1px solid #EF4444; padding: 4px 12px; font-family: monospace; font-weight: bold;",
        "background: #EF4444; color: white; padding: 4px 12px; font-family: monospace;"
    );
});