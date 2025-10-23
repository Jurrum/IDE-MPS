// src/sketch/SketchVisualHelper.js
import * as THREE from 'three';

/**
 * SketchVisualHelper provides visual feedback for sketching
 * - Shows start/end points of curves
 * - Highlights snap targets
 * - Shows connection status
 */
export class SketchVisualHelper {
  constructor(scene, sketchPlane) {
    console.log('SketchVisualHelper constructor called');
    this.scene = scene;
    this.sketchPlane = sketchPlane;
    this.snapRadius = 1.0; // Snap within 1 unit
    this.endpointMarkers = [];
    this.snapIndicator = null;
    this.connectionLines = [];
    this.createSnapIndicator();
    console.log('SketchVisualHelper initialized successfully');
  }

  /**
   * Create a snap indicator (shows when near a snap point)
   */
  createSnapIndicator() {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.8,
    });

    this.snapIndicator = new THREE.Mesh(geometry, material);
    this.snapIndicator.visible = false;
    this.scene.add(this.snapIndicator);
  }

  /**
   * Update endpoint markers for all curves
   */
  updateEndpointMarkers(curves) {
    console.log('updateEndpointMarkers called with', curves?.length, 'curves');

    // Remove old markers
    this.clearEndpointMarkers();

    if (!curves || curves.length === 0) {
      console.log('No curves to mark');
      return;
    }

    // Collect all unique endpoints
    const endpoints = this.collectEndpoints(curves);
    console.log('Found', endpoints.length, 'endpoints');

    // Create markers for each endpoint
    endpoints.forEach((ep, idx) => {
      const worldPos = this.sketchPlane.planeToWorld(ep.point.x, ep.point.y);

      // Different colors for start vs end vs connected
      let color = 0x00ff00; // Green for connected
      if (ep.isStart && idx === 0) {
        color = 0x00ffff; // Cyan for first point (start)
      } else if (!ep.connected) {
        color = 0xff0000; // Red for disconnected
      }

      const marker = this.createEndpointMarker(worldPos, color, ep.isStart && idx === 0);
      this.endpointMarkers.push(marker);
      this.scene.add(marker);
    });
  }

  /**
   * Collect all endpoints from curves
   */
  collectEndpoints(curves) {
    const endpoints = [];
    const tolerance = 0.6;

    curves.forEach((curve, idx) => {
      const start = this.getStartPoint(curve);
      const end = this.getEndPoint(curve);

      // Check if this start point connects to previous curve's end
      const startConnected = idx > 0 &&
        start.distanceTo(this.getEndPoint(curves[idx - 1])) < tolerance;

      // Check if this end point connects to next curve's start
      const endConnected = idx < curves.length - 1 &&
        end.distanceTo(this.getStartPoint(curves[idx + 1])) < tolerance;

      // Always add first curve's start
      if (idx === 0) {
        endpoints.push({
          point: start.clone(),
          isStart: true,
          connected: false,
          curveIdx: idx
        });
      }

      // Add end point if it's the last curve or not connected to next
      if (idx === curves.length - 1) {
        endpoints.push({
          point: end.clone(),
          isStart: false,
          connected: end.distanceTo(endpoints[0].point) < tolerance, // Check if closes loop
          curveIdx: idx
        });
      }
    });

    return endpoints;
  }

  /**
   * Create a visual marker for an endpoint
   */
  createEndpointMarker(position, color, isFirst = false) {
    const size = isFirst ? 0.25 : 0.15; // First point is larger
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData.isEndpointMarker = true;

    // Add a pulsing animation for disconnected points
    if (color === 0xff0000) {
      this.animateMarker(marker);
    }

    return marker;
  }

  /**
   * Animate a marker (pulsing effect)
   */
  animateMarker(marker) {
    const originalScale = marker.scale.clone();
    const animate = () => {
      if (!marker.parent) return;

      const time = Date.now() * 0.003;
      const scale = 1 + Math.sin(time) * 0.3;
      marker.scale.copy(originalScale).multiplyScalar(scale);

      requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Clear all endpoint markers
   */
  clearEndpointMarkers() {
    this.endpointMarkers.forEach(marker => {
      this.scene.remove(marker);
      marker.geometry.dispose();
      marker.material.dispose();
    });
    this.endpointMarkers = [];
  }

  /**
   * Find nearest snap point to a given 2D point
   */
  findSnapPoint(point2D, curves) {
    if (!curves || curves.length === 0) return null;

    let nearestPoint = null;
    let nearestDistance = this.snapRadius;

    // Check start point of first curve
    const firstStart = this.getStartPoint(curves[0]);
    const distToFirst = point2D.distanceTo(firstStart);

    if (distToFirst < nearestDistance) {
      nearestPoint = firstStart;
      nearestDistance = distToFirst;
    }

    // Check end point of last curve
    if (curves.length > 0) {
      const lastEnd = this.getEndPoint(curves[curves.length - 1]);
      const distToLast = point2D.distanceTo(lastEnd);

      if (distToLast < nearestDistance) {
        nearestPoint = lastEnd;
        nearestDistance = distToLast;
      }
    }

    return nearestPoint ? {
      point: nearestPoint.clone(),
      distance: nearestDistance
    } : null;
  }

  /**
   * Show snap indicator at a position
   */
  showSnapIndicator(point2D) {
    const worldPos = this.sketchPlane.planeToWorld(point2D.x, point2D.y);
    this.snapIndicator.position.copy(worldPos);
    this.snapIndicator.visible = true;

    // Pulse animation
    const time = Date.now() * 0.005;
    const scale = 1 + Math.sin(time) * 0.2;
    this.snapIndicator.scale.setScalar(scale);
  }

  /**
   * Hide snap indicator
   */
  hideSnapIndicator() {
    this.snapIndicator.visible = false;
  }

  /**
   * Show connection lines between endpoints
   */
  showConnectionStatus(curves) {
    this.clearConnectionLines();

    if (!curves || curves.length < 2) return;

    const tolerance = 0.6;

    // Check each consecutive pair
    for (let i = 0; i < curves.length; i++) {
      const current = curves[i];
      const next = curves[(i + 1) % curves.length];

      const currentEnd = this.getEndPoint(current);
      const nextStart = this.getStartPoint(next);
      const distance = currentEnd.distanceTo(nextStart);

      // If gap exists, draw a red dashed line
      if (distance > tolerance && distance < 5) {
        const line = this.createConnectionLine(currentEnd, nextStart, distance > tolerance);
        this.connectionLines.push(line);
        this.scene.add(line);
      }
    }
  }

  /**
   * Create a connection line between two points
   */
  createConnectionLine(point1, point2, isGap) {
    const start3D = this.sketchPlane.planeToWorld(point1.x, point1.y);
    const end3D = this.sketchPlane.planeToWorld(point2.x, point2.y);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([start3D, end3D]);

    const material = new THREE.LineDashedMaterial({
      color: isGap ? 0xff0000 : 0x00ff00,
      dashSize: 0.2,
      gapSize: 0.1,
      linewidth: 2,
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    line.userData.isConnectionLine = true;

    return line;
  }

  /**
   * Clear connection lines
   */
  clearConnectionLines() {
    this.connectionLines.forEach(line => {
      this.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });
    this.connectionLines = [];
  }

  /**
   * Get start point of a curve
   */
  getStartPoint(curve) {
    if (curve.type === 'line') {
      return curve.start;
    } else if (curve.type === 'arc') {
      const x = curve.center.x + Math.cos(curve.startAngle) * curve.radius;
      const y = curve.center.y + Math.sin(curve.startAngle) * curve.radius;
      return new THREE.Vector2(x, y);
    }
    return new THREE.Vector2(0, 0);
  }

  /**
   * Get end point of a curve
   */
  getEndPoint(curve) {
    if (curve.type === 'line') {
      return curve.end;
    } else if (curve.type === 'arc') {
      const x = curve.center.x + Math.cos(curve.endAngle) * curve.radius;
      const y = curve.center.y + Math.sin(curve.endAngle) * curve.radius;
      return new THREE.Vector2(x, y);
    }
    return new THREE.Vector2(0, 0);
  }

  /**
   * Clean up all visual helpers
   */
  dispose() {
    this.clearEndpointMarkers();
    this.clearConnectionLines();

    if (this.snapIndicator) {
      this.scene.remove(this.snapIndicator);
      this.snapIndicator.geometry.dispose();
      this.snapIndicator.material.dispose();
    }
  }
}
