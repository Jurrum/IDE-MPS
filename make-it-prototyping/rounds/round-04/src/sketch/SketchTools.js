// src/sketch/SketchTools.js
import * as THREE from 'three';

/**
 * Base class for all sketch tools
 */
export class SketchTool {
  constructor(sketchPlane) {
    this.sketchPlane = sketchPlane;
    this.isDrawing = false;
    this.previewLine = null;
  }

  start(point2D) {
    this.isDrawing = true;
  }

  move(point2D) {
    // Override in subclasses
  }

  end(point2D) {
    this.isDrawing = false;
    if (this.previewLine) {
      this.previewLine.visible = false;
    }
  }

  cancel() {
    this.isDrawing = false;
    if (this.previewLine) {
      this.previewLine.visible = false;
    }
  }

  dispose(scene) {
    if (this.previewLine) {
      scene.remove(this.previewLine);
      this.previewLine.geometry.dispose();
      this.previewLine.material.dispose();
    }
  }
}

/**
 * Line drawing tool
 */
export class LineTool extends SketchTool {
  constructor(sketchPlane, scene) {
    super(sketchPlane);
    this.scene = scene;
    this.startPoint = null;
    this.createPreviewLine();
  }

  createPreviewLine() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
    });

    this.previewLine = new THREE.Line(geometry, material);
    this.previewLine.visible = false;
    this.scene.add(this.previewLine);
  }

  start(point2D) {
    super.start(point2D);
    this.startPoint = point2D.clone();
    this.previewLine.visible = true;
  }

  move(point2D) {
    if (!this.isDrawing || !this.startPoint) return;

    // Update preview line
    const start3D = this.sketchPlane.planeToWorld(this.startPoint.x, this.startPoint.y);
    const end3D = this.sketchPlane.planeToWorld(point2D.x, point2D.y);

    const points = [start3D, end3D];
    this.previewLine.geometry.setFromPoints(points);
  }

  end(point2D) {
    if (!this.isDrawing || !this.startPoint) return;

    // Add the line to the sketch
    const curve = {
      type: 'line',
      start: this.startPoint.clone(),
      end: point2D.clone(),
    };

    this.sketchPlane.addCurve(curve);

    // Draw the actual line in the scene
    this.drawLine(this.startPoint, point2D);

    super.end(point2D);
    this.startPoint = null;
  }

  drawLine(start2D, end2D) {
    const start3D = this.sketchPlane.planeToWorld(start2D.x, start2D.y);
    const end3D = this.sketchPlane.planeToWorld(end2D.x, end2D.y);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([start3D, end3D]);

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    const line = new THREE.Line(geometry, material);
    line.userData.isSketchLine = true;
    this.scene.add(line);
  }
}

/**
 * Rectangle drawing tool
 */
export class RectangleTool extends SketchTool {
  constructor(sketchPlane, scene) {
    super(sketchPlane);
    this.scene = scene;
    this.startPoint = null;
    this.createPreviewLine();
  }

  createPreviewLine() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
    });

    this.previewLine = new THREE.LineLoop(geometry, material);
    this.previewLine.visible = false;
    this.scene.add(this.previewLine);
  }

  start(point2D) {
    super.start(point2D);
    this.startPoint = point2D.clone();
    this.previewLine.visible = true;
  }

  move(point2D) {
    if (!this.isDrawing || !this.startPoint) return;

    // Update preview rectangle
    const points = this.getRectanglePoints(this.startPoint, point2D);
    this.previewLine.geometry.setFromPoints(points);
  }

  end(point2D) {
    if (!this.isDrawing || !this.startPoint) return;

    // Add four lines to form a rectangle
    const p1 = this.startPoint;
    const p2 = new THREE.Vector2(point2D.x, this.startPoint.y);
    const p3 = point2D.clone();
    const p4 = new THREE.Vector2(this.startPoint.x, point2D.y);

    this.sketchPlane.addCurve({ type: 'line', start: p1.clone(), end: p2.clone() });
    this.sketchPlane.addCurve({ type: 'line', start: p2.clone(), end: p3.clone() });
    this.sketchPlane.addCurve({ type: 'line', start: p3.clone(), end: p4.clone() });
    this.sketchPlane.addCurve({ type: 'line', start: p4.clone(), end: p1.clone() });

    // Draw the actual rectangle
    this.drawRectangle(this.startPoint, point2D);

    super.end(point2D);
    this.startPoint = null;
  }

  getRectanglePoints(start, end) {
    const p1 = this.sketchPlane.planeToWorld(start.x, start.y);
    const p2 = this.sketchPlane.planeToWorld(end.x, start.y);
    const p3 = this.sketchPlane.planeToWorld(end.x, end.y);
    const p4 = this.sketchPlane.planeToWorld(start.x, end.y);

    return [p1, p2, p3, p4];
  }

  drawRectangle(start2D, end2D) {
    const points = this.getRectanglePoints(start2D, end2D);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    const rectangle = new THREE.LineLoop(geometry, material);
    rectangle.userData.isSketchLine = true;
    this.scene.add(rectangle);
  }
}

/**
 * Circle drawing tool
 */
export class CircleTool extends SketchTool {
  constructor(sketchPlane, scene) {
    super(sketchPlane);
    this.scene = scene;
    this.centerPoint = null;
    this.createPreviewLine();
  }

  createPreviewLine() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
    });

    this.previewLine = new THREE.LineLoop(geometry, material);
    this.previewLine.visible = false;
    this.scene.add(this.previewLine);
  }

  start(point2D) {
    super.start(point2D);
    this.centerPoint = point2D.clone();
    this.previewLine.visible = true;
  }

  move(point2D) {
    if (!this.isDrawing || !this.centerPoint) return;

    // Calculate radius
    const radius = this.centerPoint.distanceTo(point2D);

    // Update preview circle
    const points = this.getCirclePoints(this.centerPoint, radius);
    this.previewLine.geometry.setFromPoints(points);
  }

  end(point2D) {
    if (!this.isDrawing || !this.centerPoint) return;

    const radius = this.centerPoint.distanceTo(point2D);

    // Add circle as arc curve
    this.sketchPlane.addCurve({
      type: 'arc',
      center: this.centerPoint.clone(),
      radius: radius,
      startAngle: 0,
      endAngle: Math.PI * 2,
      clockwise: false,
    });

    // Draw the actual circle
    this.drawCircle(this.centerPoint, radius);

    super.end(point2D);
    this.centerPoint = null;
  }

  getCirclePoints(center, radius, segments = 32) {
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      points.push(this.sketchPlane.planeToWorld(x, y));
    }

    return points;
  }

  drawCircle(center2D, radius) {
    const points = this.getCirclePoints(center2D, radius);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    const circle = new THREE.LineLoop(geometry, material);
    circle.userData.isSketchLine = true;
    this.scene.add(circle);
  }
}
