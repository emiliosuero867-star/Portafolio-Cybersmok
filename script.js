
// ========================================
// EMILIO.DEV - JAVASCRIPT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. FONDO MATRIX
  const canvas = document.getElementById("matrix");
  const ctx = canvas ? canvas.getContext("2d") : null;

  if (canvas && ctx) {
    const chars =
      "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const fontSize = 15;
    let drops = [];
    let animationId = null;
    let lastFrame = 0;

    function resizeMatrix() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.ceil(window.innerWidth / fontSize);

      drops = Array.from(
        { length: columns },
        () => Math.random() * -40
      );
    }

    function drawMatrix(timestamp) {
      if (timestamp - lastFrame >= 50) {
        lastFrame = timestamp;

        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );

        ctx.fillStyle = "#00ff9d";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
          const char =
            chars[Math.floor(Math.random() * chars.length)];

          ctx.fillText(
            char,
            i * fontSize,
            drops[i] * fontSize
          );

          if (
            drops[i] * fontSize > window.innerHeight &&
            Math.random() > 0.975
          ) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      animationId = requestAnimationFrame(drawMatrix);
    }

    resizeMatrix();
    animationId = requestAnimationFrame(drawMatrix);

    window.addEventListener("resize", resizeMatrix);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
        }

        animationId = null;
      } else if (animationId === null) {
        lastFrame = 0;
        animationId = requestAnimationFrame(drawMatrix);
      }
    });
  }

  // 2. MODO OSCURO Y CLARO
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    document.body.classList.toggle(
      "light",
      theme === "light"
    );

    if (themeToggle) {
      themeToggle.innerHTML =
        theme === "light"
          ? '<i class="bi bi-moon-fill"></i>'
          : '<i class="bi bi-sun-fill"></i>';

      themeToggle.setAttribute(
        "aria-label",
        theme === "light"
          ? "Activar modo oscuro"
          : "Activar modo claro"
      );
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.body.classList.contains("light")
          ? "dark"
          : "light";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("theme", nextTheme);
      } catch (error) {
        // El cambio de tema seguirá funcionando.
      }
    });
  }

  // 3. FILTROS DE PROYECTOS
  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const projects =
    document.querySelectorAll(".project-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const filter = button.dataset.filter;

      projects.forEach((project) => {
        const matches =
          filter === "all" ||
          project.dataset.category === filter;

        project.classList.toggle("d-none", !matches);
      });
    });

    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active") ? "true" : "false"
    );
  });

  // 4. FORMULARIO DE CONTACTO
  // Esta versión valida el formulario, pero no envía correos.
  // Para enviar mensajes reales, configura EmailJS.

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const name = nameInput.value.trim();

      formMessage.textContent =
        `Gracias${name ? ", " + name : ""}. ` +
        "El formulario se validó correctamente. " +
        "Para enviar el correo real, debes conectar EmailJS.";

      formMessage.style.color = "var(--primary)";

      contactForm.reset();
    });
  }

  // 5. MENSAJE DE CONSOLA
  console.log("EMILIO.DEV: portafolio iniciado correctamente.");

});
