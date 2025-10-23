// src/utils/stats.js
import Stats from 'three/addons/libs/stats.module.js';

export function createStats() {
  const stats = new Stats();
  stats.dom.style.position = 'absolute';
  stats.dom.style.top = '0';
  stats.dom.style.left = '0';
  stats.dom.style.zIndex = '9999';
  document.body.appendChild(stats.dom);
  return stats;
}
