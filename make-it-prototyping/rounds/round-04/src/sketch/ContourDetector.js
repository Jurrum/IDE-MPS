// src/sketch/ContourDetector.js
import * as THREE from 'three';

/**
 * ContourDetector analyzes sketch curves and detects closed contours
 * A closed contour is a continuous path where the end point connects back to the start point
 */
export class ContourDetector {
  constructor(tolerance = 0.1) {
    this.tolerance = tolerance; // Distance tolerance for considering points as connected
  }

  /**
   * Detect if the current set of curves forms a closed contour
   * @param {Array} curves - Array of curve objects from sketch
   * @returns {Object} - { isClosed: boolean, contour: Array, gaps: Array }
   */
  detectClosedContour(curves) {
    if (!curves || curves.length === 0) {
      return { isClosed: false, contour: [], gaps: [] };
    }

    console.log('Detecting contour for curves:', curves);

    // For simple shapes like circles or rectangles, check if already closed
    if (this.isSimpleClosedShape(curves)) {
      console.log('Simple closed shape detected');
      return {
        isClosed: true,
        contour: curves,
        gaps: [],
        type: 'simple'
      };
    }

    // For line-based sketches, check if forms a closed loop
    if (curves.every(c => c.type === 'line')) {
      const isClosedLine = this.checkLineClosure(curves);
      if (isClosedLine) {
        console.log('Closed line loop detected');
        return {
          isClosed: true,
          contour: curves,
          gaps: [],
          type: 'lines'
        };
      }
    }

    // For complex shapes, try to find a closed loop
    const result = this.findClosedLoop(curves);
    console.log('Complex shape detection result:', result);
    return result;
  }

  /**
   * Check if curves form a simple closed shape (circle or rectangle)
   */
  isSimpleClosedShape(curves) {
    // Single circle
    if (curves.length === 1 && curves[0].type === 'arc') {
      const arc = curves[0];
      const angleSpan = Math.abs(arc.endAngle - arc.startAngle);
      return angleSpan >= Math.PI * 1.99; // Nearly full circle
    }

    // Rectangle (4 connected lines forming a closed loop)
    if (curves.length === 4 && curves.every(c => c.type === 'line')) {
      return this.checkRectangleClosure(curves);
    }

    return false;
  }

  /**
   * Check if 4 lines form a closed rectangle
   */
  checkRectangleClosure(curves) {
    for (let i = 0; i < curves.length; i++) {
      const current = curves[i];
      const next = curves[(i + 1) % curves.length];

      // Check if end of current connects to start of next
      const distance = current.end.distanceTo(next.start);
      if (distance > this.tolerance) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a set of lines forms a closed loop
   */
  checkLineClosure(curves) {
    if (curves.length < 3) return false;

    // Check if each line's end connects to the next line's start
    for (let i = 0; i < curves.length; i++) {
      const current = curves[i];
      const next = curves[(i + 1) % curves.length];

      const distance = current.end.distanceTo(next.start);
      console.log(`Line ${i} to ${(i + 1) % curves.length} distance:`, distance);

      if (distance > this.tolerance) {
        return false;
      }
    }

    return true;
  }

  /**
   * Find a closed loop in a set of line segments
   * Uses a graph-based approach to find connected paths
   */
  findClosedLoop(curves) {
    // Build adjacency graph
    const graph = this.buildGraph(curves);

    // Try to find a cycle starting from each curve
    for (let i = 0; i < curves.length; i++) {
      const path = this.findCycle(graph, i, [i], new Set([i]));
      if (path) {
        const orderedCurves = path.map(idx => curves[idx]);
        return {
          isClosed: true,
          contour: orderedCurves,
          gaps: [],
          type: 'complex'
        };
      }
    }

    // No closed loop found, find gaps
    const gaps = this.findGaps(curves);
    return {
      isClosed: false,
      contour: curves,
      gaps: gaps,
      type: 'open'
    };
  }

  /**
   * Build a graph where each curve can connect to others
   */
  buildGraph(curves) {
    const graph = Array(curves.length).fill(null).map(() => []);

    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < curves.length; j++) {
        if (i === j) continue;

        const curve1 = curves[i];
        const curve2 = curves[j];

        // Check if end of curve1 connects to start of curve2
        if (this.arePointsConnected(this.getEndPoint(curve1), this.getStartPoint(curve2))) {
          graph[i].push(j);
        }
      }
    }

    return graph;
  }

  /**
   * Find a cycle (closed loop) using DFS
   */
  findCycle(graph, start, path, visited) {
    const current = path[path.length - 1];
    const neighbors = graph[current];

    for (const neighbor of neighbors) {
      // Found a cycle back to start
      if (neighbor === start && path.length >= 3) {
        return path;
      }

      // Continue exploring if not visited
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);

        const result = this.findCycle(graph, start, path, visited);
        if (result) return result;

        // Backtrack
        path.pop();
        visited.delete(neighbor);
      }
    }

    return null;
  }

  /**
   * Find gaps in the contour (disconnected endpoints)
   */
  findGaps(curves) {
    const gaps = [];
    const endpoints = [];

    // Collect all endpoints
    curves.forEach((curve, idx) => {
      endpoints.push({
        point: this.getStartPoint(curve),
        curveIdx: idx,
        isStart: true
      });
      endpoints.push({
        point: this.getEndPoint(curve),
        curveIdx: idx,
        isStart: false
      });
    });

    // Find unconnected endpoints
    for (let i = 0; i < endpoints.length; i++) {
      const ep1 = endpoints[i];
      let hasConnection = false;

      for (let j = 0; j < endpoints.length; j++) {
        if (i === j) continue;

        const ep2 = endpoints[j];

        // Skip if same curve
        if (ep1.curveIdx === ep2.curveIdx) continue;

        // Check if they're connected
        if (ep1.point.distanceTo(ep2.point) < this.tolerance) {
          hasConnection = true;
          break;
        }
      }

      if (!hasConnection) {
        gaps.push({
          point: ep1.point.clone(),
          curveIdx: ep1.curveIdx,
          isStart: ep1.isStart
        });
      }
    }

    return gaps;
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
   * Check if two points are connected within tolerance
   */
  arePointsConnected(p1, p2) {
    return p1.distanceTo(p2) < this.tolerance;
  }

  /**
   * Auto-close a nearly closed contour by adding a closing line
   */
  autoClose(curves, gap = null) {
    if (!curves || curves.length === 0) return null;

    console.log('Auto-close called with', curves.length, 'curves');

    // If already closed, return null
    if (this.checkLineClosure(curves)) {
      console.log('Already closed, no need to auto-close');
      return null;
    }

    // Find all gaps
    const gaps = this.findGaps(curves);
    console.log('Found gaps:', gaps);

    // If exactly 2 gaps, they should be connected
    if (gaps.length === 2) {
      const closingLine = {
        type: 'line',
        start: gaps[0].point.clone(),
        end: gaps[1].point.clone(),
        autoGenerated: true
      };
      console.log('Creating closing line between two gaps:', closingLine);
      return [...curves, closingLine];
    }

    // For line-based sketches, connect last point to first point if close
    if (curves.every(c => c.type === 'line') && curves.length >= 2) {
      const firstPoint = this.getStartPoint(curves[0]);
      const lastPoint = this.getEndPoint(curves[curves.length - 1]);
      const distance = firstPoint.distanceTo(lastPoint);

      console.log('First to last distance:', distance, 'tolerance:', this.tolerance * 5);

      if (distance > 0 && distance < this.tolerance * 5) {
        const closingLine = {
          type: 'line',
          start: lastPoint.clone(),
          end: firstPoint.clone(),
          autoGenerated: true
        };
        console.log('Creating closing line:', closingLine);
        return [...curves, closingLine];
      }
    }

    console.log('Cannot auto-close: no suitable gap found');
    return null;
  }
}
