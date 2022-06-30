import { tilesImage, assetImage } from '../Main.js';
import BlockObject from '../GenericClass/BlockObjects.js';
import { globalObject } from '../Main.js';
import { notification, backMenu } from '../Utilities/Utils.js';
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
  FLAGPOLE_ID,
  FLAG_ID,
  EDITOR_SELECTOR_TILE_WIDTH,
  MAP_TILE_SIZE,
  RIGHT_SCROLL_OFFSET,
  EDITOR_CANVAS_WIDTH,
  ROWS_OF_TILES,
  LEFT,
  RIGHT,
  FLAG_SPRITE,
  TREASURE_SPRITE,
  GOOMBA_SPRITE,
  FLAGPOLE_SPRITE,
  PIPE_BOTTOM_RIGHT_SPRITE,
  PIPE_BOTTOM_LEFT_SPRITE,
  PIPE_TOP_RIGHT_SPRITE,
  PIPE_TOP_LEFT_SPRITE,
  STONE_SPRITE,
  BRICK_SPRITE,
  GROUND_SPRITE,
} from '../Constants.js';

import Selectors from '../Utilities/DomSelector.js';
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
    globalObject.currentPage = 'mapEditor';
    Selectors.mainMenu.style.display = 'block';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.height = ROWS_OF_TILES * MAP_TILE_SIZE;
    this.canvas.width = EDITOR_CANVAS_WIDTH;
    this.canvas.classList.add('editor-canvas');
    Selectors.editorCanvas = this.canvas;
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
    Selectors.tileSelector = tileSelector;

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
    [0, 1, 2, 3, 5, 7, 8, 411, 412, 421, 422, 11].forEach((data) => {
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
      if (this.selectedEntityId === FLAGPOLE_ID) {
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
        return;
      } else {
        this.rightNavButton.style.display = 'block';
      }
      this.rightOffset -= RIGHT_SCROLL_OFFSET;
      this.rightClickTracker += 1;
      console.log(this.rightClickTracker);
      console.log(this.rightOffset);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    Selectors.mainMenu.addEventListener('click', backMenu);
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
        spriteCoordinates = GROUND_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case BRICK_ID:
        spriteCoordinates = BRICK_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case STONE_ID:
        spriteCoordinates = STONE_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case PIPE_TOP_LEFT_ID:
        spriteCoordinates = PIPE_TOP_LEFT_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case PIPE_TOP_RIGHT_ID:
        spriteCoordinates = PIPE_TOP_RIGHT_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case PIPE_BOTTOM_LEFT_ID:
        spriteCoordinates = PIPE_BOTTOM_LEFT_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case PIPE_BOTTOM_RIGHT_ID:
        spriteCoordinates = PIPE_BOTTOM_RIGHT_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case TREASURE_ID:
        spriteCoordinates = TREASURE_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case FLAG_ID:
        spriteCoordinates = FLAG_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case FLAGPOLE_ID:
        spriteCoordinates = FLAGPOLE_SPRITE;
        this.draw(ctx, tilesImage, spriteCoordinates);
        break;
      case GOOMBA_ID:
        console.log(this.selectedEntityId);
        spriteCoordinates = GOOMBA_SPRITE;
        this.draw(ctx, assetImage, spriteCoordinates);
        break;
    }
  }

  draw(ctx, image, spriteCoordinates) {
    ctx.drawImage(
      image,
      ...spriteCoordinates,
      0,
      0,
      EDITOR_SELECTOR_TILE_WIDTH,
      EDITOR_SELECTOR_TILE_WIDTH
    );
  }

  clearMap(object) {
    object.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    object.entities = [];
    object.mapData = [];
    object.initMap(object.column);
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
