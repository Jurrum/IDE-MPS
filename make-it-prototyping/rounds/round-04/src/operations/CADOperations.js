// src/operations/CADOperations.js
import * as THREE from 'three';
import { Evaluator, Brush, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { Toast } from '../utils/Toast.js';
import { MaterialLibrary } from '../objects/MaterialLibrary.js';

/**
 * ExtrudeOperation - Converts 2D sketch to 3D by extrusion
 */
export class ExtrudeOperation {
  static execute(shape, params = {}) {
    if (!shape) {
      Toast.error('No shape to extrude');
      return null;
    }

    const defaults = {
      depth: 1,
      bevelEnabled: false,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3,
      curveSegments: 12,
      steps: 1,
      color: 0x00ff00,
      materialType: 'standard',
    };

    const config = { ...defaults, ...params };

    try {
      // Create extrude geometry
      const extrudeSettings = {
        depth: config.depth,
        bevelEnabled: config.bevelEnabled,
        bevelThickness: config.bevelThickness,
        bevelSize: config.bevelSize,
        bevelSegments: config.bevelSegments,
        curveSegments: config.curveSegments,
        steps: config.steps,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // Center the geometry
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);

      // Create material
      const material = MaterialLibrary.create(config.materialType, config.color);

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add metadata
      mesh.userData = {
        type: 'extruded',
        operation: 'extrude',
        depth: config.depth,
        createdAt: Date.now(),
      };

      Toast.success('Shape extruded successfully');
      return mesh;
    } catch (error) {
      console.error('Extrude error:', error);
      Toast.error('Failed to extrude shape: ' + error.message);
      return null;
    }
  }
}

/**
 * RevolveOperation - Creates 3D shape by revolving 2D profile around an axis
 */
export class RevolveOperation {
  static execute(shape, params = {}) {
    if (!shape) {
      Toast.error('No shape to revolve');
      return null;
    }

    const defaults = {
      angle: Math.PI * 2, // Full revolution
      segments: 32,
      color: 0x00ff00,
      materialType: 'standard',
    };

    const config = { ...defaults, ...params };

    try {
      // Extract points from shape
      const points = shape.getPoints(config.segments);

      // Create lathe geometry (revolve around Y axis)
      const geometry = new THREE.LatheGeometry(points, config.segments, 0, config.angle);

      // Create material
      const material = MaterialLibrary.create(config.materialType, config.color);

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add metadata
      mesh.userData = {
        type: 'revolved',
        operation: 'revolve',
        angle: config.angle,
        createdAt: Date.now(),
      };

      Toast.success('Shape revolved successfully');
      return mesh;
    } catch (error) {
      console.error('Revolve error:', error);
      Toast.error('Failed to revolve shape: ' + error.message);
      return null;
    }
  }
}

/**
 * CSGOperations - Boolean operations on meshes
 */
export class CSGOperations {
  static evaluator = new Evaluator();

  static union(meshA, meshB) {
    try {
      const brushA = new Brush(meshA.geometry, meshA.material);
      const brushB = new Brush(meshB.geometry, meshB.material);

      brushA.updateMatrixWorld(true);
      brushB.updateMatrixWorld(true);

      const result = this.evaluator.evaluate(brushA, brushB, ADDITION);

      const mesh = new THREE.Mesh(result.geometry, meshA.material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        type: 'csg',
        operation: 'union',
        createdAt: Date.now(),
      };

      Toast.success('Union operation completed');
      return mesh;
    } catch (error) {
      console.error('Union error:', error);
      Toast.error('Failed to perform union: ' + error.message);
      return null;
    }
  }

  static subtract(meshA, meshB) {
    try {
      const brushA = new Brush(meshA.geometry, meshA.material);
      const brushB = new Brush(meshB.geometry, meshB.material);

      brushA.updateMatrixWorld(true);
      brushB.updateMatrixWorld(true);

      const result = this.evaluator.evaluate(brushA, brushB, SUBTRACTION);

      const mesh = new THREE.Mesh(result.geometry, meshA.material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        type: 'csg',
        operation: 'subtract',
        createdAt: Date.now(),
      };

      Toast.success('Subtract operation completed');
      return mesh;
    } catch (error) {
      console.error('Subtract error:', error);
      Toast.error('Failed to perform subtract: ' + error.message);
      return null;
    }
  }

  static intersect(meshA, meshB) {
    try {
      const brushA = new Brush(meshA.geometry, meshA.material);
      const brushB = new Brush(meshB.geometry, meshB.material);

      brushA.updateMatrixWorld(true);
      brushB.updateMatrixWorld(true);

      const result = this.evaluator.evaluate(brushA, brushB, INTERSECTION);

      const mesh = new THREE.Mesh(result.geometry, meshA.material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        type: 'csg',
        operation: 'intersect',
        createdAt: Date.now(),
      };

      Toast.success('Intersect operation completed');
      return mesh;
    } catch (error) {
      console.error('Intersect error:', error);
      Toast.error('Failed to perform intersect: ' + error.message);
      return null;
    }
  }
}

/**
 * FilletOperation - Rounds edges using extrude with bevel
 */
export class FilletOperation {
  /**
   * Create a shape with filleted corners
   * Note: This creates a new extruded shape with rounded edges
   * For modifying existing meshes, you would need a more complex geometry modifier
   */
  static createFilletedBox(width, height, depth, radius, params = {}) {
    const defaults = {
      color: 0x00ff00,
      materialType: 'standard',
    };

    const config = { ...defaults, ...params };

    try {
      // Create a rounded rectangle shape
      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -height / 2;
      const r = Math.min(radius, width / 2, height / 2);

      shape.moveTo(x + r, y);
      shape.lineTo(x + width - r, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + r);
      shape.lineTo(x + width, y + height - r);
      shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      shape.lineTo(x + r, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      // Extrude with bevel to create rounded edges
      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: radius,
        bevelSize: radius,
        bevelSegments: 8,
        curveSegments: 8,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // Center the geometry
      geometry.computeBoundingBox();
      geometry.center();

      // Create material
      const material = MaterialLibrary.create(config.materialType, config.color);

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add metadata
      mesh.userData = {
        type: 'filleted_box',
        operation: 'fillet',
        radius: radius,
        createdAt: Date.now(),
      };

      Toast.success('Filleted shape created');
      return mesh;
    } catch (error) {
      console.error('Fillet error:', error);
      Toast.error('Failed to create fillet: ' + error.message);
      return null;
    }
  }

  /**
   * Create a filleted cylinder (chamfered edges)
   */
  static createFilletedCylinder(radius, height, filletRadius, params = {}) {
    const defaults = {
      color: 0x00ff00,
      materialType: 'standard',
      radialSegments: 32,
    };

    const config = { ...defaults, ...params };

    try {
      // Create profile with rounded top/bottom
      const shape = new THREE.Shape();
      const r = filletRadius;
      const h = height - r * 2;

      // Draw a profile that will be revolved
      shape.moveTo(0, -h / 2);
      shape.lineTo(radius - r, -h / 2);
      shape.quadraticCurveTo(radius, -h / 2, radius, -h / 2 + r);
      shape.lineTo(radius, h / 2 - r);
      shape.quadraticCurveTo(radius, h / 2, radius - r, h / 2);
      shape.lineTo(0, h / 2);

      // Use revolve to create cylinder
      const points = shape.getPoints(config.radialSegments);
      const geometry = new THREE.LatheGeometry(points, config.radialSegments);

      // Create material
      const material = MaterialLibrary.create(config.materialType, config.color);

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add metadata
      mesh.userData = {
        type: 'filleted_cylinder',
        operation: 'fillet',
        radius: filletRadius,
        createdAt: Date.now(),
      };

      Toast.success('Filleted cylinder created');
      return mesh;
    } catch (error) {
      console.error('Fillet cylinder error:', error);
      Toast.error('Failed to create filleted cylinder: ' + error.message);
      return null;
    }
  }
}
