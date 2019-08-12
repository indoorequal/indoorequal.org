export function findAllLevels(features) {
  const levels = [];
  for (let i = 0; i < features.length; i++) {
    const level = features[i].properties.level;
    if (!levels.includes(level)) {
      levels.push(level);
    }
  }
  return levels.sort((a, b) => a - b).reverse();
}
