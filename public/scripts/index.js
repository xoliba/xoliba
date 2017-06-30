window.$ = require('jquery');
/*require('../menu/indexstyle.css');*/

require('../menu/sidenav/sidenav.js');
require('../menu/sidenav/submenu.js');
document.write(require('../menu/sidenav/sidenav.html'));
document.write(require('../menu/left/left.html'));

document.write(require('../menu/canvas/canvas.html'));

require('../menu/newGamePopup/newgamepopup.js');
require('../menu/newGamePopup/newgamepopup.css');
document.write(require('../menu/newGamePopup/newGamePopup.html'));
document.write(require('../menu/newWatchGamePopUp/newWatchGamePopUp.html'));

require('../menu/console/console.js');
document.write(require('../menu/console/console.html'));
document.write(require('../menu/right/right.html'));

require('../menu/notificationPopups/closeNotificationPopup.js');
document.write(require('../menu/notificationPopups/notificationPopups.html'));

document.write(require('../menu/turnindicators/turnindicators.html'));

document.write(require('../menu/Coordinates/coordinates.html'));
require('../menu/Coordinates/coordinates.js');

document.write(require('../menu/logos/logos.html'));

require('./Launcher.js');
require('./ButtonFunctions.js');
