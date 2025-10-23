// src/main.js
import * as THREE from 'three';
import { SceneManager } from './core/scene.js';
import { ShapeFactory } from './objects/ShapeFactory.js';
import { SelectionManager } from './controls/SelectionManager.js';
import { UIManager } from './ui/UIManager.js';
import { CommandManager, AddObjectCommand, DeleteObjectCommand } from './utils/CommandManager.js';
import { Toast } from './utils/Toast.js';
import { ExportManager } from './utils/ExportManager.js';

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
}

// Initialize application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Application();
});
