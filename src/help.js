function initializeHelp() {
  const helpText = document.querySelector('.help-text');
  
  // function clearHelp() {
  //   helpText.innerHTML = "";
  // }
  
  HTMLCollection.prototype.addTextEvent = function(event, text) {
    for (var i = 0; i < this.length; i++) {
      this[i].addEventListener(event, () => {
        helpText.innerHTML = text;
      });
    }
  };
  
  HTMLElement.prototype.addTextEvent = function(event, text) {
    this.addEventListener(event, () => {
      helpText.innerHTML = text;
    });
  };
  
  const sliders = document.getElementsByClassName('sliders-container');
  sliders.addTextEvent("mouseenter", "These values determine the incentive/reward for the AI to achieve this particular outcome. A lower value will discourage it from choosing the moves leading up to the state, while a higher value will encourage it to try those moves again.");
  
  const selectors = document.getElementsByClassName('options');
  selectors.addTextEvent("mouseenter", "Select an AI<br />Easy: preprogrammed to make random moves<br />Medium: preprogrammed to get two in a row<br />Hard: preprogrammed to win or tie most games<br />ML: starts off making random moves, pursues higher-incentive states");
  
  const speed = document.getElementsByClassName('slider-speed-container');
  speed.addTextEvent("mouseenter", "Speed of simulation");
  
  const play = document.getElementsByClassName('play-button');
  play.addTextEvent("mouseenter", "Play / Pause<br />Note that player values cannot be adjusted unless the simulation is stopped");
  
  const stop = document.getElementsByClassName('stop-button');
  stop.addTextEvent("mouseenter", "Stop simulation");
  
  const svg = document.getElementsByTagName('svg');
  svg.addTextEvent("mouseenter", "This graph shows the average win-tie-loss ratio over the past 200 games");
  
  // selectors.addTextEvent("mouseenter", "asdf");
  // for (var i = 0; i < selectors.length; i++) {
  //   selectors[i].addEventListener("mouseenter", () => {
  //     helpText.innerHTML = "Select an AI<br />Easy: preprogrammed to make random moves<br />Medium: preprogrammed to get two in a row<br />Hard: preprogrammed to win or tie most games<br />ML: starts off making random moves, pursues higher-incentive states";
  //   });
  // }
  
  
}


module.exports = initializeHelp;
