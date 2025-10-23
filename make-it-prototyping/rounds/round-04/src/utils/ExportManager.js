// src/utils/ExportManager.js
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { mergeVertices, mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Toast } from './Toast.js';

export class ExportManager {
  constructor(scene) {
    this.scene = scene;
  }

  exportGLTF() {
    const exporter = new GLTFExporter();

    Toast.info('Exporting scene to GLTF...');

    exporter.parse(
      this.scene,
      (gltf) => {
        const json = JSON.stringify(gltf, null, 2);
        this.downloadFile(json, 'scene.gltf', 'application/json');
        Toast.success('Scene exported successfully!');
      },
      (error) => {
        console.error('Export error:', error);
        Toast.error('Failed to export scene');
      },
      { binary: false }
    );
  }

  exportGLB() {
    const exporter = new GLTFExporter();

    Toast.info('Exporting scene to GLB...');

    exporter.parse(
      this.scene,
      (glb) => {
        this.downloadFile(glb, 'scene.glb', 'application/octet-stream');
        Toast.success('Scene exported successfully!');
      },
      (error) => {
        console.error('Export error:', error);
        Toast.error('Failed to export scene');
      },
      { binary: true }
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

  exportSTL() {
    console.log('=== STL EXPORT START ===');

    try {
      const exporter = new STLExporter();
      Toast.info('Exporting scene to STL (binary)...');

      // Collect only mesh objects (not lights, cameras, helpers, etc.)
      const meshesToExport = [];
      this.scene.traverse((object) => {
        // Skip non-mesh objects (lights, cameras, groups, etc.)
        if (!object.isMesh || !object.geometry) {
          return;
        }

        // Skip helper objects (grid, axes, transform controls, sketch elements)
        const isHelper = object.userData.isSketchLine ||
                        object.userData.isEndpointMarker ||
                        object.userData.isGapIndicator ||
                        object.userData.isConnectionLine ||
                        object.userData.isSketchPlane ||
                        object.userData.isHelper;

        // Skip planes (sketch planes)
        const isPlane = object.geometry.type === 'PlaneGeometry';

        // Skip if parent is a Light or Helper
        let isChildOfHelper = false;
        let parent = object.parent;
        while (parent) {
          if (parent.isLight ||
              parent.isGridHelper ||
              parent.isAxesHelper ||
              parent.type === 'TransformControls' ||
              parent.type === 'GridHelper' ||
              parent.type === 'AxesHelper') {
            isChildOfHelper = true;
            break;
          }
          parent = parent.parent;
        }

        // Only export user-created solid 3D shapes
        if (!isHelper && !isPlane && !isChildOfHelper) {
          // Additional check: object must have a userData.type or be a standard geometry
          const hasValidType = object.userData.type ||
                               ['BoxGeometry', 'SphereGeometry', 'CylinderGeometry',
                                'TorusGeometry', 'ConeGeometry', 'IcosahedronGeometry',
                                'ExtrudeGeometry', 'ShapeGeometry'].includes(object.geometry.type);

          if (hasValidType) {
            meshesToExport.push(object);
          }
        }
      });

      console.log(`Found ${meshesToExport.length} mesh(es) to export`);

      if (meshesToExport.length === 0) {
        Toast.warning('No objects to export! Add some shapes first.');
        return;
      }

      // Collect and transform all geometries
      const geometriesToMerge = [];

      meshesToExport.forEach((mesh, index) => {
        console.log(`Processing mesh ${index + 1}:`, {
          type: mesh.userData.type || 'unknown',
          geometryType: mesh.geometry.type,
          vertexCount: mesh.geometry.attributes.position?.count || 0
        });

        // Clone the geometry so we don't modify the original
        let clonedGeometry = mesh.geometry.clone();

        // Ensure the geometry has an index (is triangulated)
        if (!clonedGeometry.index) {
          console.log('  - Adding index to geometry');
          clonedGeometry = mergeVertices(clonedGeometry);
        }

        // Compute vertex normals if they don't exist
        if (!clonedGeometry.attributes.normal) {
          clonedGeometry.computeVertexNormals();
        }

        // Apply the mesh's world matrix to bake in position/rotation/scale
        mesh.updateMatrixWorld(true);
        clonedGeometry.applyMatrix4(mesh.matrixWorld);

        geometriesToMerge.push(clonedGeometry);
      });

      console.log(`Merging ${geometriesToMerge.length} geometries...`);

      // Merge all geometries into one
      const mergedGeometry = mergeGeometries(geometriesToMerge, false);

      if (!mergedGeometry) {
        Toast.error('Failed to merge geometries');
        return;
      }

      // Apply scale factor - divide by 10 to make objects smaller
      // (Your scene units appear to be 10x too large for typical 3D printing)
      const scaleMatrix = new THREE.Matrix4().makeScale(0.1, 0.1, 0.1);
      mergedGeometry.applyMatrix4(scaleMatrix);

      console.log(`Merged geometry has ${mergedGeometry.attributes.position.count} vertices`);

      // Create a temporary mesh for export
      const tempMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());

      // Export the merged mesh
      const result = exporter.parse(tempMesh, { binary: true });

      // Clean up
      mergedGeometry.dispose();
      geometriesToMerge.forEach(g => g.dispose());

      if (!result || (result.byteLength && result.byteLength === 0)) {
        Toast.error('Export produced empty file');
        return;
      }

      console.log(`STL file size: ${result.byteLength} bytes`);
      this.downloadFile(result, 'scene.stl', 'application/octet-stream');
      Toast.success(`Exported ${meshesToExport.length} object(s) to STL!`);
    } catch (error) {
      console.error('STL export error:', error);
      console.error('Error stack:', error.stack);
      Toast.error('Failed to export STL: ' + error.message);
    }
  }

  exportSTLAscii() {
    const exporter = new STLExporter();

    Toast.info('Exporting scene to STL (ASCII)...');

    try {
      // Export as ASCII STL (human-readable, larger file size)
      const result = exporter.parse(this.scene, { binary: false });
      this.downloadFile(result, 'scene.stl', 'text/plain');
      Toast.success('STL (ASCII) exported successfully!');
    } catch (error) {
      console.error('STL ASCII export error:', error);
      Toast.error('Failed to export STL: ' + error.message);
    }
  }

  captureScreenshot(width = 1920, height = 1080) {
    // This would need access to renderer and camera
    Toast.info('Screenshot feature coming soon!');
  }
}
