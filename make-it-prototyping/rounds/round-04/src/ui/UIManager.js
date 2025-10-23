// src/ui/UIManager.js
import * as THREE from 'three';
import { Toast } from '../utils/Toast.js';

export class UIManager {
  constructor(app) {
    this.app = app;
    this.elements = this.getElements();
    this.init();
  }

  getElements() {
    return {
      // Control Panel
      shapeType: document.getElementById('shape-type'),
      size: document.getElementById('size'),
      color: document.getElementById('color'),
      materialType: document.getElementById('material-type'),
      addShapeBtn: document.getElementById('add-shape'),
      duplicateShapeBtn: document.getElementById('duplicate-shape'),
      deleteShapeBtn: document.getElementById('delete-shape'),
      clearSceneBtn: document.getElementById('clear-scene'),

      // Scene Controls
      saveSceneBtn: document.getElementById('save-scene'),
      loadSceneBtn: document.getElementById('load-scene'),

      // Export Controls
      exportGltfBtn: document.getElementById('export-gltf'),
      exportGlbBtn: document.getElementById('export-glb'),

      // Toolbar
      modeTranslate: document.getElementById('mode-translate'),
      modeRotate: document.getElementById('mode-rotate'),
      modeScale: document.getElementById('mode-scale'),
      snapToggle: document.getElementById('snap-toggle'),
      camFront: document.getElementById('cam-front'),
      camTop: document.getElementById('cam-top'),
      camSide: document.getElementById('cam-side'),
      camIso: document.getElementById('cam-iso'),

      // Properties Panel
      noSelection: document.getElementById('no-selection'),
      objectProperties: document.getElementById('object-properties'),
      objectName: document.getElementById('object-name'),

      // Transform inputs
      posX: document.getElementById('pos-x'),
      posY: document.getElementById('pos-y'),
      posZ: document.getElementById('pos-z'),
      rotX: document.getElementById('rot-x'),
      rotY: document.getElementById('rot-y'),
      rotZ: document.getElementById('rot-z'),
      scaleX: document.getElementById('scale-x'),
      scaleY: document.getElementById('scale-y'),
      scaleZ: document.getElementById('scale-z'),
      matColor: document.getElementById('mat-color'),
    };
  }

  init() {
    // Add shape button
    this.elements.addShapeBtn.addEventListener('click', () => {
      const type = this.elements.shapeType.value;
      const size = parseFloat(this.elements.size.value);
      const color = this.elements.color.value;
      const materialType = this.elements.materialType.value;

      this.app.addShape(type, {
        size,
        color,
        materialType,
        position: { x: 0, y: size / 2, z: 0 }
      });
    });

    // Duplicate button
    this.elements.duplicateShapeBtn.addEventListener('click', () => {
      this.app.duplicateSelected();
    });

    // Delete button
    this.elements.deleteShapeBtn.addEventListener('click', () => {
      this.app.deleteSelected();
    });

    // Clear scene button
    this.elements.clearSceneBtn.addEventListener('click', () => {
      Toast.confirm(
        'Are you sure you want to clear the entire scene?',
        () => {
          this.app.clearScene();
          Toast.success('Scene cleared successfully');
        }
      );
    });

    // Save/Load buttons
    this.elements.saveSceneBtn.addEventListener('click', () => {
      this.saveScene();
    });

    this.elements.loadSceneBtn.addEventListener('click', () => {
      this.loadScene();
    });

    // Toolbar buttons for transform modes
    this.elements.modeTranslate.addEventListener('click', () => {
      this.setTransformMode('translate');
    });

    this.elements.modeRotate.addEventListener('click', () => {
      this.setTransformMode('rotate');
    });

    this.elements.modeScale.addEventListener('click', () => {
      this.setTransformMode('scale');
    });

    // Snap toggle
    this.elements.snapToggle.addEventListener('change', (e) => {
      this.app.sceneManager.toggleSnap(e.target.checked);
    });

    // Export buttons
    this.elements.exportGltfBtn.addEventListener('click', () => {
      this.app.exportManager.exportGLTF();
    });

    this.elements.exportGlbBtn.addEventListener('click', () => {
      this.app.exportManager.exportGLB();
    });

    // Camera preset buttons
    console.log('Camera buttons:', {
      front: this.elements.camFront,
      top: this.elements.camTop,
      side: this.elements.camSide,
      iso: this.elements.camIso
    });

    if (this.elements.camFront) {
      this.elements.camFront.addEventListener('click', () => {
        console.log('Front button clicked');
        this.app.sceneManager.setCameraView('front');
      });
    }

    if (this.elements.camTop) {
      this.elements.camTop.addEventListener('click', () => {
        console.log('Top button clicked');
        this.app.sceneManager.setCameraView('top');
      });
    }

    if (this.elements.camSide) {
      this.elements.camSide.addEventListener('click', () => {
        console.log('Side button clicked');
        this.app.sceneManager.setCameraView('right');
      });
    }

    if (this.elements.camIso) {
      this.elements.camIso.addEventListener('click', () => {
        console.log('Iso button clicked');
        this.app.sceneManager.setCameraView('iso');
      });
    }

    // Property inputs - update object when changed
    this.setupPropertyListeners();
  }

  setTransformMode(mode) {
    this.app.sceneManager.setTransformMode(mode);

    // Update toolbar button states
    this.elements.modeTranslate.classList.toggle('active', mode === 'translate');
    this.elements.modeRotate.classList.toggle('active', mode === 'rotate');
    this.elements.modeScale.classList.toggle('active', mode === 'scale');
  }

  setupPropertyListeners() {
    const updatePosition = () => {
      const selected = this.app.selectionManager.getSelected();
      if (!selected) return;

      selected.position.set(
        parseFloat(this.elements.posX.value),
        parseFloat(this.elements.posY.value),
        parseFloat(this.elements.posZ.value)
      );
    };

    const updateRotation = () => {
      const selected = this.app.selectionManager.getSelected();
      if (!selected) return;

      selected.rotation.set(
        THREE.MathUtils.degToRad(parseFloat(this.elements.rotX.value)),
        THREE.MathUtils.degToRad(parseFloat(this.elements.rotY.value)),
        THREE.MathUtils.degToRad(parseFloat(this.elements.rotZ.value))
      );
    };

    const updateScale = () => {
      const selected = this.app.selectionManager.getSelected();
      if (!selected) return;

      selected.scale.set(
        parseFloat(this.elements.scaleX.value),
        parseFloat(this.elements.scaleY.value),
        parseFloat(this.elements.scaleZ.value)
      );
    };

    const updateColor = () => {
      const selected = this.app.selectionManager.getSelected();
      if (!selected) return;

      selected.material.color.set(this.elements.matColor.value);
    };

    // Attach listeners
    ['posX', 'posY', 'posZ'].forEach(key => {
      this.elements[key].addEventListener('input', updatePosition);
    });

    ['rotX', 'rotY', 'rotZ'].forEach(key => {
      this.elements[key].addEventListener('input', updateRotation);
    });

    ['scaleX', 'scaleY', 'scaleZ'].forEach(key => {
      this.elements[key].addEventListener('input', updateScale);
    });

    this.elements.matColor.addEventListener('input', updateColor);
  }

  updatePropertiesPanel(object) {
    this.elements.noSelection.style.display = 'none';
    this.elements.objectProperties.style.display = 'block';

    // Update name
    this.elements.objectName.textContent = object.userData.name || 'Unnamed Object';

    // Update position
    this.elements.posX.value = object.position.x.toFixed(2);
    this.elements.posY.value = object.position.y.toFixed(2);
    this.elements.posZ.value = object.position.z.toFixed(2);

    // Update rotation (convert to degrees)
    this.elements.rotX.value = THREE.MathUtils.radToDeg(object.rotation.x).toFixed(0);
    this.elements.rotY.value = THREE.MathUtils.radToDeg(object.rotation.y).toFixed(0);
    this.elements.rotZ.value = THREE.MathUtils.radToDeg(object.rotation.z).toFixed(0);

    // Update scale
    this.elements.scaleX.value = object.scale.x.toFixed(2);
    this.elements.scaleY.value = object.scale.y.toFixed(2);
    this.elements.scaleZ.value = object.scale.z.toFixed(2);

    // Update color
    this.elements.matColor.value = '#' + object.material.color.getHexString();
  }

  clearPropertiesPanel() {
    this.elements.noSelection.style.display = 'block';
    this.elements.objectProperties.style.display = 'none';
  }

  saveScene() {
    const sceneData = {
      objects: [],
      timestamp: Date.now(),
    };

    this.app.sceneManager.scene.traverse((object) => {
      if (object.isMesh && object.userData.type) {
        sceneData.objects.push({
          type: object.userData.type,
          position: object.position.toArray(),
          rotation: object.rotation.toArray(),
          scale: object.scale.toArray(),
          color: '#' + object.material.color.getHexString(),
        });
      }
    });

    const json = JSON.stringify(sceneData, null, 2);
    localStorage.setItem('3d-model-builder-scene', json);

    Toast.success(`Scene saved successfully! (${sceneData.objects.length} objects)`);
  }

  loadScene() {
    const json = localStorage.getItem('3d-model-builder-scene');
    if (!json) {
      Toast.warning('No saved scene found!');
      return;
    }

    Toast.confirm(
      'This will replace the current scene. Continue?',
      () => {
        try {
          const sceneData = JSON.parse(json);

          // Clear existing scene
          this.app.clearScene();

          // Load objects
          sceneData.objects.forEach((objData) => {
            const shape = this.app.addShape(objData.type, {
              size: 1, // Will be adjusted by scale
              color: objData.color,
              position: { x: 0, y: 0, z: 0 }, // Will be set below
            });

            shape.position.fromArray(objData.position);
            shape.rotation.fromArray(objData.rotation);
            shape.scale.fromArray(objData.scale);
          });

          Toast.success(`Scene loaded successfully! (${sceneData.objects.length} objects)`);
        } catch (error) {
          Toast.error('Error loading scene: ' + error.message);
        }
      }
    );
  }
}
