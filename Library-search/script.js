// script.js — Option B (Library Search Lite)
// Requirements:
// - Implement TWO small interactions (e.g., nav toggle + search filter)
// - Optional: Bookmark/Unbookmark using localStorage (bonus)

const STORAGE_KEY = "liblite_bookmarks_v1";
const THEME_STORAGE_KEY = "liblite_theme_v1";
const navToggle = document.getElementById('navToggle');
const themeToggle = document.getElementById('themeToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavList = document.getElementById('mobileNavList');
const q = document.getElementById('q');
const tagFilter = document.getElementById('tagFilter');
const clearBtn = document.getElementById('clearBtn');
const showBookmarksBtn = document.getElementById('showBookmarksBtn');
const list = document.getElementById('bookList');
const stats = document.getElementById('stats');

let allBooks = [];
let currentFilter = {
  search: '',
  tag: '',
  showBookmarksOnly: false
};

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  const themeIcon = document.querySelector('.theme-icon');
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
  } else {
    themeIcon.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);
themeToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleTheme();
  }
});

// Navigation toggle implementation with keyboard support
navToggle.addEventListener('click', toggleNavigation);
navToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleNavigation();
  }
});

// Close mobile nav when clicking overlay
mobileNavOverlay.addEventListener('click', (e) => {
  if (e.target === mobileNavOverlay) {
    closeNavigation();
  }
});

// Close mobile nav when clicking nav links
mobileNavList.addEventListener('click', (e) => {
  if (e.target.classList.contains('mobile-nav-link')) {
    closeNavigation();
  }
});

function toggleNavigation() {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeNavigation();
  } else {
    openNavigation();
  }
}

function openNavigation() {
  navToggle.setAttribute('aria-expanded', 'true');
  mobileNavOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNavigation() {
  navToggle.setAttribute('aria-expanded', 'false');
  mobileNavOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Load books
async function loadBooks() {
  try {
    const res = await fetch('books.json');
    const items = await res.json();
    allBooks = items;
    window.__BOOKS__ = items;
    window.__BM__ = new Set(loadBookmarks());
    
    populateTagFilter(items);
    applyFilters();
  } catch (error) {
    console.error('Failed to load books:', error);
    stats.textContent = 'Failed to load books';
  }
}

function populateTagFilter(books) {
  const allTags = new Set();
  books.forEach(book => {
    book.tags.forEach(tag => allTags.add(tag));
  });
  
  const sortedTags = Array.from(allTags).sort();
  tagFilter.innerHTML = '<option value="">All tags</option>';
  
  sortedTags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

// Enhanced localStorage management for bookmarks
function loadBookmarks() {
  try {
    const bookmarks = localStorage.getItem(STORAGE_KEY);
    if (!bookmarks) {
      return [];
    }
    const parsed = JSON.parse(bookmarks);
    // Ensure we return an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load bookmarks from localStorage:', error);
    return [];
  }
}

function saveBookmarks(bookmarkSet) {
  try {
    const bookmarksArray = Array.from(bookmarkSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarksArray));
    
    // Dispatch custom event for bookmark changes
    window.dispatchEvent(new CustomEvent('bookmarksUpdated', {
      detail: { 
        bookmarks: bookmarksArray,
        count: bookmarksArray.length 
      }
    }));
    
    console.log(`Bookmarks saved: ${bookmarksArray.length} items`);
  } catch (error) {
    console.error('Failed to save bookmarks to localStorage:', error);
    // Show user-friendly error message
    showNotification('Failed to save bookmark. Storage might be full.', 'error');
  }
}

// Get bookmark status for a specific book
function isBookmarked(bookId) {
  return window.__BM__ && window.__BM__.has(bookId);
}

// Add bookmark with validation
function addBookmark(bookId) {
  if (!bookId) {
    console.error('Invalid book ID provided for bookmark');
    return false;
  }
  
  const book = allBooks.find(b => b.id === bookId);
  if (!book) {
    console.error('Book not found:', bookId);
    return false;
  }
  
  window.__BM__.add(bookId);
  saveBookmarks(window.__BM__);
  showNotification(`"${book.title}" added to bookmarks`, 'success');
  return true;
}

// Remove bookmark with validation
function removeBookmark(bookId) {
  if (!bookId) {
    console.error('Invalid book ID provided for bookmark removal');
    return false;
  }
  
  const book = allBooks.find(b => b.id === bookId);
  if (!book) {
    console.error('Book not found:', bookId);
    return false;
  }
  
  window.__BM__.delete(bookId);
  saveBookmarks(window.__BM__);
  showNotification(`"${book.title}" removed from bookmarks`, 'info');
  return true;
}

// Clear all bookmarks with custom confirmation modal
function clearAllBookmarks() {
  if (window.__BM__.size === 0) {
    showNotification('No bookmarks to clear', 'info');
    return;
  }
  
  const count = window.__BM__.size;
  showConfirmDialog(
    'Clear All Bookmarks',
    `Are you sure you want to remove all ${count} bookmarked books?\n\nThis will NOT clear your search filters, only your saved bookmarks.`,
    () => {
      window.__BM__.clear();
      saveBookmarks(window.__BM__);
      applyFilters(); // Refresh the display
      showNotification(`All ${count} bookmarks cleared`, 'info');
    }
  );
}

// Export bookmarks as JSON
function exportBookmarks() {
  const bookmarks = Array.from(window.__BM__);
  const bookmarkData = bookmarks.map(id => {
    const book = allBooks.find(b => b.id === id);
    return book ? {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      tags: book.tags
    } : null;
  }).filter(Boolean);
  
  const dataStr = JSON.stringify(bookmarkData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `library-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showNotification(`Exported ${bookmarkData.length} bookmarks`, 'success');
}

// Custom confirmation dialog
function showConfirmDialog(title, message, onConfirm, onCancel = null) {
  // Remove existing modal if any
  const existingModal = document.querySelector('.confirm-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'confirm-modal-overlay';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  
  modal.innerHTML = `
    <div class="confirm-modal-header">
      <h3 class="confirm-modal-title">${title}</h3>
    </div>
    <div class="confirm-modal-body">
      <p class="confirm-modal-message">${message.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="confirm-modal-footer">
      <button class="btn btn-secondary confirm-cancel">Cancel</button>
      <button class="btn btn-primary confirm-ok">Yes, Clear All</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Add event listeners
  const cancelBtn = modal.querySelector('.confirm-cancel');
  const okBtn = modal.querySelector('.confirm-ok');
  
  const closeModal = () => {
    overlay.classList.add('confirm-modal-fade-out');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
      document.body.style.overflow = '';
    }, 300);
  };
  
  cancelBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });
  
  okBtn.addEventListener('click', () => {
    closeModal();
    onConfirm();
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
      if (onCancel) onCancel();
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus the OK button
  setTimeout(() => okBtn.focus(), 100);
}

// ... existing code ...
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('notification-fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

function bookTemplate(b) {
  const isBookmarked = window.__BM__.has(b.id);
  const pressed = isBookmarked ? 'true' : 'false';
  const bookmarkIcon = isBookmarked ? '★' : '☆';
  const bookmarkText = isBookmarked ? 'Bookmarked' : 'Bookmark';
  const tags = b.tags.map(t => `<span class="tag">${t}</span>`).join(' ');
  
  return `<li class="card">
    <h3>${b.title}</h3>
    <p><strong>${b.author}</strong> • ${b.year}</p>
    <div class="tags-container">${tags}</div>
    <div class="book-actions">
      <button class="bookmark" 
              data-id="${b.id}" 
              data-title="${b.title.replace(/"/g, '&quot;')}"
              aria-pressed="${pressed}" 
              aria-label="${isBookmarked ? 'Remove bookmark from' : 'Bookmark'} ${b.title}">
        <span class="btn-icon">${bookmarkIcon}</span>
        ${bookmarkText}
      </button>
    </div>
  </li>`;
}

function render(items) {
  list.innerHTML = items.map(bookTemplate).join('');
}

function applyFilters() {
  let filteredBooks = allBooks;
  
  // Apply search filter
  if (currentFilter.search) {
    const term = currentFilter.search.toLowerCase();
    filteredBooks = filteredBooks.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.tags.some(t => t.toLowerCase().includes(term))
    );
  }
  
  // Apply tag filter
  if (currentFilter.tag) {
    filteredBooks = filteredBooks.filter(b => 
      b.tags.includes(currentFilter.tag)
    );
  }
  
  // Apply bookmark filter
  if (currentFilter.showBookmarksOnly) {
    filteredBooks = filteredBooks.filter(b => 
      window.__BM__.has(b.id)
    );
  }
  
  render(filteredBooks);
  updateStats(filteredBooks.length, window.__BM__.size);
}

// Event listeners for filtering
q.addEventListener('input', () => {
  currentFilter.search = q.value.trim();
  applyFilters();
});

tagFilter.addEventListener('change', () => {
  currentFilter.tag = tagFilter.value;
  applyFilters();
});

showBookmarksBtn.addEventListener('click', () => {
  currentFilter.showBookmarksOnly = !currentFilter.showBookmarksOnly;
  showBookmarksBtn.setAttribute('aria-pressed', currentFilter.showBookmarksOnly);
  
  const icon = showBookmarksBtn.querySelector('.btn-icon');
  if (currentFilter.showBookmarksOnly) {
    showBookmarksBtn.innerHTML = '<span class="btn-icon">✅</span> Show All';
  } else {
    showBookmarksBtn.innerHTML = '<span class="btn-icon">★</span> My Bookmarks';
  }
  
  applyFilters();
});

// Add bookmark management buttons
function addBookmarkManagementButtons() {
  const actionButtons = document.querySelector('.action-buttons');
  if (!actionButtons) return;
  
  // Clear all bookmarks button (renamed for clarity)
  const clearBookmarksBtn = document.createElement('button');
  clearBookmarksBtn.id = 'clearBookmarksBtn';
  clearBookmarksBtn.className = 'btn btn-secondary';
  clearBookmarksBtn.innerHTML = '<span class="btn-icon">🗑️</span> Clear Bookmarks';
  clearBookmarksBtn.setAttribute('aria-label', 'Clear all bookmarked books');
  clearBookmarksBtn.addEventListener('click', clearAllBookmarks);
  
  // Export bookmarks button
  const exportBookmarksBtn = document.createElement('button');
  exportBookmarksBtn.id = 'exportBookmarksBtn';
  exportBookmarksBtn.className = 'btn btn-secondary';
  exportBookmarksBtn.innerHTML = '<span class="btn-icon">💾</span> Export Bookmarks';
  exportBookmarksBtn.setAttribute('aria-label', 'Export bookmarks as JSON file');
  exportBookmarksBtn.addEventListener('click', exportBookmarks);
  
  actionButtons.appendChild(clearBookmarksBtn);
  actionButtons.appendChild(exportBookmarksBtn);
}

// Listen for bookmark updates to update UI
window.addEventListener('bookmarksUpdated', (event) => {
  const bookmarkCount = event.detail.count;
  
  // Update clear button state
  const clearBtn = document.getElementById('clearBookmarksBtn');
  if (clearBtn) {
    clearBtn.disabled = bookmarkCount === 0;
    clearBtn.style.opacity = bookmarkCount === 0 ? '0.5' : '1';
  }
  
  // Update export button state
  const exportBtn = document.getElementById('exportBookmarksBtn');
  if (exportBtn) {
    exportBtn.disabled = bookmarkCount === 0;
    exportBtn.style.opacity = bookmarkCount === 0 ? '0.5' : '1';
  }
  
  console.log(`Bookmarks updated: ${bookmarkCount} total`);
});

clearBtn.addEventListener('click', () => {
  q.value = "";
  tagFilter.value = "";
  currentFilter = {
    search: '',
    tag: '',
    showBookmarksOnly: false
  };
  showBookmarksBtn.setAttribute('aria-pressed', 'false');
  showBookmarksBtn.innerHTML = '<span class="btn-icon">★</span> My Bookmarks';
  applyFilters();
  q.focus();
});

// Enhanced bookmark toggle functionality
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.bookmark');
  if (!btn) return;
  
  const id = btn.getAttribute('data-id');
  if (!id) {
    console.error('Bookmark button missing data-id attribute');
    return;
  }
  
  const isCurrentlyBookmarked = btn.getAttribute('aria-pressed') === 'true';
  
  if (isCurrentlyBookmarked) {
    if (removeBookmark(id)) {
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span class="btn-icon">☆</span> Bookmark';
      btn.setAttribute('aria-label', `Bookmark ${btn.dataset.title || 'this book'}`);
    }
  } else {
    if (addBookmark(id)) {
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = '<span class="btn-icon">★</span> Bookmarked';
      btn.setAttribute('aria-label', `Remove bookmark from ${btn.dataset.title || 'this book'}`);
    }
  }
  
  // If showing bookmarks only and item was unbookmarked, refresh view
  if (currentFilter.showBookmarksOnly && isCurrentlyBookmarked) {
    applyFilters();
  } else {
    updateStats(document.querySelectorAll('.card').length, window.__BM__.size);
  }
});

function updateStats(shownCount, bookmarkCount = 0) {
  const total = allBooks.length;
  let statsText = `${shownCount} shown / ${total} total`;
  
  if (bookmarkCount > 0) {
    statsText += ` • ${bookmarkCount} bookmarked`;
  }
  
  if (currentFilter.search) {
    statsText += ` • filtered by "${currentFilter.search}"`;
  }
  
  if (currentFilter.tag) {
    statsText += ` • tag: ${currentFilter.tag}`;
  }
  
  if (currentFilter.showBookmarksOnly) {
    statsText += ` • bookmarks only`;
  }
  
  stats.textContent = statsText;
}

loadBooks();

// Initialize theme on page load
initializeTheme();

// Initialize bookmark management buttons
addBookmarkManagementButtons();

// Initial update of bookmark management buttons
window.dispatchEvent(new CustomEvent('bookmarksUpdated', {
  detail: { 
    bookmarks: Array.from(window.__BM__ || []),
    count: (window.__BM__ || new Set()).size
  }
}));
