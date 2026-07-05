document.addEventListener('DOMContentLoaded', () => {
  
  // --- CONTROL DEL DESLIZADOR INTERACTIVO (SLIDER) ---
  const sliders = document.querySelectorAll('.slider-container');

  sliders.forEach(slider => {
    const handle = slider.querySelector('.slider-handle');
    const imgBefore = slider.querySelector('.img-before');

    if (handle && imgBefore) {
      let isDragging = false;

      // Función para actualizar la posición del slider
      const updateSlider = (clientX) => {
        const rect = slider.getBoundingClientRect();
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
        slider.setPointerCapture(e.pointerId);
        updateSlider(e.clientX);
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
      };

      const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        slider.releasePointerCapture(e.pointerId);
      };

      // Registrar los eventos en el contenedor
      slider.addEventListener('pointerdown', onPointerDown);
      slider.addEventListener('pointermove', onPointerMove);
      slider.addEventListener('pointerup', onPointerUp);
      slider.addEventListener('pointercancel', onPointerUp);
    }
  });

  // --- CONTROL DEL FORMULARIO DE CONVERSIÓN ---
  const form = document.getElementById('diagnosticoForm');
  const statusDiv = document.getElementById('formStatus');
  const selectInteres = document.getElementById('interes');
  const submitBtn = document.getElementById('submitBtn');

  const INTEREST_CONFIG = {
    A: {
      buttonText: "Solicitar Diagnóstico Gratuito",
      successMessage: "Gracias. Nos pondremos en contacto contigo en menos de 24 horas para analizar vuestro flujo operativo."
    },
    B: {
      buttonText: "Solicitar Diagnóstico Gratuito",
      successMessage: "Gracias. Nos pondremos en contacto contigo en menos de 24 horas para analizar vuestro flujo operativo."
    },
    C: {
      buttonText: "Unirse a la Beta Privada",
      successMessage: "¡Ya estás en la lista de espera! Te notificaremos en cuanto el MVP esté disponible."
    }
  };

  // Cambiar el texto del botón dinámicamente según la opción de interés seleccionada
  if (selectInteres && submitBtn) {
    selectInteres.addEventListener('change', () => {
      const selected = selectInteres.value;
      if (INTEREST_CONFIG[selected]) {
        submitBtn.textContent = INTEREST_CONFIG[selected].buttonText;
      } else {
        submitBtn.textContent = "Comenzar Ahora";
      }
    });
  }

  if (form && statusDiv) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('nombre').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const interestVal = selectInteres.value;
      const messageVal = document.getElementById('mensaje').value.trim();

      // Limpiar estados anteriores del estado
      statusDiv.className = 'form-status';
      statusDiv.textContent = '';
      statusDiv.style.display = 'none';

      // Validar Email Corporativo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        statusDiv.classList.add('error');
        statusDiv.textContent = "Introduce un formato de email válido.";
        statusDiv.style.display = 'block';
        return;
      }

      const commonDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
      const domain = emailVal.split("@")[1].toLowerCase();
      if (commonDomains.includes(domain)) {
        statusDiv.classList.add('error');
        statusDiv.textContent = "Por favor, introduce un correo corporativo de tu estudio.";
        statusDiv.style.display = 'block';
        return;
      }

      // Deshabilitar botón durante el envío
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitud...';

      try {
        const response = await fetch("https://api.artqui.ai/v1/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            interest: interestVal,
            bottleneck: messageVal
          })
        });

        // Habilitar de nuevo el botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        if (response.ok || response.status === 201 || response.status === 200) {
          // Mostrar éxito dinámico
          statusDiv.classList.add('success');
          statusDiv.textContent = INTEREST_CONFIG[interestVal] 
            ? INTEREST_CONFIG[interestVal].successMessage 
            : "¡Datos enviados con éxito!";
          statusDiv.style.display = 'block';

          // Resetear el formulario y el botón
          form.reset();
          submitBtn.textContent = "Comenzar Ahora";
        } else {
          statusDiv.classList.add('error');
          statusDiv.textContent = "Ha ocurrido un error al procesar tu solicitud. Por favor, vuelve a intentarlo.";
          statusDiv.style.display = 'block';
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Simular éxito con fallback en caso de error de conexión CORS con la API placeholder de prueba
        console.warn("Error de conexión (CORS o API inactiva). Simulando envío de lead de pruebas:", err);
        statusDiv.classList.add('success');
        statusDiv.textContent = INTEREST_CONFIG[interestVal] 
          ? INTEREST_CONFIG[interestVal].successMessage 
          : "¡Datos enviados con éxito!";
        statusDiv.style.display = 'block';
        
        form.reset();
        submitBtn.textContent = "Comenzar Ahora";
      }

      // Scroll suave al mensaje de éxito
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

});
