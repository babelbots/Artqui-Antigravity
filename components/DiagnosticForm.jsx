"use client";

import React, { useState } from "react";

export default function DiagnosticForm() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    bottleneck: "",
  });

  // Estados para la gestión de la UI
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  // Opciones de interés mapeadas con su valor interno, texto visible e información del botón
  const INTEREST_OPTIONS = {
    A: {
      label: "Queremos una auditoría e implantación de IA a medida (Formación High-Ticket)",
      buttonText: "Solicitar Diagnóstico Gratuito",
      successMessage: "Gracias. Nos pondremos en contacto contigo en menos de 24 horas para analizar vuestro flujo operativo.",
    },
    B: {
      label: "Queremos delegar procesos técnicos para que los ejecutéis con IA (Servicios)",
      buttonText: "Solicitar Diagnóstico Gratuito",
      successMessage: "Gracias. Nos pondremos en contacto contigo en menos de 24 horas para analizar vuestro flujo operativo.",
    },
    C: {
      label: "Quiero apuntarme a la lista de espera del SaaS (Normativas, 2D a 3D, Gestión)",
      buttonText: "Unirse a la Beta Privada",
      successMessage: "¡Ya estás en la lista de espera! Te notificaremos en cuanto el MVP esté disponible.",
    },
  };

  // Manejar cambios en las entradas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validaciones del formulario
  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "El nombre y apellidos son obligatorios.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "El email corporativo es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Introduce un formato de email válido.";
    } else {
      // Opcional: Validación básica de dominio corporativo común
      const commonDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
      const domain = formData.email.split("@")[1].toLowerCase();
      if (commonDomains.includes(domain)) {
        tempErrors.email = "Por favor, introduce un correo corporativo de tu estudio.";
      }
    }

    if (!formData.interest) {
      tempErrors.interest = "Debes seleccionar una opción de interés.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Manejador del envío del formulario (POST fetch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.artqui.ai/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          interest: formData.interest,
          bottleneck: formData.bottleneck.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reiniciar formulario manteniendo la selección previa por breves momentos o resetear completo
        setFormData({ name: "", email: "", interest: "", bottleneck: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar texto dinámico del botón según la opción de interés seleccionada
  const selectedOption = INTEREST_OPTIONS[formData.interest];
  const buttonText = selectedOption ? selectedOption.buttonText : "Comenzar Ahora";
  const successMessage = selectedOption ? selectedOption.successMessage : "Solicitud procesada correctamente.";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-gray-900/60 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Efecto de brillo ambiental sutil en el fondo de la tarjeta */}
        <div className="absolute -top-1/4 -right-1/4 w-72 height-72 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold font-title text-gray-100 mb-6 text-center md:text-left">
            Impulsa la Eficiencia de tu Estudio
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Campo: Nombre y Apellidos */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Nombre y Apellidos *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Carlos Martínez"
                className={`w-full bg-black/40 border ${
                  errors.name ? "border-red-500" : "border-white/10"
                } focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 text-gray-200 rounded px-4 py-3 outline-none transition duration-200 text-sm`}
              />
              {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name}</span>}
            </div>

            {/* Campo: Email Corporativo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email Corporativo *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="carlos@martinezarquitectos.com"
                className={`w-full bg-black/40 border ${
                  errors.email ? "border-red-500" : "border-white/10"
                } focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 text-gray-200 rounded px-4 py-3 outline-none transition duration-200 text-sm`}
              />
              {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email}</span>}
            </div>

            {/* Campo: Interés / Perfil */}
            <div className="flex flex-col gap-2">
              <label htmlFor="interest" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                ¿En qué está interesado tu estudio? *
              </label>
              <div className="relative">
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className={`w-full bg-black/40 border ${
                    errors.interest ? "border-red-500" : "border-white/10"
                  } focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 text-gray-200 rounded px-4 py-3 outline-none transition duration-200 text-sm appearance-none cursor-pointer`}
                >
                  <option value="" disabled className="bg-gray-900 text-gray-500">
                    Selecciona una opción...
                  </option>
                  {Object.entries(INTEREST_OPTIONS).map(([value, { label }]) => (
                    <option key={value} value={value} className="bg-gray-900 text-gray-200">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.interest && <span className="text-red-400 text-xs mt-1">{errors.interest}</span>}
            </div>

            {/* Campo Opcional: Mayor cuello de botella */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bottleneck" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Cuéntanos brevemente el mayor cuello de botella actual en tu estudio (opcional)
              </label>
              <textarea
                id="bottleneck"
                name="bottleneck"
                value={formData.bottleneck}
                onChange={handleChange}
                rows="4"
                placeholder="Ej. Perdemos demasiado tiempo analizando normativas municipales y justificando normativas en el CTE..."
                className="w-full bg-black/40 border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 text-gray-200 rounded px-4 py-3 outline-none transition duration-200 text-sm resize-none"
              />
            </div>

            {/* Botón de Envio */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 text-sm font-semibold rounded font-title text-black transition-all duration-300 relative overflow-hidden group shadow-lg ${
                isSubmitting
                  ? "bg-emerald-800 text-emerald-950 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] shadow-emerald-500/10 hover:shadow-emerald-400/25"
              }`}
            >
              {/* Brillo dinámico en hover */}
              <span className="absolute top-1/2 left-1/2 w-[120%] h-0 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-[45deg] group-hover:h-[300%] transition-all duration-500 pointer-events-none" />
              <span className="relative z-10">
                {isSubmitting ? "Procesando solicitud..." : buttonText}
              </span>
            </button>

            {/* Estado del Envío (Feedback) */}
            {submitStatus === "success" && (
              <div className="mt-4 p-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded text-sm text-center font-medium animate-fadeIn">
                {successMessage}
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mt-4 p-4 border border-red-500/30 bg-red-500/10 text-red-400 rounded text-sm text-center font-medium animate-fadeIn">
                Ha ocurrido un error al enviar tus datos. Por favor, inténtalo de nuevo o contáctanos directamente a hola@artqui.com.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
