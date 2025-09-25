import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import StepLR, ReduceLROnPlateau
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import time
import copy
import os
from tqdm import tqdm
import json

from .data_loader import create_data_loaders
from .model import create_model, count_parameters

class Trainer:
    def __init__(self, model, train_loader, val_loader, criterion, optimizer, device, scheduler=None):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.criterion = criterion
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.device = device
        
        self.train_losses = []
        self.val_losses = []
        self.train_accuracies = []
        self.val_accuracies = []
        self.learning_rates = []
        
    def train_epoch(self):
        self.model.train()
        running_loss = 0.0
        correct_predictions = 0
        total_samples = 0
        
        progress_bar = tqdm(self.train_loader, desc="Training")
        
        for inputs, labels in progress_bar:
            inputs, labels = inputs.to(self.device), labels.to(self.device)
            
            self.optimizer.zero_grad()
            
            outputs = self.model(inputs)
            loss = self.criterion(outputs, labels)
            
            loss.backward()
            self.optimizer.step()
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total_samples += labels.size(0)
            correct_predictions += (predicted == labels).sum().item()
            
            # Update progress bar
            current_accuracy = 100 * correct_predictions / total_samples
            progress_bar.set_postfix({
                'Loss': f'{loss.item():.4f}',
                'Acc': f'{current_accuracy:.2f}%'
            })
        
        epoch_loss = running_loss / len(self.train_loader)
        epoch_accuracy = 100 * correct_predictions / total_samples
        
        return epoch_loss, epoch_accuracy
    
    def validate_epoch(self):
        self.model.eval()
        running_loss = 0.0
        correct_predictions = 0
        total_samples = 0
        
        with torch.no_grad():
            progress_bar = tqdm(self.val_loader, desc="Validation")
            
            for inputs, labels in progress_bar:
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                outputs = self.model(inputs)
                loss = self.criterion(outputs, labels)
                
                running_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                total_samples += labels.size(0)
                correct_predictions += (predicted == labels).sum().item()
                
                # Update progress bar
                current_accuracy = 100 * correct_predictions / total_samples
                progress_bar.set_postfix({
                    'Loss': f'{loss.item():.4f}',
                    'Acc': f'{current_accuracy:.2f}%'
                })
        
        epoch_loss = running_loss / len(self.val_loader)
        epoch_accuracy = 100 * correct_predictions / total_samples
        
        return epoch_loss, epoch_accuracy
    
    def train(self, num_epochs, save_dir='../models', save_best=True):
        best_val_accuracy = 0.0
        best_model_wts = copy.deepcopy(self.model.state_dict())
        
        # Create save directory
        os.makedirs(save_dir, exist_ok=True)
        
        print(f"Starting training for {num_epochs} epochs...")
        print(f"Model parameters: {count_parameters(self.model):,}")
        
        for epoch in range(num_epochs):
            print(f'\nEpoch {epoch+1}/{num_epochs}')
            print('-' * 50)
            
            # Training phase
            train_loss, train_accuracy = self.train_epoch()
            
            # Validation phase
            val_loss, val_accuracy = self.validate_epoch()
            
            # Store metrics
            self.train_losses.append(train_loss)
            self.val_losses.append(val_loss)
            self.train_accuracies.append(train_accuracy)
            self.val_accuracies.append(val_accuracy)
            
            # Learning rate scheduling
            if self.scheduler:
                if isinstance(self.scheduler, ReduceLROnPlateau):
                    self.scheduler.step(val_loss)
                else:
                    self.scheduler.step()
                self.learning_rates.append(self.optimizer.param_groups[0]['lr'])
            
            print(f'Train Loss: {train_loss:.4f}, Train Acc: {train_accuracy:.2f}%')
            print(f'Val Loss: {val_loss:.4f}, Val Acc: {val_accuracy:.2f}%')
            
            if self.scheduler:
                print(f'Learning Rate: {self.optimizer.param_groups[0]["lr"]:.6f}')
            
            # Save best model
            if save_best and val_accuracy > best_val_accuracy:
                best_val_accuracy = val_accuracy
                best_model_wts = copy.deepcopy(self.model.state_dict())
                torch.save({
                    'epoch': epoch + 1,
                    'model_state_dict': best_model_wts,
                    'optimizer_state_dict': self.optimizer.state_dict(),
                    'best_val_accuracy': best_val_accuracy,
                    'train_losses': self.train_losses,
                    'val_losses': self.val_losses,
                    'train_accuracies': self.train_accuracies,
                    'val_accuracies': self.val_accuracies,
                }, os.path.join(save_dir, 'best_model.pth'))
                print(f'New best model saved! Val Accuracy: {best_val_accuracy:.2f}%')
        
        # Load best model weights
        self.model.load_state_dict(best_model_wts)
        
        return self.model
    
    def plot_training_history(self, save_path=None):
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
        
        # Loss plot
        ax1.plot(self.train_losses, label='Train Loss', color='blue')
        ax1.plot(self.val_losses, label='Validation Loss', color='red')
        ax1.set_title('Training and Validation Loss')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Loss')
        ax1.legend()
        ax1.grid(True)
        
        # Accuracy plot
        ax2.plot(self.train_accuracies, label='Train Accuracy', color='blue')
        ax2.plot(self.val_accuracies, label='Validation Accuracy', color='red')
        ax2.set_title('Training and Validation Accuracy')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Accuracy (%)')
        ax2.legend()
        ax2.grid(True)
        
        # Learning rate plot
        if self.learning_rates:
            ax3.plot(self.learning_rates, color='green')
            ax3.set_title('Learning Rate Schedule')
            ax3.set_xlabel('Epoch')
            ax3.set_ylabel('Learning Rate')
            ax3.set_yscale('log')
            ax3.grid(True)
        
        # Combined loss and accuracy
        ax4_twin = ax4.twinx()
        ax4.plot(self.train_losses, label='Train Loss', color='blue', alpha=0.7)
        ax4.plot(self.val_losses, label='Val Loss', color='red', alpha=0.7)
        ax4_twin.plot(self.train_accuracies, label='Train Acc', color='blue', linestyle='--')
        ax4_twin.plot(self.val_accuracies, label='Val Acc', color='red', linestyle='--')
        
        ax4.set_xlabel('Epoch')
        ax4.set_ylabel('Loss')
        ax4_twin.set_ylabel('Accuracy (%)')
        ax4.set_title('Combined Loss and Accuracy')
        ax4.grid(True)
        
        # Combine legends
        lines1, labels1 = ax4.get_legend_handles_labels()
        lines2, labels2 = ax4_twin.get_legend_handles_labels()
        ax4.legend(lines1 + lines2, labels1 + labels2, loc='center right')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

def train_sports_classifier(
    csv_file='../archive/sports.csv',
    root_dir='../archive',
    model_name='resnet50',
    num_epochs=20,
    batch_size=32,
    learning_rate=0.001,
    image_size=224,
    pretrained=True,
    save_dir='../models'
):
    """
    Main training function for sports classifier
    """
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Create data loaders
    data_info = create_data_loaders(
        csv_file=csv_file,
        root_dir=root_dir,
        batch_size=batch_size,
        image_size=image_size,
        num_workers=4
    )
    
    train_loader = data_info['train_loader']
    val_loader = data_info['val_loader']
    train_dataset = data_info['train_dataset']
    
    # Create model
    num_classes = train_dataset.num_classes
    model = create_model(model_name=model_name, num_classes=num_classes, pretrained=pretrained)
    model = model.to(device)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    
    # Learning rate scheduler
    scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3)
    
    # Create trainer
    trainer = Trainer(model, train_loader, val_loader, criterion, optimizer, device, scheduler)
    
    # Train the model
    best_model = trainer.train(num_epochs=num_epochs, save_dir=save_dir)
    
    # Plot training history
    trainer.plot_training_history(save_path=os.path.join(save_dir, 'training_history.png'))
    
    # Save training configuration
    config = {
        'model_name': model_name,
        'num_classes': num_classes,
        'num_epochs': num_epochs,
        'batch_size': batch_size,
        'learning_rate': learning_rate,
        'image_size': image_size,
        'pretrained': pretrained,
        'final_train_accuracy': trainer.train_accuracies[-1],
        'final_val_accuracy': trainer.val_accuracies[-1],
        'best_val_accuracy': max(trainer.val_accuracies)
    }
    
    with open(os.path.join(save_dir, 'config.json'), 'w') as f:
        json.dump(config, f, indent=4)
    
    print(f"\nTraining completed!")
    print(f"Best validation accuracy: {max(trainer.val_accuracies):.2f}%")
    print(f"Model saved to: {save_dir}")
    
    return best_model, trainer

if __name__ == "__main__":
    # Example usage
    model, trainer = train_sports_classifier(
        model_name='resnet50',
        num_epochs=10,
        batch_size=32,
        learning_rate=0.001
    )