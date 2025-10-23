// src/objects/ShapeFactory.js
import * as THREE from 'three';
import { MaterialLibrary } from './MaterialLibrary.js';

export class ShapeFactory {
  constructor() {
    this.objectCounter = 0;
  }

  create(type, params = {}) {
    // Default parameters
    const defaults = {
      size: 1,
      color: 0x00ff00,
      materialType: 'standard',
      position: { x: 0, y: 0, z: 0 },
    };

    const config = { ...defaults, ...params };

    let geometry;

    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(
          config.size,
          config.size,
          config.size
        );
        break;

      case 'sphere':
        geometry = new THREE.SphereGeometry(
          config.size / 2,
          32,
          32
        );
        break;

      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          config.size / 2,
          config.size / 2,
          config.size,
          32
        );
        break;

      case 'cone':
        geometry = new THREE.ConeGeometry(
          config.size / 2,
          config.size,
          32
        );
        break;

      case 'torus':
        geometry = new THREE.TorusGeometry(
          config.size / 2,
          config.size / 4,
          16,
          100
        );
        break;

      case 'plane':
        geometry = new THREE.PlaneGeometry(
          config.size,
          config.size
        );
        break;

      default:
        console.warn(`Unknown shape type: ${type}`);
        geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
    }

    // Create material using MaterialLibrary
    const material = MaterialLibrary.create(config.materialType, config.color);

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Set position
    mesh.position.set(config.position.x, config.position.y, config.position.z);

    // Add metadata
    mesh.userData = {
      type,
      id: ++this.objectCounter,
      name: `${type}_${this.objectCounter}`,
      createdAt: Date.now(),
    };

    return mesh;
  }

  createMaterial(type, color) {
    const colorValue = typeof color === 'string' ? color : `#${color.toString(16).padStart(6, '0')}`;

    switch (type) {
      case 'basic':
        return new THREE.MeshBasicMaterial({ color: colorValue });

      case 'lambert':
        return new THREE.MeshLambertMaterial({ color: colorValue });

      case 'phong':
        return new THREE.MeshPhongMaterial({
          color: colorValue,
          shininess: 100,
        });

      case 'standard':
      default:
        return new THREE.MeshStandardMaterial({
          color: colorValue,
          roughness: 0.5,
          metalness: 0.5,
        });
    }
  }
}
