ATLAS_PREFIX = "atlas-";
// Fixed position header on scroll, using an empty spacer element to maintain
// the vertical space that would normally be taken up by the static position
// header only when the header has fixed position.
$(function () {
    var aperture = $(window);

    var headerClass = ATLAS_PREFIX + 'header';
    var spacerClass = ATLAS_PREFIX + 'header-fix';
    var imageClass = headerClass + '__title-image';

    var enabledModifier = '--fixed';
    var fixedModifier = '--is-fixed';
    var offsetModifier = '--is-offset';

    var headerClassFixed = headerClass + fixedModifier;
    var spacerClassFixed = spacerClass + fixedModifier;
    var imageClassFixed = imageClass + fixedModifier;

    var headerClassEnabled = headerClass + enabledModifier;
    var headerClassOffset = headerClass + offsetModifier;

    // Current resize or scroll state, resize or scroll complete event name, the
    // limit (ms) for checking resize or scroll state, and the scroll threshold
    // (px) for making the header fixed.
    var resizing = false;
    var resized = 'atlas.header_fixed.resize.done';
    var limit = 10;
    var threshold = 200;

    // Blocks and elements.
    var header = $('.' + headerClass);
    var spacer = $('.' + spacerClass);
    var image = $('.' + imageClass);

    // No header? Fixed position disabled?
    if (header.length === 0 || !header.hasClass(headerClassEnabled)) {
        return;
    }

    // No spacer? Create one and insert it before the header element.
    if (spacer.length === 0) {
        spacer = $('<div class="' + spacerClass + '">');
        header.before(spacer);
    }

    // Wait until the window has finished resizing and/or scrolling, then
    // trigger the "done" event.
    aperture.on('resize scroll', function () {
        window.clearTimeout(resizing);

        resizing = window.setTimeout(function () {
            aperture.trigger(resized);
        }, limit);
    });

    // Add or remove the "fixed" modifier class on both the header and spacer
    // elements on load and on resize or scroll complete.
    aperture.on('load ' + resized, function () {
        var toggle = aperture.scrollTop() > threshold;
        var admin = $('#wpadminbar').length !== 0;

        header.toggleClass(headerClassFixed, toggle);
        header.toggleClass(headerClassOffset, toggle && admin);
        spacer.toggleClass(spacerClassFixed, toggle);
        image.toggleClass(imageClassFixed, toggle);
    });
});

// Second level navigation toggle on all screen sizes.
$(function () {
    // Block class names.
    var headerClass = ATLAS_PREFIX + 'header';

    // Element class names.
    var navClass = headerClass + '__nav';

    var navListClass = headerClass + '__nav-list';
    var navItemClass = headerClass + '__nav-item';
    var navLinkClass = headerClass + '__nav-link';

    var wrapClass = headerClass + '__nav-item-toggle';
    var buttonClass = headerClass + '__nav-item-toggle-button';

    // Class name modifiers.
    var defaultModifier = '--default';
    var disabledModifier = '--item-toggle-disabled';
    var hiddenModifier = '--item-hidden';
    var toggleModifier = '--item-toggle';
    var level1Modifier = '--level-1';
    var level2Modifier = '--level-2';

    // Full class names with modifiers applied.
    var buttonClassDefault = buttonClass + defaultModifier;
    var buttonClassHidden = buttonClass + hiddenModifier;
    var navClassDisabled = navClass + disabledModifier;
    var navListClassHidden = navListClass + hiddenModifier;
    var navListClassToggle = navListClass + toggleModifier;
    var navListClassLevel2 = navListClass + level2Modifier;

    // Template elements.
    var buttonTemplate = $('#' + ATLAS_PREFIX + 'nav-item-button-template');
    var showTemplate = $('#' + ATLAS_PREFIX + 'nav-item-show-template');
    var hideTemplate = $('#' + ATLAS_PREFIX + 'nav-item-hide-template');

    // Elements.
    var nav = $('.' + navClass);
    var lists = $('.' + navListClassLevel2);
    var items = lists.parent('.' + navItemClass);

    // No navigation? No second level lists? Toggle disabled?
    if (nav.length === 0 || lists.length === 0 || nav.hasClass(navClassDisabled)) {
        return;
    }

    // Default button HTML.
    var buttonHtml = '<a href="#">';

    // Template-based button HTML.
    if (buttonTemplate.length !== 0) {
        buttonHtml = buttonTemplate.html();
    }

    // Default show/hide second level content.
    var showContent = '+ <span class="screen-reader-text">show items</span>';
    var hideContent = '&minus; <span class="screen-reader-text">hide items</span>';

    // Template-based show/hide second level content.
    if (showTemplate.length !== 0) {
        showContent = showTemplate.html();
    }

    if (hideTemplate.length !== 0) {
        hideContent = hideTemplate.html();
    }

    // Function to get buttons, lists, etc. associated with particular item.
    var getComponents = function (element) {
        var item = $(element);

        if (!item.hasClass(navItemClass)) {
            item = item.closest('.' + navItemClass);
        }

        return {
            item: item,
            button: item.find('.' + buttonClass).first(),
            list: item.find('.' + navListClass).first(),
            others: items.not(item)
        };
    };

    // Functions to show, hide, and toggle second level items.
    var showItem = function (element) {
        var components = getComponents(element);

        // Show this item.
        components.button.removeClass(buttonClassHidden);
        components.list.removeClass(navListClassHidden);

        // Switch button content.
        components.button.html(hideContent);

        // Hide other items.
        components.others.each(function (i, otherElement) {
            hideItem(otherElement);
        });
    };

    var hideItem = function (element) {
        var components = getComponents(element);

        // Hide this item.
        components.button.addClass(buttonClassHidden);
        components.list.addClass(navListClassHidden);

        // Switch button content.
        components.button.html(showContent);
    };

    var toggleItem = function (element) {
        var components = getComponents(element);

        if (components.button.hasClass(buttonClassHidden)) {
            return showItem(element);
        }

        hideItem(element);
    };

    // Add toggle links to all items with second level lists.
    lists.each(function (i, listElement) {
        var list = $(listElement);
        var item = list.parent();
        var wrap = list.children('.' + wrapClass);

        // No wrap?
        if (wrap.length === 0) {
            wrap = item.children('.' + navLinkClass)
                .wrap('<div class="' + wrapClass + '">')
                .parent();
        }

        // Find button.
        var button = wrap.children('.' + buttonClass);

        // No button?
        if (button.length === 0) {
            button = $(buttonHtml);

            button.addClass(buttonClass);
            wrap.append(button);

            // Completely default button? Apply completely default styles.
            if (buttonTemplate.length === 0) {
                button.addClass(buttonClassDefault);
            }
        }

        // Toggle visibility on button click.
        button.on('click', { button: button }, function (e) {
            e.preventDefault();
            e.stopPropagation();

            toggleItem(e.data.button);
        });

        // Set initial state.
        list.addClass(navListClassToggle);
        hideItem(list);
    });

    // Hide all items on click outside button(s).
    $('html').on('click', function () {
        items.each(function (i, itemElement) {
            hideItem(itemElement);
        });
    });
});

// Main navigation toggle on small screens.
$(function () {
    // Block class names.
    var headerClass = ATLAS_PREFIX + 'header';

    // Element class names.
    var specialClass = headerClass + '__special';
    var navClass = headerClass + '__nav';
    var navSpecialClass = headerClass + '__nav-special';
    var wrapClass = headerClass + '__nav-toggle';
    var buttonClass = headerClass + '__nav-toggle-button';

    // Class name modifiers.
    var defaultModifier = '--default';
    var disabledModifier = '--toggle-disabled';
    var hiddenModifier = '--hidden';
    var rightModifier = '--right';
    var toggleModifier = '--toggle';

    // Full class names with modifiers applied.
    var buttonClassDefault = buttonClass + defaultModifier;
    var buttonClassHidden = buttonClass + hiddenModifier;
    var navClassDisabled = navClass + disabledModifier;
    var navClassHidden = navClass + hiddenModifier;
    var wrapClassRight = wrapClass + rightModifier;

    // Template elements.
    var buttonTemplate = $('#' + ATLAS_PREFIX + 'nav-button-template');
    var showTemplate = $('#' + ATLAS_PREFIX + 'nav-show-template');
    var hideTemplate = $('#' + ATLAS_PREFIX + 'nav-hide-template');

    // Elements.
    var special = $('.' + specialClass);
    var nav = $('.' + navClass);
    var navSpecial = $('.' + navSpecialClass);
    var wrap = $('.' + wrapClass);
    var button = $('.' + buttonClass);

    // No navigation? Toggle disabled?
    if (nav.length === 0 || nav.hasClass(navClassDisabled)) {
        return;
    }

    // Default show/hide menu content.
    var showContent = 'Menu';
    var hideContent = 'Menu';

    // Template-based show/hide menu content.
    if (showTemplate.length !== 0) {
        showContent = showTemplate.html();
    }

    if (hideTemplate.length !== 0) {
        hideContent = hideTemplate.html();
    }

    // Insert the toggle button if it does not already exist. Use a template if
    // one is available; use default values if one is not.
    if (button.length === 0) {
        // Create container?
        if (wrap.length === 0) {
            wrap = $('<div class="' + wrapClass + '">');

            // Make space for adjacent element?
            if (special.length !== 0) {
                wrap.addClass(wrapClassRight);
            }

            nav.before(wrap);
        }

        // Create button from template or default values. The default modifer
        // class should only be applied to completely default buttons, not those
        // created from templates.
        button = $('<a href="#" class="' + buttonClassDefault + '">');

        if (buttonTemplate.length !== 0) {
            button = $(buttonTemplate.html());
        }

        button.addClass(buttonClass);
        wrap.append(button);
    }

    // Functions to show, hide, and toggle the navigation menu.
    var showNav = function () {
        nav.removeClass(navClassHidden);
        button.removeClass(buttonClassHidden);
        button.html(hideContent);
    };

    var hideNav = function () {
        nav.addClass(navClassHidden);
        button.addClass(buttonClassHidden);
        button.html(showContent);
    };

    var toggleNav = function () {
        if (nav.hasClass(navClassHidden)) {
            return showNav();
        }

        hideNav();
    };

    // Set initial classes.
    nav.addClass(navClass + toggleModifier);
    navSpecial.addClass(navSpecialClass + toggleModifier);

    // Set initial visibility.
    hideNav();

    // Toggle visibility on button click.
    button.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        toggleNav();
    });

    // Hide on click outside button.
    $('html').on('click', function () {
        hideNav();
    });
});

//# sourceMappingURL=atlas.js.map
