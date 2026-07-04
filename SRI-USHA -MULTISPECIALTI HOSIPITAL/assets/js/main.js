/* ==========================================================================
   Sri Usha Multi Speciality Hospital - Core Interactions
   Design: Premium, Luxury, Corporate Healthcare UI/UX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on page reload/load
  if (window.history && window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  initPreloader();
  initMobileMenu();
  initScrollFeatures();
  initCounters();
  initTestimonials();
  initGalleryLightbox();
  initDoctorLightbox();
  initFAQAccordion();
  initScrollAnimations();
  initAppointmentForm();
  updateActiveNavLink();
});

/* --- Preloader --- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Fade out preloader instantly when DOM is ready
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
}

/* --- Mobile Menu Toggle --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      // Prevent body scrolling when menu is active
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- Centralized performant scroll features --- */
function initScrollFeatures() {
  const navbar = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Setup click handler for Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  let scrollPending = false;
  const onScroll = () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Navbar Sticky transition
        if (navbar) {
          if (scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }

        // Scroll Progress Bar
        if (progressBar) {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          progressBar.style.width = scrolled + '%';
        }

        // Back to Top visibility
        if (backToTopBtn) {
          if (scrollY > 400) {
            backToTopBtn.classList.add('active');
          } else {
            backToTopBtn.classList.remove('active');
          }
        }

        scrollPending = false;
      });
    }
  };

  // Register single scroll listener with passive option
  window.addEventListener('scroll', onScroll, { passive: true });
  // Call once initially to set correct state
  onScroll();
}

/* --- Active Nav Link Highlighter --- */
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Counters Animation --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + (counter.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  };

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* --- Testimonial Slider --- */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-controls');
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;

  // Create Dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 6000); // 6 seconds auto cycle
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h4')?.textContent || '';
      const desc = item.querySelector('.gallery-overlay p')?.textContent || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.getAttribute('data-full') || img.src;
        if (lightboxCaption) {
          lightboxCaption.textContent = title + (desc ? ` - ${desc}` : '');
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- FAQ Accordion --- */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all FAQs
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --- Scroll Entrance Animations --- */
function initScrollAnimations() {
  const animates = document.querySelectorAll('.scroll-animate');
  if (animates.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animates.forEach(el => observer.observe(el));
}

/* --- Appointment Booking Logic --- */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const modal = document.getElementById('successModal');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fields
    const name = document.getElementById('apptName').value.trim();
    const phone = document.getElementById('apptPhone').value.trim();
    const email = document.getElementById('apptEmail').value.trim();
    const department = document.getElementById('apptDept').value;
    const opType = document.getElementById('apptOpType').value;
    const date = document.getElementById('apptDate').value;
    const message = document.getElementById('apptMsg').value.trim();

    // Basic Validation
    if (!name || !phone || !department || !opType || !date) {
      alert('Please fill in all the required fields (Name, Phone, Department, OP Type, and Appointment Date).');
      return;
    }

    // Save details to modal actions for WhatsApp/Email redirect triggers
    const whatsappBtn = document.getElementById('successWhatsapp');
    const emailBtn = document.getElementById('successEmail');
    const closeBtn = document.getElementById('successClose');

    // Phone Numbers
    const hospitalPhone = '918790514387';
    const hospitalEmail = 'sriushahosipitalkdm@gmail.com';

    // Text formatting
    const wsText = `Hello Sri Usha Multi Speciality Hospital, I would like to request an appointment:
- Name: ${name}
- Phone: ${phone}
- Email: ${email || 'Not provided'}
- OP Type: ${opType}
- Department: ${department}
- Date: ${date}
- Message: ${message || 'No additional details'}`;

    const whatsappUrl = `https://wa.me/${hospitalPhone}?text=${encodeURIComponent(wsText)}`;

    const emailSubject = `Appointment Request - ${name}`;
    const emailBody = `Patient Details:
-------------------------------------
Name: ${name}
Contact Number: ${phone}
Email Address: ${email || 'Not provided'}
OP Type: ${opType}
Department: ${department}
Preferred Date: ${date}

Additional Message:
${message || 'No additional details'}`;

    const emailUrl = `mailto:${hospitalEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Set Actions
    if (whatsappBtn) {
      whatsappBtn.href = whatsappUrl;
      whatsappBtn.target = '_blank';
    }

    if (emailBtn) {
      emailBtn.href = emailUrl;
    }

    // Show Success Modal
    if (modal) {
      modal.classList.add('active');
    }

    // Clear form
    form.reset();

    // Setup modal close
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });
}

/* --- Doctor Image Lightbox --- */
function initDoctorLightbox() {
  const doctorImages = document.querySelectorAll('.doctor-image img');
  if (doctorImages.length === 0) return;

  // Ensure lightbox element exists
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image Preview Window');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close Preview Window">&times;</button>
        <img src="" alt="Fullscreen Image Preview" class="lightbox-image">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  doctorImages.forEach(img => {
    // Add pointer cursor to show it's clickable
    img.style.cursor = 'pointer';
    
    // Add a title attribute for accessibility
    img.setAttribute('title', 'Click to view full image');

    img.addEventListener('click', () => {
      // Find doctor name and specialty from the card structure
      const card = img.closest('.doctor-card') || img.closest('.doctor-profile-grid');
      let name = '';
      let specialty = '';
      if (card) {
        name = card.querySelector('.doctor-title')?.textContent || card.querySelector('h3')?.textContent || '';
        specialty = card.querySelector('.doctor-specialty')?.textContent || card.querySelector('.doctor-degrees')?.textContent || '';
      }

      if (lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
          lightboxCaption.textContent = name + (specialty ? ` - ${specialty}` : '');
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Re-bind close events if they haven't been bound already by initGalleryLightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
