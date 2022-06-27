import Selectors from './DomSelector.js';
import { Game } from './Main.js';

class SavedLevel {
  constructor() {
    this.fetchData();
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
    responseData.map((data) => {
      const element = document.createElement('div');
      element.classList.add('saved-level');

      const levelInfo = document.createElement('div');
      levelInfo.classList.add('level-info');
      element.appendChild(levelInfo);

      const deleteLevel = document.createElement('div');
      deleteLevel.innerHTML = 'x';
      element.appendChild(deleteLevel);

      deleteLevel.addEventListener('click', () => {
        this.deleteSavedLevel(data);
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

      Selectors.savedLevel.appendChild(element);
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
    Selectors.savedLevel.style.display = 'none';
    new Game(map);
  }

  deleteSavedLevel(data) {}
}

export default SavedLevel;
