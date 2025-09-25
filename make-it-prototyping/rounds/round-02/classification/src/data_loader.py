import os
import pandas as pd
import numpy as np
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt

class SportsDataset(Dataset):
    def __init__(self, csv_file, root_dir, transform=None, split='train'):
        """
        Sports dataset loader
        
        Args:
            csv_file (str): Path to the CSV file with annotations
            root_dir (str): Directory with all the images
            transform (callable, optional): Optional transform to be applied on a sample
            split (str): Dataset split - 'train', 'valid', or 'test'
        """
        self.sports_frame = pd.read_csv(csv_file)
        self.sports_frame = self.sports_frame[self.sports_frame['data set'] == split]
        self.root_dir = root_dir
        self.transform = transform
        
        # Create label encoder
        self.label_encoder = LabelEncoder()
        self.sports_frame['encoded_labels'] = self.label_encoder.fit_transform(self.sports_frame['labels'])
        self.num_classes = len(self.label_encoder.classes_)
        
    def __len__(self):
        return len(self.sports_frame)
    
    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()
            
        img_path = os.path.join(self.root_dir, self.sports_frame.iloc[idx]['filepaths'])
        image = Image.open(img_path).convert('RGB')
        label = self.sports_frame.iloc[idx]['encoded_labels']
        
        if self.transform:
            image = self.transform(image)
            
        return image, label
    
    def get_class_names(self):
        return self.label_encoder.classes_
    
    def get_class_distribution(self):
        """Return class distribution for the current split"""
        return self.sports_frame['labels'].value_counts()

def get_transforms(image_size=224, augment=True):
    """
    Get data transforms for training and validation
    
    Args:
        image_size (int): Target image size
        augment (bool): Whether to apply data augmentation
    
    Returns:
        dict: Dictionary containing train and val transforms
    """
    if augment:
        train_transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    else:
        train_transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    val_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return {'train': train_transform, 'val': val_transform}

def create_data_loaders(csv_file, root_dir, batch_size=32, image_size=224, num_workers=4):
    """
    Create data loaders for train, validation, and test sets
    
    Args:
        csv_file (str): Path to CSV file
        root_dir (str): Root directory containing images
        batch_size (int): Batch size for data loaders
        image_size (int): Target image size
        num_workers (int): Number of workers for data loading
    
    Returns:
        dict: Dictionary containing data loaders and datasets
    """
    transforms_dict = get_transforms(image_size=image_size)
    
    # Create datasets
    train_dataset = SportsDataset(csv_file, root_dir, transform=transforms_dict['train'], split='train')
    val_dataset = SportsDataset(csv_file, root_dir, transform=transforms_dict['val'], split='valid')
    test_dataset = SportsDataset(csv_file, root_dir, transform=transforms_dict['val'], split='test')
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    
    return {
        'train_loader': train_loader,
        'val_loader': val_loader,
        'test_loader': test_loader,
        'train_dataset': train_dataset,
        'val_dataset': val_dataset,
        'test_dataset': test_dataset
    }

def visualize_batch(data_loader, class_names, num_images=8):
    """
    Visualize a batch of images with their labels
    
    Args:
        data_loader: PyTorch data loader
        class_names: List of class names
        num_images: Number of images to display
    """
    dataiter = iter(data_loader)
    images, labels = next(dataiter)
    
    # Denormalize images for visualization
    mean = torch.tensor([0.485, 0.456, 0.406])
    std = torch.tensor([0.229, 0.224, 0.225])
    
    fig, axes = plt.subplots(2, 4, figsize=(15, 8))
    axes = axes.ravel()
    
    for i in range(min(num_images, len(images))):
        img = images[i]
        # Denormalize
        for t, m, s in zip(img, mean, std):
            t.mul_(s).add_(m)
        img = torch.clamp(img, 0, 1)
        
        axes[i].imshow(img.permute(1, 2, 0))
        axes[i].set_title(f'Label: {class_names[labels[i]]}')
        axes[i].axis('off')
    
    plt.tight_layout()
    plt.show()