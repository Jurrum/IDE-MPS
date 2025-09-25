import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    accuracy_score, precision_recall_fscore_support,
    top_k_accuracy_score
)
import pandas as pd
from tqdm import tqdm
import os
import json
from collections import defaultdict

from .data_loader import create_data_loaders
from .model import create_model

class ModelEvaluator:
    def __init__(self, model, test_loader, device, class_names):
        self.model = model
        self.test_loader = test_loader
        self.device = device
        self.class_names = class_names
        self.predictions = []
        self.true_labels = []
        self.prediction_probs = []
        
    def evaluate(self):
        """Evaluate the model on test data"""
        self.model.eval()
        
        all_predictions = []
        all_labels = []
        all_probs = []
        
        with torch.no_grad():
            progress_bar = tqdm(self.test_loader, desc="Evaluating")
            
            for inputs, labels in progress_bar:
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                outputs = self.model(inputs)
                probabilities = torch.softmax(outputs, dim=1)
                _, predictions = torch.max(outputs, 1)
                
                all_predictions.extend(predictions.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
                all_probs.extend(probabilities.cpu().numpy())
                
                # Update progress bar with current accuracy
                current_acc = accuracy_score(all_labels, all_predictions)
                progress_bar.set_postfix({'Accuracy': f'{current_acc:.4f}'})
        
        self.predictions = np.array(all_predictions)
        self.true_labels = np.array(all_labels)
        self.prediction_probs = np.array(all_probs)
        
        return self.predictions, self.true_labels, self.prediction_probs
    
    def compute_metrics(self):
        """Compute various evaluation metrics"""
        metrics = {}
        
        # Basic metrics
        metrics['accuracy'] = accuracy_score(self.true_labels, self.predictions)
        metrics['top_5_accuracy'] = top_k_accuracy_score(
            self.true_labels, self.prediction_probs, k=5, labels=range(len(self.class_names))
        )
        
        # Per-class metrics
        precision, recall, f1, support = precision_recall_fscore_support(
            self.true_labels, self.predictions, average=None
        )
        
        metrics['per_class'] = {
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'support': support
        }
        
        # Macro averages
        metrics['macro_precision'] = np.mean(precision)
        metrics['macro_recall'] = np.mean(recall)
        metrics['macro_f1'] = np.mean(f1)
        
        # Weighted averages
        metrics['weighted_precision'] = np.average(precision, weights=support)
        metrics['weighted_recall'] = np.average(recall, weights=support)
        metrics['weighted_f1'] = np.average(f1, weights=support)
        
        return metrics
    
    def plot_confusion_matrix(self, normalize=True, save_path=None, figsize=(15, 12)):
        """Plot confusion matrix"""
        cm = confusion_matrix(self.true_labels, self.predictions)
        
        if normalize:
            cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
            title = 'Normalized Confusion Matrix'
            fmt = '.2f'
        else:
            title = 'Confusion Matrix'
            fmt = 'd'
        
        plt.figure(figsize=figsize)
        sns.heatmap(cm, annot=False, fmt=fmt, cmap='Blues',
                   xticklabels=self.class_names, yticklabels=self.class_names)
        plt.title(title)
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        plt.xticks(rotation=45, ha='right')
        plt.yticks(rotation=0)
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        return cm
    
    def plot_per_class_metrics(self, save_path=None):
        """Plot per-class precision, recall, and F1-score"""
        metrics = self.compute_metrics()
        
        df = pd.DataFrame({
            'Class': self.class_names,
            'Precision': metrics['per_class']['precision'],
            'Recall': metrics['per_class']['recall'],
            'F1-Score': metrics['per_class']['f1_score'],
            'Support': metrics['per_class']['support']
        })
        
        fig, axes = plt.subplots(2, 2, figsize=(20, 12))
        
        # Precision
        axes[0, 0].bar(range(len(self.class_names)), df['Precision'])
        axes[0, 0].set_title('Per-Class Precision')
        axes[0, 0].set_xlabel('Class')
        axes[0, 0].set_ylabel('Precision')
        axes[0, 0].set_xticks(range(len(self.class_names)))
        axes[0, 0].set_xticklabels(self.class_names, rotation=90)
        
        # Recall
        axes[0, 1].bar(range(len(self.class_names)), df['Recall'])
        axes[0, 1].set_title('Per-Class Recall')
        axes[0, 1].set_xlabel('Class')
        axes[0, 1].set_ylabel('Recall')
        axes[0, 1].set_xticks(range(len(self.class_names)))
        axes[0, 1].set_xticklabels(self.class_names, rotation=90)
        
        # F1-Score
        axes[1, 0].bar(range(len(self.class_names)), df['F1-Score'])
        axes[1, 0].set_title('Per-Class F1-Score')
        axes[1, 0].set_xlabel('Class')
        axes[1, 0].set_ylabel('F1-Score')
        axes[1, 0].set_xticks(range(len(self.class_names)))
        axes[1, 0].set_xticklabels(self.class_names, rotation=90)
        
        # Support
        axes[1, 1].bar(range(len(self.class_names)), df['Support'])
        axes[1, 1].set_title('Per-Class Support (Number of Samples)')
        axes[1, 1].set_xlabel('Class')
        axes[1, 1].set_ylabel('Support')
        axes[1, 1].set_xticks(range(len(self.class_names)))
        axes[1, 1].set_xticklabels(self.class_names, rotation=90)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        return df
    
    def get_top_predictions(self, image_idx, top_k=5):
        """Get top-k predictions for a specific image"""
        if image_idx >= len(self.prediction_probs):
            raise ValueError(f"Image index {image_idx} out of range")
        
        probs = self.prediction_probs[image_idx]
        top_indices = np.argsort(probs)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                'class': self.class_names[idx],
                'probability': probs[idx],
                'class_idx': idx
            })
        
        return results
    
    def analyze_misclassifications(self, top_n=10):
        """Analyze the most common misclassifications"""
        misclassified = self.true_labels != self.predictions
        misclassified_indices = np.where(misclassified)[0]
        
        misclass_pairs = defaultdict(int)
        for idx in misclassified_indices:
            true_class = self.class_names[self.true_labels[idx]]
            pred_class = self.class_names[self.predictions[idx]]
            misclass_pairs[(true_class, pred_class)] += 1
        
        # Sort by frequency
        sorted_pairs = sorted(misclass_pairs.items(), key=lambda x: x[1], reverse=True)
        
        print(f"Top {top_n} most common misclassifications:")
        print("-" * 60)
        for i, ((true_class, pred_class), count) in enumerate(sorted_pairs[:top_n]):
            print(f"{i+1:2d}. {true_class} → {pred_class}: {count} times")
        
        return sorted_pairs[:top_n]
    
    def save_results(self, save_dir, model_name="model"):
        """Save evaluation results to files"""
        os.makedirs(save_dir, exist_ok=True)
        
        metrics = self.compute_metrics()
        
        # Save metrics as JSON
        metrics_serializable = {}
        for key, value in metrics.items():
            if isinstance(value, dict):
                metrics_serializable[key] = {k: v.tolist() if isinstance(v, np.ndarray) else v 
                                           for k, v in value.items()}
            elif isinstance(value, np.ndarray):
                metrics_serializable[key] = value.tolist()
            else:
                metrics_serializable[key] = value
        
        with open(os.path.join(save_dir, f'{model_name}_metrics.json'), 'w') as f:
            json.dump(metrics_serializable, f, indent=4)
        
        # Save classification report
        report = classification_report(self.true_labels, self.predictions, 
                                     target_names=self.class_names, output_dict=True)
        with open(os.path.join(save_dir, f'{model_name}_classification_report.json'), 'w') as f:
            json.dump(report, f, indent=4)
        
        # Save predictions
        results_df = pd.DataFrame({
            'true_label': [self.class_names[label] for label in self.true_labels],
            'predicted_label': [self.class_names[pred] for pred in self.predictions],
            'correct': self.true_labels == self.predictions
        })
        results_df.to_csv(os.path.join(save_dir, f'{model_name}_predictions.csv'), index=False)
        
        print(f"Evaluation results saved to {save_dir}")

def load_and_evaluate_model(
    model_path,
    csv_file='../archive/sports.csv',
    root_dir='../archive',
    model_name='resnet50',
    batch_size=32,
    image_size=224,
    save_dir='../outputs'
):
    """Load a saved model and evaluate it on test data"""
    
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
    
    test_loader = data_info['test_loader']
    train_dataset = data_info['train_dataset']  # For getting class names
    class_names = train_dataset.get_class_names()
    num_classes = len(class_names)
    
    # Load model
    model = create_model(model_name=model_name, num_classes=num_classes, pretrained=False)
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    model = model.to(device)
    
    # Create evaluator and run evaluation
    evaluator = ModelEvaluator(model, test_loader, device, class_names)
    predictions, true_labels, prediction_probs = evaluator.evaluate()
    
    # Compute and display metrics
    metrics = evaluator.compute_metrics()
    
    print("=== Evaluation Results ===")
    print(f"Test Accuracy: {metrics['accuracy']:.4f}")
    print(f"Top-5 Accuracy: {metrics['top_5_accuracy']:.4f}")
    print(f"Macro F1-Score: {metrics['macro_f1']:.4f}")
    print(f"Weighted F1-Score: {metrics['weighted_f1']:.4f}")
    
    # Generate visualizations
    evaluator.plot_confusion_matrix(save_path=os.path.join(save_dir, 'confusion_matrix.png'))
    evaluator.plot_per_class_metrics(save_path=os.path.join(save_dir, 'per_class_metrics.png'))
    
    # Analyze misclassifications
    evaluator.analyze_misclassifications()
    
    # Save results
    evaluator.save_results(save_dir)
    
    return evaluator, metrics

if __name__ == "__main__":
    # Example usage
    model_path = '../models/best_model.pth'
    if os.path.exists(model_path):
        evaluator, metrics = load_and_evaluate_model(model_path)
    else:
        print(f"Model not found at {model_path}. Please train a model first.")
