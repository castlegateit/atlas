// Atlas block class prefix, which is also set in the Sass source
// _variables.scss file. This file is not bundled in the production JavaScript
// by default to allow the prefix to be set separately during build.
if (typeof ATLAS_PREFIX === 'undefined') {
    ATLAS_PREFIX = 'atlas-';
}
