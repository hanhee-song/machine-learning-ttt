function initializeHelp() {
  const helpText = document.querySelector('.help-text');
  
  function clearHelp() {
    helpText.innerHTML = "";
  }
  
  const sliders = document.getElementsByClassName('sliders-container');
  for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("mouseover", () => {
      helpText.innerHTML = "asdf";
    });
    sliders[i].addEventListener("mouseout", () => {
      clearHelp();
    });
  }
}

module.exports = initializeHelp;
