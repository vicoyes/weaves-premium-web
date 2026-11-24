// ===================================
// Carga el CTA de contacto compartido (components/contact-form.html)
// en cualquier página que tenga <div data-contact-form></div>.
// ===================================
(function () {
    'use strict';

    var slots = document.querySelectorAll('[data-contact-form]');
    if (!slots.length) return;

    // La base se deduce del propio <script>, así funciona en /, /pages/, /sectores/…
    var script = document.currentScript;
    var base = '';
    if (script && script.src) base = script.src.replace(/js\/contact-form-loader\.js.*$/, '');

    fetch(base + 'components/contact-form.html?v=20261123-6', { cache: 'no-store' })
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        })
        .then(function (html) {
            slots.forEach(function (slot) { slot.innerHTML = html; });
        })
        .catch(function () {
            slots.forEach(function (slot) {
                slot.innerHTML =
                    '<p class="contact-fallback">No pudimos cargar el formulario. ' +
                    'Escríbenos a <a href="mailto:info@weavewp.com">info@weavewp.com</a> y te contestamos igual.</p>';
            });
        });
})();
