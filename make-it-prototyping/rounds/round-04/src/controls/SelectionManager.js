// src/controls/SelectionManager.js
import * as THREE from 'three';

export class SelectionManager {
  constructor(scene, camera, domElement) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectableObjects = [];
    this.selectedObject = null;
    this.highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    this.highlightBox = null;
    this.eventListeners = {};

    this.init();
  }

  init() {
    this.domElement.addEventListener('click', (e) => this.onClick(e));
    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onClick(event) {
    this.updateMousePosition(event);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.selectableObjects);

    if (intersects.length > 0) {
      this.select(intersects[0].object);
    } else {
      this.deselect();
    }
  }

  onMouseMove(event) {
    this.updateMousePosition(event);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.selectableObjects);

    // Update cursor
    this.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  }

  updateMousePosition(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  select(object) {
    if (this.selectedObject === object) return;

    this.deselect();

    this.selectedObject = object;
    this.createHighlight(object);
    this.emit('select', object);
  }

  deselect() {
    if (!this.selectedObject) return;

    this.removeHighlight();
    this.selectedObject = null;
    this.emit('deselect');
  }

  createHighlight(object) {
    const geometry = object.geometry.clone();
    this.highlightBox = new THREE.Mesh(geometry, this.highlightMaterial);
    this.highlightBox.position.copy(object.position);
    this.highlightBox.rotation.copy(object.rotation);
    this.highlightBox.scale.copy(object.scale).multiplyScalar(1.01);
    this.scene.add(this.highlightBox);

    // Animate the highlight
    this.animateHighlight();
  }

  animateHighlight() {
    if (!this.highlightBox) return;

    const startTime = Date.now();
    const animate = () => {
      if (!this.highlightBox) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const pulse = Math.sin(elapsed * 3) * 0.02 + 1.01;

      if (this.selectedObject) {
        this.highlightBox.position.copy(this.selectedObject.position);
        this.highlightBox.rotation.copy(this.selectedObject.rotation);
        this.highlightBox.scale.copy(this.selectedObject.scale).multiplyScalar(pulse);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  removeHighlight() {
    if (this.highlightBox) {
      this.scene.remove(this.highlightBox);
      this.highlightBox.geometry.dispose();
      this.highlightBox = null;
    }
  }

  addSelectableObject(object) {
    this.selectableObjects.push(object);
  }

  removeSelectableObject(object) {
    const index = this.selectableObjects.indexOf(object);
    if (index > -1) {
      this.selectableObjects.splice(index, 1);
    }
  }

  getSelected() {
    return this.selectedObject;
  }

  clearAll() {
    this.deselect();
    this.selectableObjects = [];
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }
}
