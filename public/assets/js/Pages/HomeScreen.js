import { globalObject } from '../Main.js';
import Selectors from '../Utilities/DomSelector.js';
import { marioIntroText } from '../Main.js';
import { Game } from '../Main.js';
import SavedLevel from './SavedLevels.js';
import MapEditor from './MapEditor.js';
import { notification } from '../Utilities/Utils.js';
import { map, MESSAGE_API, SCORE_API, SCORE_ENTITIES } from '../Constants.js';

/**
 * class Create Home screen layout
 */
class HomeScreen {
  /**
   *
   * @param {img} marioImg
   */
  constructor(marioImg) {
    // get playerName if none show popup
    const playerName = localStorage.getItem('playerName');
    globalObject.playerName = playerName;
    if (!playerName) {
      Selectors.nameFormSelector.style.display = 'flex';
      this.handlePlayerInfo();
    }
    // hide main menu and mapEditor screen
    Selectors.mapEditor.style.display = 'none';
    Selectors.mainMenu.style.display = 'none';
    // create intro main div
    this.intro = document.createElement('div');
    this.intro.classList.add('intro');
    Selectors.introSelector = this.intro;
    this.intro.style.display = 'flex';
    // remove blur effect if playername
    if (globalObject.playerName) {
      this.intro.style.filter = 'blur(0px)';
    }
    // left intro
    const introLeft = document.createElement('div');
    introLeft.classList.add('intro-left');
    // Mario Thumbnai
    const introText = document.createElement('img');
    introText.src = marioIntroText.src;
    introText.classList.add('intro--text');
    introLeft.appendChild(introText);
    // Mario img
    const introImg = document.createElement('img');
    introImg.src = marioImg.src;
    introImg.classList.add('intro--img');
    introLeft.appendChild(introImg);
    this.intro.appendChild(introLeft);
    // RIght intro
    Selectors.introRight = document.createElement('div');
    Selectors.introRight.classList.add('intro-right');
    // buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('intro--buttons');
    buttonsWrapper.style.display = 'flex';
    this.playButton = document.createElement('button');
    this.playButton.innerHTML = 'Play';
    buttonsWrapper.appendChild(this.playButton);
    this.savedLevels = document.createElement('button');
    this.savedLevels.innerHTML = 'Saved Level';
    buttonsWrapper.appendChild(this.savedLevels);
    this.createMap = document.createElement('button');
    this.createMap.innerHTML = 'create map';
    buttonsWrapper.appendChild(this.createMap);
    Selectors.introRight.appendChild(buttonsWrapper);

    Selectors.containerSelector.appendChild(this.intro);
    Selectors.nightMode.style.display = 'hidden';
    // High score
    Selectors.messageScoreWrapper = document.createElement('div');
    Selectors.messageScoreWrapper.classList.add('score-message');

    Selectors.highScore = document.createElement('div');
    Selectors.messageBox = document.createElement('div');
    Selectors.introRight.appendChild(Selectors.messageScoreWrapper);
    Selectors.messageScoreWrapper.appendChild(Selectors.highScore);
    Selectors.messageScoreWrapper.appendChild(Selectors.messageBox);
    this.intro.appendChild(Selectors.introRight);
    this.defineEvents();
    this.fetchScore();
    this.fetchMessage();
  }
  /**
   * @desc handle button clicks event
   */
  defineEvents() {
    this.playButton.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      this.intro.style.display = 'none';
      Selectors.nightMode.style.display = 'block';
      globalObject.game = new Game(map);
    });

    this.createMap.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      this.intro.style.display = 'none';
      Selectors.mapEditor.style.display = 'flex';
      globalObject.editor = new MapEditor();
    });

    this.savedLevels.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      this.intro.style.display = 'none';
      Selectors.savedLevel.style.display = 'flex';
      globalObject.savedLevel = new SavedLevel();
    });
  }
  /**
   * @desc take
   */
  handlePlayerInfo() {
    Selectors.nameSubmitSelector.addEventListener('click', (e) => {
      e.preventDefault();
      const playerName = Selectors.playerNameSelector.value;
      if (playerName.length < 3) {
        notification('Name cannot be less than 3 character');
        return;
      }
      this.intro.style.filter = 'blur(0px)';
      globalObject.playerName = playerName;
      localStorage.setItem('playerName', playerName);
      Selectors.nameFormSelector.style.display = 'none';
    });
  }
  /**
   * @desc fetch scores for HALL OF FAME
   */
  async fetchScore() {
    const response = await fetch(SCORE_API, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    this.renderHallOfFame(responseData.data);
  }
  /**
   * @desc fetch scores for HALL OF FAME
   */
  async fetchMessage() {
    const response = await fetch(MESSAGE_API, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    this.messageData = responseData.data;
    this.renderMessage(this.messageData.reverse());
  }
  /**
   *
   * @param {Array} data array of data for high score
   * @desc Html element for hall of fame
   */
  renderHallOfFame(data) {
    Selectors.highScore.classList.add('high-scores');
    const heading = document.createElement('h1');
    heading.innerHTML = 'HALL OF FAME';
    Selectors.highScore.appendChild(heading);
    const schema = document.createElement('div');
    schema.classList.add('score-wrapper');
    SCORE_ENTITIES.forEach((title) => {
      const titleElement = document.createElement('div');
      titleElement.innerHTML = title;
      schema.appendChild(titleElement);
    });
    Selectors.highScore.appendChild(schema);
    data.forEach((datum) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('score-wrapper');
      [datum.player, datum.score, datum.time].forEach((value) => {
        const valueElement = document.createElement('div');
        valueElement.innerHTML = value;
        wrapper.appendChild(valueElement);
      });
      Selectors.highScore.appendChild(wrapper);
    });
  }
  /**
   *
   * @param {Array} data array of data for Messages
   * @desc render messages be it from game or from player
   */
  renderMessage(data) {
    Selectors.messageBox.classList.add('message-box');
    const messageTop = document.createElement('div');
    Selectors.messageBox.appendChild(messageTop);
    const heading = document.createElement('h1');
    heading.innerHTML = 'Global Messages';
    messageTop.appendChild(heading);
    data.forEach((datum) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('message-wrapper');
      if (datum.player === 'Game') {
        const gameMessage = document.createElement('div');
        gameMessage.classList.add('game-message');
        gameMessage.innerHTML = datum.message;
        wrapper.appendChild(gameMessage);
      } else {
        const playerMessage = document.createElement('div');
        const heading = document.createElement('h3');
        heading.innerHTML = datum.player;
        playerMessage.appendChild(heading);
        const message = document.createElement('p');
        message.innerHTML = datum.message;
        playerMessage.appendChild(message);
        wrapper.appendChild(playerMessage);
      }
      messageTop.appendChild(wrapper);
    });
    const formWrapper = document.createElement('div');
    formWrapper.classList.add('form-wrapper');
    Selectors.inputField = document.createElement('input');
    formWrapper.appendChild(Selectors.inputField);
    const sendButton = document.createElement('button');
    sendButton.innerHTML = 'SEND';
    sendButton.addEventListener('click', (e) => {
      this.sendMessage(e);
    });
    formWrapper.appendChild(sendButton);
    Selectors.messageBox.appendChild(formWrapper);
  }
  // Send Message
  async sendMessage(e) {
    e.preventDefault();
    const rawData = {
      player: globalObject.playerName,
      message: Selectors.inputField.value,
    };
    const jsonData = JSON.stringify(rawData);
    const response = await fetch(MESSAGE_API, {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    if (data.success) {
      notification('Message Sent');
      Selectors.inputField.value = '';
      this.messageData.push(rawData);
    }
  }
}
export default HomeScreen;
