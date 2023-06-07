function changeText() {
    var clickMeText = document.querySelector('.click-me');
    var goText = document.querySelector('#click-go');
  
    clickMeText.classList.add('hidden');
    goText.classList.remove('hidden');
  }

const libs = [
  'js/config.js',
  'js/three.js',
  'jsartoolkit5/artoolkit.min.js',
  'jsartoolkit5/artoolkit.api.js',
  'threex/threex-artoolkitsource.js',
  'threex/threex-arbasecontrols.js',
  'threex/threex-artoolkitcontext.js',
  'threex/threex-armarkercontrols.js',
  'js/project_multi.js'
]

function injectLibs(){
  if (libs.length > 0){
    let scriptTag = document.createElement('script');
    scriptTag.src = libs.shift();
    console.log(scriptTag.src);
    scriptTag.onload = function(e){
      console.log('Loaded file %s', e.target.src);
      injectLibs();
    }
    document.getElementsByTagName('head')[0].appendChild(scriptTag);

  }
  else {
    console.log("Libs loaded!");
    console.log("Init THREE scene");
    initTHREEjs();
  } 
}

function buttonClicked(){
  changeText();
  injectLibs();
}