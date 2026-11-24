// ===================================
// Eventos de Umami para getweaves.com
// El script del tracker se carga aparte; aquí solo se decide qué se envía.
// Regla: nada de esto puede romper la página ni el envío del formulario.
// ===================================
(function () {
    'use strict';

    function track(name, data) {
        try {
            if (window.umami && typeof window.umami.track === 'function') {
                window.umami.track(name, data || {});
            }
        } catch (e) { /* nunca romper por analítica */ }
    }

    // El tracker se carga con async: esperamos a que exista antes de los eventos de carga.
    function whenReady(cb) {
        if (window.umami) { cb(); return; }
        var intentos = 0;
        var t = setInterval(function () {
            if (window.umami) { clearInterval(t); cb(); }
            else if (++intentos > 60) { clearInterval(t); }
        }, 50);
    }

    var path = window.location.pathname;

    // --- service_view: los servicios viven en una sola página con ?id=
    if (/\/servicios\/servicio\.html$/.test(path)) {
        var slug = new URLSearchParams(window.location.search).get('id') || 'procesos';
        whenReady(function () { track('service_view', { slug: slug }); });
    }

    // --- case_study_view: cada caso tiene su propia URL
    var caso = path.match(/\/pages\/caso-([a-z0-9-]+)\.html$/);
    if (caso) {
        whenReady(function () { track('case_study_view', { slug: caso[1] }); });
    }

    // --- cta_click y whatsapp_click: delegación, un solo listener para todo el sitio
    var CTA = /(^|\s)(nav-cta|btn|btn-hero-primary|btn-hero-secondary|btn-primary|btn-cta-primary|btn-outline|btn-w|service-card-cta|feature-cta|proj-more|proj-card|link-arrow)(\s|$)/;

    function ubicacion(el) {
        var s = el.closest('section[id], header[id], footer[id], [id]');
        return s && s.id ? s.id : (s ? s.tagName.toLowerCase() : 'sin-seccion');
    }

    function destino(href) {
        try {
            var u = new URL(href, window.location.href);
            if (u.hostname && u.hostname !== window.location.hostname) return u.hostname;
            return u.pathname + (u.search || '');
        } catch (e) { return href; }
    }

    document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return;
        if (a.classList.contains('social-btn')) return; // perfiles sociales: ruido, no CTA

        var label = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
        var loc = ubicacion(a);

        if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
            track('whatsapp_click', { location: loc, label: label });
            return;
        }
        if (/^mailto:/i.test(href)) {
            track('cta_click', { label: label, location: loc, target: 'email' });
            return;
        }
        if (CTA.test(a.className || '')) {
            track('cta_click', { label: label, location: loc, target: destino(href) });
        }
    }, true);

    // --- form_start: primera vez que alguien toca un campo, una sola vez por sesión
    var empezado = false;
    document.addEventListener('focusin', function (ev) {
        if (empezado) return;
        var form = ev.target.closest && ev.target.closest('form');
        if (!form) return;
        try {
            if (window.sessionStorage.getItem('wv_form_start')) { empezado = true; return; }
        } catch (e) { /* modo privado: seguimos */ }
        empezado = true;
        try { window.sessionStorage.setItem('wv_form_start', '1'); } catch (e) { }
        track('form_start', {
            form: form.id || 'contacto',
            field: ev.target.name || ev.target.id || ev.target.type || ''
        });
    }, true);

    // --- form_submit: solo cuando el servidor confirma (los scripts disparan el evento)
    var enviado = false;
    document.addEventListener('weave:form-success', function (ev) {
        if (enviado) return;
        enviado = true;
        var d = (ev && ev.detail) || {};
        var params = new URLSearchParams(window.location.search);
        track('form_submit', {
            form: d.form || 'contacto',
            proceso: d.proceso || '',
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            pagina: window.location.pathname
        });
    });
})();
