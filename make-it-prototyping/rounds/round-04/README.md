# 3D Model Builder Web Application - Complete Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Architecture Overview](#architecture-overview)
6. [Development Plan](#development-plan)
7. [Implementation Guide](#implementation-guide)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Performance Optimization](#performance-optimization)
12. [Deployment](#deployment)
13. [Contributing](#contributing)
14. [Resources](#resources)

## Project Overview
A web-based 3D modeling application that allows users to create, manipulate, and view 3D environments using basic geometric shapes. Built with Three.js for rendering and interaction.

**Key Features:**
- Interactive 3D viewport with orbit camera controls
- Multiple geometric primitives (cube, sphere, cylinder, cone, torus, plane)
- Real-time object manipulation (translate, rotate, scale)
- Material and color customization
- Scene persistence (save/load functionality)
- Intuitive UI with property panels and controls
- Raycasting-based object selection
- Grid snapping and visual helpers

**Target Users:**
- Developers learning 3D web graphics
- Designers prototyping 3D layouts
- Educators teaching 3D concepts
- Anyone needing a simple 3D scene builder

## Technology Stack

### Core Technologies
- **Three.js v0.160+**: Core 3D rendering engine
  - Scene management and rendering
  - Geometry and material systems
  - Camera and lighting
  - Controls and helpers
- **Vanilla JavaScript/TypeScript**: Application logic
  - ES6+ modules for code organization
  - Optional TypeScript for type safety
- **HTML5/CSS3**: UI framework
  - Semantic HTML for accessibility
  - CSS Grid/Flexbox for layout
  - CSS Custom Properties for theming
- **Vite 5+**: Modern build tool and dev server
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Built-in TypeScript support

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Browser DevTools**: Debugging and profiling

## Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Node.js (v18.0.0 or higher recommended)
node --version  # Should output v18.0.0 or higher

# npm (comes with Node.js)
npm --version   # Should output 9.0.0 or higher

# Git (for version control)
git --version   # Any recent version
```

**Knowledge Requirements:**
- Basic JavaScript (ES6+): arrow functions, classes, modules
- HTML/CSS fundamentals
- Basic understanding of 3D concepts (coordinates, transformations)
- Familiarity with npm and command line tools (helpful but not required)

## Development Plan

### Phase 1: Environment Setup
1. **Project Initialization**
   - Create basic HTML structure (`index.html`)
   - Set up build configuration (Vite or simple static server)
   - Install Three.js via npm or CDN
   - Create folder structure:
     ```
     round-04/
     ├── index.html
     ├── style.css
     ├── src/
     │   ├── main.js
     │   ├── scene.js
     │   ├── controls.js
     │   └── shapes.js
     ├── package.json
     └── README.md
     ```

2. **Basic Three.js Scene**
   - Initialize renderer, scene, and camera
   - Add basic lighting (ambient + directional)
   - Implement orbit controls for camera navigation
   - Add grid helper for spatial reference
   - Test rendering with a simple cube

### Phase 2: Core 3D Functionality
1. **Shape Creation System**
   - Implement factory functions for basic shapes:
     - Cube/Box
     - Sphere
     - Cylinder
     - Cone
     - Torus
     - Plane
   - Add configurable parameters (size, segments, color, material)
   - Create material options (basic, standard, phong)

2. **Scene Management**
   - Object selection system (raycasting)
   - Object highlighting on hover
   - Scene graph management (add/remove objects)
   - Object naming/labeling system

### Phase 3: User Interface
1. **Control Panel**
   - Shape selector buttons/dropdown
   - Parameter inputs for new shapes:
     - Dimensions (width, height, depth, radius)
     - Color picker
     - Material type selector
   - "Add Shape" button
   - "Delete Selected" button
   - "Clear Scene" button

2. **Object Properties Panel**
   - Display selected object properties
   - Transform controls:
     - Position (X, Y, Z)
     - Rotation (X, Y, Z)
     - Scale (X, Y, Z)
   - Material/color editor
   - Real-time updates on change

### Phase 4: Transform Tools
1. **TransformControls Integration**
   - Add Three.js TransformControls
   - Implement mode switching:
     - Translate (move)
     - Rotate
     - Scale
   - Keyboard shortcuts (G for move, R for rotate, S for scale)

2. **Snapping & Helpers**
   - Grid snapping toggle
   - Rotation snapping (15° increments)
   - Bounding box visualization

### Phase 5: Advanced Features (Optional)
1. **Scene Persistence**
   - Export scene to JSON
   - Import/load saved scenes
   - LocalStorage auto-save

2. **Additional Features**
   - Duplicate selected object
   - Group/ungroup objects
   - Material library
   - Texture support
   - Export to formats (glTF, OBJ)
   - Screenshot/render capture

## Key Implementation Details

### Scene Setup
```javascript
// Basic scene initialization pattern
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
```

### Raycasting for Selection
```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// On click, cast ray to detect object intersection
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  // Handle selection
}
```

### Shape Factory Pattern
```javascript
function createShape(type, params) {
  let geometry;

  switch(type) {
    case 'cube':
      geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(params.radius, params.segments);
      break;
    // ... more shapes
  }

  const material = new THREE.MeshStandardMaterial({ color: params.color });
  return new THREE.Mesh(geometry, material);
}
```

## Implementation Guide

### Phase 1: Setting Up the Basic Scene

#### 1.1 Create index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Model Builder</title>
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div id="app">
    <!-- Control Panel -->
    <aside id="control-panel">
      <h2>Add Shapes</h2>
      <div class="shape-controls">
        <select id="shape-type">
          <option value="cube">Cube</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
          <option value="torus">Torus</option>
          <option value="plane">Plane</option>
        </select>

        <div class="param-group">
          <label>Size: <input type="number" id="size" value="1" min="0.1" step="0.1"></label>
          <label>Color: <input type="color" id="color" value="#00ff00"></label>
        </div>

        <button id="add-shape">Add Shape</button>
        <button id="delete-shape">Delete Selected</button>
        <button id="clear-scene">Clear Scene</button>
      </div>

      <hr>

      <div class="scene-controls">
        <h3>Scene</h3>
        <button id="save-scene">Save Scene</button>
        <button id="load-scene">Load Scene</button>
      </div>
    </aside>

    <!-- 3D Viewport -->
    <main id="viewport">
      <canvas id="three-canvas"></canvas>

      <!-- Toolbar -->
      <div id="toolbar">
        <button id="mode-translate" class="tool-btn active" title="Translate (G)">Move</button>
        <button id="mode-rotate" class="tool-btn" title="Rotate (R)">Rotate</button>
        <button id="mode-scale" class="tool-btn" title="Scale (S)">Scale</button>
      </div>
    </main>

    <!-- Properties Panel -->
    <aside id="properties-panel">
      <h2>Properties</h2>
      <div id="no-selection">No object selected</div>
      <div id="object-properties" style="display: none;">
        <h3 id="object-name">Object Name</h3>

        <div class="property-group">
          <h4>Position</h4>
          <label>X: <input type="number" id="pos-x" step="0.1"></label>
          <label>Y: <input type="number" id="pos-y" step="0.1"></label>
          <label>Z: <input type="number" id="pos-z" step="0.1"></label>
        </div>

        <div class="property-group">
          <h4>Rotation (degrees)</h4>
          <label>X: <input type="number" id="rot-x" step="1"></label>
          <label>Y: <input type="number" id="rot-y" step="1"></label>
          <label>Z: <input type="number" id="rot-z" step="1"></label>
        </div>

        <div class="property-group">
          <h4>Scale</h4>
          <label>X: <input type="number" id="scale-x" step="0.1" min="0.1"></label>
          <label>Y: <input type="number" id="scale-y" step="0.1" min="0.1"></label>
          <label>Z: <input type="number" id="scale-z" step="0.1" min="0.1"></label>
        </div>

        <div class="property-group">
          <h4>Material</h4>
          <label>Color: <input type="color" id="mat-color"></label>
        </div>
      </div>
    </aside>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

#### 1.2 Create main.css

```css
/* src/styles/main.css */
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3a3a3a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --accent-color: #00aaff;
  --border-color: #444;
  --panel-width: 280px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

#app {
  display: grid;
  grid-template-columns: var(--panel-width) 1fr var(--panel-width);
  height: 100vh;
  gap: 1px;
  background-color: var(--border-color);
}

/* Panels */
aside {
  background-color: var(--bg-secondary);
  padding: 20px;
  overflow-y: auto;
}

aside h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--accent-color);
}

aside h3 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

aside h4 {
  margin: 12px 0 8px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Viewport */
#viewport {
  position: relative;
  background-color: var(--bg-tertiary);
}

#three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Toolbar */
#toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background-color: rgba(45, 45, 45, 0.9);
  padding: 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.tool-btn {
  padding: 8px 16px;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.tool-btn:hover {
  background-color: var(--bg-primary);
  border-color: var(--accent-color);
}

.tool-btn.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

/* Form Controls */
select, input[type="number"], input[type="color"] {
  width: 100%;
  padding: 8px;
  margin: 4px 0 12px;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
}

input[type="color"] {
  height: 40px;
  cursor: pointer;
}

label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

button {
  width: 100%;
  padding: 10px;
  margin: 4px 0;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0088cc;
}

button#delete-shape {
  background-color: #cc3333;
}

button#delete-shape:hover {
  background-color: #aa2222;
}

button#clear-scene {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
}

button#clear-scene:hover {
  background-color: var(--bg-primary);
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid var(--border-color);
}

.property-group {
  margin-bottom: 16px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
```

#### 1.3 Create main.js (Entry Point)

```javascript
// src/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { SceneManager } from './core/scene.js';
import { ShapeFactory } from './objects/ShapeFactory.js';
import { SelectionManager } from './controls/SelectionManager.js';
import { UIManager } from './ui/UIManager.js';

class Application {
  constructor() {
    this.sceneManager = new SceneManager();
    this.shapeFactory = new ShapeFactory();
    this.selectionManager = new SelectionManager(
      this.sceneManager.scene,
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
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
      this.uiManager.updatePropertiesPanel(object);
    });

    this.selectionManager.on('deselect', () => {
      this.uiManager.clearPropertiesPanel();
    });
  }

  addShape(type, params) {
    const shape = this.shapeFactory.create(type, params);
    this.sceneManager.scene.add(shape);
    this.selectionManager.addSelectableObject(shape);
    return shape;
  }

  deleteSelected() {
    const selected = this.selectionManager.getSelected();
    if (selected) {
      this.sceneManager.scene.remove(selected);
      this.selectionManager.removeSelectableObject(selected);
      this.selectionManager.deselect();
    }
  }

  clearScene() {
    this.selectionManager.clearAll();
    this.sceneManager.clearScene();
  }
}

// Initialize application
new Application();
```

#### 1.4 Create SceneManager (core/scene.js)

```javascript
// src/core/scene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // Setup renderer
    this.setupRenderer();

    // Setup camera
    this.setupCamera();

    // Setup controls
    this.setupControls();

    // Setup lighting
    this.setupLighting();

    // Setup helpers
    this.setupHelpers();

    // Configure scene
    this.scene.background = new THREE.Color(0x2a2a2a);
  }

  setupRenderer() {
    const canvas = document.getElementById('three-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setupCamera() {
    const canvas = this.renderer.domElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;

    // Shadow properties
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    this.scene.add(directionalLight);

    // Hemisphere light for better color gradation
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    this.scene.add(hemisphereLight);
  }

  setupHelpers() {
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.scene.add(gridHelper);

    // Axes helper (optional, for debugging)
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.visible = false; // Hide by default
    this.scene.add(axesHelper);
  }

  startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      this.controls.update();

      // Render scene
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  onWindowResize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  clearScene() {
    // Remove all meshes from scene
    const objectsToRemove = [];

    this.scene.traverse((object) => {
      if (object.isMesh && object.geometry) {
        objectsToRemove.push(object);
      }
    });

    objectsToRemove.forEach((object) => {
      this.scene.remove(object);
      object.geometry.dispose();
      object.material.dispose();
    });
  }
}
```

#### 1.5 Create ShapeFactory (objects/ShapeFactory.js)

```javascript
// src/objects/ShapeFactory.js
import * as THREE from 'three';

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

    // Create material
    const material = this.createMaterial(config.materialType, config.color);

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
```

#### 1.6 Create SelectionManager (controls/SelectionManager.js)

```javascript
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
```

#### 1.7 Create UIManager (ui/UIManager.js)

```javascript
// src/ui/UIManager.js
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
      addShapeBtn: document.getElementById('add-shape'),
      deleteShapeBtn: document.getElementById('delete-shape'),
      clearSceneBtn: document.getElementById('clear-scene'),

      // Scene Controls
      saveSceneBtn: document.getElementById('save-scene'),
      loadSceneBtn: document.getElementById('load-scene'),

      // Toolbar
      modeTranslate: document.getElementById('mode-translate'),
      modeRotate: document.getElementById('mode-rotate'),
      modeScale: document.getElementById('mode-scale'),

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

      this.app.addShape(type, {
        size,
        color,
        position: { x: 0, y: size / 2, z: 0 }
      });
    });

    // Delete button
    this.elements.deleteShapeBtn.addEventListener('click', () => {
      this.app.deleteSelected();
    });

    // Clear scene button
    this.elements.clearSceneBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the entire scene?')) {
        this.app.clearScene();
      }
    });

    // Save/Load buttons
    this.elements.saveSceneBtn.addEventListener('click', () => {
      this.saveScene();
    });

    this.elements.loadSceneBtn.addEventListener('click', () => {
      this.loadScene();
    });

    // Property inputs - update object when changed
    this.setupPropertyListeners();
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

    alert('Scene saved successfully!');
  }

  loadScene() {
    const json = localStorage.getItem('3d-model-builder-scene');
    if (!json) {
      alert('No saved scene found!');
      return;
    }

    if (!confirm('This will replace the current scene. Continue?')) {
      return;
    }

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

      alert('Scene loaded successfully!');
    } catch (error) {
      alert('Error loading scene: ' + error.message);
    }
  }
}
```

### Phase 2: Adding Transform Controls

Transform controls allow users to visually manipulate objects in 3D space.

#### 2.1 Update SceneManager to Support Transform Controls

```javascript
// Add to src/core/scene.js
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class SceneManager {
  constructor() {
    // ... existing code ...
    this.transformControls = null;
    this.init();
  }

  init() {
    // ... existing setup code ...
    this.setupTransformControls();
  }

  setupTransformControls() {
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    this.transformControls.addEventListener('dragging-changed', (event) => {
      // Disable orbit controls while transforming
      this.controls.enabled = !event.value;
    });

    this.scene.add(this.transformControls);
  }

  attachTransformControls(object) {
    this.transformControls.attach(object);
  }

  detachTransformControls() {
    this.transformControls.detach();
  }

  setTransformMode(mode) {
    this.transformControls.setMode(mode); // 'translate', 'rotate', or 'scale'
  }
}
```

#### 2.2 Update Application to Handle Transform Modes

```javascript
// Update src/main.js
setupEventListeners() {
  // ... existing code ...

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
    switch (e.key.toLowerCase()) {
      case 'g':
        this.sceneManager.setTransformMode('translate');
        break;
      case 'r':
        this.sceneManager.setTransformMode('rotate');
        break;
      case 's':
        this.sceneManager.setTransformMode('scale');
        break;
      case 'delete':
      case 'backspace':
        this.deleteSelected();
        break;
    }
  });
}
```

## API Reference

### SceneManager

Main class for managing the Three.js scene, camera, and renderer.

**Constructor:**
```javascript
new SceneManager()
```

**Properties:**
- `scene: THREE.Scene` - The Three.js scene
- `camera: THREE.PerspectiveCamera` - Main camera
- `renderer: THREE.WebGLRenderer` - WebGL renderer
- `controls: OrbitControls` - Camera orbit controls
- `transformControls: TransformControls` - Object manipulation controls

**Methods:**
- `startRenderLoop(): void` - Start the animation loop
- `onWindowResize(): void` - Handle window resize events
- `clearScene(): void` - Remove all objects from scene
- `attachTransformControls(object): void` - Attach transform gizmo to object
- `detachTransformControls(): void` - Detach transform gizmo
- `setTransformMode(mode): void` - Set transform mode ('translate', 'rotate', 'scale')

### ShapeFactory

Factory class for creating geometric shapes.

**Constructor:**
```javascript
new ShapeFactory()
```

**Methods:**
- `create(type, params): THREE.Mesh` - Create a new shape
  - `type: string` - Shape type ('cube', 'sphere', 'cylinder', 'cone', 'torus', 'plane')
  - `params: object` - Configuration options
    - `size: number` - Base size (default: 1)
    - `color: string|number` - Color (default: 0x00ff00)
    - `materialType: string` - Material type (default: 'standard')
    - `position: {x, y, z}` - Initial position (default: {0, 0, 0})

- `createMaterial(type, color): THREE.Material` - Create a material
  - `type: string` - Material type ('basic', 'lambert', 'phong', 'standard')
  - `color: string|number` - Material color

### SelectionManager

Handles object selection using raycasting.

**Constructor:**
```javascript
new SelectionManager(scene, camera, domElement)
```

**Properties:**
- `selectedObject: THREE.Mesh|null` - Currently selected object
- `selectableObjects: THREE.Mesh[]` - Array of selectable objects

**Methods:**
- `addSelectableObject(object): void` - Add object to selection pool
- `removeSelectableObject(object): void` - Remove object from selection pool
- `select(object): void` - Select an object
- `deselect(): void` - Deselect current object
- `getSelected(): THREE.Mesh|null` - Get currently selected object
- `clearAll(): void` - Clear all selectable objects and selection
- `on(event, callback): void` - Register event listener
  - Events: 'select', 'deselect'

### UIManager

Manages UI interactions and updates.

**Constructor:**
```javascript
new UIManager(app)
```

**Methods:**
- `updatePropertiesPanel(object): void` - Update properties panel with object data
- `clearPropertiesPanel(): void` - Clear properties panel
- `saveScene(): void` - Save scene to localStorage
- `loadScene(): void` - Load scene from localStorage

## Best Practices

### Code Organization

1. **Modular Structure**: Keep related functionality in separate modules
2. **Single Responsibility**: Each class should have one clear purpose
3. **Event-Driven**: Use events to decouple components
4. **Consistent Naming**: Use clear, descriptive names for variables and functions

### Performance

1. **Dispose Resources**: Always dispose geometries and materials when removing objects
```javascript
object.geometry.dispose();
object.material.dispose();
```

2. **Use Instancing**: For many identical objects, use InstancedMesh
3. **Optimize Shadows**: Limit shadow-casting objects and resolution
4. **Monitor FPS**: Use `stats.js` to track performance

### Memory Management

```javascript
// Proper cleanup when removing objects
function removeObject(object) {
  scene.remove(object);

  if (object.geometry) object.geometry.dispose();
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(mat => mat.dispose());
    } else {
      object.material.dispose();
    }
  }
}
```

### Error Handling

```javascript
// Wrap critical operations in try-catch
try {
  const sceneData = JSON.parse(localStorage.getItem('scene'));
  // ... load scene
} catch (error) {
  console.error('Failed to load scene:', error);
  alert('Error loading scene. The file may be corrupted.');
}
```

## Troubleshooting

### Common Issues

#### Issue: Black screen / Nothing renders

**Possible causes:**
1. Camera positioned inside an object
2. Lights not added to scene
3. Canvas not properly sized

**Solution:**
```javascript
// Check camera position
console.log(camera.position); // Should not be (0,0,0)

// Verify lights exist
console.log(scene.children.filter(c => c.isLight));

// Check canvas size
console.log(renderer.domElement.width, renderer.domElement.height);
```

#### Issue: Objects not selectable

**Possible causes:**
1. Objects not added to selectable array
2. Raycaster not properly configured
3. Mouse coordinates incorrect

**Solution:**
```javascript
// Ensure object is added to selection manager
selectionManager.addSelectableObject(mesh);

// Debug raycasting
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(scene.children, true);
console.log('Intersections:', intersects);
```

#### Issue: Transform controls not visible

**Possible causes:**
1. Controls not attached to object
2. Controls not added to scene
3. Camera too far away

**Solution:**
```javascript
// Verify controls are in scene
console.log(scene.children.includes(transformControls));

// Ensure object is attached
console.log(transformControls.object); // Should be the selected mesh
```

#### Issue: Performance degradation

**Possible causes:**
1. Too many objects with shadows
2. High polygon count
3. Memory leaks from undisposed resources

**Solution:**
```javascript
// Disable shadows for some objects
mesh.castShadow = false;
mesh.receiveShadow = false;

// Use lower polygon counts
const geometry = new THREE.SphereGeometry(radius, 16, 16); // Instead of 32, 32

// Track memory usage
console.log(renderer.info.memory);
```

### Debugging Tips

1. **Use Browser DevTools**: Utilize console, network, and performance tabs
2. **Three.js Inspector**: Install the Three.js browser extension
3. **Stats.js**: Add FPS monitor to track performance
4. **Console Logging**: Log important state changes

```javascript
// Add stats
import Stats from 'three/addons/libs/stats.module.js';
const stats = new Stats();
document.body.appendChild(stats.dom);

// In render loop
function animate() {
  stats.begin();
  // ... render
  stats.end();
}
```

## Performance Optimization

### Optimization Checklist

- [ ] Use appropriate polygon counts for geometries
- [ ] Limit number of lights (especially shadows)
- [ ] Implement frustum culling for off-screen objects
- [ ] Use texture compression
- [ ] Dispose unused resources
- [ ] Use BufferGeometry instead of Geometry
- [ ] Enable renderer.setPixelRatio() appropriately
- [ ] Implement LOD (Level of Detail) for complex scenes

### Example: Adding Stats Monitor

```javascript
// src/utils/stats.js
import Stats from 'three/addons/libs/stats.module.js';

export function createStats() {
  const stats = new Stats();
  stats.dom.style.position = 'absolute';
  stats.dom.style.top = '0';
  stats.dom.style.left = '0';
  document.body.appendChild(stats.dom);
  return stats;
}
```

```javascript
// In main.js
import { createStats } from './utils/stats.js';

class Application {
  constructor() {
    // ... existing code ...
    this.stats = createStats();
  }

  init() {
    // ... existing code ...
    this.sceneManager.startRenderLoop(() => {
      this.stats.update();
    });
  }
}
```

## Deployment

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in /dist folder
```

### Hosting Options

1. **GitHub Pages** (Free)
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm install -D gh-pages
npm run deploy
```

2. **Netlify** (Free)
- Connect your Git repository
- Build command: `npm run build`
- Publish directory: `dist`

3. **Vercel** (Free)
- Import from Git
- Framework: Vite
- Auto-detects build settings

### Environment Variables

```javascript
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature X"`
5. Push to your fork: `git push origin feature/my-feature`
6. Create a Pull Request

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use ES6+ features
- Add comments for complex logic
- Follow existing naming conventions

### Testing

Before submitting:
- [ ] Test in Chrome, Firefox, and Safari
- [ ] Test on mobile devices (if applicable)
- [ ] Verify no console errors
- [ ] Check performance with 20+ objects
- [ ] Test save/load functionality

## Development Milestones

### Milestone 1: Basic Viewer (Day 1)
- ✓ Scene renders with grid
- ✓ Camera controls work
- ✓ Can add one type of shape programmatically

### Milestone 2: Shape Creation (Day 2-3)
- ✓ UI for adding multiple shape types
- ✓ Color and size customization
- ✓ Object selection working

### Milestone 3: Transform Tools (Day 4-5)
- ✓ Move, rotate, scale selected objects
- ✓ Properties panel updates
- ✓ Delete functionality

### Milestone 4: Polish (Day 6+)
- ✓ Save/load functionality
- ✓ Better UI/UX
- ✓ Additional features as needed

## UI/UX Considerations
1. **Layout**: Side panel for controls, main viewport for 3D scene
2. **Responsive**: Scale properly on different screen sizes
3. **Feedback**: Visual feedback for all interactions
4. **Performance**: Monitor FPS, optimize for many objects
5. **Accessibility**: Keyboard shortcuts, clear labels

## Testing Strategy
1. Manual testing of each shape type
2. Test transform operations on various objects
3. Test scene save/load with complex scenes
4. Cross-browser testing (Chrome, Firefox, Safari)
5. Performance testing with 50+ objects

## Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Fundamentals](https://threejs.org/manual/)
- [OrbitControls Docs](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [TransformControls Docs](https://threejs.org/docs/#examples/en/controls/TransformControls)

## Installation & Setup

### Quick Start

```bash
# 1. Navigate to the project directory
cd round-04

# 2. Initialize a new Vite project (if not already initialized)
npm create vite@latest . -- --template vanilla

# 3. Install dependencies
npm install

# 4. Install Three.js
npm install three

# 5. Start development server
npm run dev

# The app will open at http://localhost:5173
```

### Detailed Setup Steps

#### Step 1: Project Initialization

```bash
# Create project with Vite
npm create vite@latest 3d-model-builder -- --template vanilla
cd 3d-model-builder

# Or use TypeScript template for better type safety
npm create vite@latest 3d-model-builder -- --template vanilla-ts
```

#### Step 2: Install Dependencies

```bash
# Core dependencies
npm install three

# Development dependencies (optional but recommended)
npm install -D eslint prettier
```

#### Step 3: Project Structure

Create the following folder structure:

```
round-04/
├── public/               # Static assets
│   └── favicon.ico
├── src/                  # Source code
│   ├── main.js          # Application entry point
│   ├── core/            # Core 3D functionality
│   │   ├── scene.js     # Scene setup and management
│   │   ├── renderer.js  # Renderer configuration
│   │   ├── camera.js    # Camera setup
│   │   └── lighting.js  # Lighting configuration
│   ├── objects/         # 3D object management
│   │   ├── ShapeFactory.js    # Shape creation
│   │   ├── ObjectManager.js   # Scene object management
│   │   └── materials.js       # Material definitions
│   ├── controls/        # User interaction
│   │   ├── OrbitController.js     # Camera controls
│   │   ├── TransformController.js # Object manipulation
│   │   └── SelectionManager.js    # Object selection
│   ├── ui/              # User interface
│   │   ├── ControlPanel.js    # Main control panel
│   │   ├── PropertiesPanel.js # Object properties
│   │   └── Toolbar.js         # Tool buttons
│   ├── utils/           # Utility functions
│   │   ├── raycaster.js       # Raycasting utilities
│   │   ├── storage.js         # LocalStorage helpers
│   │   └── helpers.js         # General utilities
│   └── styles/          # CSS files
│       ├── main.css           # Main styles
│       └── variables.css      # CSS custom properties
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

#### Step 4: Configure Vite (vite.config.js)

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

#### Step 5: Update package.json Scripts

```json
{
  "name": "3d-model-builder",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,ts",
    "format": "prettier --write \"src/**/*.{js,ts,css}\""
  }
}
```

### Alternative Setup (Without Build Tools)

For simple testing without Vite:

```bash
# Install a simple HTTP server
npm install -g http-server

# Serve the files
http-server . -p 8080

# Open http://localhost:8080 in your browser
```

**Note:** When using this method, you'll need to use the CDN version of Three.js:

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
```

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Control Panel │  │  3D Viewport  │  │Properties    │  │
│  │(Add Shapes)  │  │   (Canvas)    │  │Panel         │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Shape Factory │  │Selection Mgr │  │Transform Ctrl│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Object Manager│  │Storage Utils │  │Event Handlers│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Three.js Core Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Renderer   │  │    Scene     │  │   Camera     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Lighting   │  │   Meshes     │  │   Controls   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   WebGL/GPU  │
                    └──────────────┘
```

### Data Flow

```
User Action (Click "Add Cube")
         │
         ▼
    UI Handler (ControlPanel.js)
         │
         ▼
    ShapeFactory.createShape('cube', params)
         │
         ▼
    ObjectManager.addToScene(mesh)
         │
         ▼
    Three.js Scene.add(mesh)
         │
         ▼
    Renderer renders updated scene
```

### Class Diagram

```
┌─────────────────┐
│   Application   │
│  (Main Entry)   │
└────────┬────────┘
         │
         │ initializes
         │
    ┌────┴────┬─────────┬──────────┐
    │         │         │          │
    ▼         ▼         ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│Scene   ││Camera  ││Renderer││Controls│
│Manager ││Manager ││Manager ││Manager │
└────────┘└────────┘└────────┘└────────┘
    │
    │ uses
    │
┌───┴────────┬──────────────┬────────────┐
│            │              │            │
▼            ▼              ▼            ▼
┌────────┐┌──────────┐┌─────────┐┌──────────┐
│Shape   ││Selection ││Transform││Storage   │
│Factory ││Manager   ││Controls ││Manager   │
└────────┘└──────────┘└─────────┘└──────────┘
```

### Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| **main.js** | Application entry point, initialization |
| **SceneManager** | Scene setup, lighting, helpers, render loop |
| **ShapeFactory** | Create geometric primitives with parameters |
| **ObjectManager** | Add/remove/update objects in scene |
| **SelectionManager** | Raycasting, object selection, highlighting |
| **TransformController** | Translate/rotate/scale selected objects |
| **ControlPanel** | UI for adding shapes and scene controls |
| **PropertiesPanel** | Display/edit selected object properties |
| **StorageManager** | Save/load scenes to/from localStorage |

## Success Criteria
The application is considered complete when:
- ✓ Users can add at least 5 different shape types
- ✓ Users can move, rotate, and scale objects
- ✓ Users can change colors and materials
- ✓ Users can delete objects
- ✓ Camera navigation is smooth and intuitive
- ✓ UI is clear and responsive
- ✓ Scene can be saved and loaded
## Advanced Features (Optional Enhancements)

### Feature 1: Keyboard Shortcuts

Add comprehensive keyboard shortcuts for power users:

```javascript
// src/utils/KeyboardManager.js
export class KeyboardManager {
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      // Prevent default for certain keys
      if (['g', 'r', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      this.handleKeyPress(e);
    });
  }

  handleKeyPress(event) {
    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;

    // Transform modes
    if (!ctrl && !shift) {
      switch (key) {
        case 'g':
          this.app.sceneManager.setTransformMode('translate');
          break;
        case 'r':
          this.app.sceneManager.setTransformMode('rotate');
          break;
        case 's':
          this.app.sceneManager.setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          this.app.deleteSelected();
          break;
        case 'escape':
          this.app.selectionManager.deselect();
          break;
      }
    }

    // With Ctrl/Cmd
    if (ctrl) {
      switch (key) {
        case 's':
          event.preventDefault();
          this.app.uiManager.saveScene();
          break;
        case 'o':
          event.preventDefault();
          this.app.uiManager.loadScene();
          break;
        case 'd':
          event.preventDefault();
          this.duplicateSelected();
          break;
      }
    }

    // Number keys for quick shape add
    if (!ctrl && !shift && /^[1-6]$/.test(key)) {
      const shapes = ['cube', 'sphere', 'cylinder', 'cone', 'torus', 'plane'];
      const shapeType = shapes[parseInt(key) - 1];
      this.app.addShape(shapeType, {
        size: 1,
        color: '#00ff00',
        position: { x: 0, y: 0.5, z: 0 }
      });
    }
  }

  duplicateSelected() {
    const selected = this.app.selectionManager.getSelected();
    if (!selected) return;

    const duplicate = this.app.shapeFactory.create(
      selected.userData.type,
      {
        size: 1,
        color: '#' + selected.material.color.getHexString(),
      }
    );

    duplicate.position.copy(selected.position).add(new THREE.Vector3(1, 0, 1));
    duplicate.rotation.copy(selected.rotation);
    duplicate.scale.copy(selected.scale);

    this.app.sceneManager.scene.add(duplicate);
    this.app.selectionManager.addSelectableObject(duplicate);
    this.app.selectionManager.select(duplicate);
  }
}
```

### Feature 2: Grid Snapping

Add snapping functionality for precise positioning:

```javascript
// Add to SceneManager
export class SceneManager {
  // ... existing code ...

  constructor() {
    // ... existing code ...
    this.snapEnabled = false;
    this.snapSize = 0.5;
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;
    if (this.transformControls) {
      this.transformControls.setTranslationSnap(this.snapEnabled ? this.snapSize : null);
      this.transformControls.setRotationSnap(this.snapEnabled ? THREE.MathUtils.degToRad(15) : null);
      this.transformControls.setScaleSnap(this.snapEnabled ? 0.1 : null);
    }
  }

  setSnapSize(size) {
    this.snapSize = size;
    if (this.snapEnabled && this.transformControls) {
      this.transformControls.setTranslationSnap(size);
    }
  }
}
```

### Feature 3: Export to 3D Formats

```javascript
// src/utils/ExportManager.js
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export class ExportManager {
  constructor(scene) {
    this.scene = scene;
  }

  exportGLTF() {
    const exporter = new GLTFExporter();
    exporter.parse(
      this.scene,
      (gltf) => {
        const json = JSON.stringify(gltf, null, 2);
        this.downloadFile(json, 'scene.gltf', 'application/json');
      },
      (error) => console.error('Export error:', error),
      { binary: false }
    );
  }

  downloadFile(data, filename, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| **G** | Switch to Translate mode |
| **R** | Switch to Rotate mode |
| **S** | Switch to Scale mode |
| **Delete** / **Backspace** | Delete selected object |
| **Escape** | Deselect current object |
| **1-6** | Quick add shape (1=Cube, 2=Sphere, etc.) |
| **Ctrl+S** | Save scene |
| **Ctrl+O** | Open/Load scene |
| **Ctrl+D** | Duplicate selected object |
| **Left Mouse** | Select object |
| **Right Mouse + Drag** | Rotate camera |
| **Middle Mouse + Drag** | Pan camera |
| **Mouse Wheel** | Zoom in/out |

## FAQ (Frequently Asked Questions)

### General Questions

**Q: What browsers are supported?**  
A: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+ are fully supported. WebGL 2.0 is required.

**Q: Can I use this commercially?**  
A: Yes, this project is open source. Check the license file for specific terms.

**Q: Does this work on mobile?**  
A: Basic functionality works, but the experience is optimized for desktop with mouse/keyboard controls.

### Technical Questions

**Q: Why is my scene rendering black?**  
A: Common causes:
1. Camera positioned incorrectly (try resetting to default position)
2. No lights in the scene (check if lights were added)
3. Objects too far from camera (adjust camera distance)

**Q: How do I improve performance?**  
A: Several options:
- Reduce shadow quality or disable shadows
- Lower polygon counts for shapes
- Limit the number of objects in the scene
- Disable antialiasing for low-end devices

**Q: Can I import existing 3D models?**  
A: The basic version only supports primitive shapes. For model importing, add GLTFLoader or OBJLoader from Three.js addons.

**Q: How do I save my work permanently?**  
A: Use the Save Scene button to store in browser localStorage, or export to GLTF format (if export feature is implemented).

### Development Questions

**Q: How do I add new shape types?**  
A: Add a new case in `ShapeFactory.create()` method with the desired Three.js geometry.

**Q: How do I customize the UI theme?**  
A: Modify CSS custom properties in `src/styles/main.css`:
```css
:root {
  --bg-primary: #1a1a1a;
  --accent-color: #00aaff;
}
```

**Q: Can I add textures to objects?**  
A: Yes, extend the MaterialFactory to support texture loading:
```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/texture.jpg');
material.map = texture;
```

**Q: Is TypeScript supported?**  
A: Yes! Use the TypeScript Vite template and add type definitions:
```bash
npm install -D @types/three
```

## Next Steps

After completing this basic application, consider these enhancements:

1. **Add More Shapes**: Torus knot, icosahedron, custom shapes
2. **Lighting Controls**: Allow users to add and configure lights
3. **Texture Support**: Image textures and UV mapping
4. **Animation**: Keyframe animation system
5. **Grouping**: Parent-child relationships between objects
6. **Camera Presets**: Top/front/side orthographic views
7. **Measurement Tools**: Distance and angle measurements
8. **Collaborative Features**: Real-time multi-user editing
9. **Cloud Storage**: Backend integration for saving projects
10. **Mobile Support**: Touch-optimized controls

## License

This project is provided as educational material. Feel free to use, modify, and distribute according to your needs.

## Support and Community

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join the community forum for questions
- **Documentation**: Refer to Three.js official docs for advanced topics
- **Examples**: Check the `/examples` folder for implementation samples

---

**Happy Building!** 🎨🚀

*Created with Three.js and Vite*
