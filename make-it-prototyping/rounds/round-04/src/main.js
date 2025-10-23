// src/main.js
import * as THREE from 'three';
import { SceneManager } from './core/scene.js';
import { ShapeFactory } from './objects/ShapeFactory.js';
import { SelectionManager } from './controls/SelectionManager.js';
import { UIManager } from './ui/UIManager.js';
import { CommandManager, AddObjectCommand, DeleteObjectCommand } from './utils/CommandManager.js';
import { Toast } from './utils/Toast.js';
import { ExportManager } from './utils/ExportManager.js';
import { SketchManager } from './sketch/SketchManager.js';
import { ExtrudeOperation, CSGOperations, FilletOperation } from './operations/CADOperations.js';

class Application {
  constructor() {
    this.sceneManager = new SceneManager();
    this.shapeFactory = new ShapeFactory();
    this.selectionManager = new SelectionManager(
      this.sceneManager.scene,
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
    );
    this.commandManager = new CommandManager();
    this.exportManager = new ExportManager(this.sceneManager.scene);
    this.sketchManager = new SketchManager(
      this.sceneManager,
      this.sceneManager.camera,
      this.sceneManager.renderer
    );
    this.uiManager = new UIManager(this);

    this.init();
  }

  init() {
    // Set up event listeners
    this.setupEventListeners();

    // Start render loop
    this.sceneManager.startRenderLoop();

    console.log('3D Model Builder initialized successfully!');
  }

  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.sceneManager.onWindowResize();
    });

    // Selection events
    this.selectionManager.on('select', (object) => {
      this.sceneManager.attachTransformControls(object);
      this.uiManager.updatePropertiesPanel(object);
    });

    this.selectionManager.on('deselect', () => {
      this.sceneManager.detachTransformControls();
      this.uiManager.clearPropertiesPanel();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Handle Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            this.duplicateSelected();
            break;
          case 'z':
            e.preventDefault();
            this.undo();
            break;
          case 'y':
            e.preventDefault();
            this.redo();
            break;
        }
        return;
      }

      // Handle regular shortcuts
      switch (e.key.toLowerCase()) {
        case 'g':
          this.sceneManager.setTransformMode('translate');
          this.uiManager.setTransformMode('translate');
          break;
        case 'r':
          this.sceneManager.setTransformMode('rotate');
          this.uiManager.setTransformMode('rotate');
          break;
        case 's':
          this.sceneManager.setTransformMode('scale');
          this.uiManager.setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          this.deleteSelected();
          break;
        case 'escape':
          this.selectionManager.deselect();
          break;
      }
    });
  }

  addShape(type, params) {
    const shape = this.shapeFactory.create(type, params);

    const command = new AddObjectCommand(
      this.sceneManager.scene,
      shape,
      this.selectionManager
    );
    this.commandManager.execute(command);

    return shape;
  }

  deleteSelected() {
    const selected = this.selectionManager.getSelected();
    if (selected) {
      const command = new DeleteObjectCommand(
        this.sceneManager.scene,
        selected,
        this.selectionManager
      );
      this.commandManager.execute(command);
    }
  }

  undo() {
    if (this.commandManager.undo()) {
      Toast.info('Undo successful');
    } else {
      Toast.warning('Nothing to undo');
    }
  }

  redo() {
    if (this.commandManager.redo()) {
      Toast.info('Redo successful');
    } else {
      Toast.warning('Nothing to redo');
    }
  }

  clearScene() {
    this.selectionManager.clearAll();
    this.sceneManager.clearScene();
  }

  /**
   * Clear absolutely everything - shapes, sketches, and exit sketch mode
   */
  clearAll() {
    console.log('Clearing everything...');

    // Exit sketch mode if active
    if (this.sketchManager.isSketchMode) {
      this.sketchManager.exitSketchMode(false);
    }

    // Clear all selections
    this.selectionManager.clearAll();

    // Clear the 3D scene (all meshes)
    this.sceneManager.clearScene();

    // Clear any remaining sketch-related objects
    const toRemove = [];
    this.sceneManager.scene.traverse((object) => {
      if (object.userData.isSketchLine ||
          object.userData.isEndpointMarker ||
          object.userData.isGapIndicator ||
          object.userData.isConnectionLine ||
          object.userData.isSketchPlane) {
        toRemove.push(object);
      }
    });

    toRemove.forEach(obj => {
      this.sceneManager.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });

    // Reset command history
    this.commandManager = new CommandManager();

    // Clear properties panel
    this.uiManager.clearPropertiesPanel();

    console.log('Everything cleared successfully');
  }

  duplicateSelected() {
    const selected = this.selectionManager.getSelected();
    if (!selected) return;

    // Create a duplicate with the same type
    const duplicate = this.shapeFactory.create(
      selected.userData.type,
      {
        size: 1, // Will be adjusted by scale
        color: '#' + selected.material.color.getHexString(),
      }
    );

    // Copy transform properties
    duplicate.position.copy(selected.position).add(new THREE.Vector3(1, 0, 1));
    duplicate.rotation.copy(selected.rotation);
    duplicate.scale.copy(selected.scale);

    // Add to scene
    this.sceneManager.scene.add(duplicate);
    this.selectionManager.addSelectableObject(duplicate);

    // Select the new duplicate
    this.selectionManager.select(duplicate);
  }

  // ===== CAD Operations =====

  /**
   * Extrude the current sketch into a 3D shape
   */
  extrudeSketch(depth = 1) {
    // First check if contour is closed
    const contourResult = this.sketchManager.checkContourClosure();

    if (!contourResult) {
      Toast.warning('No sketch to extrude. Draw a shape first.');
      return;
    }

    if (!contourResult.isClosed) {
      const gapCount = contourResult.gaps.length;
      Toast.error(`Cannot extrude: Sketch is not closed (${gapCount} gap${gapCount > 1 ? 's' : ''} found)`);
      return;
    }

    const shape = this.sketchManager.getSketchShape();
    if (!shape) {
      Toast.warning('Failed to create shape from sketch.');
      return;
    }

    Toast.info('Extruding closed contour...');

    const mesh = ExtrudeOperation.execute(shape, {
      depth: depth,
      bevelEnabled: false,
      color: 0x00ff00,
      materialType: 'standard',
    });

    if (mesh) {
      // Get the sketch plane to properly position and orient the extruded mesh
      const sketchPlane = this.sketchManager.currentPlane;

      // Apply the sketch plane's position and rotation to the extruded mesh
      mesh.position.copy(sketchPlane.position);
      mesh.rotation.copy(sketchPlane.plane.rotation);

      // Add a small offset in the normal direction to avoid z-fighting
      const offset = sketchPlane.normal.clone().multiplyScalar(0.01);
      mesh.position.add(offset);

      this.sceneManager.scene.add(mesh);
      this.selectionManager.addSelectableObject(mesh);
      this.sketchManager.exitSketchMode(false);
      Toast.success('Shape extruded successfully!');
    }
  }

  /**
   * Perform CSG union on two selected objects
   */
  performUnion() {
    // Implementation would require selecting two objects
    Toast.info('Select two objects to union (coming soon)');
  }

  /**
   * Perform CSG subtraction
   */
  performSubtract() {
    Toast.info('Select two objects to subtract (coming soon)');
  }

  /**
   * Create a filleted box
   */
  createFilletedBox(width, height, depth, radius) {
    const mesh = FilletOperation.createFilletedBox(width, height, depth, radius, {
      color: 0x00ff00,
      materialType: 'standard',
    });

    if (mesh) {
      this.sceneManager.scene.add(mesh);
      this.selectionManager.addSelectableObject(mesh);
    }
  }
}

// Initialize application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Application();
});
