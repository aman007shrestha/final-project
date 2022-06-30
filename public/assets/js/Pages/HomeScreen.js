import { globalObject } from '../Main.js';
import Selectors from '../Utilities/DomSelector.js';
import { marioIntroText } from '../Main.js';
import { Game } from '../Main.js';
import SavedLevel from './SavedLevels.js';
import MapEditor from './MapEditor.js';
import { notification } from '../Utilities/Utils.js';
import { map } from '../Constants.js';

class HomeScreen {
  constructor(marioImg) {
    const playerName = localStorage.getItem('playerName');
    console.log(playerName);
    globalObject.playerName = playerName;
    if (!playerName) {
      Selectors.nameFormSelector.style.display = 'flex';
      this.handlePlayerInfo();
    }

    Selectors.mapEditor.style.display = 'none';
    Selectors.mainMenu.style.display = 'none';

    this.intro = document.createElement('div');
    this.intro.classList.add('intro');
    Selectors.introSelector = this.intro;
    this.intro.style.display = 'flex';
    if (globalObject.playerName) {
      this.intro.style.filter = 'blur(0px)';
    }
    const introLeft = document.createElement('div');
    introLeft.classList.add('intro-left');

    const introText = document.createElement('img');
    introText.src = marioIntroText.src;
    introText.classList.add('intro--text');
    introLeft.appendChild(introText);

    const introImg = document.createElement('img');
    introImg.src = marioImg.src;
    introImg.classList.add('intro--img');
    introLeft.appendChild(introImg);

    this.intro.appendChild(introLeft);
    Selectors.introRight = document.createElement('div');
    Selectors.introRight.classList.add('intro-right');

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
    Selectors.highScore = document.createElement('div');
    Selectors.introRight.appendChild(Selectors.highScore);
    this.intro.appendChild(Selectors.introRight);
    this.defineEvents();
    this.fetchScore();
  }

  defineEvents() {
    this.playButton.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      console.log('Play clicked');
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

  handlePlayerInfo() {
    Selectors.nameSubmitSelector.addEventListener('click', (e) => {
      e.preventDefault();
      const playerName = Selectors.playerNameSelector.value;
      if (playerName.length < 3) {
        Selectors.notificationSelector.innerHTML =
          'Name cannot be less than 3 character';
        Selectors.notificationSelector.style.display = 'block';
        setTimeout(() => {
          Selectors.notificationSelector.style.display = 'none';
        }, 3000);
        return;
      }
      this.intro.style.filter = 'blur(0px)';
      globalObject.playerName = playerName;
      console.log(globalObject.playerName);
      localStorage.setItem('playerName', playerName);
      Selectors.nameFormSelector.style.display = 'none';
    });
  }
  async fetchScore() {
    const response = await fetch('http://127.0.0.1:5005/api/score', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    console.log(responseData.data);
    this.renderHallOfFame(responseData.data);
  }
  renderHallOfFame(data) {
    Selectors.highScore.classList.add('high-scores');
    const heading = document.createElement('h1');
    heading.innerHTML = 'HALL OF FAME';
    Selectors.highScore.appendChild(heading);
    const schema = document.createElement('div');
    schema.classList.add('score-wrapper');
    ['Name', 'Score', 'Timing'].forEach((title) => {
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
}
export default HomeScreen;
