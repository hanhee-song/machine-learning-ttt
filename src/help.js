function initializeHelp() {
  const helpText = document.querySelector('.help-text');
  
  // function clearHelp() {
  //   helpText.innerHTML = "";
  // }
  
  let fadeTimeout = null;
  
  function addText(text) {
    for (var i = 0; i < this.length; i++) {
      this[i].addEventListener("mouseenter", () => {
        helpText.innerHTML = text;
        helpText.classList.remove("fadeout");
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
        }
      });
      this[i].addEventListener("mouseleave", () => {
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
        }
        fadeTimeout = setTimeout(function () {
          helpText.classList.add("fadeout");
        }, 2000);
      });
    }
  }
  HTMLCollection.prototype.addTextEvent = addText;
  HTMLElement.prototype.addTextEvent = addText;
  
  const sliders = document.getElementsByClassName('sliders-container');
  sliders.addTextEvent("These values determine the incentive/reward for the AI to achieve this particular outcome. A lower value will discourage it from choosing the moves leading up to the state, while a higher value will encourage it to try those moves again.");
  
  const selectors = document.getElementsByClassName('options');
  selectors.addTextEvent("Select an AI<br />Easy: preprogrammed to make random moves<br />Medium: preprogrammed to get two in a row<br />Hard: preprogrammed to win or tie most games<br />ML: starts off making random moves, pursues higher-incentive states");
  
  const speed = document.getElementsByClassName('slider-speed-container');
  speed.addTextEvent("Speed of simulation");
  
  const play = document.getElementsByClassName('play-button');
  play.addTextEvent("Play / Pause<br />Note that player values cannot be adjusted unless the simulation is stopped");
  
  const stop = document.getElementsByClassName('stop-button');
  stop.addTextEvent("Stop simulation");
  
  const svg = document.getElementsByTagName('svg');
  svg.addTextEvent("This graph shows the average win-tie-loss ratio over the past 200 games");
  
  // selectors.addTextEvent("mouseenter", "asdf");
  // for (var i = 0; i < selectors.length; i++) {
  //   selectors[i].addEventListener("mouseenter", () => {
  //     helpText.innerHTML = "Select an AI<br />Easy: preprogrammed to make random moves<br />Medium: preprogrammed to get two in a row<br />Hard: preprogrammed to win or tie most games<br />ML: starts off making random moves, pursues higher-incentive states";
  //   });
  // }
  
  
}


module.exports = initializeHelp;
