window.guideOpenRank = function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    if (el.tagName === 'DETAILS') {
        el.open = true;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#rank-"]');
    if (!a) return;

    var id = a.getAttribute('href').slice(1);
    if (!document.getElementById(id)) return;

    e.preventDefault();
    window.guideOpenRank(id);
    history.replaceState(null, '', '#' + id);
});
