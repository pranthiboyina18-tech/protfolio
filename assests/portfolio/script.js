(() => {
  const body = document.body;
  document.documentElement.classList.add('js');
  body.classList.add('loading');
  const loader = document.querySelector('.loader');
  const nav = document.querySelector('.primary-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.primary-nav a')];
  const backToTop = document.querySelector('.back-to-top');

  const finishLoading = () => {
    loader?.classList.add('is-done');
    body.classList.remove('loading');
  };
  window.addEventListener('load', finishLoading, { once: true });
  window.setTimeout(finishLoading, 1800);

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav?.classList.toggle('is-open', !isOpen);
    body.classList.toggle('menu-open', !isOpen);
  });

  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    nav?.classList.remove('is-open');
    body.classList.remove('menu-open');
  };
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const filters = document.querySelectorAll('.filter-chip');
  const projects = document.querySelectorAll('.project-item');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(project => {
      project.classList.toggle('is-hidden', category !== 'all' && project.dataset.category !== category);
    });
  }));

  const rotatingWord = document.querySelector('.rotating-word');
  const words = ['the web', 'small ideas', 'better questions', 'what comes next'];
  let wordIndex = 0;
  if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      rotatingWord.classList.add('is-changing');
      window.setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotatingWord.textContent = words[wordIndex];
        rotatingWord.classList.remove('is-changing');
      }, 200);
    }, 2400);
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const updateScrollUI = () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 560);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelector('.footer-top')?.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  const recipient = document.querySelector('.contact-email')?.getAttribute('href')?.replace(/^mailto:/, '');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    let firstInvalid = null;
    fields.forEach(field => {
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      feedback.textContent = 'Please check the highlighted fields. Add a valid email and a message of at least 10 characters.';
      feedback.classList.add('is-error');
      firstInvalid.focus();
      return;
    }

    if (!recipient || recipient === 'your.email@example.com') {
      feedback.textContent = 'Form validated. Replace the sample email address in index.html to enable sending.';
      feedback.classList.add('is-error');
      return;
    }

    const values = new FormData(form);
    const subject = encodeURIComponent(values.get('subject'));
    const message = encodeURIComponent(
      `From: ${values.get('name')} (${values.get('email')})\n\n${values.get('message')}`
    );
    feedback.textContent = 'Your email app should open with your message ready to send.';
    feedback.classList.remove('is-error');
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${message}`;
  });
  form?.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) field.setAttribute('aria-invalid', 'false');
      feedback.textContent = '';
      feedback.classList.remove('is-error');
    });
  });
})();
