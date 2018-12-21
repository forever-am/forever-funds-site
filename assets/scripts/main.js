// Menu toggling fn
var toggleMenu = function () {
    var _b = document.body;
    _b.className.match(/(?:^|\s)menu-open(?!\S)/) ? _b.classList.remove('menu-open') : _b.classList.add('menu-open');
};

// Table expand on click
var tableExpand = function () {
    var trigger = document.getElementById('expand-table');
    var switcher = false;

    if (!trigger) {
        return;
    }

    trigger.addEventListener('click', function () {
        switcher = !switcher;
        document.querySelectorAll('.mr-data tr').forEach(function (item, index) {
            (index > 3) && item.classList.toggle('to-show');
        });

        switcher ? trigger.innerHTML = 'Show Less' : trigger.innerHTML = 'Show More';
    });
};

var tableIndicators = function () {
    var tables = Array.from(document.querySelectorAll('[data-wide-table]'));
    var tableIndicators = document.querySelectorAll('table .indicator');

    tables.forEach(function (item) {

        item.addEventListener('scroll', function () {
            var currentScroll = item.scrollLeft;
            currentScroll > 60 ? item.classList.add('show') : item.classList.remove('show');

            tableIndicators.forEach(function (item) {
                item.style.left = currentScroll + 'px' || '0';
            });
        });
    });
};

var winOnScroll = function () {
    var _d = document.documentElement,
        _b = document.body;
    // init check
    (window.pageYOffset || _d.scrollTop) > 50 ? _b.classList.add('_scroll') : '';

    window.addEventListener('scroll', () => {
        _b.classList.toggle('_scroll', (window.pageYOffset || _d.scrollTop) > 50);
    });
};

window.onload = function() {
    var hamburger = document.getElementsByClassName('menu-button')[0];
    var menuLinks = document.getElementsByClassName('page-link');

    hamburger.addEventListener('click', toggleMenu);

    for (var i = 0; i < menuLinks.length; ++i) {
        var menuLink = menuLinks[i];
        menuLink.addEventListener('click', toggleMenu);
    }

    winOnScroll();
    tableIndicators();
};
