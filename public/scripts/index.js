window.$ = require('jquery');
require('../menuScripts/sidenav.js');
require('../menuScripts/newgamepopup.js');
require('../menuScripts/submenu.js');
require('../menuScripts/console.js');
document.write(require('../partials/sidenav.html'));
document.write(require('../partials/left.html'));
document.write(require('../partials/canvas.html'));
document.write(require('../partials/right.html'));
document.write(require('../partials/newGamePopup.html'));
document.write(require('../partials/console.html'));

require('./Launcher.js');
