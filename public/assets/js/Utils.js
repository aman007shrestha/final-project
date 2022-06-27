// Gravity implementation
import Selectors from './DomSelector.js';
const useGravity = (entity) => {
  entity.velocity.y += 0.18;
  entity.position.y += entity.velocity.y;
};

const notification = (message) => {
  Selectors.notificationSelector.innerHTML = message;
  Selectors.notificationSelector.style.display = 'block';
  setTimeout(() => {
    Selectors.notificationSelector.style.display = 'none';
  }, 3000);
};

export { useGravity, notification };
