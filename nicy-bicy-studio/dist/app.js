import { books } from './catalog.js';

const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = 'nicy-bicy-shelf-v1';
const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
const knownIds = new Set(books.map((book) => book.id));
let storageAvailable = true;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter((id) => knownIds.has(id)));
} catch { storageAvailable = false; }

let category = 'All books';
let query = '';
let sort = 'featured';
let activeBook = null;
let returnFocus = null;
let toastTimer;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function categoryName(book) {
  return book.category?.trim() || 'Books';
}

function renderFilters() {
  const categories = ['All books', ...new Set(books.map(categoryName))]
    .filter((name, index) => index === 0 || (name !== 'All books' && name !== 'Saved'));
  const buttons = categories.map((name) => {
    const button = element('button', 'filter', name);
    button.type = 'button';
    button.dataset.category = name;
    button.setAttribute('aria-pressed', name === category);
    return button;
  });
  const shelf = element('button', 'filter saved-filter', 'Your shelf ');
  shelf.type = 'button';
  shelf.dataset.category = 'Saved';
  shelf.setAttribute('aria-pressed', category === 'Saved');
  shelf.append(element('span', 'saved-count', saved.size));
  $('.filters').replaceChildren(...buttons, shelf);
}

function bookmarkIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', 'M6 3h12v18l-6-4-6 4Z');
  svg.append(path);
  return svg;
}

function showToast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3300);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
    storageAvailable = true;
  } catch { storageAvailable = false; }
}

function updateSavedControls() {
  document.querySelectorAll('.saved-count').forEach((node) => { node.textContent = saved.size; });
  $('.saved-trigger').setAttribute('aria-label', `View your shelf, ${saved.size} saved ${saved.size === 1 ? 'book' : 'books'}`);
  document.querySelectorAll('.bookmark').forEach((button) => {
    const book = books.find((item) => item.id === button.dataset.bookId);
    button.setAttribute('aria-pressed', saved.has(book.id));
    button.setAttribute('aria-label', `${saved.has(book.id) ? 'Remove' : 'Save'} ${book.title}${saved.has(book.id) ? ' from' : ' to'} your shelf`);
  });
  if (activeBook && $('#book-dialog').open) {
    const button = $('#dialog-save');
    button.textContent = saved.has(activeBook.id) ? 'Saved to your shelf ✓' : 'Save to your shelf +';
    button.setAttribute('aria-pressed', saved.has(activeBook.id));
  }
}

function toggleSaved(book) {
  const removing = saved.has(book.id);
  if (removing) saved.delete(book.id); else saved.add(book.id);
  persist();
  if (category === 'Saved') {
    const focusedId = document.activeElement?.dataset.bookId;
    render();
    if (removing && focusedId === book.id && !$('#book-dialog').open) {
      const nextControl = $('#book-grid .bookmark') || $('#reset-filters');
      nextControl.focus();
    }
  }
  updateSavedControls();
  showToast(`${book.title} ${removing ? 'removed from' : 'added to'} your shelf.${storageAvailable ? '' : ' Saved for this visit only.'}`);
}

function createCard(book) {
  const card = element('article', 'book-card');
  card.style.setProperty('--book-bg', book.color || '#ece5d5');
  const art = element('div', 'book-art');
  const coverButton = element('button', 'book-cover-button');
  coverButton.setAttribute('aria-label', `View ${book.title}`);
  const cover = element('img');
  cover.src = book.cover; cover.alt = `${book.title} ${book.sample ? 'sample ' : ''}book cover`;
  cover.width = book.coverWidth || 360; cover.height = book.coverHeight || 500; cover.loading = 'lazy';
  coverButton.append(cover);
  coverButton.addEventListener('click', () => openBook(book, coverButton));
  const bookmark = element('button', 'bookmark');
  bookmark.dataset.bookId = book.id;
  bookmark.append(bookmarkIcon());
  bookmark.addEventListener('click', () => toggleSaved(book));
  art.append(coverButton, bookmark);
  if (book.mood) art.append(element('span', 'book-tag', book.mood.toUpperCase()));
  const meta = element('div', 'book-meta');
  meta.append(element('span', '', categoryName(book)), element('span', '', book.sample ? 'SAMPLE EDITION' : book.author || 'NICY BICY STUDIO'));
  const heading = element('h3');
  const titleButton = element('button', '', book.title);
  titleButton.addEventListener('click', () => openBook(book, titleButton));
  heading.append(titleButton);
  const bottom = element('div', 'book-bottom');
  const details = element('button', '', availableVariants(book).length > 1 ? 'Format options ↗' : 'Book details ↗');
  details.setAttribute('aria-label', `View details for ${book.title}`);
  details.addEventListener('click', () => openBook(book, details));
  if (book.priceLabel || book.format) bottom.append(element('span', '', book.priceLabel || book.format));
  bottom.append(details);
  card.append(art, meta, heading);
  if (book.subtitle) card.append(element('p', 'book-subtitle', book.subtitle));
  card.append(bottom);
  const buy = purchaseLink(book, 'book-buy');
  if (buy) card.append(buy);
  return card;
}

function render() {
  let filtered = books.filter((book) => {
    const matchesCategory = category === 'All books' || (category === 'Saved' ? saved.has(book.id) : categoryName(book) === category);
    const haystack = [book.title, book.subtitle, categoryName(book), book.description, book.mood, book.author].filter(Boolean).join(' ').toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase().trim());
  });
  if (sort !== 'featured') filtered = [...filtered].sort((a, b) => sort === 'az' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  $('#book-grid').replaceChildren(...filtered.map(createCard));
  $('#empty-state').hidden = filtered.length > 0;
  $('#empty-message').textContent = category === 'Saved' && !query ? 'Save a book that catches your eye. You’ll find it here.' : 'No books match this search. Try another word, or explore the whole collection.';
  $('#results-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'book' : 'books'}${category === 'Saved' ? ' on your shelf' : category === 'All books' ? ' to discover' : ` in ${category.toLowerCase()}`}${query ? ` matching “${query}”` : ''}`;
  document.querySelectorAll('.filter').forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active);
  });
  updateSavedControls();
}

function httpsUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}

function availableVariants(book) {
  const variants = Array.isArray(book.variants) ? book.variants : [];
  const valid = variants.filter((variant) => variant.format && httpsUrl(variant.purchaseUrl));
  if (valid.length) return [...valid].sort((a, b) => Number(b.format.toLowerCase() === 'paperback') - Number(a.format.toLowerCase() === 'paperback'));
  return httpsUrl(book.purchaseUrl) ? [{ id: 'default', format: book.format || 'Book', purchaseUrl: book.purchaseUrl, pages: book.pages }] : [];
}

function purchaseLink(book, className, variant = availableVariants(book)[0]) {
  const purchaseUrl = !book.sample && variant && httpsUrl(variant.purchaseUrl);
  if (!purchaseUrl) return null;
  const caption = className === 'book-buy' ? 'Buy on Amazon' : `Buy ${variant.format.toLowerCase()} on Amazon`;
  const link = element('a', `button button-dark amazon-link ${className}`, caption);
  const arrow = element('span', '', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  link.href = purchaseUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Buy ${variant.format.toLowerCase()} on Amazon: ${book.title} (opens in a new tab)`);
  return link;
}

function openBook(book, trigger) {
  activeBook = book;
  returnFocus = trigger;
  const layout = element('div', 'dialog-layout');
  layout.style.setProperty('--book-bg', book.color || '#ece5d5');
  const art = element('div', 'dialog-art');
  const image = element('img'); image.src = book.cover; image.alt = `${book.title}, updated paperback cover`; image.width = book.coverWidth || 360; image.height = book.coverHeight || 500;
  art.append(image, element('p', 'cover-caption', 'Updated paperback cover shown'));
  const info = element('div', 'dialog-info');
  const title = element('h2', '', book.title); title.id = 'dialog-title';
  const specs = element('div', 'dialog-specs');
  specs.setAttribute('aria-live', 'polite');
  const variants = availableVariants(book);
  let selectedVariant = variants[0];
  const buySlot = element('div', 'purchase-slot');
  const save = element('button', `button ${selectedVariant ? 'button-outline' : 'button-dark'}`); save.id = 'dialog-save';
  save.addEventListener('click', () => toggleSaved(book));
  info.append(element('p', 'eyebrow', categoryName(book).toUpperCase()), title);
  if (book.subtitle) info.append(element('p', 'dialog-subtitle', book.subtitle));
  if (book.description) info.append(element('p', 'dialog-description', book.description));
  if (variants.length) {
    const formatLabel = element('label', 'format-label', 'Book format');
    formatLabel.htmlFor = 'book-format';
    const formatSelect = element('select', 'format-select');
    formatSelect.id = 'book-format';
    for (const variant of variants) {
      const option = element('option', '', variant.format);
      option.value = variant.id;
      formatSelect.append(option);
    }
    formatSelect.value = selectedVariant.id;
    formatSelect.addEventListener('change', () => {
      selectedVariant = variants.find((variant) => variant.id === formatSelect.value) || variants[0];
      updateVariant();
    });
    info.append(formatLabel, formatSelect);
  }
  function updateVariant() {
    const format = selectedVariant?.format || book.format;
    const pages = Number(selectedVariant?.pages || book.pages);
    const values = [];
    if (format) values.push(element('span', '', format));
    if (Number.isInteger(pages) && pages > 0) values.push(element('span', '', `${pages} pages`));
    if (book.language) values.push(element('span', '', book.language));
    specs.replaceChildren(...values);
    const buy = purchaseLink(book, 'dialog-buy', selectedVariant);
    buySlot.replaceChildren(...(buy ? [buy] : []));
  }
  updateVariant();
  if (specs.childElementCount) info.append(specs);
  info.append(buySlot);
  info.append(save);
  if (!book.sample) info.append(element('p', 'dialog-disclaimer', 'Amazon shows current prices and availability. Its preview may show earlier cover artwork.'));
  if (book.sample) info.append(element('p', 'dialog-disclaimer', 'An imagined sample edition, created to introduce our studio. This title is not currently for sale.'));
  layout.append(art, info);
  $('#dialog-content').replaceChildren(layout);
  $('#book-dialog').showModal();
  document.body.classList.add('modal-open');
  updateSavedControls();
}

renderFilters();
$('.filters').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button || !event.currentTarget.contains(button)) return;
  category = button.dataset.category;
  render();
});
$('#sort').addEventListener('change', (event) => { sort = event.target.value; render(); });
$('#book-search').addEventListener('input', (event) => { query = event.target.value; render(); });
$('.search-trigger').addEventListener('click', () => {
  $('#search-field').hidden = false;
  $('#collection').scrollIntoView({ behavior: scrollBehavior });
  $('#book-search').focus({ preventScroll: true });
});
$('#close-search').addEventListener('click', () => {
  query = ''; $('#book-search').value = ''; $('#search-field').hidden = true; render(); $('.search-trigger').focus();
});
$('.saved-trigger').addEventListener('click', () => {
  category = 'Saved'; query = ''; $('#book-search').value = ''; render();
  $('#collection').scrollIntoView({ behavior: scrollBehavior });
  $('.saved-filter').focus({ preventScroll: true });
});
$('#reset-filters').addEventListener('click', () => {
  category = 'All books'; query = ''; $('#book-search').value = ''; render();
  $('.filter').focus({ preventScroll: true });
});

$('.menu-toggle').addEventListener('click', () => {
  const open = $('.menu-toggle').getAttribute('aria-expanded') !== 'true';
  $('.menu-toggle').setAttribute('aria-expanded', open);
  $('.menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  $('#mobile-nav').hidden = !open;
});
function closeMenu() {
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
  $('.menu-toggle').setAttribute('aria-label', 'Open navigation');
  $('#mobile-nav').hidden = true;
}
document.querySelectorAll('#mobile-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) { closeMenu(); $('.menu-toggle').focus(); }
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (dialog.id === 'book-dialog') {
      activeBook = null;
      if (returnFocus?.isConnected) returnFocus.focus(); else $('.saved-filter').focus();
    }
  });
});
$('#privacy-button').addEventListener('click', () => { $('#privacy-dialog').showModal(); document.body.classList.add('modal-open'); });
$('#clear-shelf').addEventListener('click', () => { saved.clear(); persist(); render(); showToast('Your saved shelf has been cleared.'); });

const prompts = [
  '“Pick three colors you love. See where they take you.”',
  '“Try a familiar scene in an unexpected color palette.”',
  '“Take your time with one page. There is no finish line.”',
  '“Notice the colors around you. Borrow one for your next page.”',
  '“Give a friendly animal a color only you would imagine.”',
  '“Share a creative afternoon. Make every page your own.”',
];
let promptIndex = 0;
$('#new-prompt').addEventListener('click', () => {
  promptIndex = (promptIndex + 1) % prompts.length;
  $('#reading-prompt').textContent = prompts[promptIndex];
});
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  try {
    const value = JSON.parse(event.newValue || '[]');
    saved = new Set(Array.isArray(value) ? value.filter((id) => knownIds.has(id)) : []);
    render();
  } catch { /* Keep the current shelf if another tab writes invalid data. */ }
});
$('#year').textContent = new Date().getFullYear();
render();
