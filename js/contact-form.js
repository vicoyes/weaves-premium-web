// ===================================
// Formulario de contacto (CTA compartido)
// Validación, consentimiento y envío al webhook de n8n.
// Usa delegación en document: funciona también cuando el formulario se inyecta
// después de cargar la página (components/contact-form.html).
// Sin JS, el formulario hace POST nativo a la misma URL.
// ===================================
(function () {
    'use strict';

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function rulesFor() {
        return {
            nombre: {
                el: 'cf-nombre', err: 'cf-nombre-err',
                test: function (v) { return v.trim().length >= 2; }
            },
            empresa: {
                el: 'cf-empresa', err: 'cf-empresa-err',
                test: function (v) { return v.trim().length >= 2; }
            },
            email: {
                el: 'cf-email', err: 'cf-email-err',
                test: function (v) { return EMAIL_RE.test(v.trim()); }
            },
            proceso: {
                el: 'cf-proceso', err: 'cf-proceso-err',
                test: function (v) { return v.trim() !== ''; }
            },
            privacidad: {
                el: 'cf-privacidad', err: 'cf-privacidad-err',
                test: function (_, el) { return el.checked; }
            }
        };
    }

    function setError(form, rule, hasError) {
        var input = form.querySelector('#' + rule.el);
        var err = form.querySelector('#' + rule.err);
        if (!input || !err) return;
        input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
        err.hidden = !hasError;
    }

    function validate(form, rules) {
        var firstInvalid = null;
        Object.keys(rules).forEach(function (name) {
            var rule = rules[name];
            var input = form.querySelector('#' + rule.el);
            if (!input) return;
            var ok = rule.test(input.value || '', input);
            setError(form, rule, !ok);
            if (!ok && !firstInvalid) firstInvalid = input;
        });
        return firstInvalid;
    }

    function setStatus(form, message, isError) {
        var box = form.querySelector('#cf-status');
        if (!box) return;
        box.textContent = message || '';
        box.className = 'cf-status' + (isError ? ' is-error' : '');
    }

    function setLoading(form, isLoading) {
        var btn = form.querySelector('.cf-submit');
        var label = form.querySelector('.cf-submit-label');
        if (!btn) return;
        btn.disabled = isLoading;
        btn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
        if (label) label.textContent = isLoading ? 'Enviando…' : 'Enviar y pedir la llamada';
    }

    function hidden(form, name, value) {
        var input = form.elements[name];
        if (input) input.value = value;
    }

    function fillTracking(form) {
        var params = new URLSearchParams(window.location.search);
        hidden(form, 'pagina', window.location.href.split('#')[0]);
        hidden(form, 'origen', document.referrer || '');
        hidden(form, 'utm_source', params.get('utm_source') || '');
        hidden(form, 'utm_medium', params.get('utm_medium') || '');
        hidden(form, 'utm_campaign', params.get('utm_campaign') || '');
        hidden(form, 'enviado_en', new Date().toISOString());
    }

    function payload(form) {
        var data = {};
        new FormData(form).forEach(function (value, key) { data[key] = value; });
        data.privacidad = form.elements.privacidad.checked;
        data.marketing = form.elements.marketing.checked;
        data.idioma = document.documentElement.lang || 'es';
        return data;
    }

    function showSuccess(form) {
        var scope = form.closest('.contact-inner') || form.parentNode;
        var success = scope.querySelector('#cf-success');
        if (!success) return;
        form.hidden = true;
        success.hidden = false;
        if (typeof success.focus === 'function') success.focus();
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'contacto_enviado', proceso: form.elements.proceso.value });
        } catch (e) { /* la analítica nunca debe romper el envío */ }
    }

    // Limpia el error en cuanto la persona corrige el campo (delegado).
    function clearOnFix(event) {
        var input = event.target;
        if (!input || !input.id) return;
        var form = input.closest('#contacto-form');
        if (!form) return;
        var rules = rulesFor();
        Object.keys(rules).forEach(function (name) {
            var rule = rules[name];
            if (rule.el !== input.id) return;
            if (input.getAttribute('aria-invalid') === 'true' && rule.test(input.value || '', input)) {
                setError(form, rule, false);
            }
        });
    }
    document.addEventListener('input', clearOnFix);
    document.addEventListener('change', clearOnFix);

    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.id !== 'contacto-form') return;
        event.preventDefault();
        if (form.dataset.sending === '1') return;

        var rules = rulesFor();
        var firstInvalid = validate(form, rules);
        if (firstInvalid) {
            setStatus(form, 'Revisa los campos marcados.', true);
            if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
            return;
        }

        // Trampa para bots: si el campo oculto viene relleno, fingimos éxito y no enviamos nada.
        if (form.elements.website && form.elements.website.value.trim() !== '') { showSuccess(form); return; }

        setStatus(form, '');
        setLoading(form, true);
        form.dataset.sending = '1';
        fillTracking(form);

        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

        fetch(form.getAttribute('action'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload(form)),
            signal: controller ? controller.signal : undefined
        })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (data) {
                if (!data || data.ok !== true) throw new Error('Respuesta no válida');
                showSuccess(form);
            })
            .catch(function () {
                setStatus(form, 'No pudimos enviar el formulario. Vuelve a intentarlo o escríbenos a info@weavewp.com — tus datos siguen aquí.', true);
            })
            .then(function () {
                if (timer) clearTimeout(timer);
                setLoading(form, false);
                delete form.dataset.sending;
            });
    });
})();
