document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Transition (Slide Up from Bottom)
    const animatedElements = [];
    for (let el of document.body.children) {
        if (!el.classList.contains('bg-glow') && el.tagName !== 'HEADER' && el.tagName !== 'SCRIPT') {
            animatedElements.push(el);
            el.style.opacity = '0';
            el.style.transform = 'translateY(-40px)';
            el.style.transition = 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }
    
    // Trigger reflow
    void document.body.offsetWidth;
    
    animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Handle outbound links for slide-down fade-out
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            // Only animate internal links ending in .html
            if (target && target.endsWith('.html') && !link.hasAttribute('target')) {
                e.preventDefault();
                
                animatedElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(40px)';
                });
                
                setTimeout(() => {
                    window.location.href = target;
                }, 300); // Redirect after animation completes
            }
        });
    });

    // 2. Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.glass, .feature-card, h1, p, .btn');
    animateElements.forEach((el, index) => {
        if (!el.closest('header') && !el.closest('.bg-glow')) {
            el.classList.add('fade-up-element');
            el.style.transitionDelay = `${(index % 5) * 0.04}s`;
            observer.observe(el);
        }
    });
});
