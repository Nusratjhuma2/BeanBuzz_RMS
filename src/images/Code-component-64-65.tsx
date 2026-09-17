# Product Images Directory

This directory contains all product images for the BeanBuzz Restaurant Management System.

## Structure

The images are organized by categories:

- `/burgers/` - Burger product images
- `/pizzas/` - Pizza product images  
- `/coffee/` - Coffee and beverage images
- `/pasta/` - Pasta dish images
- `/desserts/` - Dessert images
- `/sides/` - Side dish images
- `/drinks/` - Cold drink images

## Image Guidelines

- **Format**: JPG or PNG preferred
- **Size**: Minimum 800x600px for quality display
- **Aspect Ratio**: 16:9 recommended for consistency
- **File Naming**: Use lowercase with hyphens (e.g., `classic-beef-burger.jpg`)
- **File Size**: Keep under 500KB for optimal loading

## XAMPP Implementation

When implementing in XAMPP, update the menu database table with the relative image paths:

```sql
UPDATE menu_items SET image = '/images/burgers/classic-beef-burger.jpg' WHERE name = 'Classic Beef Burger';
```

## Current Images (from Unsplash for React version)

The React version currently uses Unsplash URLs for product images. When migrating to XAMPP, download and store these images locally in this directory structure.