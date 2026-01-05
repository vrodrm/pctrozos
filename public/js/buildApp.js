/**
 * PC Builder Application
 * Encapsulates logic for selecting parts, handling pagination, and updating the UI.
 */
class PCBuilder {
  constructor() {
    this.selectedParts = {};
    this.init();
  }

  /**
   * Initialize event listeners when the DOM is ready.
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupModalListeners();
    });
  }

  /**
   * Sets up listeners for all category modals.
   */
  setupModalListeners() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      const categoryId = modal.id.replace('modal-', '');
      const searchInput = document.getElementById(`search-${categoryId}`);

      // Event: Modal opened
      modal.addEventListener('show.bs.modal', () => {
        if (searchInput) searchInput.value = ''; // Reset search
        this.loadParts(categoryId, 1);
      });

      // Event: Search input
      if (searchInput) {
        searchInput.addEventListener('input', this.debounce(() => {
          this.loadParts(categoryId, 1);
        }, 500));

        // Prevent form submission on Enter
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') e.preventDefault();
        });
      }
    });
  }

  /**
   * Fetches parts from the API and updates the UI.
   * @param {string} category - The category ID.
   * @param {number} page - The page number to load.
   */
  async loadParts(category, page) {
    const listGroup = document.getElementById(`list-group-${category}`);
    const searchInput = document.getElementById(`search-${category}`);
    const searchTerm = searchInput ? searchInput.value : '';

    this.renderLoading(listGroup);

    try {
      const params = new URLSearchParams({
        category: category,
        page: page,
        limit: 5,
        search: searchTerm
      });

      const response = await fetch(`/api/piezas?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      this.renderPartsList(category, data.piezas);
      this.renderPagination(category, data.currentPage, data.totalPages);
    } catch (error) {
      console.error('Error loading parts:', error);
      this.renderError(listGroup, 'Error al cargar las piezas.');
    }
  }

  /**
   * Renders the loading state.
   */
  renderLoading(container) {
    container.innerHTML = '<div class="text-center p-3">Cargando...</div>';
  }

  /**
   * Renders an error message.
   */
  renderError(container, message) {
    container.innerHTML = `<div class="text-danger p-3">${message}</div>`;
  }

  /**
   * Renders the list of parts into the DOM.
   */
  renderPartsList(category, parts) {
    const listGroup = document.getElementById(`list-group-${category}`);
    listGroup.innerHTML = '';

    if (!parts || parts.length === 0) {
      listGroup.innerHTML = '<div class="text-center p-3">No hay piezas disponibles en esta categoría.</div>';
      return;
    }

    parts.forEach(part => {
      const button = this.createPartElement(category, part);
      listGroup.appendChild(button);
    });
  }

  /**
   * Creates a DOM element for a single part.
   */
  createPartElement(category, part) {
    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    button.type = 'button';
    button.setAttribute('data-bs-dismiss', 'modal');

    // Attach click listener directly
    button.addEventListener('click', () => this.selectPart(category, part));

    button.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${part.image_url}" alt="${part.name}" style="width: 50px; height: 50px; object-fit: contain;">
        <span>${part.name}</span>
      </div>
      <span class="badge bg-success rounded-pill">${part.price}€</span>
    `;
    return button;
  }

  /**
   * Renders pagination controls.
   */
  renderPagination(category, currentPage, totalPages) {
    const paginationContainer = document.getElementById(`pagination-${category}`);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous Button
    const prevLi = this.createPageItem('Anterior', currentPage > 1, () => this.loadParts(category, currentPage - 1));
    paginationContainer.appendChild(prevLi);

    // Page Info
    const infoLi = document.createElement('li');
    infoLi.className = 'page-item disabled';
    infoLi.innerHTML = `<span class="page-link">Página ${currentPage} de ${totalPages}</span>`;
    paginationContainer.appendChild(infoLi);

    // Next Button
    const nextLi = this.createPageItem('Siguiente', currentPage < totalPages, () => this.loadParts(category, currentPage + 1));
    paginationContainer.appendChild(nextLi);
  }

  /**
   * Helper to create a pagination item.
   */
  createPageItem(text, enabled, onClick) {
    const li = document.createElement('li');
    li.className = `page-item ${!enabled ? 'disabled' : ''}`;

    const button = document.createElement('button');
    button.className = 'page-link';
    button.type = 'button';
    button.textContent = text;

    if (enabled) {
      button.addEventListener('click', onClick);
    }

    li.appendChild(button);
    return li;
  }

  /**
   * Handles part selection.
   */
  selectPart(category, part) {
    this.selectedParts[category] = {
      id: part.id,
      name: part.name,
      price: parseFloat(part.price) || 0,
      image_url: part.image_url
    };

    // Update UI card label
    const label = document.getElementById(`label-${category}`);
    if (label) {
      label.innerText = part.name;
      label.classList.replace('text-muted', 'text-primary');
    }

    this.updateSummary();
  }

  /**
   * Updates the summary section (total price and hidden inputs).
   */
  updateSummary() {
    const summaryList = document.getElementById('summaryList');
    const hiddenInputs = document.getElementById('hiddenInputs');
    const totalPriceElement = document.getElementById('totalPrice');

    if (!summaryList || !hiddenInputs || !totalPriceElement) return;

    summaryList.innerHTML = '';
    hiddenInputs.innerHTML = '';
    let total = 0;

    for (const [cat, part] of Object.entries(this.selectedParts)) {
      // Visual Item
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center small gap-2';
      li.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <img class="object-fit-contain" src="${part.image_url}" width="50" height="50" alt="">
            <span>${part.name}</span>
          </div>
          <span>${part.price.toFixed(2)}€</span>
      `;
      summaryList.appendChild(li);

      // Hidden Input for Form Submission
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'partIds[]';
      input.value = part.id;
      hiddenInputs.appendChild(input);

      total += part.price;
    }

    totalPriceElement.innerText = `${total.toFixed(2)}€`;
  }

  /**
   * Debounce utility function.
   */
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Instantiate the application
new PCBuilder();
