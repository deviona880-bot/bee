// Image upload utility for frontend
import axios from 'axios';

/**
 * Upload image to backend (you can later connect to Cloudinary)
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Option 1: Upload to your backend
    // const response = await axios.post('/api/upload', formData);
    // return response.data.url;

    // Option 2: Use local URL (for development)
    return URL.createObjectURL(file);

    // Option 3: Upload to Cloudinary (when configured)
    // const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    // const cloudinaryFormData = new FormData();
    // cloudinaryFormData.append('file', file);
    // cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
    // const response = await axios.post(cloudinaryUrl, cloudinaryFormData);
    // return response.data.secure_url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Get placeholder for missing images
 * @param {string} type - Type of entity (product, blog, team)
 * @returns {string} - Placeholder emoji
 */
export function getImagePlaceholder(type) {
  const placeholders = {
    product: '📦',
    blog: '📰',
    team: '👤',
    category: '🏷️',
    order: '📋'
  };
  return placeholders[type] || '🖼️';
}

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {boolean} - True if valid
 */
export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid image type. Please use JPG, PNG, GIF, or WebP');
  }

  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }

  return true;
}

/**
 * Get image dimensions
 * @param {string} src - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}
