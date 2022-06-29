import Selectors from './DomSelector.js';
import { Game } from './Main.js';
import { globalObject } from './Main.js';
import { notification, backMenu } from './Utils.js';
import { HomeScreen, marioImg } from './Main.js';
import { CLICK_EVENT, NONE } from './Constants.js';

class SavedLevel {
  constructor() {
    this.fetchData();
    this.handleEvents();
    Selectors.mainMenu.style.display = 'block';
    globalObject.currentPage = 'savedLevel';
  }

  async fetchData() {
    const response = await fetch('http://127.0.0.1:5005/api/map', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    this.displayLevels(responseData.data);
  }

  displayLevels(responseData) {
    const levelsWrapper = document.createElement('div');
    levelsWrapper.classList.add('level-wrapper');
    Selectors.savedLevel.appendChild(levelsWrapper);
    Selectors.levelsWrapper = levelsWrapper;
    console.log(responseData);

    responseData.map((data, i) => {
      const element = document.createElement('div');
      element.classList.add('saved-level');

      const levelInfo = document.createElement('div');
      levelInfo.classList.add('level-info');
      element.appendChild(levelInfo);

      const deleteLevel = document.createElement('div');
      deleteLevel.innerHTML = 'x';
      deleteLevel.classList.add('delete-menu');
      element.appendChild(deleteLevel);

      deleteLevel.addEventListener('click', () => {
        this.deleteSavedLevel(data, i, responseData);
      });

      const levelName = document.createElement('div');
      levelName.innerHTML = `Saved Level ${data.level}`;
      levelInfo.appendChild(levelName);

      const authorName = document.createElement('div');
      authorName.innerHTML = `Author: ${data.player}`;
      levelInfo.appendChild(authorName);

      element.setAttribute('data', data._id);
      levelInfo.addEventListener('click', () => {
        this.renderLevel(data._id);
      });

      Selectors.levelsWrapper.appendChild(element);
    });
  }
  async renderLevel(data_id) {
    const response = await fetch(`http://127.0.0.1:5005/api/map/${data_id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    console.log(responseData.data.map);
    const map = responseData.data.map;
    Selectors.savedLevel.style.display = NONE;
    new Game(map);
  }

  async deleteSavedLevel(data, index, responseData) {
    if (data.player !== globalObject.playerName) {
      notification('You are not author');
      return;
    }
    console.log(data, index);
    const response = await fetch(`http://127.0.0.1:5005/api/map/${data._id}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    });
    const deleteResponse = await response.json();
    if (deleteResponse.success) {
      responseData.splice(index, 1);
      console.log(responseData);
      document.getElementsByClassName('saved-level')[index].remove();
      notification('Map Deleted');
      return;
    }
  }
  handleEvents() {
    Selectors.mainMenu.addEventListener(CLICK_EVENT, backMenu);
  }
}
export default SavedLevel;
