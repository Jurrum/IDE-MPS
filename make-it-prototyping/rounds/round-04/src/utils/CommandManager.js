// src/utils/CommandManager.js
export class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = 50;
  }

  execute(command) {
    command.execute();

    // Remove any commands after current index (if we've undone some)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new command
    this.history.push(command);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo() {
    if (this.currentIndex < 0) return false;

    this.history[this.currentIndex].undo();
    this.currentIndex--;
    return true;
  }

  redo() {
    if (this.currentIndex >= this.history.length - 1) return false;

    this.currentIndex++;
    this.history[this.currentIndex].execute();
    return true;
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

// Command: Add Object
export class AddObjectCommand {
  constructor(scene, object, selectionManager) {
    this.scene = scene;
    this.object = object;
    this.selectionManager = selectionManager;
  }

  execute() {
    this.scene.add(this.object);
    this.selectionManager.addSelectableObject(this.object);
  }

  undo() {
    this.scene.remove(this.object);
    this.selectionManager.removeSelectableObject(this.object);
  }
}

// Command: Delete Object
export class DeleteObjectCommand {
  constructor(scene, object, selectionManager) {
    this.scene = scene;
    this.object = object;
    this.selectionManager = selectionManager;
  }

  execute() {
    this.scene.remove(this.object);
    this.selectionManager.removeSelectableObject(this.object);
    this.selectionManager.deselect();
  }

  undo() {
    this.scene.add(this.object);
    this.selectionManager.addSelectableObject(this.object);
  }
}

// Command: Transform Object
export class TransformObjectCommand {
  constructor(object, oldTransform, newTransform) {
    this.object = object;
    this.oldTransform = oldTransform;
    this.newTransform = newTransform;
  }

  execute() {
    this.applyTransform(this.newTransform);
  }

  undo() {
    this.applyTransform(this.oldTransform);
  }

  applyTransform(transform) {
    if (transform.position) {
      this.object.position.copy(transform.position);
    }
    if (transform.rotation) {
      this.object.rotation.copy(transform.rotation);
    }
    if (transform.scale) {
      this.object.scale.copy(transform.scale);
    }
  }
}

// Command: Change Material
export class ChangeMaterialCommand {
  constructor(object, oldColor, newColor) {
    this.object = object;
    this.oldColor = oldColor;
    this.newColor = newColor;
  }

  execute() {
    this.object.material.color.set(this.newColor);
  }

  undo() {
    this.object.material.color.set(this.oldColor);
  }
}
