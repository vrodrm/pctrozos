const selectedParts = {};

// Initialize modal listeners
document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    // Modal show event
    modal.addEventListener('show.bs.modal', (event) => {
      const categoryId = modal.id.replace('modal-', '');
      const searchInput = document.getElementById(`search-${categoryId}`);
      if (searchInput) searchInput.value = '';
      loadParts(categoryId, 1);
    });

    // Attach debounced search listener to input
    const categoryId = modal.id.replace('modal-', '');
    const searchInput = document.getElementById(`search-${categoryId}`);
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        loadParts(categoryId, 1);
      }, 500));

      // Prevent submitting the form when pressing Enter in the search input
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
    }
  });
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

async function loadParts(category, page) {
  const listGroup = document.getElementById(`list-group-${category}`);
  const paginationContainer = document.getElementById(`pagination-${category}`);
  const searchInput = document.getElementById(`search-${category}`);
  const searchTerm = searchInput ? searchInput.value : '';

  listGroup.innerHTML = '<div class="text-center p-3">Cargando...</div>';

  try {
    const response = await fetch(`/api/piezas?category=${category}&page=${page}&limit=5&search=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    renderParts(category, data.piezas);
    renderPagination(category, data.currentPage, data.totalPages);
  } catch (error) {
    console.error('Error loading parts:', error);
    listGroup.innerHTML = '<div class="text-danger p-3">Error al cargar las piezas.</div>';
  }
}

function renderParts(category, parts) {
  const listGroup = document.getElementById(`list-group-${category}`);
  listGroup.innerHTML = '';

  if (parts.length === 0) {
    listGroup.innerHTML = '<div class="text-center p-3">No hay piezas disponibles en esta categoría.</div>';
    return;
  }

  parts.forEach(pieza => {
    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    button.type = 'button';
    button.setAttribute('data-bs-dismiss', 'modal');
    button.onclick = () => selectPart(category, pieza.id, pieza.name, pieza.price, pieza.image_url);

    button.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${pieza.image_url}" alt="" style="width: 50px; height: 50px; object-fit: contain;">
        <span>${pieza.name}</span>
      </div>
      <span class="badge bg-success rounded-pill">${pieza.price}€</span>
    `;
    listGroup.appendChild(button);
  });
}

function renderPagination(category, currentPage, totalPages) {
  const paginationContainer = document.getElementById(`pagination-${category}`);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous Button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<button type="button" class="page-link" onclick="loadParts('${category}', ${currentPage - 1})">Anterior</button>`;
  paginationContainer.appendChild(prevLi);

  // Page Numbers (simplified: showing all or range could be complex, keeping it simple for now)
  // For better UX, maybe just show current page info? Or a few numbers. 
  // Let's do simple Previous | Page X of Y | Next

  const infoLi = document.createElement('li');
  infoLi.className = 'page-item disabled';
  infoLi.innerHTML = `<span class="page-link">Página ${currentPage} de ${totalPages}</span>`;
  paginationContainer.appendChild(infoLi);

  // Next Button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `<button type="button" class="page-link" onclick="loadParts('${category}', ${currentPage + 1})">Siguiente</button>`;
  paginationContainer.appendChild(nextLi);
}
function selectPart(category, id, name, price, image_url) {
  // 1. Guardar en nuestro objeto de estado
  selectedParts[category] = { id, name, price: parseFloat(price) || 0, image_url };

  // 2. Actualizar el label en la tarjeta
  document.getElementById(`label-${category}`).innerText = name;
  document.getElementById(`label-${category}`).classList.replace('text-muted', 'text-primary');

  updateSummary();
}

function updateSummary() {
  const summaryList = document.getElementById('summaryList');
  const hiddenInputs = document.getElementById('hiddenInputs');
  const totalPriceElement = document.getElementById('totalPrice');

  summaryList.innerHTML = '';
  hiddenInputs.innerHTML = '';
  let total = 0;

  for (const [cat, part] of Object.entries(selectedParts)) {
    // Añadir a la lista visual
    summaryList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center small gap-2">
          <img class="object-fit-contain" src=${part.image_url} width=50 height=50 ></img>${part.name} <span>${part.price.toFixed(2)}€</span>
        </li>`;

    // Crear input oculto para el POST
    hiddenInputs.innerHTML += `<input type="hidden" name="partIds[]" value="${part.id}">`;

    total += part.price;
  }

  totalPriceElement.innerText = `${total.toFixed(2)}€`;
}
