// src/utils/ExportManager.js
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
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

  captureScreenshot(width = 1920, height = 1080) {
    // This would need access to renderer and camera
    Toast.info('Screenshot feature coming soon!');
  }
}
