import { tilesImage } from './Main.js';
import BlockObject from './BlockObjects.js';
import globalObject from './GlobalObect.js';
import { notification } from './Utils.js';
import {
  PIPE_BOTTOM_LEFT_ID,
  PIPE_BOTTOM_RIGHT_ID,
  PIPE_TOP_LEFT_ID,
  PIPE_TOP_RIGHT_ID,
  GROUND_ID,
  STONE_ID,
  BRICK_ID,
  TREASURE_ID,
  TILE_HEIGHT,
  TILE_WIDTH,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  GOOMBA_ID,
  EDITOR_SELECTOR_TILE_WIDTH,
  MAP_TILE_SIZE,
  EDITOR_CANVAS_HEIGHT,
  RIGHT_SCROLL_OFFSET,
  EDITOR_CANVAS_WIDTH,
  ROWS_OF_TILES,
  LEFT,
  RIGHT,
} from './Constants.js';

import Selectors from './DomSelector.js';
class MapEditor {
  constructor() {
    this.rightClickTracker = 0;
    this.rightScrollOffset = RIGHT_SCROLL_OFFSET;
    this.rightOffset;
    this.maxWidth = 2400;
    this.mapData = [];
    this.entities = [];
    this.canBeSaved = false;
    this.selectedEntityId = 0;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.height = ROWS_OF_TILES * MAP_TILE_SIZE;
    this.canvas.width = EDITOR_CANVAS_WIDTH;
    this.canvas.classList.add('editor-canvas');
    Selectors.mapEditor.appendChild(this.canvas);

    this.column = Math.floor(this.maxWidth / MAP_TILE_SIZE);
    this.rightOffset = this.column * MAP_TILE_SIZE - this.canvas.width;
    Selectors.widthSelector.addEventListener('click', (e) => {
      e.preventDefault();
      this.maxWidth = Selectors.widthInput.value;
      this.column =
        Math.floor(Math.floor(this.maxWidth / MAP_TILE_SIZE) / 10) * 10;
      this.rightOffset = this.column * MAP_TILE_SIZE - this.canvas.width;
      this.initMap(this.column);
    });

    const tileSelector = document.createElement('div');
    tileSelector.classList.add('tiles-wrapper');
    Selectors.mapEditor.appendChild(tileSelector);

    this.leftNavButton = this.addNavButtons(LEFT);
    this.rightNavButton = this.addNavButtons(RIGHT);
    Selectors.mapEditor.appendChild(this.leftNavButton);
    Selectors.mapEditor.appendChild(this.rightNavButton);
    this.addSelectors(tileSelector);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.initMap(this.column);
    this.handleSelect();
    this.handleEvents();
  }
  addSelectors(tileSelector) {
    [0, 1, 2, 3, 4, 5, 411, 412, 421, 422, 11].forEach((data) => {
      let elementCanvas = document.createElement('canvas');
      let ctx = elementCanvas.getContext('2d');
      elementCanvas.width = EDITOR_SELECTOR_TILE_WIDTH;
      elementCanvas.height = EDITOR_SELECTOR_TILE_WIDTH;
      let element = document.createElement('div');
      element.setAttribute('data', data);
      element.classList.add('entities');
      element.appendChild(elementCanvas);
      tileSelector.appendChild(element);
      element.addEventListener('click', () => {
        this.selectedEntityId = Number(element.getAttribute('data'));
      });
      this.drawSelectors(ctx, data);
    });
  }
  addNavButtons(direction) {
    let directionButton = document.createElement('button');
    directionButton.classList.add('nav__button');
    directionButton.classList.add(`button--${direction}`);
    if (direction === LEFT) {
      directionButton.innerHTML = '<';
    } else if (direction === RIGHT) {
      directionButton.innerHTML = '>';
    }
    return directionButton;
  }
  initMap(column) {
    this.mapData = [];
    for (let row = 0; row < ROWS_OF_TILES; row++) {
      let rowData = [];
      for (let col = 0; col < column; col++) {
        rowData.push(0);
      }
      this.mapData.push(rowData);
    }
  }
  handleSelect() {
    this.canvas.addEventListener('click', ({ offsetX, offsetY }) => {
      let rowIndex = Math.floor(offsetY / MAP_TILE_SIZE);
      let columnIndex =
        Math.floor(offsetX / MAP_TILE_SIZE) +
        this.rightClickTracker * (this.rightScrollOffset / MAP_TILE_SIZE);
      this.mapData[rowIndex][columnIndex] = this.selectedEntityId;

      let block = new BlockObject({
        position: {
          x:
            MAP_TILE_SIZE *
            (columnIndex -
              this.rightClickTracker *
                (this.rightScrollOffset / MAP_TILE_SIZE)),
          y: MAP_TILE_SIZE * rowIndex,
        },
        elementId: this.selectedEntityId,
        size: MAP_TILE_SIZE,
      });
      block.initBlock(this.ctx);
      this.entities.push(block);
      //Edit for flag Flag
      if (this.selectedEntityId === 2) {
        this.canBeSaved = true;
      }
    });
  }
  handleEvents() {
    // @desc Navbuttons handling
    this.rightNavButton.addEventListener('click', () => {
      console.log(this.mapData);
      if (this.rightOffset <= 0) {
        notification('Reached End of World');
        console.log('You shall not pass');
        return;
      } else {
        this.rightNavButton.style.display = 'block';
      }
      this.rightOffset -= RIGHT_SCROLL_OFFSET;
      this.rightClickTracker += 1;
      console.log(this.rightClickTracker);
      console.log(this.rightOffset);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // console.log(this.entities);
      this.entities.forEach((entity) => {
        entity.position.x -= RIGHT_SCROLL_OFFSET;
        if (entity.elementId !== 0) {
          entity.drawBlock(this.ctx);
        }
        if (entity.elementId === 0) {
          entity.drawBlock(this.ctx, 0);
        }
      });
    });
    this.leftNavButton.addEventListener('click', () => {
      if (this.rightClickTracker <= 0) {
        notification('Reached Start of World');
        return;
      } else {
        this.leftNavButton.style.display = 'block';
      }
      this.rightOffset += RIGHT_SCROLL_OFFSET;
      this.rightClickTracker -= 1;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.entities.forEach((entity) => {
        entity.position.x += RIGHT_SCROLL_OFFSET;
        if (entity.elementId !== 0) {
          entity.drawBlock(this.ctx);
        }
        if (entity.elementId === 0) {
          entity.drawBlock(this.ctx, 0);
        }
      });
    });
    Selectors.clearMap.addEventListener('click', () => {
      this.clearMap(this);
    });
    Selectors.saveMap.addEventListener('click', () => {
      this.saveMap();
    });
  }
  drawSelectors(ctx, data) {
    let spriteCoordinates;
    switch (data) {
      case 0:
        ctx.fillStyle = 'white';
        ctx.fillRect(
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case GROUND_ID:
        spriteCoordinates = [0, 0, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case BRICK_ID:
        spriteCoordinates = [16 * 22, 0, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case STONE_ID:
        spriteCoordinates = [0, 16, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case PIPE_TOP_LEFT_ID:
        spriteCoordinates = [0, 16 * 10, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case PIPE_TOP_RIGHT_ID:
        spriteCoordinates = [16, 16 * 10, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case PIPE_BOTTOM_LEFT_ID:
        spriteCoordinates = [0, 16 * 11, SPRITE_WIDTH, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
      case PIPE_BOTTOM_RIGHT_ID:
        spriteCoordinates = [16, 16 * 11, SPRITE_WIDTH - 1, SPRITE_HEIGHT];
        ctx.drawImage(
          tilesImage,
          ...spriteCoordinates,
          0,
          0,
          EDITOR_SELECTOR_TILE_WIDTH,
          EDITOR_SELECTOR_TILE_WIDTH
        );
        break;
    }
  }
  clearMap(object) {
    console.log(object);
    console.log('wassip');
    console.log(this);
    object.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    object.entities = [];
    object.mapData = [];
    object.initMap(object.column);
    console.log(object.mapData);
  }
  async saveMap() {
    if (this.canBeSaved) {
      const rawData = {
        player: globalObject.playerName,
        mapData: this.mapData,
      };
      const jsonData = JSON.stringify(rawData);
      console.log(jsonData);
      const response = await fetch('http://127.0.0.1:5005/api/map', {
        method: 'POST',
        body: jsonData,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        notification('Map Saved');
      }

      this.clearMap(this);
    } else {
      notification('Add a flag pole');
    }
  }
}
export default MapEditor;
