import torch
import torch.nn as nn
import torchvision.models as models
from efficientnet_pytorch import EfficientNet

class SportsClassifier(nn.Module):
    def __init__(self, num_classes=100, model_name='resnet50', pretrained=True, dropout_rate=0.5):
        """
        Sports classification model
        
        Args:
            num_classes (int): Number of output classes
            model_name (str): Base model architecture ('resnet50', 'efficientnet-b0', 'vgg16', etc.)
            pretrained (bool): Whether to use pretrained weights
            dropout_rate (float): Dropout rate for regularization
        """
        super(SportsClassifier, self).__init__()
        self.num_classes = num_classes
        self.model_name = model_name
        self.dropout_rate = dropout_rate
        
        # Initialize dropout first, before creating backbone
        self.dropout = nn.Dropout(dropout_rate)
        
        if 'efficientnet' in model_name.lower():
            self.backbone = self._create_efficientnet(model_name, pretrained)
        elif 'resnet' in model_name.lower():
            self.backbone = self._create_resnet(model_name, pretrained)
        elif 'vgg' in model_name.lower():
            self.backbone = self._create_vgg(model_name, pretrained)
        else:
            raise ValueError(f"Unsupported model: {model_name}")
        
    def _create_efficientnet(self, model_name, pretrained):
        if pretrained:
            model = EfficientNet.from_pretrained(model_name, num_classes=self.num_classes)
        else:
            model = EfficientNet.from_name(model_name, num_classes=self.num_classes)
        return model
    
    def _create_resnet(self, model_name, pretrained):
        if model_name == 'resnet18':
            model = models.resnet18(pretrained=pretrained)
        elif model_name == 'resnet34':
            model = models.resnet34(pretrained=pretrained)
        elif model_name == 'resnet50':
            model = models.resnet50(pretrained=pretrained)
        elif model_name == 'resnet101':
            model = models.resnet101(pretrained=pretrained)
        else:
            raise ValueError(f"Unsupported ResNet variant: {model_name}")
        
        # Replace the final layer
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(self.dropout.p),
            nn.Linear(num_features, self.num_classes)
        )
        return model
    
    def _create_vgg(self, model_name, pretrained):
        if model_name == 'vgg16':
            model = models.vgg16(pretrained=pretrained)
        elif model_name == 'vgg19':
            model = models.vgg19(pretrained=pretrained)
        else:
            raise ValueError(f"Unsupported VGG variant: {model_name}")
        
        # Replace the final classifier
        num_features = model.classifier[6].in_features
        model.classifier[6] = nn.Linear(num_features, self.num_classes)
        return model
    
    def forward(self, x):
        return self.backbone(x)

class CustomCNN(nn.Module):
    """
    Simple custom CNN for sports classification
    """
    def __init__(self, num_classes=100, input_channels=3):
        super(CustomCNN, self).__init__()
        
        self.features = nn.Sequential(
            # Block 1
            nn.Conv2d(input_channels, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Block 2
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Block 3
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Block 4
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        self.avgpool = nn.AdaptiveAvgPool2d((7, 7))
        
        self.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(4096, num_classes),
        )
        
    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

def create_model(model_name='resnet50', num_classes=100, pretrained=True):
    """
    Factory function to create models
    
    Args:
        model_name (str): Model architecture name
        num_classes (int): Number of output classes
        pretrained (bool): Whether to use pretrained weights
    
    Returns:
        torch.nn.Module: Created model
    """
    if model_name == 'custom_cnn':
        return CustomCNN(num_classes=num_classes)
    else:
        return SportsClassifier(num_classes=num_classes, model_name=model_name, pretrained=pretrained)

def count_parameters(model):
    """Count the number of trainable parameters in a model"""
    return sum(p.numel() for p in model.parameters() if p.requires_grad)

def freeze_backbone(model, freeze=True):
    """
    Freeze/unfreeze the backbone of a pretrained model for transfer learning
    
    Args:
        model: The model to modify
        freeze (bool): Whether to freeze (True) or unfreeze (False) the backbone
    """
    if hasattr(model, 'backbone'):
        for param in model.backbone.parameters():
            param.requires_grad = not freeze
    else:
        # For custom models, freeze all but the last layer
        layers = list(model.children())
        for layer in layers[:-1]:
            for param in layer.parameters():
                param.requires_grad = not freeze