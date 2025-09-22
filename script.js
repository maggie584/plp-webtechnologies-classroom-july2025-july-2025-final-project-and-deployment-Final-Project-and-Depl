// main.js — accessible UI interactions: menu toggle, slider, form validation
document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------
     Mobile menu toggle
     ----------------------- */
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('primary-navigation');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked (good UX)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------
     Simple slider (transform-based)
     ----------------------- */
  const slidesContainer = document.querySelector('.slides');
  const slides = document.querySelectorAll('.slides .slide');
  const btnNext = document.querySelector('.slider-btn.next');
  const btnPrev = document.querySelector('.slider-btn.prev');
  let current = 0;
  let autoplayInterval = null;
  const AUTOPLAY_MS = 5000;

  function updateSlider() {
    if (!slidesContainer) return;
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;
  }

  function nextSlide() { current = (current + 1) % slides.length; updateSlider(); }
  function prevSlide() { current = (current - 1 + slides.length) % slides.length; updateSlider(); }

  if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_MS);
  }
  function resetAutoplay() {
    startAutoplay();
  }

  if (slides.length > 0) {
    updateSlider();
    startAutoplay();

    // Pause autoplay while hovering
    const slider = document.querySelector('.slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      slider.addEventListener('mouseleave', startAutoplay);
    }
  }

  /* -----------------------
     Simple contact form validation
     ----------------------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.error').forEach(el => el.textContent = '');

      const name = form.elements['name'];
      const email = form.elements['email'];
      const message = form.elements['message'];

      let valid = true;

      if (!name.value || name.value.trim().length < 2) {
        showError(name, 'Please enter your full name (2+ characters).');
        valid = false;
      }

      // simple email regex (sufficient for client-side check)
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value || !emailRe.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }

      if (!message.value || message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters.');
        valid = false;
      }

      if (!valid) {
        // focus first invalid field
        const firstError = form.querySelector('.error:not(:empty)');
        if (firstError) {
          const input = firstError.previousElementSibling;
          if (input) input.focus();
        }
        return;
      }

      // Success: show local success message. (For production, send to backend or Netlify forms.)
      const success = document.getElementById('form-success');
      if (success) {
        success.hidden = false;
        success.textContent = 'Thanks! Your message passed client-side validation.';
      }
      form.reset();
    });
  }

  function showError(inputElem, message) {
    const err = inputElem.parentElement.querySelector('.error');
    if (err) err.textContent = message;
  }

  /* -----------------------
     Smooth-internal links (progressive enhancement)
     ----------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});