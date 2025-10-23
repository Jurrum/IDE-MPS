// src/core/scene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { createStats } from '../utils/stats.js';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.transformControls = null;
    this.clock = new THREE.Clock();
    this.snapEnabled = false;
    this.snapSize = 0.5;
    this.stats = createStats();

    this.init();
  }

  init() {
    // Setup renderer
    this.setupRenderer();

    // Setup camera
    this.setupCamera();

    // Setup controls
    this.setupControls();

    // Setup transform controls
    this.setupTransformControls();

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

      // Update stats
      this.stats.begin();

      // Update controls
      this.controls.update();

      // Render scene
      this.renderer.render(this.scene, this.camera);

      // End stats
      this.stats.end();
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
    // Remove all user-created meshes from scene
    const objectsToRemove = [];

    this.scene.traverse((object) => {
      if (object.isMesh && object.geometry) {
        // Don't remove helper objects (grid, axes, sketch helpers)
        const isHelper = object.userData.isSketchLine ||
                        object.userData.isEndpointMarker ||
                        object.userData.isGapIndicator ||
                        object.userData.isConnectionLine ||
                        object.userData.isSketchPlane ||
                        object.userData.isHelper;

        if (!isHelper) {
          objectsToRemove.push(object);
        }
      }
    });

    console.log(`clearScene: Removing ${objectsToRemove.length} objects`);

    objectsToRemove.forEach((object) => {
      // Remove from parent (not necessarily the scene)
      if (object.parent) {
        object.parent.remove(object);
      }

      // Dispose resources
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    console.log(`clearScene: ${objectsToRemove.length} objects removed`);
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

  toggleSnap(enabled) {
    this.snapEnabled = enabled;
    if (this.transformControls) {
      this.transformControls.setTranslationSnap(enabled ? this.snapSize : null);
      this.transformControls.setRotationSnap(enabled ? THREE.MathUtils.degToRad(15) : null);
      this.transformControls.setScaleSnap(enabled ? 0.1 : null);
    }
  }

  setSnapSize(size) {
    this.snapSize = size;
    if (this.snapEnabled && this.transformControls) {
      this.transformControls.setTranslationSnap(size);
    }
  }

  setCameraView(view) {
    console.log('Setting camera view to:', view);

    const distance = 10;
    const target = new THREE.Vector3(0, 0, 0);

    // Completely disable damping during view change
    const originalDamping = this.controls.enableDamping;
    const originalAutoRotate = this.controls.autoRotate;

    this.controls.enableDamping = false;
    this.controls.autoRotate = false;

    // Reset OrbitControls internal state by updating target first
    this.controls.target.copy(target);

    // Reset up vector
    this.camera.up.set(0, 1, 0);

    // Set camera position based on view
    switch (view) {
      case 'front':
        this.camera.position.set(0, 0, distance);
        break;
      case 'back':
        this.camera.position.set(0, 0, -distance);
        break;
      case 'top':
        this.camera.position.set(0, distance, 0);
        this.camera.up.set(0, 0, -1); // Fix up vector for top view
        break;
      case 'bottom':
        this.camera.position.set(0, -distance, 0);
        break;
      case 'left':
        this.camera.position.set(-distance, 0, 0);
        break;
      case 'right':
        this.camera.position.set(distance, 0, 0);
        break;
      case 'iso':
      default:
        this.camera.position.set(distance * 0.7, distance * 0.7, distance * 0.7);
        break;
    }

    // Update camera orientation
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();

    // Force OrbitControls to accept the new state immediately
    // This prevents it from interpolating back to the old position
    this.controls.update();

    // Render one frame immediately to show the change
    this.renderer.render(this.scene, this.camera);

    console.log('Camera position set to:', this.camera.position);
    console.log('Camera target set to:', this.controls.target);

    // Restore original control settings
    this.controls.enableDamping = originalDamping;
    this.controls.autoRotate = originalAutoRotate;
  }
}
