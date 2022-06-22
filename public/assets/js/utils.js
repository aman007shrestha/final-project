const useGravity = (entity) => {
  // console.log('Run gravity');
  entity.velocity.y += 0.1;
  entity.position.y += entity.velocity.y;
};

export { useGravity };
