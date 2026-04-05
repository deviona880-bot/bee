# 🎨 Frontend Code Complete Index

## Project Structure
```
frontend/
├── app/
│   ├── layout.js                    # Root layout with Header & Footer
│   ├── page.js                      # Homepage
│   ├── about/page.js                # About page
│   ├── services/page.js             # Services with query filtering
│   ├── products/page.js             # Product listing with filters
│   ├── products/[id]/page.js        # Product details
│   ├── blog/page.js                 # Blog listing
│   ├── contact/page.js              # Contact form
│   ├── cart/page.js                 # Shopping cart
│   ├── checkout/page.js             # Checkout page
│   ├── login/page.js                # Login page
│   ├── register/page.js             # Registration page
│   └── admin/
│       ├── layout.js                # Admin sidebar layout
│       ├── page.js                  # Dashboard
│       ├── products/page.js         # Product management
│       ├── categories/page.js       # Category management
│       ├── orders/page.js           # Order management
│       ├── users/page.js            # User management
│       ├── blog/page.js             # Blog management
│       ├── contact/page.js          # Contact messages
│       └── team/page.js             # Team management
├── components/
│   ├── Header.jsx                   # Navigation header
│   ├── Footer.jsx                   # Footer
│   └── ImageUpload.jsx              # Image upload component
├── lib/
│   ├── apiClient.js                 # Axios instance with JWT
│   └── imageHelper.js               # Image handling utilities
├── globals.css                      # Global styles & animations
├── layout.js                        # Root metadata
├── package.json                     # Dependencies
├── .env.example                     # Environment variables
├── next.config.js                   # Next.js configuration
├── jsconfig.json                    # Path alias config
└── postcss.config.js               # CSS processing

## 21 Frontend Pages

### PUBLIC PAGES (10)

#### 1. **Home** (`app/page.js`)
- Hero section with gradient background
- 3 service cards (Travaux, Cosmétiques, Apiculture)
- Featured products grid
- Values section with 3 icons
- CTA call-to-action section
- All in French

```jsx
'use client';
import Link from 'next/link';
import { ArrowRight, Leaf, Sparkles, Beaker } from 'lucide-react';
// Hero with gradient from-primary to-secondary
// Grid layout for desktop/mobile
// Service cards with links
```

---

#### 2. **About** (`app/about/page.js`)
- Company story section
- Mission & Vision in 2-column layout
- Team members loaded from API
- Dynamic team member display

```jsx
'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
// Fetch team from /api/team
// Display team member cards
```

---

#### 3. **Services** (`app/services/page.js`)
- 3 service cards clickable
- Query parameter filtering (?type=...)
- Selected service details with features list
- "Demander un Devis" button
- Includes:
  - Travaux Forestiers
  - Cosmétiques Naturels
  - Produits Apicoles

```jsx
'use client';
import { useSearchParams } from 'next/navigation';
// Check searchParams.get('type')
// Conditional service detail rendering
```

---

#### 4. **Products** (`app/products/page.js`)
- Product grid with pagination
- Search bar with icon
- Category filter dropdown (loads from API)
- Sort dropdown
- Add to cart button
- Products show: name, description, price, stock status

Features:
- Responsive grid (1 → 4 columns)
- Sticky filter bar
- Pagination with page numbers
- localStorage integration

```jsx
'use client';
const [products, setProducts] = useState([]);
const [search, setSearch] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [page, setPage] = useState(1);

const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item._id === product._id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
};
```

---

#### 5. **Product Details** (`app/products/[id]/page.js`)
- Dynamic product page using URL params
- Main product image (placeholder emoji)
- Product gallery grid
- Price and description
- Quantity selector
- Add to cart button with quantity
- Stock status (color-coded)
- Back to products link

```jsx
'use client';
const params = useParams();
const [product, setProduct] = useState(null);
const [quantity, setQuantity] = useState(1);

const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  // Find or create item
  // Update localStorage
};
```

---

#### 6. **Blog** (`app/blog/page.js`)
- Blog article listing with pagination
- Article cards showing: category, title, excerpt, date
- "Lire Plus" links
- Pagination buttons
- 6 articles per page
- Fetches from `/api/blog`

```jsx
'use client';
const [blogs, setBlogs] = useState([]);
const [page, setPage] = useState(1);

// Category badge in primary color
// Date formatted in French locale
```

---

#### 7. **Contact** (`app/contact/page.js`)
- Contact form with fields:
  - Name* (required)
  - Email* (required)
  - Phone (optional)
  - Subject* (required)
  - Message* (required, textarea)
- Contact information displayed:
  - Email (from .env)
  - Phone (from .env)
  - Address (from .env)
- Success message on submit
- Form clears after submission

```jsx
'use client';
const [formData, setFormData] = useState({
  name: '', email: '', phone: '', subject: '', message: ''
});
const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  await apiClient.post('/contact', formData);
  setSubmitted(true);
  setTimeout(() => setSubmitted(false), 5000);
};
```

---

#### 8. **Cart** (`app/cart/page.js`)
- Displays cart items from localStorage
- Item cards showing:
  - Product image (emoji placeholder)
  - Name and description
  - Unit price
  - Quantity controls (+/-)
  - Remove button
- Order Summary on right:
  - Subtotal
  - Shipping (9,99€)
  - Tax (20%)
  - Total
- "Procéder au Paiement" button
- "Continuer votre Shopping" button
- Empty cart message

```jsx
'use client';
const [cart, setCart] = useState([]);

const updateQuantity = (id, quantity) => {
  if (quantity <= 0) {
    removeItem(id);
    return;
  }
  // Update cart and localStorage
};

const calculateTotal = () => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};
```

---

#### 9. **Checkout** (`app/checkout/page.js`)
- Order summary (left side)
- Checkout form (right side):
  - Shipping address textarea
  - Payment method radio buttons:
    - Carte Bancaire
    - Virement Bancaire
    - PayPal
- "Confirmer la Commande" button
- On success: clears cart, redirects to home

```jsx
'use client';
const [cart, setCart] = useState([]);
const [formData, setFormData] = useState({
  shippingAddress: '',
  paymentMethod: 'credit_card'
});

const handleSubmit = async (e) => {
  e.preventDefault();
  const orderData = {
    items: cart.map(item => ({...})),
    totalAmount: calculateTotal() + 9.99,
    shippingAddress: formData.shippingAddress,
    paymentMethod: formData.paymentMethod
  };
  await apiClient.post('/orders', orderData);
  localStorage.removeItem('cart');
  router.push('/');
};
```

---

### AUTHENTICATION PAGES (2)

#### 10. **Login** (`app/login/page.js`)
- Email and password form
- Form validation
- Error message display
- Role-based redirect:
  - Admin users → `/admin`
  - Regular users → `/`
- Link to registration page
- Loading state on button

```jsx
'use client';
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await apiClient.post('/auth/login', formData);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  if (response.data.user.role === 'admin') {
    router.push('/admin');
  } else {
    router.push('/');
  }
};
```

---

#### 11. **Register** (`app/register/page.js`)
- Form fields:
  - Name* (required)
  - Email* (required)
  - Password* (required)
  - Confirm Password* (required)
- Password confirmation validation
- Form validation errors
- Auto-login after registration
- Role-based redirect (same as login)
- Link to login page

```jsx
'use client';
if (formData.password !== formData.confirmPassword) {
  setError('Les mots de passe ne correspondent pas');
  return;
}
// Create user, auto-login, redirect
```

---

### ADMIN PAGES (9)

#### 12. **Admin Layout** (`app/admin/layout.js`)
- Gradient sidebar (primary → secondary color)
- Fixed height with scroll
- Collapsible menu with toggle button
- Menu items with icons (Lucide React):
  - 🏠 Tableau de Bord
  - 📦 Produits
  - 🏷️ Catégories
  - 🛒 Commandes
  - 👥 Utilisateurs
  - 📚 Blog
  - 💬 Messages
  - 👨‍💼 Équipe
- Active page highlighting (left border + bg color)
- Sticky top header with:
  - "Panneau d'Administration" title
  - User name display
  - "Admin" badge
  - Subtitle
- Main content area (full width when menu expanded)
- Logout button in sidebar footer

```jsx
'use client';
const [menuOpen, setMenuOpen] = useState(true);
// Check admin role, redirect non-admin to "/"
// Render sidebar with active route detection
```

---

#### 13. **Admin Dashboard** (`app/admin/page.js`)
- 4 Stat Cards:
  1. Users Total (color: #8B7355) with trend
  2. Produits (color: #D4A574) with count
  3. Commandes (color: #FFB84D) with trend
  4. Messages (color: #6B8E23) with count
- Welcome section:
  - Gradient background (primary → secondary)
  - Welcome message
  - Quick action buttons
- Performance metrics:
  - Delivered orders (CheckCircle icon, green)
  - Processing orders (Clock icon, orange)
  - Pending orders (AlertCircle icon, red)
- Real-time API calls to fetch statistics

```jsx
'use client';
const fetchStats = async () => {
  const [users, products, orders, messages] = await Promise.all([
    apiClient.get('/users'),
    apiClient.get('/products?limit=100'),
    apiClient.get('/orders'),
    apiClient.get('/contact')
  ]);
  // Calculate stats
};

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div style={{ borderColor: color }}>
    // Display icon, value, trend
  </div>
);
```

---

#### 14. **Admin Products** (`app/admin/products/page.js`)
- Left side: Form for adding/editing products
  - Name input
  - Description textarea
  - Price input
  - Category dropdown (loaded from API)
  - Type dropdown (3 options: travaux, cosmétiques, apiculture)
  - Stock input
- Right side: Product table
  - Columns: Name, Type (with emoji), Price, Stock, Actions
  - Stock color-coded:
    - Green if > 5
    - Yellow if 1-5
    - Red if 0
  - Edit button (fills form)
  - Delete button (with confirmation)
- Product count display (top right)
- Success/error messages

```jsx
'use client';
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);

const handleSubmit = async (e) => {
  if (editingId) {
    await apiClient.put(`/products/${editingId}`, formData);
  } else {
    await apiClient.post('/products', formData);
  }
  fetchProducts();
};
```

---

#### 15. **Admin Categories** (`app/admin/categories/page.js`)
- Left side: Category form
  - Name input
  - Slug input
  - Description textarea
  - Add/Update/Cancel buttons
- Right side: Categories table
  - Columns: Name, Slug, Actions
  - Edit and Delete buttons
- Real-time table updates

```jsx
'use client';
const [categories, setCategories] = useState([]);

// CRUD operations for categories
```

---

#### 16. **Admin Orders** (`app/admin/orders/page.js`)
- Table showing all orders:
  - Order ID (truncated)
  - Customer name (from userId)
  - Total amount (formatted with €)
  - Status dropdown (pending → processing → shipped → delivered → cancelled)
  - Order date (French locale)
  - Details button
- Status updates happen on dropdown change
- Real-time status synchronization

```jsx
'use client';
const updateStatus = async (id, status) => {
  await apiClient.put(`/orders/${id}/status`, { status });
  fetchOrders();
};
```

---

#### 17. **Admin Users** (`app/admin/users/page.js`)
- User list table showing:
  - User name
  - Email
  - Role (user/admin)
  - Delete button (with confirmation)
- Delete functionality with API call

```jsx
'use client';
// GET /users for admin view
// DELETE /users/:id with confirmation
```

---

#### 18. **Admin Blog** (`app/admin/blog/page.js`)
- Left side: Blog post form
  - Title input
  - Slug input
  - Excerpt textarea
  - Content textarea (large)
  - Category input
  - Published checkbox toggle
  - Add/Update/Cancel buttons
- Right side: Blog posts table
  - Columns: Title, Category, Status (Published/Draft), Actions
  - Edit and Delete buttons
  - Published status indicator

```jsx
'use client';
const [formData, setFormData] = useState({
  title: '', slug: '', excerpt: '', content: '', category: '', published: false
});

// CRUD for blog posts
```

---

#### 19. **Admin Contact** (`app/admin/contact/page.js`)
- Contact messages inbox (main area)
- Table showing:
  - Sender name
  - Subject
  - Status (New/Read/Responded)
  - Date
  - View button
- Click to see message details:
  - Full message content
  - Sender email
  - Sender phone
  - Status dropdown to update
  - Delete button

```jsx
'use client';
const [messages, setMessages] = useState([]);
const [selectedMessage, setSelectedMessage] = useState(null);

// GET /contact for messages
// PUT /contact/:id/status to update
// DELETE /contact/:id to remove
```

---

#### 20. **Admin Team** (`app/admin/team/page.js`)
- Form for managing team members:
  - Name
  - Role/Position
  - Bio
  - Email
  - Phone
- Team display showing:
  - Member cards with info
  - Edit and Delete buttons
- CRUD operations

```jsx
'use client';
// GET /team
// POST /team (add member)
// PUT /team/:id (update)
// DELETE /team/:id (delete)
```

---

## COMPONENTS (3)

### 1. Header Component (`components/Header.jsx`)
```jsx
'use client';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const cart = localStorage.getItem('cart');
    // Load from localStorage
  }, []);

  return (
    <header>
      {/* Logo */}
      {/* Desktop Navigation */}
      {/* Cart Icon Badge */}
      {/* User Menu with Logout */}
      {/* Mobile Menu Toggle */}
    </header>
  );
}
```

**Features:**
- Sticky positioning (top-0 z-50)
- Logo/brand name
- Navigation links
- Cart icon with count badge
- User profile / Logout button
- Mobile hamburger menu
- Responsive design

---

### 2. Footer Component (`components/Footer.jsx`)
```jsx
'use client';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const address = process.env.NEXT_PUBLIC_ADDRESS;

  return (
    <footer>
      {/* 4-column grid */}
      {/* Social Links */}
      {/* Copyright */}
    </footer>
  );
}
```

**Features:**
- Company info section
- Quick links
- Services links
- Contact info (email, phone, address)
- Social media icons
- Copyright notice
- Uses environment variables for contact info

---

### 3. ImageUpload Component (`components/ImageUpload.jsx`)
```jsx
'use client';
import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { uploadImage, validateImageFile, getImagePlaceholder } from '@/lib/imageHelper';

export default function ImageUpload({
  onUpload,
  placeholder = 'product',
  currentImage = null,
  label = 'Image'
}) {
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file); // Check type and size

      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const imageUrl = await uploadImage(file);
      onUpload(imageUrl); // Pass URL to parent
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUpload(null);
  };

  return (
    <div>
      {/* Preview area */}
      {/* File input */}
      {/* Upload button */}
      {/* Error/Success messages */}
      {/* File info */}
    </div>
  );
}
```

**Features:**
- File validation (JPG, PNG, GIF, WebP)
- Max file size: 5MB
- Preview display
- Drag/drop ready
- Error handling
- Success notification
- Placeholder emojis by type
- Clear image button

---

## UTILITIES (2)

### 1. API Client (`lib/apiClient.js`)
```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Interceptor - Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

### 2. Image Helper (`lib/imageHelper.js`)
```javascript
import axios from 'axios';

// Upload image to backend or Cloudinary
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Option 1: Backend upload
  // const response = await axios.post('/api/upload', formData);
  // return response.data.url;

  // Option 2: Local URL (development)
  return URL.createObjectURL(file);

  // Option 3: Cloudinary (production)
  // Upload to Cloudinary
}

// Get emoji placeholder by type
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

// Validate image file
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

// Get image dimensions
export function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}
```

---

## STYLING

### Global Styles (`app/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-in { animation: fadeIn 0.6s ease-in-out; }
.slide-up { animation: slideUp 0.6s ease-in-out; }

/* Button Styles */
.btn {
  @apply px-6 py-3 rounded-lg font-semibold transition;
}

.btn-primary {
  @apply btn bg-primary text-white hover:bg-opacity-90;
}

.btn-secondary {
  @apply btn bg-secondary text-white hover:bg-opacity-90;
}

.btn-accent {
  @apply btn bg-accent text-black hover:bg-opacity-90;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
```

---

## CONFIGURATION

### Environment Variables (`.env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=Naturel & Abeilles
NEXT_PUBLIC_CONTACT_EMAIL=contact@naturel-abeilles.fr
NEXT_PUBLIC_PHONE=+33 1 23 45 67 89
NEXT_PUBLIC_ADDRESS=123 Rue de la Nature, 75000 Paris, France
```

---

### Next.js Config (`next.config.js`)
```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
```

---

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## STATE MANAGEMENT

**localStorage Usage:**
- **cart:** Stores shopping cart items
  ```javascript
  localStorage.getItem('cart'); // Returns JSON array
  localStorage.setItem('cart', JSON.stringify(cartArray));
  ```

- **token:** JWT authentication token
  ```javascript
  localStorage.getItem('token');
  localStorage.setItem('token', jwtToken);
  ```

- **user:** Currently logged-in user info
  ```javascript
  localStorage.getItem('user'); // Returns JSON
  localStorage.setItem('user', JSON.stringify(userData));
  ```

---

## KEY FEATURES

✅ **Responsive Design:** Mobile-first approach
✅ **French Language:** All UI text in French
✅ **Role-Based Access:** Admin dashboard protection
✅ **JWT Authentication:** Automatic token management
✅ **Shopping Cart:** localStorage persistence
✅ **Real-time Updates:** API integration
✅ **Image Handling:** Validation & preview
✅ **Form Validation:** Client-side checks
✅ **Error Handling:** User-friendly messages
✅ **Animations:** Smooth transitions & fade-ins

---

## TOTALS

- **Pages:** 21 (10 public + 2 auth + 9 admin)
- **Components:** 3 (Header, Footer, ImageUpload)
- **Utilities:** 2 (apiClient, imageHelper)
- **Files:** ~28 total source files
- **API Integrations:** 20+ endpoints
- **Responsive Breakpoints:** Mobile, Tablet, Desktop
