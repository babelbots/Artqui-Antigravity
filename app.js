document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Menú Móvil
    // ----------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
            
            // Animación sencilla del botón hamburguesa
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            });
        });
    }

    // ----------------------------------------------------------------
    // 2. Deslizador Antes / Después (Before-After Image Slider)
    // ----------------------------------------------------------------
    const slider = document.getElementById('image-slider');
    const beforeContainer = document.getElementById('before-container');
    const handle = document.getElementById('slider-handle');

    if (slider && beforeContainer && handle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            // Calcular posición relativa al slider (de 0 a 1)
            let position = (clientX - rect.left) / rect.width;
            
            // Limitar rangos para no salirse de la pantalla
            if (position < 0) position = 0;
            if (position > 1) position = 1;

            const percentage = position * 100;
            
            // Actualizar interfaz
            handle.style.left = `${percentage}%`;
            beforeContainer.style.width = `${percentage}%`;
        };

        // Eventos de Ratón (Desktop)
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Eventos de Click Directo en el Slider
        slider.addEventListener('click', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            updateSlider(e.clientX);
        });

        // Eventos Táctiles (Móvil/Tablet)
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // ----------------------------------------------------------------
    // 3. Formulario de Contacto & Dialog de Éxito
    // ----------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const successDialog = document.getElementById('success-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');

    if (contactForm && successDialog && closeDialogBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulación del envío de leads a Vercel/Servidor
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                interest: formData.get('interest'),
                message: formData.get('message')
            };
            
            console.log('Solicitud de contacto enviada:', data);
            
            // Mostrar modal de éxito
            successDialog.showModal();
            
            // Resetear el formulario
            contactForm.reset();
        });

        // Cerrar modal
        closeDialogBtn.addEventListener('click', () => {
            successDialog.close();
        });

        // Cerrar al hacer clic en el backdrop del diálogo
        successDialog.addEventListener('click', (e) => {
            const rect = successDialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                successDialog.close();
            }
        });
    }

    // ----------------------------------------------------------------
    // 4. Scroll Reveal (Efecto de aparición al hacer scroll)
    // ----------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Dejar de observar una vez revelado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealOnScroll.observe(element);
        });
    }
});
