// ============ MODO CLARO / OSCURO ============
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.innerHTML = theme === 'light'
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
  localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
});

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

// ============ MENÚ HAMBURGUESA ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.querySelectorAll('.hamburger span').forEach((span, index) => {
    if (hamburger.classList.contains('active')) {
      span.style.transform =
        index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
        index === 1 ? 'opacity: 0' :
        'rotate(-45deg) translate(5px, -5px)';
      if (index === 1) span.style.opacity = '0';
    } else {
      span.style.transform = '';
      span.style.opacity = '';
    }
  });
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.querySelectorAll('.hamburger span').forEach(span => {
      span.style.transform = '';
      span.style.opacity = '';
    });
  });
});

// ============ NAVEGACIÓN ACTIVA (SCROLL) ============
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(anchor => {
    anchor.classList.remove('active');
    if (anchor.getAttribute('href') === `#${current}`) {
      anchor.classList.add('active');
    }
  });
});

// ============ EFECTO MÁQUINA DE ESCRIBIR ============
const typewriterElement = document.getElementById('typewriter');
const phrases = [
  'Desarrollador Web.',
  'Diseñador Frontend.',
  'Creador de Experiencias.'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let typingSpeed = 100;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (!deleting) {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      deleting = true;
      typingSpeed = 80;
    }
  } else {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }
  }

  setTimeout(typeWriter, typingSpeed);
}

typeWriter();

// ============ CONTADORES ANIMADOS ============
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ============ INTERSECTION OBSERVER ============
const observerOptions = {
  threshold: 0.3
};

// Contadores
const aboutSection = document.querySelector('.about');
let countersAnimated = false;

const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      animateCounters();
      countersAnimated = true;
    }
  });
}, observerOptions);

if (aboutSection) {
  aboutObserver.observe(aboutSection);
}

// Barras de progreso
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress');

  progressBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-progress');
    bar.style.width = targetWidth;
  });
}

const skillsSection = document.querySelector('#habilidades');
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateProgressBars();
      skillsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// Animación de aparición de secciones
const revealElements = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(section => {
  sectionObserver.observe(section);
});

// ============ FILTRO DE PROYECTOS ============
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filter === 'todos' || category === filter) {
        card.classList.remove('hide');
        card.classList.add('show');
      } else {
        card.classList.add('hide');
        card.classList.remove('show');
      }
    });
  });
});

// ============ FORMULARIO DE CONTACTO ============
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    formMessage.style.color = '#ef4444';
    formMessage.textContent = 'Por favor completa todos los campos.';
    return;
  }

  if (!isValidEmail(email)) {
    formMessage.style.color = '#ef4444';
    formMessage.textContent = 'Por favor ingresa un email válido.';
    return;
  }

  formMessage.style.color = '#10b981';
  formMessage.textContent = '¡Mensaje enviado correctamente!';
  contactForm.reset();

  setTimeout(() => {
    formMessage.textContent = '';
  }, 5000);
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ============ BOTÓN SCROLL TOP ============
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============ HEADER AL HACER SCROLL ============
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
