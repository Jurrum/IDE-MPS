// src/sketch/SketchPlane.js
import * as THREE from 'three';

/**
 * SketchPlane represents a 2D drawing surface in 3D space
 * Users can draw 2D shapes on this plane that can later be extruded into 3D
 */
export class SketchPlane {
  constructor(orientation = 'XY', position = new THREE.Vector3(0, 0, 0)) {
    this.orientation = orientation;
    this.position = position.clone();
    this.size = 20; // Size of the sketch plane grid
    this.active = false;
    this.curves = []; // Store 2D curves drawn on this plane

    this.createPlane();
    this.createGrid();
  }

  createPlane() {
    // Create a semi-transparent plane to show the sketch surface
    const geometry = new THREE.PlaneGeometry(this.size, this.size);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });

    this.plane = new THREE.Mesh(geometry, material);
    this.plane.userData.isSketchPlane = true;

    // Orient the plane based on the orientation
    this.orientPlane();
    this.plane.position.copy(this.position);
  }

  createGrid() {
    // Create a grid helper on the sketch plane
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(this.size, divisions, 0x0088ff, 0x004488);

    // Rotate grid to match plane orientation
    if (this.orientation === 'XY') {
      gridHelper.rotation.x = Math.PI / 2;
    } else if (this.orientation === 'XZ') {
      // Default orientation for GridHelper
    } else if (this.orientation === 'YZ') {
      gridHelper.rotation.z = Math.PI / 2;
    }

    gridHelper.position.copy(this.position);
    this.grid = gridHelper;
  }

  orientPlane() {
    // Orient plane based on the coordinate system
    switch (this.orientation) {
      case 'XY':
        // Default orientation (no rotation needed)
        this.plane.rotation.set(0, 0, 0);
        this.normal = new THREE.Vector3(0, 0, 1);
        break;
      case 'XZ':
        this.plane.rotation.set(Math.PI / 2, 0, 0);
        this.normal = new THREE.Vector3(0, 1, 0);
        break;
      case 'YZ':
        this.plane.rotation.set(0, Math.PI / 2, 0);
        this.normal = new THREE.Vector3(1, 0, 0);
        break;
    }
  }

  /**
   * Convert 3D point to 2D coordinates on this sketch plane
   */
  worldTo2D(worldPoint) {
    // Create a matrix to transform world coordinates to plane-local coordinates
    const inverseMatrix = new THREE.Matrix4();
    inverseMatrix.copy(this.plane.matrixWorld).invert();

    const localPoint = worldPoint.clone().applyMatrix4(inverseMatrix);

    // Return 2D coordinates (x, y) ignoring z
    return new THREE.Vector2(localPoint.x, localPoint.y);
  }

  /**
   * Convert 2D plane coordinates to 3D world coordinates
   */
  planeToWorld(x, y) {
    // Create a local point on the plane (z = 0 in plane coordinates)
    const localPoint = new THREE.Vector3(x, y, 0);

    // Transform to world coordinates
    const worldPoint = localPoint.applyMatrix4(this.plane.matrixWorld);

    return worldPoint;
  }

  /**
   * Add a curve to the sketch
   */
  addCurve(curve) {
    this.curves.push(curve);
  }

  /**
   * Get all curves as a single closed shape
   */
  getClosedShape() {
    if (this.curves.length === 0) return null;

    // Create a THREE.Shape from the curves
    const shape = new THREE.Shape();

    // Start from the first point
    let firstPoint = true;

    this.curves.forEach(curve => {
      if (curve.type === 'line') {
        if (firstPoint) {
          shape.moveTo(curve.start.x, curve.start.y);
          firstPoint = false;
        }
        shape.lineTo(curve.end.x, curve.end.y);
      } else if (curve.type === 'arc') {
        shape.absarc(
          curve.center.x,
          curve.center.y,
          curve.radius,
          curve.startAngle,
          curve.endAngle,
          curve.clockwise
        );
      }
    });

    return shape;
  }

  /**
   * Show the sketch plane in the scene
   */
  show(scene) {
    if (!this.plane.parent) {
      scene.add(this.plane);
      scene.add(this.grid);
    }
    this.plane.visible = true;
    this.grid.visible = true;
    this.active = true;
  }

  /**
   * Hide the sketch plane
   */
  hide() {
    this.plane.visible = false;
    this.grid.visible = false;
    this.active = false;
  }

  /**
   * Remove from scene
   */
  dispose(scene) {
    scene.remove(this.plane);
    scene.remove(this.grid);
    this.plane.geometry.dispose();
    this.plane.material.dispose();
    this.grid.dispose();
  }

  /**
   * Clear all curves from the sketch
   */
  clear() {
    this.curves = [];
  }
}
