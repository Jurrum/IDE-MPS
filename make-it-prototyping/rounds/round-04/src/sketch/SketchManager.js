// src/sketch/SketchManager.js
import * as THREE from 'three';
import { SketchPlane } from './SketchPlane.js';
import { LineTool, RectangleTool, CircleTool } from './SketchTools.js';
import { ContourDetector } from './ContourDetector.js';
import { SketchVisualHelper } from './SketchVisualHelper.js';
import { Toast } from '../utils/Toast.js';

/**
 * SketchManager handles the sketch mode workflow
 * - Creating and managing sketch planes
 * - Switching between sketch tools
 * - Converting sketches to 3D geometry
 */
export class SketchManager {
  constructor(sceneManager, camera, renderer) {
    console.log('SketchManager initialized');
    this.sceneManager = sceneManager;
    this.camera = camera;
    this.renderer = renderer;
    this.scene = sceneManager.scene;

    this.isSketchMode = false;
    this.currentPlane = null;
    this.currentTool = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.contourDetector = new ContourDetector(0.6); // Higher tolerance for grid snapping (0.5 units)
    this.contourFeedback = null; // Visual feedback for closed contour
    this.visualHelper = null; // Visual helper for endpoints and snapping

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (!this.isSketchMode) return;
      this.onMouseMove(e);
    });

    this.renderer.domElement.addEventListener('click', (e) => {
      if (!this.isSketchMode) return;
      this.onMouseClick(e);
    });

    this.renderer.domElement.addEventListener('contextmenu', (e) => {
      if (!this.isSketchMode) return;
      e.preventDefault();
      this.cancelCurrentTool();
    });
  }

  /**
   * Enter sketch mode - creates a new sketch plane
   */
  enterSketchMode(orientation = 'XY') {
    try {
      console.log('enterSketchMode called with orientation:', orientation);

      if (this.isSketchMode) {
        Toast.warning('Already in sketch mode');
        return;
      }

      this.isSketchMode = true;
      console.log('Creating sketch plane...');
      this.currentPlane = new SketchPlane(orientation);
      console.log('Sketch plane created:', this.currentPlane);

      this.currentPlane.show(this.scene);
      console.log('Sketch plane shown in scene');

      // Create visual helper
      this.visualHelper = new SketchVisualHelper(this.scene, this.currentPlane);
      console.log('Visual helper created');

      // Disable orbit controls temporarily
      this.sceneManager.controls.enabled = false;
      console.log('Orbit controls disabled');

      // Set default tool to line
      this.setTool('line');

      Toast.success(`Sketch mode activated on ${orientation} plane`);
    } catch (error) {
      console.error('Error entering sketch mode:', error);
      Toast.error('Failed to enter sketch mode: ' + error.message);
    }
  }

  /**
   * Exit sketch mode
   */
  exitSketchMode(keepPlane = false) {
    if (!this.isSketchMode) return;

    this.isSketchMode = false;

    // Clean up current tool
    if (this.currentTool) {
      this.currentTool.dispose(this.scene);
      this.currentTool = null;
    }

    // Clean up visual helper
    if (this.visualHelper) {
      this.visualHelper.dispose();
      this.visualHelper = null;
    }

    // Hide or remove plane
    if (this.currentPlane) {
      if (!keepPlane) {
        this.currentPlane.dispose(this.scene);
        this.currentPlane = null;
      } else {
        this.currentPlane.hide();
      }
    }

    // Re-enable orbit controls
    this.sceneManager.controls.enabled = true;

    Toast.info('Sketch mode deactivated');
  }

  /**
   * Switch between sketch tools
   */
  setTool(toolName) {
    if (!this.isSketchMode || !this.currentPlane) {
      Toast.warning('Enter sketch mode first');
      return;
    }

    // Clean up previous tool
    if (this.currentTool) {
      this.currentTool.dispose(this.scene);
    }

    // Create new tool
    switch (toolName) {
      case 'line':
        this.currentTool = new LineTool(this.currentPlane, this.scene);
        break;
      case 'rectangle':
        this.currentTool = new RectangleTool(this.currentPlane, this.scene);
        break;
      case 'circle':
        this.currentTool = new CircleTool(this.currentPlane, this.scene);
        break;
      default:
        Toast.error(`Unknown tool: ${toolName}`);
        return;
    }

    Toast.info(`Tool: ${toolName}`);
  }

  /**
   * Cancel current drawing operation
   */
  cancelCurrentTool() {
    if (this.currentTool) {
      this.currentTool.cancel();
    }
  }

  /**
   * Clear all sketch lines from the current plane
   */
  clearSketch() {
    if (!this.currentPlane) return;

    this.currentPlane.clear();

    // Remove all sketch lines from the scene
    const sketchLines = [];
    this.scene.traverse((object) => {
      if (object.userData.isSketchLine) {
        sketchLines.push(object);
      }
    });

    sketchLines.forEach((line) => {
      this.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });

    // Clear visual helpers
    if (this.visualHelper) {
      this.visualHelper.clearEndpointMarkers();
      this.visualHelper.clearConnectionLines();
    }

    // Remove contour feedback
    this.removeContourFeedback();

    Toast.info('Sketch cleared');
  }

  /**
   * Mouse move handler for sketch mode
   */
  onMouseMove(event) {
    if (!this.currentPlane || !this.currentTool) return;

    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to the sketch plane
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check intersection with sketch plane
    const intersects = this.raycaster.intersectObject(this.currentPlane.plane);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      let point2D = this.currentPlane.worldTo2D(intersectPoint);

      // Snap to grid (0.5 units)
      point2D.x = Math.round(point2D.x * 2) / 2;
      point2D.y = Math.round(point2D.y * 2) / 2;

      // Check for snap to existing endpoints (if visual helper exists)
      if (this.visualHelper && this.currentPlane.curves.length > 0) {
        const snapPoint = this.visualHelper.findSnapPoint(point2D, this.currentPlane.curves);

        if (snapPoint) {
          // Snap to the nearby endpoint
          point2D = snapPoint.point;
          this.visualHelper.showSnapIndicator(point2D);
        } else {
          this.visualHelper.hideSnapIndicator();
        }
      }

      this.currentTool.move(point2D);
    }
  }

  /**
   * Mouse click handler for sketch mode
   */
  onMouseClick(event) {
    if (!this.currentPlane || !this.currentTool) return;

    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to the sketch plane
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check intersection with sketch plane
    const intersects = this.raycaster.intersectObject(this.currentPlane.plane);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      const point2D = this.currentPlane.worldTo2D(intersectPoint);

      // Snap to grid
      point2D.x = Math.round(point2D.x * 2) / 2;
      point2D.y = Math.round(point2D.y * 2) / 2;

      if (!this.currentTool.isDrawing) {
        this.currentTool.start(point2D);
      } else {
        this.currentTool.end(point2D);

        // Update visual feedback after completing shape
        setTimeout(() => {
          // Update endpoint markers
          if (this.visualHelper) {
            this.visualHelper.updateEndpointMarkers(this.currentPlane.curves);
            this.visualHelper.showConnectionStatus(this.currentPlane.curves);
          }

          // Check if contour is now closed
          this.checkContourClosure();
        }, 100);
      }
    }
  }

  /**
   * Get the current sketch as a THREE.Shape
   */
  getSketchShape() {
    if (!this.currentPlane) {
      Toast.error('No active sketch plane');
      return null;
    }

    return this.currentPlane.getClosedShape();
  }

  /**
   * Check if current sketch has any curves
   */
  hasSketch() {
    return this.currentPlane && this.currentPlane.curves.length > 0;
  }

  /**
   * Automatically close the contour by adding a closing line
   */
  autoCloseContour() {
    if (!this.currentPlane || this.currentPlane.curves.length === 0) {
      Toast.warning('No sketch to close');
      return;
    }

    const closedCurves = this.contourDetector.autoClose(this.currentPlane.curves);

    if (!closedCurves) {
      Toast.error('Cannot auto-close: contour is already closed or gaps are too large');
      return;
    }

    // Add the auto-generated closing line
    const closingLine = closedCurves[closedCurves.length - 1];
    if (closingLine.autoGenerated) {
      this.currentPlane.addCurve(closingLine);

      // Draw the closing line
      const start3D = this.currentPlane.planeToWorld(closingLine.start.x, closingLine.start.y);
      const end3D = this.currentPlane.planeToWorld(closingLine.end.x, closingLine.end.y);

      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints([start3D, end3D]);

      const material = new THREE.LineBasicMaterial({
        color: 0x00ff00, // Green to indicate auto-generated
        linewidth: 3,
      });

      const line = new THREE.Line(geometry, material);
      line.userData.isSketchLine = true;
      line.userData.autoGenerated = true;
      this.scene.add(line);

      Toast.success('Contour auto-closed!');

      // Check closure again to show feedback
      setTimeout(() => {
        this.checkContourClosure();
      }, 100);
    }
  }

  /**
   * Check if sketch forms a closed contour and provide visual feedback
   */
  checkContourClosure() {
    if (!this.currentPlane || this.currentPlane.curves.length === 0) {
      this.removeContourFeedback();
      return null;
    }

    const result = this.contourDetector.detectClosedContour(this.currentPlane.curves);

    console.log('Contour detection result:', result);

    if (result.isClosed) {
      this.showClosedContourFeedback();
      Toast.success('✓ Closed contour detected! Ready to extrude.', 2000);
    } else {
      this.removeContourFeedback();
      if (result.gaps.length > 0) {
        console.log('Gaps found:', result.gaps);
        // Optionally show gap indicators
        this.showGapFeedback(result.gaps);
      }
    }

    return result;
  }

  /**
   * Show visual feedback that contour is closed
   */
  showClosedContourFeedback() {
    this.removeContourFeedback();

    // Create a glowing effect around the closed contour
    const shape = this.currentPlane.getClosedShape();
    if (!shape) return;

    try {
      // Create a filled shape to show it's closed
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });

      this.contourFeedback = new THREE.Mesh(geometry, material);

      // Position it on the sketch plane
      this.contourFeedback.position.copy(this.currentPlane.position);
      this.contourFeedback.rotation.copy(this.currentPlane.plane.rotation);

      // Slightly offset to show above sketch lines
      const offset = this.currentPlane.normal.clone().multiplyScalar(0.01);
      this.contourFeedback.position.add(offset);

      this.scene.add(this.contourFeedback);
    } catch (error) {
      console.error('Error showing contour feedback:', error);
    }
  }

  /**
   * Show indicators where gaps exist in the contour
   */
  showGapFeedback(gaps) {
    // Remove old gap indicators
    this.scene.traverse((obj) => {
      if (obj.userData.isGapIndicator) {
        this.scene.remove(obj);
        obj.geometry?.dispose();
        obj.material?.dispose();
      }
    });

    // Show small spheres at gap locations
    gaps.forEach(gap => {
      const worldPos = this.currentPlane.planeToWorld(gap.point.x, gap.point.y);

      const geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(worldPos);
      sphere.userData.isGapIndicator = true;

      this.scene.add(sphere);

      // Animate the gap indicator (pulse)
      this.animateGapIndicator(sphere);
    });
  }

  /**
   * Animate gap indicator with pulsing effect
   */
  animateGapIndicator(mesh) {
    const startScale = mesh.scale.clone();
    const animate = () => {
      if (!mesh.parent) return; // Stop if removed

      const time = Date.now() * 0.003;
      const scale = 1 + Math.sin(time) * 0.3;
      mesh.scale.copy(startScale).multiplyScalar(scale);

      requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Remove contour feedback visualization
   */
  removeContourFeedback() {
    if (this.contourFeedback) {
      this.scene.remove(this.contourFeedback);
      this.contourFeedback.geometry?.dispose();
      this.contourFeedback.material?.dispose();
      this.contourFeedback = null;
    }

    // Remove gap indicators
    const toRemove = [];
    this.scene.traverse((obj) => {
      if (obj.userData.isGapIndicator) {
        toRemove.push(obj);
      }
    });

    toRemove.forEach(obj => {
      this.scene.remove(obj);
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
  }
}
