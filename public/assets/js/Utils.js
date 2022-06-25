// Gravity implementation
const useGravity = (entity) => {
  entity.velocity.y += 0.24;
  entity.position.y += entity.velocity.y;
};

export { useGravity };
