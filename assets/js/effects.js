(function () {

    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    //===== Typing effect

    var typed = document.querySelector('.typed-text');
    if (typed && !reduceMotion) {
        var words = JSON.parse(typed.getAttribute('data-words'));
        var wordIndex = 0;
        var charIndex = words[0].length;
        var deleting = true;

        // Hold the first word for a moment before starting to cycle
        setTimeout(function tick() {
            var word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            typed.textContent = word.slice(0, charIndex);

            var delay = deleting ? 35 : 75;
            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 1800;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 300;
            }
            setTimeout(tick, delay);
        }, 2200);
    }

    //===== Reveal on scroll

    var targets = document.querySelectorAll(
        '.section-title, .single-skill, .single-work, .contact-box, .about-area p'
    );

    if (reduceMotion || !('IntersectionObserver' in window)) {
        return;
    }

    for (var i = 0; i < targets.length; i++) {
        var el = targets[i];
        el.classList.add('reveal');
        // Stagger cards that sit side by side in the same row
        var siblings = el.parentElement.parentElement.children;
        var position = Array.prototype.indexOf.call(siblings, el.parentElement);
        if (el.matches('.single-skill, .contact-box') && position > 0) {
            el.style.transitionDelay = (position % 3) * 0.12 + 's';
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var target = entry.target;
                target.classList.add('revealed');
                observer.unobserve(target);
                // Drop the stagger once revealed so hover effects respond instantly
                setTimeout(function () { target.style.transitionDelay = ''; }, 1200);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    for (var j = 0; j < targets.length; j++) {
        observer.observe(targets[j]);
    }

}());
