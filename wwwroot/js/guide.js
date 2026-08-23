document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#rank-"]');
    if (!a) return;

    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();

    if (el.tagName === 'DETAILS') {
        el.open = true;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
});
