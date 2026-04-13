# ALESPI Solutions Web

Landing page corporativa para ALESPI Solutions, enfocada en presentar servicios HVAC, experiencia técnica, credenciales y canales de contacto en una interfaz moderna, responsiva y modular.

El proyecto está construido con HTML, Tailwind CSS, PostCSS y JavaScript vanilla. La página principal carga parciales HTML desde `src/` para mantener una estructura más limpia y profesional.

## Resumen

- Arquitectura modular basada en parciales HTML.
- Estilos compilados con Tailwind CSS v3.
- Navegación por tabs para separar el contenido principal.
- Animaciones y transiciones personalizadas en CSS.
- Formulario de contacto con validación del lado del cliente.
- Preparado para ejecutarse como sitio estático mediante servidor local o hosting simple.

## Estructura del proyecto

```text
ALESPI SOLUIONS Web/
├── .gitignore             # Exclusiones del repositorio
├── images/                # Logos y recursos visuales
├── src/                   # Parciales HTML cargados dinámicamente
│   ├── contacto.html
│   ├── credenciales.html
│   ├── estadisticas.html
│   ├── expertiz.html
│   ├── footer.html
│   ├── hero.html
│   ├── navbar.html
│   ├── servicios.html
│   └── valores.html
├── index.html             # Shell principal de la aplicación
├── input.css              # Fuente de estilos con directivas Tailwind y CSS custom
├── output.css             # CSS compilado
├── postcss.config.js      # Configuración de PostCSS
├── script.js              # Carga de parciales e interacciones del frontend
├── tailwind.config.js     # Configuración de Tailwind CSS
├── package.json           # Scripts y dependencias del proyecto
├── package-lock.json      # Lockfile de dependencias
└── README.md              # Documentación del proyecto
```

## Arquitectura

### 1. Shell principal

`index.html` contiene la estructura base del documento, las referencias a CSS y JavaScript, y los contenedores donde se inyectan los parciales.

### 2. Parciales HTML

Los bloques principales del sitio viven dentro de `src/` y se cargan con `fetch()` al iniciar la página.

Esto permite:

- mantener el `index.html` liviano;
- separar responsabilidades por sección;
- facilitar cambios de contenido sin tocar toda la página;
- dar una estructura de repositorio más mantenible.

### 3. Lógica de frontend

`script.js` se encarga de:

- cargar los parciales declarados con `data-include`;
- inicializar la navegación por tabs;
- activar los CTA del hero;
- validar el formulario de contacto;
- manejar observadores para animaciones y estadísticas;
- aplicar comportamientos del navbar y scroll.

### 4. Estilos

`input.css` contiene:

- directivas de Tailwind;
- clases utilitarias personalizadas;
- componentes visuales reutilizables;
- animaciones y keyframes del sitio.

`output.css` es el archivo generado y el que realmente consume la página.

## Secciones del sitio

La interfaz actual está organizada en las siguientes pestañas:

- Inicio
- Servicios
- Expertiz
- Credenciales
- Contacto

Cada sección está separada en parciales para facilitar mantenimiento y futuras ampliaciones.

## Requisitos

- Node.js 14 o superior
- npm 6 o superior

## Instalación

```bash
npm install
```

## Desarrollo local

### 1. Compilar estilos

```bash
npm run build
```

### 2. Mantener compilación en modo watch

```bash
npm run dev
```

### 3. Levantar servidor local

```bash
npm start
```

El sitio queda disponible en:

```text
http://localhost:8080
```

## Scripts disponibles

```bash
npm run build:css   # Compila input.css hacia output.css
npm run watch:css   # Recompila CSS en modo watch
npm run build       # Alias de build:css
npm run dev         # Alias de watch:css
npm run dev:css     # Watch explícito de Tailwind
npm run serve       # Inicia live-server en el puerto 8080
npm start           # Inicia live-server en el puerto 8080
npm run preview     # Compila y levanta el servidor
```

## Flujo recomendado de trabajo

### Cambios de contenido

Edita el parcial correspondiente dentro de `src/`.

Ejemplos:

- `src/hero.html` para el bloque principal.
- `src/servicios.html` para la oferta de servicios.
- `src/contacto.html` para teléfonos, correos, mapa y formulario.

### Cambios de comportamiento

Edita `script.js` cuando necesites modificar:

- carga de parciales;
- tabs y navegación;
- validaciones del formulario;
- interacciones o animaciones basadas en JavaScript.

### Cambios visuales

Edita `input.css` para:

- clases de componentes;
- animaciones personalizadas;
- ajustes responsive;
- estilos de secciones y efectos visuales.

Después recompila con:

```bash
npm run build
```

## Consideraciones importantes

### El sitio debe ejecutarse con servidor

Como `script.js` carga parciales con `fetch()`, no conviene abrir `index.html` directamente desde el sistema de archivos.

Usa siempre un servidor local o un hosting estático real para evitar problemas de carga.

### Formulario de contacto

Actualmente el formulario valida datos en frontend y muestra notificaciones visuales, pero no envía la información a un backend.

Si se requiere envío real, el siguiente paso es integrar:

- un endpoint propio;
- un servicio de formularios;
- o una función serverless.

### CSS compilado

`output.css` es generado a partir de `input.css`. No es recomendable editarlo manualmente.

## Despliegue

El proyecto puede desplegarse como sitio estático en servicios como:

- Netlify
- Vercel
- GitHub Pages
- cualquier servidor HTTP simple

Condición clave: el hosting debe servir correctamente `index.html`, `output.css`, `script.js`, `images/` y `src/`.

## Personalización rápida

### Actualizar textos corporativos

Edita los parciales dentro de `src/`.

### Reemplazar logos o imágenes

Agrega o sustituye recursos dentro de `images/` y actualiza las rutas en los parciales correspondientes.

### Ajustar colores o tokens visuales

Revisa `tailwind.config.js` y `input.css`.

## Estado actual del proyecto

- Landing page modularizada.
- Navegación por tabs operativa.
- Build de Tailwind funcional.
- Estructura lista para mantenimiento y futuras iteraciones.

## Próximas mejoras sugeridas

- Integrar envío real del formulario.
- Sustituir placeholders de imágenes técnicas por fotografías del portafolio.
- Agregar meta tags SEO y Open Graph.
- Incorporar favicon e identidad visual completa.
- Añadir analítica o seguimiento de conversiones.

## Mantenimiento

Si se agregan nuevas secciones, el flujo recomendado es:

1. crear un nuevo parcial en `src/`;
2. agregar su contenedor en `index.html`;
3. conectar su tab o CTA en `script.js` si aplica;
4. recompilar estilos si hubo cambios en `input.css`.

## Licencia

Uso interno o según los términos definidos por el propietario del proyecto.
4. Agregar favicon en `<head>`
5. Implementar analytics (Google Analytics, Mixpanel)
6. Configurar dominio personalizado
7. Certificado SSL (HTTPS)

## 🎉 ¡Landing Page Lista para Producción!

Tu landing page está **completamente funcional y visualmente impactante**. Solo necesitas:

1. ✅ Estructura HTML optimizada
2. ✅ 20+ animaciones CSS3 avanzadas
3. ✅ Sistema de notificaciones
4. ✅ Formulario con validación
5. ✅ Responsivo en todos los dispositivos
6. ✅ Navbar sticky con menú hamburguesa
7. ⏳ [OPCIONAL] Imágenes del portafolio
8. ⏳ [OPCIONAL] Backend para formularios
9. ⏳ [OPCIONAL] Blog/Noticias
10. ⏳ [OPCIONAL] Integración CRM

---

**Versión:** 3.0 (Tailwind CSS v3.4.1 + Animaciones Avanzadas CSS3)
**Última actualización:** Enero 2026
**Stack Tecnológico:** HTML5 • Tailwind CSS • Font Awesome • JavaScript Vanilla
**Licencia:** Uso interno para ALESPI Solutions
**Desarrollador:** GitHub Copilot

### 📸 Vista Previa

Accesible en: **http://localhost:8080**

- ✨ Navbar animado con gradiente
- 🎬 Hero Section con múltiples animaciones
- 🎯 Tarjetas de servicios con efectos hover
- 📊 Sección de estadísticas con bounce y glow
- 📝 Formulario de contacto con validación
- 🎨 Paleta de colores profesional
- 📱 Completamente responsivo



