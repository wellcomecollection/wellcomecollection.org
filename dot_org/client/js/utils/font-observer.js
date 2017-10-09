import FontFaceObserver from 'fontfaceobserver';
const rootElement = document.documentElement;
function init() {
  const WB = new FontFaceObserver('Wellcome Bold Web', {weight: 'bold'});
  const HNL = new FontFaceObserver('Helvetica Neue Light Web');
  const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
  const LR = new FontFaceObserver('Lettera Regular Web');
  Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()]).then(function() {
    rootElement.classList.add('fonts-loaded');
  }).catch((error) => console.log(error));
}

export default {
  init
};
