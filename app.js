document.addEventListener('DOMContentLoaded', () => {
  
  // --- CONTROL DEL DESLIZADOR INTERACTIVO (SLIDER) ---
  const container = document.getElementById('sliderContainer');
  const handle = document.getElementById('sliderHandle');
  const imgBefore = document.querySelector('.img-before');

  if (container && handle && imgBefore) {
    let isDragging = false;

    // Función para actualizar la posición del slider
    const updateSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;

      // Constreñir el porcentaje entre 0 y 100
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Mover la barra de control
      handle.style.left = `${percentage}%`;

      // Recortar la imagen superior (Boceto antes) usando clip-path
      imgBefore.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // Eventos de puntero unificados (ratón y táctil)
    const onPointerDown = (e) => {
      isDragging = true;
      container.setPointerCapture(e.pointerId);
      updateSlider(e.clientX);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      container.releasePointerCapture(e.pointerId);
    };

    // Registrar los eventos en el contenedor
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
  }

  // --- CONTROL DEL FORMULARIO DE CONVERSIÓN ---
  const form = document.getElementById('diagnosticoForm');
  const statusDiv = document.getElementById('formStatus');

  if (form && statusDiv) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Deshabilitar botón durante el envío
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitud...';

      // Limpiar estados anteriores del estado
      statusDiv.className = 'form-status';
      statusDiv.textContent = '';
      statusDiv.style.display = 'none';

      // Capturar datos del formulario
      const data = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        estudio: document.getElementById('estudio').value,
        tamano: document.getElementById('tamano').value,
        mensaje: document.getElementById('mensaje').value
      };

      // Simulación de envío (hacia Notion/Calendly/CRM)
      setTimeout(() => {
        // Habilitar de nuevo el botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Mostrar éxito
        statusDiv.classList.add('success');
        statusDiv.textContent = `¡Gracias, ${data.nombre}! Hemos registrado tu solicitud. Nos pondremos en contacto contigo en el email ${data.email} en menos de 24 horas para agendar tu Sesión de Diagnóstico.`;
        statusDiv.style.display = 'block';

        // Resetear el formulario
        form.reset();
        
        // Scroll suave al mensaje de éxito
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1500);
    });
  }

});
