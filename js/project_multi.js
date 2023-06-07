// Copyright 2023 Marco Kempf
// originated from Chritian Lölkes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



//////////////////////////////////////////////////////////////////////////////////
//		INIT BASIC THREE COMPONENTS
//////////////////////////////////////////////////////////////////////////////////

var renderer, scene, camera;
var deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
// array for the init-Functions
var initFcts = [];
// array of functions for the rendering loop
// var onRenderFcts = [];
// array for loader Functions
var loaderFcts = [];

//var markerRoot1 = new THREE.Group();
var then = Date.now();

//////////////////////////////////////////////////////////////////////////////////
////////////////////////// INIT SCENE ////////////////////////////////////////////
function initScene() {
  scene = new THREE.Scene();
  console.debug("Scene initialized");

  // from stemkoski example create a light
  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);
  console.debug("Light initialized");
}
initFcts.push(initScene);
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
function initCamera() {
  camera = new THREE.Camera();
  scene.add(camera);
  console.debug("Camera initialized.");
}
initFcts.push(initCamera);

//////////////////////////////////////////////////////////////////////////////////
////////////////////////// INIT RENDERER /////////////////////////////////////////
function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true, // Performance on older mobile devices.
    alpha: true, // Display webcam image in the background.
    precision: "mediump", // Performance on older mobile devices. (Christian)
    powerPreference: "low-power", // Mobile application. (Christian)
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  // size setting taken from Christian script
  renderer.setSize(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  );
  // from original example
  //renderer.setSize( 640, 480);

  // style attributes written inside CSS file
  renderer.domElement.id = "renderer";
  //renderer.domElement.style.position = 'absolute';
  //renderer.domElement.style.top = '0px';
  //renderer.domElement.style.left = '0px';
  document.body.appendChild(renderer.domElement);
  //document.getElementById("webAR").appendChild(renderer.domElement);

  console.debug("Renderer initialized");

  clock = new THREE.Clock();
  deltaTime = 0;
  totalTime = 0;
}
initFcts.push(initRenderer);


///////////////////////////// Init ARToolKit /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////  ARToolKIT SOURCE  ///////////////////////////////////
function initARToolkit() {
  // arToolKitSource from github
  console.debug("creating ARToolKitSource");

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
    // resolution of at which we initialize the source image
    //sourceWidth: 640,
    //sourceHeight: 480,
    // resolution displayed for the source
    //displayWidth: 640,
    //displayHeight: 480,
  });

  function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
    console.debug("Resize!");
  }

  arToolkitSource.init(function onReady() {
    onResize();
  });

  window.addEventListener("resize", function () {
    onResize();
  });

  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// ARToolKit CONTEXT /////////////////////////////////

  // initialize it
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono",
    patternRatio: 0.9,
  });
  // copy projection matrix to camera
  arToolkitContext.init(function onCompleted() {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });
  
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// ARToolKit CONTROLS ////////////////////////////////
  // create TextureLoader for text-PNGs
  let loader = new THREE.TextureLoader();

  ///////////////////////////// SETUP MARKERROOTS ///////////////////////////////
  // take patternArray from config.js
  for (let i = 0; i < patternArray.length; i++) {
    let markerRoot = new THREE.Group();
    scene.add(markerRoot);
    var markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot,
      {
        type: "pattern",
        patternUrl: "resources/pattern-marker_" + patternArray[i] + ".patt",
        
        //changeMatrixMode: 'modelViewMatrix',
        //smooth: true,
        //smoothCount: 3,
        //smoothTolerance: 0.001,
        //smoothThreshold: 2,
      }
    );

    let texture = loader.load(
      "resources/text_" + patternArray[i] + ".png",
      render
    );
    let geometry1 = new THREE.PlaneBufferGeometry(1.5, 1.5, 4, 4);
    let material1 = new THREE.MeshBasicMaterial({ color: textcolor, map: texture, transparent:true, opacity: 0.9, });

    let mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.rotation.x = -Math.PI / 2;

    markerRoot.add(mesh1);
    console.debug("Created marker: " + patternArray[i]);
  };
  scene.visible = true;
  console.debug("ARToolKit initialized");
}

//////////////////////////////////////////////////////////////////////////////////
//////////////// START the INIT functions ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function initTHREEjs() {
  initFcts.forEach(function (initFct) {
    initFct();
  });
}
//// WORKING ANIMATE FUNCTIONS
function animate(){
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    update();
    render();
}
function update(){
    if (arToolkitSource.ready !== false){
    arToolkitContext.update(arToolkitSource.domElement);
    }
}
function render(){
    renderer.render(scene,camera);
}

function run() {
  console.log("Everything done: RUN ....");
  // Remove the splashscreen. No need to hide it
  document.getElementById("startmessage").remove();
  //document.getElementById("startmessage_bottom").remove();

  // Run the whole init functions
  initARToolkit();
  // start the animations
  animate();
  if (enable_idleTimer) {
    idleTimer();
    console.debug("OK: Inactivity timer is enabled.");
  }
}