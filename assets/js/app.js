(function () {
  const dogs = Array.isArray(window.DOGS) ? window.DOGS : [];
  const featuredDogs = Array.isArray(window.FEATURED_DOGS) ? window.FEATURED_DOGS : [];

  const dogCards = document.getElementById('dogCards');
  const featuredContainer = document.getElementById('featuredDogs');
  const resultCount = document.getElementById('resultCount');
  const filterForm = document.getElementById('dog-filter');
  const searchInput = document.getElementById('searchInput');
  const breedFilter = document.getElementById('breedFilter');
  const statusFilter = document.getElementById('statusFilter');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const yearNode = document.getElementById('year');

  function createDogCard(dog) {
    return `
      <article class="dog-card">
        <a class="dog-image-wrap" href="${dog.profileUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open ${dog.name} profile on Elite K9 Group">
          <img src="${dog.imageUrl}" alt="${dog.alt}" loading="lazy" width="480" height="360" decoding="async">
          <span class="dog-status ${dog.status === 'Available' ? 'is-available' : 'is-sold'}">${dog.status}</span>
        </a>
        <div class="dog-body">
          <h3>${dog.name}</h3>
          <p class="dog-breed">${dog.breed}</p>
          <p class="dog-meta">${dog.sex} | Born ${dog.born}</p>
          <p class="dog-summary">${dog.summary}</p>
          <a class="dog-link" href="${dog.profileUrl}" target="_blank" rel="noopener noreferrer">View Profile</a>
        </div>
      </article>
    `;
  }

  function createFeaturedCard(item) {
    return `
      <article class="featured-card">
        <img src="${item.imageUrl}" alt="${item.alt}" loading="lazy" width="420" height="300" decoding="async">
        <div class="featured-body">
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
          <a href="${item.href}" target="_blank" rel="noopener noreferrer">Learn More</a>
        </div>
      </article>
    `;
  }

  function applyFilters() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const breed = breedFilter.value;
    const status = statusFilter.value;

    const filtered = dogs.filter((dog) => {
      const matchesQuery = !query || dog.name.toLowerCase().includes(query) || dog.breed.toLowerCase().includes(query);
      const matchesBreed = breed === 'all' || dog.breed === breed;
      const matchesStatus = status === 'all' || dog.status === status;
      return matchesQuery && matchesBreed && matchesStatus;
    });

    dogCards.innerHTML = filtered.map(createDogCard).join('');
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'dog profile matches' : 'dog profiles match'} your filters.`;
  }

  if (dogCards) {
    dogCards.innerHTML = dogs.map(createDogCard).join('');
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = featuredDogs.map(createFeaturedCard).join('');
  }

  if (resultCount) {
    resultCount.textContent = `${dogs.length} dog profiles currently listed.`;
  }

  if (filterForm) {
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
    });

    [searchInput, breedFilter, statusFilter].forEach(function (control) {
      control.addEventListener('change', applyFilters);
      control.addEventListener('input', applyFilters);
    });
  }

  if (menuToggle && mainNav) {
    const navLinks = mainNav.querySelectorAll('a');

    function setMenuState(isOpen) {
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuToggle.classList.toggle('is-open', isOpen);
      mainNav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    }

    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!expanded);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 980px)');
    if (desktopQuery && typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', function (event) {
        if (event.matches) {
          setMenuState(false);
        }
      });
    }
  }

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
})();

