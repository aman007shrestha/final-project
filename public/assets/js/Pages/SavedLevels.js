import Selectors from '../Utilities/DomSelector.js';
import { Game } from '../Main.js';
import { globalObject } from '../Main.js';
import { notification, backMenu } from '../Utilities/Utils.js';
import { CLICK_EVENT, MAP_API, NONE, SAVED_LEVEL_PAGE } from '../Constants.js';

/**
 * class blueprint for rendering Saved level page
 */
class SavedLevel {
  constructor() {
    this.fetchData();
    this.handleEvents();
    Selectors.mainMenu.style.display = 'block';
    globalObject.currentPage = SAVED_LEVEL_PAGE;
  }
  /**
   * fetch data of maps
   */
  async fetchData() {
    const response = await fetch(MAP_API, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    this.displayLevels(responseData.data);
  }
  /**
   *
   * @param {Array} responseData loop through array to render each map card
   */
  displayLevels(responseData) {
    const levelsWrapper = document.createElement('div');
    levelsWrapper.classList.add('level-wrapper');
    Selectors.savedLevel.appendChild(levelsWrapper);
    Selectors.levelsWrapper = levelsWrapper;

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
        this.renderLevel(data);
      });
      Selectors.levelsWrapper.appendChild(element);
    });
  }

  async renderLevel(data) {
    const response = await fetch(MAP_API + data._id, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const responseData = await response.json();
    const map = responseData.data.map;
    Selectors.savedLevel.style.display = NONE;
    Selectors.levelsWrapper.style.display = NONE;
    new Game(map, data);
  }
  /**
   *
   * @param {Object} data data object which is to be deleted
   * @param {Number} index of element which is to be deleted
   * @param {Array} responseData Array from where data is to be deleted
   * @returns
   */
  async deleteSavedLevel(data, index, responseData) {
    if (data.player !== globalObject.playerName) {
      notification('You are not author');
      return;
    }
    const response = await fetch(MAP_API + data._id, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    });
    const deleteResponse = await response.json();
    if (deleteResponse.success) {
      responseData.splice(index, 1);
      document.getElementsByClassName('saved-level')[index].remove();
      notification('Map Deleted');
      return;
    }
  }
  /**
   * Click Back event
   */
  handleEvents() {
    Selectors.mainMenu.addEventListener(CLICK_EVENT, backMenu);
  }
}
export default SavedLevel;
