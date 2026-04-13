document.addEventListener('DOMContentLoaded', async function() {
    await loadPartials();
    initializeTabs();
    initializeHamburger();
    initializeContactForm();
    initializeAnchorScroll();
    initializeStatsObserver();
    initializeCardObserver();
    initializeNavbarShadow();
});

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabLinks = document.querySelectorAll('[data-open-tab]');

    tabButtons.forEach((button) => {
        button.addEventListener('click', function() {
            activateTab(this.getAttribute('data-tab'));
        });
    });

    tabLinks.forEach((link) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            activateTab(this.getAttribute('data-open-tab'));
        });
    });
}

function initializeHamburger() {
    const hamburger = document.querySelector('.hamburger');

    if (!hamburger) {
        return;
    }

    hamburger.addEventListener('click', () => {
        const tabsContainer = document.querySelector('nav');
        tabsContainer.classList.toggle('expanded');
    });
}

function initializeContactForm() {
    const formularioContacto = document.getElementById('formularioContacto');

    if (!formularioContacto) {
        return;
    }

    formularioContacto.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !asunto || !mensaje) {
            mostrarNotificacion('Por favor, completa todos los campos.', 'error');
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            mostrarNotificacion('Por favor, ingresa un email valido.', 'error');
            return;
        }

        console.log('Formulario enviado:', { nombre, email, asunto, mensaje });
        mostrarNotificacion('Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
        formularioContacto.reset();
    });
}

// Función para mostrar notificaciones
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
    
    // Auto-eliminar notificación después de 5 segundos
    setTimeout(() => {
        notificacion.classList.add('saliendo');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 5000);
}

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

function animarNumero(element) {
    const numero = element.textContent;
    const valorNumerico = parseInt(numero) || 0;
    const duracion = 2000; // 2 segundos
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

console.log('Script de ALESPI Solutions cargado correctamente');
