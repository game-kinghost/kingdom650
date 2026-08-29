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
