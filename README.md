# Atlas

## Install

Install with npm:

    npm install @castlegate/atlas

You can link to the bundled CSS and JavaScript files, which include [Bootstrap](https://getbootstrap.com/) and [jQuery](https://jquery.com/):

~~~ html
<link rel="stylesheet" href="/node_modules/@castlegate/atlas/dist/css/atlas-bundle.min.css">
<script src="/node_modules/@castlegate/atlas/dist/js/atlas-bundle.min.js"></script>
~~~

Alternatively, you can incorporate the Sass and JavaScript source files into your project. For example:

~~~ scss
@import '/path/to/node_modules/@castlegate/atlas/src/scss/atlas';
~~~

Then include the non-bundled JavaScript from `node_modules/@castlegate/atlas/dist/js/atlas.js` or as individual files from `node_modules/@castlegate/atlas/src/js`. These non-bundled Sass and JavaScript source files will require Bootstrap and jQuery to be installed separately.

## Prefix

By default, all class names used by Atlas use the `atlas-` prefix. To change or remove this prefix, you should define `$atlas-prefix` in Sass and `ATLAS_PREFIX` in JavaScript _before_ you load and compile the Sass and JavaScript provided by Atlas.

## Build

    npm install
    gulp

## License

Copyright (c) 2019 Castlegate IT. All rights reserved.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
