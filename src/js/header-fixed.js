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
