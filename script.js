// Punto de entrada de la interfaz: primero carga el HTML modular y después activa cada comportamiento dependiente del DOM.
document.addEventListener('DOMContentLoaded', async function() {
    await loadPartials();
    initializeTabs();
    initializeHamburger();
    initializeCarousels();
    initializeServiceStories();
    initializeContactForm();
    initializePrivacyModal();
    initializeAnchorScroll();
    initializeStatsObserver();
    initializeCardObserver();
    initializeNavbarShadow();
    initializeExpertizGallery();
    initializeVideoThumbnails();
});

// Inserta en la página cada parcial declarado con data-include para mantener el index.html como un shell liviano.
async function loadPartials() {
    const partialTargets = document.querySelectorAll('[data-include]');

    await Promise.all(Array.from(partialTargets).map(async (target) => {
        const partialPath = target.getAttribute('data-include');

        try {
            const response = await fetch(partialPath);

            if (!response.ok) {
                throw new Error(`No se pudo cargar ${partialPath}`);
            }

            target.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
            target.innerHTML = `<div class="p-6 text-red-600">Error al cargar ${partialPath}</div>`;
        }
    }));
}

// Reinicia clases de animación cuando una pestaña vuelve a mostrarse para que los efectos se reproduzcan otra vez.
function restartAnimations(container) {
    const animatedElements = container.querySelectorAll('[class*="animate-"]');

    animatedElements.forEach((element) => {
        const animationClasses = Array.from(element.classList).filter((className) => className.startsWith('animate-'));

        if (animationClasses.length === 0) {
            return;
        }

        animationClasses.forEach((className) => element.classList.remove(className));
        void element.offsetWidth;
        animationClasses.forEach((className) => element.classList.add(className));
    });
}

// Activa una pestaña de contenido, sincroniza el estado visual del menú y rehidrata efectos dependientes de la vista activa.
function activateTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const targetButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    const activeContent = document.querySelector(`[data-tab-content="${tabName}"]`);

    if (!targetButton || !activeContent || targetButton.classList.contains('tab-active')) {
        return;
    }

    tabButtons.forEach((btn) => btn.classList.remove('tab-active'));
    tabContents.forEach((content) => content.classList.add('hidden'));

    targetButton.classList.add('tab-active');
    activeContent.classList.remove('hidden');
    restartAnimations(activeContent);
    initializeServiceStories();
    if (tabName === 'expertiz') {
        initializeExpertizGallery();
        initializeVideoThumbnails();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Vincula tanto los botones del navbar como los CTA internos que abren una pestaña específica.
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabLinks = document.querySelectorAll('[data-open-tab]');
    const navElement = document.querySelector('nav');

    tabButtons.forEach((button) => {
        button.addEventListener('click', function() {
            activateTab(this.getAttribute('data-tab'));
            navElement?.classList.remove('expanded');
            document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
            document.querySelector('.hamburger')?.setAttribute('aria-label', 'Abrir menú');
        });
    });

    tabLinks.forEach((link) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            activateTab(this.getAttribute('data-open-tab'));
            navElement?.classList.remove('expanded');
            document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
            document.querySelector('.hamburger')?.setAttribute('aria-label', 'Abrir menú');
        });
    });
}

// Controla la expansión del menú en móvil reutilizando una clase sobre el elemento nav.
function initializeHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('nav');

    if (!hamburger || !navbar) {
        return;
    }

    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('expanded');
        const isExpanded = navbar.classList.contains('expanded');
        hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        hamburger.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
    });
}

// Valida campos obligatorios y formato de correo antes de enviar el formulario al backend.
function initializeContactForm() {
    const formularioContacto = document.getElementById('formularioContacto');

    if (!formularioContacto) {
        return;
    }

    formularioContacto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !empresa || !asunto || !mensaje) {
            mostrarNotificacion('Por favor, completa todos los campos.', 'error');
            return;
        }

        const regexNombre = /^[^\d]+$/;
        if (!regexNombre.test(nombre)) {
            mostrarNotificacion('El nombre no puede contener números.', 'error');
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            mostrarNotificacion('Por favor, ingresa un email válido.', 'error');
            return;
        }

        const submitButton = formularioContacto.querySelector('button[type="submit"]');
        const originalButtonText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }

        try {
            const response = await emailjs.send(
                "service_jct37c5",
                "template_4nys7kf",
                {
                    nombre,
                    email,
                    empresa,
                    asunto,
                    mensaje
                }
            );

            // Correo a ALESPI (admin)
            await emailjs.send(
                "service_jct37c5",
                "template_2yuc1er",
            {
                nombre,
                email,
                empresa,
                asunto,
                mensaje
         }
    );

            console.log("Email enviado:", response);

            mostrarNotificacion(
                '¡Mensaje recibido! Pronto recibirás una confirmación en tu correo.',
                'success'
            );

            formularioContacto.reset();

        } catch (error) {
            console.error("Error EmailJS:", error);

            mostrarNotificacion(
                error?.text || 'Ocurrió un error al enviar el formulario.',
                'error'
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

function initializePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (!modal) {
        return;
    }

    const showModal = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        Object.assign(modal.style, {
            display: 'flex',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '9999',
            opacity: '1',
            visibility: 'visible',
            backgroundColor: 'rgba(15, 23, 42, 0.88)'
        });
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        document.body.style.overflow = '';
    };

    const openButtons = document.querySelectorAll('[data-open-privacy]');
    openButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            showModal();
        });
    });

    const closeButtons = document.querySelectorAll('[data-close-privacy]');
    closeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            hideModal();
        });
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

// Inicializa cualquier carrusel declarado con atributos data-carousel y encapsula estado por instancia.
function initializeCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach((carousel) => {
        const slides = carousel.querySelectorAll('[data-carousel-slide]');
        const dots = carousel.querySelectorAll('[data-carousel-dot]');
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');

        if (!slides.length) {
            return;
        }

        let currentIndex = 0;
        let intervalId;

        const updateCarousel = (newIndex) => {
            currentIndex = (newIndex + slides.length) % slides.length;

            slides.forEach((slide, index) => {
                const isActive = index === currentIndex;
                slide.classList.toggle('opacity-100', isActive);
                slide.classList.toggle('opacity-0', !isActive);
                slide.classList.toggle('pointer-events-none', !isActive);
            });

            dots.forEach((dot, index) => {
                const isActive = index === currentIndex;
                dot.classList.toggle('bg-white', isActive);
                dot.classList.toggle('bg-white/40', !isActive);
            });
        };

        const startAutoplay = () => {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 4500);
        };

        prevButton?.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
            startAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
            startAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
                startAutoplay();
            });
        });

        updateCarousel(0);
        startAutoplay();
    });
}

// Gestiona la activación de tarjetas de servicios según el scroll y aplica un desplazamiento sutil en sus imágenes.
function initializeServiceStories() {
    const storiesRoot = document.querySelector('[data-service-stories]');

    if (!storiesRoot) {
        return;
    }

    const steps = Array.from(storiesRoot.querySelectorAll('[data-service-step]'));

    if (!steps.length) {
        return;
    }

    const activateStory = (storyId) => {
        if (!storyId) {
            return;
        }

        steps.forEach((step) => {
            step.classList.toggle('is-active', step.dataset.serviceStep === storyId);
        });
    };

    let ticking = false;

    const updateParallax = () => {
        const isDesktop = window.innerWidth >= 1024;

        steps.forEach((step) => {
            const rect = step.getBoundingClientRect();
            const media = step.querySelector('.service-story-gallery');

            if (!media) {
                return;
            }

            if (!isDesktop) {
                media.style.setProperty('--service-card-offset', '0px');
                return;
            }

            const viewportCenter = window.innerHeight * 0.5;
            const cardCenter = rect.top + rect.height / 2;
            const offset = Math.max(-24, Math.min(24, (viewportCenter - cardCenter) * 0.06));
            media.style.setProperty('--service-card-offset', `${offset}px`);
        });

        ticking = false;
    };

    const requestParallax = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateParallax);
    };

    const refreshStories = () => {
        const firstVisibleStep = steps.find((step) => {
            const rect = step.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.62 && rect.bottom > window.innerHeight * 0.22;
        });

        activateStory(firstVisibleStep?.dataset.serviceStep || steps[0].dataset.serviceStep);
        requestParallax();
    };

    if (storiesRoot.dataset.serviceStoriesReady === 'true') {
        refreshStories();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries.length) {
            activateStory(visibleEntries[0].target.dataset.serviceStep);
        }
    }, {
        threshold: [0.3, 0.45, 0.6, 0.75],
        rootMargin: '-12% 0px -28% 0px'
    });

    steps.forEach((step) => observer.observe(step));

    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', refreshStories);

    storiesRoot.dataset.serviceStoriesReady = 'true';
    refreshStories();
}

// Construye una notificación temporal y registra sus estilos una sola vez para no duplicar reglas en el documento.
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    const estilo = document.createElement('style');
    if (!document.querySelector('style[data-notificacion]')) {
        estilo.setAttribute('data-notificacion', 'true');
        estilo.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                animation: slideIn 0.3s ease-out;
                z-index: 1000;
                max-width: 400px;
            }
            
            .notificacion-success {
                background-color: #4caf50;
            }
            
            .notificacion-error {
                background-color: #f44336;
            }
            
            .notificacion-info {
                background-color: #2196f3;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOut {
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            
            .notificacion.saliendo {
                animation: slideOut 0.3s ease-out forwards;
            }

            @media (max-width: 768px) {
                .notificacion {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(estilo);
    }
    
    document.body.appendChild(notificacion);
    
    // La salida se difiere para que la animación de cierre se complete antes de retirar el nodo del DOM.
    setTimeout(() => {
        notificacion.classList.add('saliendo');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 5000);
}

// Suaviza el desplazamiento de anclas internas sin interferir con los enlaces que cambian de pestaña.
function initializeAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (this.hasAttribute('data-open-tab')) {
                return;
            }

            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Observa los contadores numéricos para iniciar su animación solo cuando entran en el viewport.
function initializeStatsObserver() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.classList.contains('stat-number')) {
                animarNumero(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-number').forEach((element) => {
        observer.observe(element);
    });
}

// Anima la cuenta ascendente hasta alcanzar el valor final renderizado en la tarjeta.
function animarNumero(element) {
    const numero = element.textContent;
    const valorNumerico = parseInt(numero) || 0;
    const duracion = 2000;
    const incremento = valorNumerico / (duracion / 50);
    
    let valorActual = 0;
    const intervalo = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorNumerico) {
            element.textContent = numero;
            clearInterval(intervalo);
        } else {
            element.textContent = Math.floor(valorActual) + '+';
        }
    }, 50);
}

// Aplica una revelación progresiva a tarjetas de valor y servicio cuando aparecen en pantalla.
function initializeCardObserver() {
    const animarElementos = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animarElementos.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.service-card, .valor-card').forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animarElementos.observe(element);
    });
}

// Ajusta la sombra del navbar según el desplazamiento para reforzar jerarquía visual en scroll.
function initializeNavbarShadow() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}


// Inicializa la galería de expertiz con transiciones fade automáticas cada 3 segundos.
function initializeExpertizGallery() {
    const slides = document.querySelectorAll('.expertiz-gallery-slide');
    const dotsContainer = document.getElementById('expertizDots');

    if (!slides.length || !dotsContainer) return;

    // Evitar doble inicialización
    if (dotsContainer.dataset.initialized === 'true') return;
    dotsContainer.dataset.initialized = 'true';

    let current = 0;
    let timer;

    // Limpiar dots previos si los hay
    dotsContainer.innerHTML = '';

    slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'expertiz-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Imagen ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 3000);
    }

    resetTimer();
}

// Muestra el primer fotograma real de cada video en lugar de pantalla negra.
function initializeVideoThumbnails() {
    ['vidPlayer1', 'vidPlayer2'].forEach(function (id) {
        const video = document.getElementById(id);
        if (!video) return;

        function seekToFrame() {
            video.currentTime = 0.5;
        }

        video.addEventListener('seeked', function handler() {
            video.pause();
            video.removeEventListener('seeked', handler);
        });

        if (video.readyState >= 2) {
            seekToFrame();
        } else {
            video.addEventListener('loadeddata', seekToFrame, { once: true });
        }
    });
}

console.log('Script de ALESPI Solutions cargado correctamente');