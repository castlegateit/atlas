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
