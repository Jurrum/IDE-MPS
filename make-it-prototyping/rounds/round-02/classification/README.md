# Sports Classification Neural Network

A PyTorch-based image classification project for recognizing 100 different sports from images.

## Project Structure

```
classification/
├── src/
│   ├── data_loader.py      # Data loading and preprocessing utilities
│   ├── model.py           # Neural network model definitions
│   ├── train.py           # Training script and utilities
│   └── evaluate.py        # Model evaluation and metrics
├── models/                # Saved model checkpoints
├── data/                  # Additional data files (if needed)
├── outputs/               # Evaluation results and visualizations
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Dataset

The project uses a sports image dataset with:
- **100 sports classes** (air hockey, archery, basketball, etc.)
- **Train/Validation/Test splits** already provided
- **Images in JPG format** organized by sport type
- **CSV metadata file** with class labels and file paths

## Getting Started

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Data Structure

Ensure your data is structured as follows:
```
archive/
├── sports.csv              # Metadata file
├── train/                 # Training images
│   ├── air hockey/
│   ├── archery/
│   └── ...
├── valid/                 # Validation images
└── test/                  # Test images
```

### 3. Training a Model

```python
from src.train import train_sports_classifier

# Train with ResNet-50 (recommended for beginners)
model, trainer = train_sports_classifier(
    csv_file='../archive/sports.csv',
    root_dir='../archive',
    model_name='resnet50',
    num_epochs=20,
    batch_size=32,
    learning_rate=0.001
)
```

### 4. Available Models

- **ResNet variants**: `resnet18`, `resnet34`, `resnet50`, `resnet101`
- **EfficientNet variants**: `efficientnet-b0` through `efficientnet-b7`
- **VGG variants**: `vgg16`, `vgg19`
- **Custom CNN**: `custom_cnn` (built from scratch)

### 5. Evaluating a Trained Model

```python
from src.evaluate import load_and_evaluate_model

evaluator, metrics = load_and_evaluate_model(
    model_path='../models/best_model.pth',
    csv_file='../archive/sports.csv',
    root_dir='../archive'
)

print(f"Test Accuracy: {metrics['accuracy']:.4f}")
```

## Key Features

### Data Loading (`data_loader.py`)
- Custom PyTorch Dataset class for sports images
- Automatic data augmentation for training
- Support for train/validation/test splits
- Visualization utilities for data exploration

### Model Architecture (`model.py`)
- Multiple pre-trained model support (transfer learning)
- Custom CNN implementation for learning from scratch
- Flexible model factory function
- Parameter counting and backbone freezing utilities

### Training (`train.py`)
- Comprehensive training loop with progress tracking
- Automatic best model saving
- Learning rate scheduling
- Training visualization and metrics logging
- Configurable hyperparameters

### Evaluation (`evaluate.py`)
- Detailed performance metrics (accuracy, precision, recall, F1)
- Top-k accuracy calculation
- Confusion matrix visualization
- Per-class performance analysis
- Misclassification analysis
- Results export to JSON/CSV

## Training Tips

### For Beginners:
1. Start with **ResNet-50** - good balance of performance and speed
2. Use **pretrained=True** for transfer learning (faster convergence)
3. Begin with **10-20 epochs** to see if the model is learning
4. Use **batch_size=32** (adjust based on your GPU memory)

### For Experimentation:
1. Try **EfficientNet-B0** for better efficiency
2. Experiment with learning rates: `0.001`, `0.0001`
3. Add more data augmentation for better generalization
4. Use learning rate scheduling for better convergence

### For Advanced Users:
1. Implement **custom_cnn** to learn from scratch
2. Experiment with different optimizers (SGD, AdamW)
3. Try ensemble methods with multiple models
4. Implement advanced techniques like mixup or cutmix

## Example Training Session

```python
# Quick start with default settings
from src.train import train_sports_classifier

model, trainer = train_sports_classifier(
    num_epochs=10,
    batch_size=16,  # Reduce if GPU memory is limited
    model_name='resnet50'
)

# Visualize training progress
trainer.plot_training_history()
```

## Monitoring Training

The training script provides:
- **Real-time progress bars** with loss and accuracy
- **Automatic model checkpointing** (saves best model)
- **Training history plots** (loss, accuracy, learning rate)
- **Configuration saving** for reproducibility

## Next Steps

1. **Train your first model** with the default settings
2. **Evaluate performance** on the test set
3. **Experiment with different architectures** and hyperparameters
4. **Analyze results** using the confusion matrix and per-class metrics
5. **Try advanced techniques** like ensemble methods or custom architectures

## Common Issues

- **CUDA out of memory**: Reduce batch_size or image_size
- **Slow training**: Ensure you're using GPU (`torch.cuda.is_available()`)
- **Poor performance**: Try transfer learning with pretrained=True
- **Overfitting**: Add more data augmentation or reduce model complexity