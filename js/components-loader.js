// ===================================
// COMPONENTS LOADER - Carga Header y Footer
// ===================================

// Función para obtener la ruta correcta a los componentes según la ubicación de la página
function getComponentsPath() {
    const path = window.location.pathname;

    // Nº de carpetas por encima del archivo. Antes se comprobaba
    // path.endsWith('index.html') primero, así que /servicios/index.html
    // devolvía './components/' y buscaba en /servicios/components/ (404).
    const dirs = path.split('/').filter(Boolean);
    const depth = path.endsWith('/') ? dirs.length : dirs.length - 1;

    return depth <= 0 ? './components/' : '../'.repeat(depth) + 'components/';
}

// Versión de componentes para evitar que el navegador conserve header o footer antiguos
const COMPONENT_VERSION = '20260825-5';

// Función para cargar componentes HTML
async function loadComponent(elementId, componentFile) {
    // Si la página ya trae el componente en el HTML (para que pinte en el primer
    // frame, sin el salto de ver la página sin cabecera), no lo sobrescribimos.
    const existing = document.getElementById(elementId);
    if (existing && existing.children.length > 0) return;

    const basePath = getComponentsPath();
    const componentPath = basePath + componentFile;
    const versionedPath = componentPath + '?v=' + COMPONENT_VERSION;
    
    try {
        const response = await fetch(versionedPath, { cache: 'no-store' });
        if (!response.ok) {
            // Si falla, intentar con ruta absoluta desde la raíz
            const fallbackPath = '/components/' + componentFile;
            const fallbackResponse = await fetch(fallbackPath + '?v=' + COMPONENT_VERSION, { cache: 'no-store' });
            if (!fallbackResponse.ok) throw new Error(`Error loading ${componentPath} and ${fallbackPath}`);
            const html = await fallbackResponse.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
            return;
        }
        
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
        console.error('Attempted paths:', componentPath);
    }
}

// Función para marcar el enlace activo en el navegación
function setActiveNavLink() {
    // Si el HTML ya trae un activo marcado (páginas con el nav inline), respetarlo.
    if (document.querySelector('.nav-links a.active')) return;

    let current = window.location.pathname;
    if (current.endsWith('/')) current += 'index.html';

    // La sección es la primera carpeta: /servicios/web.html marca "Qué hacemos".
    const section = current.split('/').filter(Boolean)[0] || '';

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = new URL(link.getAttribute('href'), window.location.origin).pathname;
        const linkSection = href.split('/').filter(Boolean)[0] || '';
        const isHome = href === '/index.html';
        const match = isHome
            ? (current === '/index.html')
            : (href === current || (linkSection && linkSection === section));
        link.classList.toggle('active', match);
        if (match) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar header y footer
    await loadComponent('header-placeholder', 'header.html');
    await loadComponent('footer-placeholder', 'footer.html');
    
    // Marcar enlace activo después de cargar el header
    setTimeout(setActiveNavLink, 100);
    
    // Re-inicializar el menú móvil después de cargar el header
    initMobileMenu();
    
    // Iniciar efecto de scroll para el nav
    initNavScroll();
});

// Función para efecto blur al hacer scroll en nav
function initNavScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('nav');
        if (!nav) return;
        if (window.scrollY > 60) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
    // Trigger inicial por si recarga la página ya estando abajo
    const ev = new Event('scroll');
    window.dispatchEvent(ev);
}

// Función para inicializar el menú móvil
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}
