// src/objects/MaterialLibrary.js
import * as THREE from 'three';

export class MaterialLibrary {
  static presets = {
    standard: {
      name: 'Standard',
      create: (color) => new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.5,
      })
    },
    metal: {
      name: 'Metal',
      create: (color) => new THREE.MeshStandardMaterial({
        color,
        metalness: 1.0,
        roughness: 0.2,
      })
    },
    plastic: {
      name: 'Plastic',
      create: (color) => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: 0.5,
      })
    },
    glass: {
      name: 'Glass',
      create: (color) => new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
      })
    },
    rubber: {
      name: 'Rubber',
      create: (color) => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: 1.0,
      })
    },
    mirror: {
      name: 'Mirror',
      create: (color) => new THREE.MeshStandardMaterial({
        color,
        metalness: 1.0,
        roughness: 0.0,
      })
    },
    matte: {
      name: 'Matte',
      create: (color) => new THREE.MeshLambertMaterial({
        color,
      })
    },
    glossy: {
      name: 'Glossy',
      create: (color) => new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
      })
    },
  };

  static create(presetName, color) {
    const preset = this.presets[presetName];
    if (!preset) {
      console.warn(`Unknown preset: ${presetName}`);
      return this.presets.standard.create(color);
    }
    return preset.create(color);
  }

  static getPresetNames() {
    return Object.keys(this.presets);
  }

  static getPresetDisplayNames() {
    return Object.entries(this.presets).map(([key, value]) => ({
      key,
      name: value.name
    }));
  }
}
