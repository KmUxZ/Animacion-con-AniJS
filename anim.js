(function() {
    'use strict';

    function parseAniJS(aniString) {
        const parts = {};
        const pairs = aniString.split(',');

        pairs.forEach(pair => {
            const [key, ...valueParts] = pair.split(':');
            const value = valueParts.join(':').trim();
            parts[key.trim()] = value;
        });
        
        return parts; 
    }

    function applyAnimation(element, animationClass) {
        element.classList.add('animate__animated', 'animate__' + animationClass);

        element.addEventListener('animationend', function handler() {
            element.classList.remove('animate__animated', 'animate__' + animationClass);
            element.removeEventListener('animationend', handler);
        }, {once: true});
    }

    function initAniJS() {
        const elements = document.querySelectorAll('[data-anijs]');
        
        elements.forEach(element => {
            const aniString = element.getAttribute('data-anijs');
            const config = parseAniJS(aniString);
            
            const eventType = config['if'];
            const animation = config['do'];
            const target = config['on'];
            
            if (eventType === 'load') {
                setTimeout(() => {
                    applyAnimation(element, animation);
                }, 100);
            } else if (eventType === 'scroll') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            applyAnimation(element, animation);
                            observer.unobserve(element);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(element);
            } else {
                element.addEventListener(eventType, () => {
                    if (target) {
                        const targetElement = document.querySelector(target);
                        if (targetElement) {
                            applyAnimation(targetElement, animation);
                        }
                    } else {
                        applyAnimation(element, animation);
                    }
                });
            }
        });
        
        console.log('✅ AniJS inicializado correctamente - ' + elements.length + ' elementos encontrados');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAniJS);
    } else {
        initAniJS();
    }

})();