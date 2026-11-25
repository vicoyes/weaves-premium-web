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

    var english = document.documentElement.lang === 'en';
    fetch(base + 'components/' + (english ? 'contact-form-en.html' : 'contact-form.html') + '?v=20261124-1', { cache: 'no-store' })
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        })
        .then(function (html) {
            slots.forEach(function (slot) { slot.innerHTML = html; });
        })
        .catch(function () {
            slots.forEach(function (slot) {
                slot.innerHTML = english ? '<p class="contact-fallback">We could not load the form. Email <a href="mailto:info@weavewp.com">info@weavewp.com</a> and we will respond.</p>' :
                    '<p class="contact-fallback">No pudimos cargar el formulario. ' +
                    'Escríbenos a <a href="mailto:info@weavewp.com">info@weavewp.com</a> y te contestamos igual.</p>';
            });
        });
})();
