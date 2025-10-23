// src/utils/Toast.js
export class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = this.getIcon(type);
    toast.prepend(icon);

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  static success(message, duration) {
    this.show(message, 'success', duration);
  }

  static error(message, duration) {
    this.show(message, 'error', duration);
  }

  static warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  static info(message, duration) {
    this.show(message, 'info', duration);
  }

  static confirm(message, onConfirm, onCancel) {
    this.init();

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';

    const modal = document.createElement('div');
    modal.className = 'toast-modal';

    const text = document.createElement('p');
    text.textContent = message;

    const buttons = document.createElement('div');
    buttons.className = 'toast-buttons';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.className = 'toast-btn toast-btn-confirm';
    confirmBtn.onclick = () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'toast-btn toast-btn-cancel';
    cancelBtn.onclick = () => {
      overlay.remove();
      if (onCancel) onCancel();
    };

    buttons.appendChild(cancelBtn);
    buttons.appendChild(confirmBtn);

    modal.appendChild(text);
    modal.appendChild(buttons);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => {
      overlay.classList.add('show');
      modal.classList.add('show');
    }, 10);
  }
}
