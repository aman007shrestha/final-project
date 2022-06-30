class MarioAudio {
  constructor() {
    this.bump = new Audio('./assets/sounds/bump.wav');
    this.coin = new Audio('./assets/sounds/coin.wav');
    this.jump = new Audio('./assets/sounds/jump.wav');
    this.stomp = new Audio('./assets/sounds/stomp.wav');
    this.marioDeath = new Audio('./assets/sounds/mario_death.wav');
    this.powerDown = new Audio('./assets/sounds/powerdown.wav');
    this.powerUp = new Audio('./assets/sounds/powerup.wav');
  }
}
export default MarioAudio;
