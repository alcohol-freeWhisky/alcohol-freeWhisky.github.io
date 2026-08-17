(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Active navigation + tiny cat exit motion before page changes. */
  const raw = window.location.pathname.split('/').pop();
  const current = (!raw || raw === '') ? 'index.html' : raw;
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  let activeIndex = -1;

  navLinks.forEach((link, index) => {
    link.classList.remove('active');
    const href = (link.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (href === current || (current === 'research.html' && href === 'research-experiences.html')) {
      link.classList.add('active');
      activeIndex = index;
    }
  });

  navLinks.forEach((link, targetIndex) => {
    link.addEventListener('click', (event) => {
      if (reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      const targetFile = href.split('/').pop() || 'index.html';
      if (targetFile === current || (current === 'research.html' && targetFile === 'research-experiences.html')) return;

      const active = document.querySelector('[data-nav].active');
      if (!active) return;
      event.preventDefault();
      active.classList.add(targetIndex >= activeIndex ? 'cat-exit-right' : 'cat-exit-left');
      window.setTimeout(() => { window.location.href = href; }, 190);
    });
  });

  /* Scroll progress under the sticky header. */
  const header = document.querySelector('.site-header');
  if (header) {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    header.appendChild(progress);

    const updateProgress = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const value = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progress.style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
  }

  /* Photography filtering and floating composition. */
  const filters = [...document.querySelectorAll('[data-filter]')];
  const floatingGallery = document.querySelector('.floating-gallery');
  const floatingItems = [...document.querySelectorAll('.floating-gallery .gallery-item[data-category]')];
  const galleryItems = [...document.querySelectorAll('.gallery-item[data-category]')];

  let activePhotoFilter = 'all';

  function layoutFloatingGallery() {
    if (!floatingGallery || !floatingItems.length) return;

    const sceneWidth = floatingGallery.clientWidth;
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    const tablet = !mobile && window.matchMedia('(max-width: 980px)').matches;
    const visibleItems = floatingItems.filter((item) => !item.hidden);
    const filmOnly = activePhotoFilter === 'film';

    if (!visibleItems.length) {
      floatingGallery.style.height = '0px';
      return;
    }

    if (filmOnly) {
      const gap = mobile ? 10 : (tablet ? 14 : 16);
      const maxWidth = mobile ? Math.min(110, (sceneWidth - gap) / 2) : (tablet ? 150 : 178);
      const widthFromScene = mobile ? (sceneWidth - gap) / 2 : (sceneWidth - gap * 3) / 4;
      const cardWidth = Math.max(88, Math.min(maxWidth, widthFromScene));
      const columns = mobile ? 2 : 4;
      const totalWidth = columns * cardWidth + gap * (columns - 1);
      const startLeft = Math.max(0, (sceneWidth - totalWidth) / 2);
      const rowGap = mobile ? 262 : 0;
      visibleItems.forEach((item, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        item.style.left = `${startLeft + col * (cardWidth + gap)}px`;
        item.style.top = `${20 + row * rowGap}px`;
        item.style.width = `${cardWidth}px`;
        item.style.setProperty('--r', `${[-0.6, 0.45, -0.4, 0.55][index % 4]}deg`);
        item.style.setProperty('--delay', `${-(index * 0.42)}s`);
        item.style.setProperty('--dx', `${index % 2 ? 2 : -2}px`);
        item.dataset.depth = String(0.22 + index * 0.04);
      });
      const rows = Math.ceil(visibleItems.length / columns);
      floatingGallery.style.height = `${mobile ? rows * rowGap + 140 : 290}px`;
      return;
    }

    const columns = mobile ? 2 : (tablet ? 3 : 5);
    const rowGap = mobile ? 300 : (tablet ? 300 : 278);
    const xPatterns = mobile
      ? [[4, 52], [10, 47], [3, 55], [8, 49]]
      : tablet
        ? [[5, 35, 66], [10, 39, 69], [4, 33, 64], [9, 42, 70]]
        : [
            [4, 23, 42, 61, 80],
            [8, 27, 46, 65, 76],
            [3, 21, 40, 59, 78],
            [7, 25, 44, 63, 81],
            [5, 29, 48, 67, 79]
          ];
    const yJitter = mobile ? [0, 34] : (tablet ? [0, 30, 12] : [0, 24, 8, 31, 14]);
    const rotations = [-1.8, 1.2, -0.7, 1.6, -1.0, .6, -1.4, .9, -.35];

    visibleItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const ratio = (img?.naturalWidth && img?.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1.2;
      const row = Math.floor(index / columns);
      const col = index % columns;
      const pattern = xPatterns[row % xPatterns.length];
      let width;
      if (mobile) {
        width = ratio < .85 ? sceneWidth * .39 : sceneWidth * .46;
      } else if (tablet) {
        width = ratio < .85 ? Math.min(205, sceneWidth * .23) : Math.min(285, sceneWidth * .31);
      } else {
        width = ratio < .85
          ? Math.min(190, sceneWidth * .145)
          : ratio > 1.75
            ? Math.min(275, sceneWidth * .21)
            : Math.min(245, sceneWidth * .185);
      }
      if (item.dataset.category === 'film') width *= 1.08;
      const desiredLeft = sceneWidth * (pattern[col] / 100);
      const left = Math.max(0, Math.min(sceneWidth - width - 4, desiredLeft));
      const top = 12 + row * rowGap + yJitter[col % yJitter.length];
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      item.style.width = `${width}px`;
      item.style.setProperty('--r', `${rotations[index % rotations.length]}deg`);
      item.style.setProperty('--delay', `${-((index % 7) * 0.68)}s`);
      item.style.setProperty('--dx', `${(index % 2 ? 1 : -1) * (2 + (index % 3))}px`);
      item.dataset.depth = String(.28 + (index % 5) * .11);
    });

    const rows = Math.ceil(visibleItems.length / columns);
    const floor = mobile ? 760 : (tablet ? 900 : 980);
    const tail = mobile ? 250 : 230;
    floatingGallery.style.height = `${Math.max(floor, rows * rowGap + tail)}px`;
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      activePhotoFilter = button.dataset.filter || 'all';
      floatingItems.forEach((item) => {
        item.hidden = !(activePhotoFilter === 'all' || item.dataset.category === activePhotoFilter);
        item.style.setProperty('--px', '0px');
        item.style.setProperty('--py', '0px');
      });
      requestAnimationFrame(layoutFloatingGallery);
    });
  });

  if (floatingGallery) {
    floatingItems.forEach((item) => {
      const img = item.querySelector('img');
      if (img && !img.complete) img.addEventListener('load', layoutFloatingGallery, { once: true });
    });
    layoutFloatingGallery();
    window.addEventListener('resize', () => requestAnimationFrame(layoutFloatingGallery));

    /* Very small mouse parallax, layered by item depth. */
    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      floatingGallery.addEventListener('mousemove', (event) => {
        const rect = floatingGallery.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;
        floatingItems.forEach((item) => {
          if (item.hidden) return;
          const depth = Number(item.dataset.depth || .4);
          item.style.setProperty('--px', `${(nx * 7 * depth).toFixed(2)}px`);
          item.style.setProperty('--py', `${(ny * 5 * depth).toFixed(2)}px`);
        });
      }, { passive: true });
      floatingGallery.addEventListener('mouseleave', () => {
        floatingItems.forEach((item) => {
          item.style.setProperty('--px', '0px');
          item.style.setProperty('--py', '0px');
        });
      });
    }
  }

  /* Editorial photography lightbox with a minimal category label. */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-stage img');
  const lightboxMeta = lightbox?.querySelector('.lightbox-meta');
  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.documentElement.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      if (!lightbox || !lightboxImage) return;
      event.preventDefault();
      lightboxImage.src = item.getAttribute('href');
      lightboxImage.alt = item.querySelector('img')?.alt || 'Photography by Ziqi Wei';
      const location = item.dataset.location?.trim();
      const category = item.dataset.category === 'portrait' ? 'Portrait' : (item.dataset.category === 'film' ? 'Cinematic' : 'Landscape');
      if (lightboxMeta) lightboxMeta.textContent = location || category;
      lightbox.classList.add('open');
      document.documentElement.style.overflow = 'hidden';
    });
  });

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.closest('.lightbox-close')) close();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
})();
