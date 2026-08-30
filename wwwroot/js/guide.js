window.guideOpenRank = function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    if (el.tagName === 'DETAILS') {
        el.open = true;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function currentPath() {
    return window.location.pathname.replace(/\/$/, '');
}

document.addEventListener('mouseover', function (e) {
    var row = e.target.closest('.guide-bar-row');
    if (!row) return;

    var href = row.getAttribute('href');
    if (!href) return;

    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var el = document.getElementById(href.slice(hashIndex + 1));
    if (el && el.tagName === 'DETAILS') {
        el.open = true;
    }
});

document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;

    var href = a.getAttribute('href');
    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var id = href.slice(hashIndex + 1);
    if (!id) return;

    // a.pathname is resolved by the browser (accounts for <base href>),
    // so comparing it to the current path reliably tells us whether this
    // link points at the page we're already on.
    var linkPath = a.pathname.replace(/\/$/, '');
    if (linkPath !== currentPath()) return;

    if (!document.getElementById(id)) return;

    e.preventDefault();
    window.guideOpenRank(id);
    history.replaceState(null, '', '#' + id);
});

(function () {
    var BUBBLE_COUNT = 32;
    var COLORS = [
        [255, 107, 107],
        [76, 201, 240],
        [6, 214, 160],
        [247, 37, 133],
        [167, 139, 250],
        [240, 168, 48],
        [255, 209, 102]
    ];

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    var INTENSITIES = [
        { inner: 0.18, outer: 0.07, border: 0.18, borderWidth: 1 },
        { inner: 0.32, outer: 0.14, border: 0.4, borderWidth: 1.5 },
        { inner: 0.55, outer: 0.28, border: 0.75, borderWidth: 2 }
    ];

    function paint(bubble) {
        var c = bubble.color;
        var rgb = c[0] + ', ' + c[1] + ', ' + c[2];
        var tone = bubble.tone;
        bubble.el.style.width = bubble.r * 2 + 'px';
        bubble.el.style.height = bubble.r * 2 + 'px';
        bubble.el.style.background = 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 30%, rgba(' + rgb + ',' + tone.inner + ') 65%, rgba(' + rgb + ',' + tone.outer + ') 100%)';
        bubble.el.style.border = tone.borderWidth + 'px solid rgba(' + rgb + ',' + tone.border + ')';
    }

    function place(bubble) {
        bubble.el.style.transform = 'translate(' + (bubble.x - bubble.r) + 'px,' + (bubble.y - bubble.r) + 'px)';
    }

    function respawn(bubble, w, h) {
        bubble.r = rand(11, 30);
        bubble.color = COLORS[Math.floor(rand(0, COLORS.length))];
        var toneRoll = Math.random();
        bubble.tone = toneRoll < 0.5 ? INTENSITIES[0] : (toneRoll < 0.8 ? INTENSITIES[1] : INTENSITIES[2]);
        bubble.x = rand(bubble.r, Math.max(bubble.r + 1, w - bubble.r));
        bubble.y = rand(bubble.r, Math.max(bubble.r + 1, h - bubble.r));
        var speed = rand(12, 26);
        var angle = rand(0, Math.PI * 2);
        bubble.vx = Math.cos(angle) * speed;
        bubble.vy = Math.sin(angle) * speed;
        bubble.popped = false;
        bubble.spawnedAt = performance.now();
        bubble.lifespan = rand(9000, 16000);
        bubble.el.style.transition = '';
        bubble.el.style.opacity = '0';
        paint(bubble);
        place(bubble);
    }

    function pop(bubble, container) {
        if (bubble.popped) return;
        bubble.popped = true;
        bubble.el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        bubble.el.style.opacity = '0';
        bubble.el.style.transform = 'translate(' + (bubble.x - bubble.r) + 'px,' + (bubble.y - bubble.r) + 'px) scale(1.6)';
        setTimeout(function () {
            var w = container.clientWidth || 600;
            var h = container.clientHeight || 220;
            respawn(bubble, w, h);
        }, rand(300, 1200));
    }

    function initHeroBubbles() {
        var container = document.querySelector('.hero-banner .bubbles');
        if (!container || container.dataset.bubblesInit) return;
        container.dataset.bubblesInit = '1';

        var w = container.clientWidth || 600;
        var h = container.clientHeight || 220;
        var bubbles = [];

        for (var i = 0; i < BUBBLE_COUNT; i++) {
            var el = document.createElement('span');
            el.className = 'bubble';
            container.appendChild(el);
            var bubble = { el: el };
            respawn(bubble, w, h);
            bubble.spawnedAt = performance.now() - rand(0, 12000);
            bubbles.push(bubble);
        }

        var last = performance.now();

        function tick(now) {
            if (!document.body.contains(container)) return;

            var dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            var cw = container.clientWidth || w;
            var ch = container.clientHeight || h;

            var i, bubble;
            for (i = 0; i < bubbles.length; i++) {
                bubble = bubbles[i];
                if (bubble.popped) continue;

                bubble.x += bubble.vx * dt;
                bubble.y += bubble.vy * dt;

                if (bubble.x - bubble.r < 0) { bubble.x = bubble.r; bubble.vx *= -1; }
                if (bubble.x + bubble.r > cw) { bubble.x = cw - bubble.r; bubble.vx *= -1; }
                if (bubble.y - bubble.r < 0) { bubble.y = bubble.r; bubble.vy *= -1; }
                if (bubble.y + bubble.r > ch) { bubble.y = ch - bubble.r; bubble.vy *= -1; }
            }

            for (i = 0; i < bubbles.length; i++) {
                var b1 = bubbles[i];
                if (b1.popped) continue;
                for (var j = i + 1; j < bubbles.length; j++) {
                    var b2 = bubbles[j];
                    if (b2.popped) continue;
                    var dx = b1.x - b2.x;
                    var dy = b1.y - b2.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < b1.r + b2.r) {
                        pop(b1, container);
                        pop(b2, container);
                    }
                }
            }

            for (i = 0; i < bubbles.length; i++) {
                bubble = bubbles[i];
                if (bubble.popped) continue;

                var age = now - bubble.spawnedAt;
                if (age > bubble.lifespan) {
                    pop(bubble, container);
                    continue;
                }

                var opacity = age < 400 ? Math.max(0, age / 400) * 0.9 : 0.9;
                bubble.el.style.opacity = String(opacity);
                place(bubble);
            }

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    new MutationObserver(function () {
        initHeroBubbles();
    }).observe(document.body, { childList: true, subtree: true });

    initHeroBubbles();
})();
