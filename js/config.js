//// MARKER DEFINITIONS AND PATTERN SET
// create marker at
// https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
//
// Patternset
// Global Variables for the patternsets
// Each set is consistent of:
// markerNames: provides an element name of the marker, e.g. "ml"
// Patternfile: <markerName>.patt , inside /resources/markers, e.g. /resources/markers/pattern-ml_bw_75.patt
// Textfile: png with description on it, inside /resources/texts, e.g. /resources/texts/ml.png

const patternArray = ["mk"];
const textcolor = 0xffff00;

// This can be used to drop the framerate. Set 0 to disable
const fps = 0;

////////////////////////////////////////////////////////////////////////////////
// Different messages displayed to the user.
// Message displayed after successful loading of all components.
// User is ready to launch the app, provide las instructions.
const afterLoadingMessage = '<p class="justify"><b>Tippen Sie auf den Text und gestatten Sie bitte den Zugriff auf ihre Kamera. Bewegen Sie danch ihre Kamera vor den Markern der schwarzen Boxen.</b></p>';
// Message displayed if there's no WebRTC support
const missingWebRTCMessage = 'Das Werk benötigt WebRTC. Diese Funktion konnte bei Ihrem Gerät nicht aktiviert werden. Bitte versuchen Sie es mit einem anderen Gerät.'

////////////////////////////////////////////////////////////////////////////////
// Is enabled, the page will automatically redirect to another URL after a
// certain inactivity time (from the last click).
// This obviously doesn't work if there is no click interaction.
const enable_idleTimer = false;
//const idleLocation = 'https://zkm.de';