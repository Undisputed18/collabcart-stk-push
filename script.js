document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links li a');

  // Toggle Mobile Menu
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const bars = menuToggle.querySelectorAll('.bar');
    if (navLinks.classList.contains('active')) {
      bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  });

  // Close menu when a link is clicked
  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const bars = menuToggle.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    });
  });

  // Smooth Scroll for Learn More Button
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Real SMTP Backend Handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      // Visual feedback
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Updated to use Vercel Serverless Function (relative path)
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Message sent successfully! It is now in your Gmail inbox.');
          contactForm.reset();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Error: ${errorData.message || 'Something went wrong on the server.'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the email server. Please try again later.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Header background change on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(13, 17, 23, 0.95)';
      header.style.padding = '10px 0';
    } else {
      header.style.background = 'rgba(13, 17, 23, 0.8)';
      header.style.padding = '15px 0';
    }
  });
});
