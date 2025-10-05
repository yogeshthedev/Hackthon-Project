# Library Search Lite

A simple, accessible library search application with bookmarking and theme switching.

## Features

- **Search** books by title, author, or tags
- **Filter** by tags using dropdown
- **Bookmark** favorite books (saved locally)
- **Dark/Light theme** toggle
- **Responsive design** for all devices
- **Keyboard accessible** with screen reader support

## Getting Started

1. Open `index.html` in your web browser
2. Or serve locally:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Files

- `index.html` - Main page layout
- `style.css` - Styling and themes
- `script.js` - Search, bookmark, and theme functionality
- `books.json` - Sample book data (10 books)

## Usage

- **Search**: Type in the search box to find books
- **Filter**: Use the tag dropdown to filter by category
- **Bookmark**: Click the bookmark button on any book
- **Theme**: Click the moon/sun icon to switch themes
- **Mobile**: Use the hamburger menu on mobile devices

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+


## ✨ Features

### 🔍 **Search & Filter**
- **Real-time search** by title, author, or tags
- **Tag-based filtering** with dropdown selection
- **Instant results** with live search updates
- **Clear filters** button to reset all search criteria

### 🔖 **Bookmark Management**
- **Persistent bookmarks** using localStorage
- **Visual feedback** for bookmarked items
- **Bookmark-only view** to show saved books
- **Export functionality** to download bookmarks as JSON
- **Clear all bookmarks** with confirmation dialog

### 🎨 **Theme System**
- **Light & Dark themes** with seamless switching
- **Persistent theme preference** saved locally
- **High contrast ratios** meeting WCAG guidelines
- **Smooth transitions** between themes

### ♿ **Accessibility Features**
- **WCAG 2.1 AA compliant** design
- **Keyboard navigation** for all interactive elements
- **Screen reader support** with proper ARIA labels
- **Focus indicators** for keyboard users
- **Skip navigation** link for screen readers
- **Semantic HTML** structure

### 📱 **Responsive Design**
- **Mobile-first** approach
- **Touch-friendly** interface on mobile devices
- **Responsive breakpoints** for tablet and desktop
- **Flexible layouts** adapting to screen size

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone or download** the project files:
   ```bash
   git clone <repository-url>
   cd library-search-lite
   ```

2. **Open in browser** (choose one method):
   
   **Option A: Direct file access**
   ```bash
   # Open index.html directly in your browser
   open index.html
   ```
   
   **Option B: Local server (recommended)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then navigate to `http://localhost:8000`

3. **Start exploring** the library collection!

## 📁 Project Structure

```
library-search-lite/
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS with theme support
├── script.js           # JavaScript functionality
├── books.json          # Sample book dataset (10 items)
└── README.md           # This file
```
