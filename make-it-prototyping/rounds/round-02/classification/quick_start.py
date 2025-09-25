#!/usr/bin/env python3
"""
Quick start script for sports classification
This script demonstrates how to get started with the project
"""

import os
import sys
import torch

# Add src to path
sys.path.append('src')

from src.train import train_sports_classifier
from src.evaluate import load_and_evaluate_model
from src.data_loader import create_data_loaders, visualize_batch

def main():
    print("=== Sports Classification Quick Start ===\n")
    
    # Check if GPU is available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    if device.type == 'cuda':
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    print()
    
    # Check if data exists
    data_paths = {
        'csv': '../archive/sports.csv',
        'root': '../archive'
    }
    
    for name, path in data_paths.items():
        if os.path.exists(path):
            print(f"[OK] {name.upper()} data found: {path}")
        else:
            print(f"[ERROR] {name.upper()} data NOT found: {path}")
            print("Please ensure your data is in the correct location.")
            return
    
    print("\n=== Data Overview ===")
    
    # Create data loaders to inspect the dataset
    try:
        data_info = create_data_loaders(
            csv_file=data_paths['csv'],
            root_dir=data_paths['root'],
            batch_size=16,
            image_size=224
        )
        
        train_dataset = data_info['train_dataset']
        print(f"Number of classes: {train_dataset.num_classes}")
        print(f"Training samples: {len(train_dataset)}")
        print(f"Validation samples: {len(data_info['val_dataset'])}")
        print(f"Test samples: {len(data_info['test_dataset'])}")
        
        # Show some class names
        class_names = train_dataset.get_class_names()
        print(f"\nFirst 10 classes: {class_names[:10].tolist()}")
        
        # Optionally visualize some samples
        response = input("\nWould you like to visualize some training samples? (y/n): ")
        if response.lower() == 'y':
            visualize_batch(data_info['train_loader'], class_names)
            
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    print("\n=== Training Options ===")
    print("1. Quick training (ResNet-50, 5 epochs) - Recommended for testing")
    print("2. Standard training (ResNet-50, 20 epochs) - Good for real results")
    print("3. Custom training - Choose your own parameters")
    print("4. Skip training and evaluate existing model")
    print("5. Exit")
    
    choice = input("\nEnter your choice (1-5): ")
    
    if choice == '1':
        print("\n=== Quick Training ===")
        model, trainer = train_sports_classifier(
            csv_file=data_paths['csv'],
            root_dir=data_paths['root'],
            model_name='resnet50',
            num_epochs=5,
            batch_size=32,
            learning_rate=0.001,
            pretrained=True
        )
        
    elif choice == '2':
        print("\n=== Standard Training ===")
        model, trainer = train_sports_classifier(
            csv_file=data_paths['csv'],
            root_dir=data_paths['root'],
            model_name='resnet50',
            num_epochs=20,
            batch_size=32,
            learning_rate=0.001,
            pretrained=True
        )
        
    elif choice == '3':
        print("\n=== Custom Training ===")
        print("Available models: resnet18, resnet50, efficientnet-b0, custom_cnn")
        model_name = input("Model name (default: resnet50): ") or 'resnet50'
        
        try:
            num_epochs = int(input("Number of epochs (default: 10): ") or 10)
            batch_size = int(input("Batch size (default: 32): ") or 32)
            learning_rate = float(input("Learning rate (default: 0.001): ") or 0.001)
        except ValueError:
            print("Invalid input. Using default values.")
            num_epochs, batch_size, learning_rate = 10, 32, 0.001
        
        model, trainer = train_sports_classifier(
            csv_file=data_paths['csv'],
            root_dir=data_paths['root'],
            model_name=model_name,
            num_epochs=num_epochs,
            batch_size=batch_size,
            learning_rate=learning_rate,
            pretrained=True
        )
        
    elif choice == '4':
        print("\n=== Model Evaluation ===")
        model_path = '../models/best_model.pth'
        
        if os.path.exists(model_path):
            try:
                evaluator, metrics = load_and_evaluate_model(
                    model_path=model_path,
                    csv_file=data_paths['csv'],
                    root_dir=data_paths['root']
                )
                print("\n=== Final Results ===")
                print(f"Test Accuracy: {metrics['accuracy']:.4f}")
                print(f"Top-5 Accuracy: {metrics['top_5_accuracy']:.4f}")
                print(f"Macro F1-Score: {metrics['macro_f1']:.4f}")
                
            except Exception as e:
                print(f"Error evaluating model: {e}")
        else:
            print(f"No trained model found at {model_path}")
            print("Please train a model first.")
            
    elif choice == '5':
        print("Goodbye!")
        return
        
    else:
        print("Invalid choice. Exiting.")
        return
    
    # If training was performed, ask about evaluation
    if choice in ['1', '2', '3']:
        response = input("\nWould you like to evaluate the trained model on test data? (y/n): ")
        if response.lower() == 'y':
            try:
                evaluator, metrics = load_and_evaluate_model(
                    model_path='../models/best_model.pth',
                    csv_file=data_paths['csv'],
                    root_dir=data_paths['root']
                )
                print("\n=== Final Results ===")
                print(f"Test Accuracy: {metrics['accuracy']:.4f}")
                print(f"Top-5 Accuracy: {metrics['top_5_accuracy']:.4f}")
                print(f"Macro F1-Score: {metrics['macro_f1']:.4f}")
                
            except Exception as e:
                print(f"Error evaluating model: {e}")
    
    print("\n=== Next Steps ===")
    print("1. Check the 'models/' folder for saved models")
    print("2. Review 'outputs/' folder for evaluation results")
    print("3. Experiment with different model architectures")
    print("4. Try adjusting hyperparameters for better performance")
    print("5. Read the README.md for more detailed information")

if __name__ == "__main__":
    main()