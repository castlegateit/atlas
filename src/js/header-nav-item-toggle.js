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
