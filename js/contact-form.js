// ===================================
// Formulario de contacto — home
// Validación, consentimiento y envío al webhook de n8n.
// Sin JS el formulario hace POST nativo a la misma URL.
// ===================================
(function () {
    'use strict';

    var form = document.getElementById('contacto-form');
    if (!form) return;

    var successBox = document.getElementById('cf-success');
    var statusBox = document.getElementById('cf-status');
    var submitBtn = form.querySelector('.cf-submit');
    var submitLabel = form.querySelector('.cf-submit-label');
    var sending = false;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    var rules = {
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

    function field(name) { return form.elements[name]; }

    function setError(name, hasError) {
        var rule = rules[name];
        if (!rule) return;
        var input = document.getElementById(rule.el);
        var err = document.getElementById(rule.err);
        if (!input || !err) return;
        input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
        err.hidden = !hasError;
    }

    function validate() {
        var firstInvalid = null;
        Object.keys(rules).forEach(function (name) {
            var rule = rules[name];
            var input = document.getElementById(rule.el);
            if (!input) return;
            var ok = rule.test(input.value || '', input);
            setError(name, !ok);
            if (!ok && !firstInvalid) firstInvalid = input;
        });
        return firstInvalid;
    }

    // Limpia el error del campo en cuanto la persona lo corrige.
    Object.keys(rules).forEach(function (name) {
        var input = document.getElementById(rules[name].el);
        if (!input) return;
        var evt = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(evt, function () {
            if (input.getAttribute('aria-invalid') === 'true' && rules[name].test(input.value || '', input)) {
                setError(name, false);
            }
        });
    });

    function setStatus(message, isError) {
        if (!statusBox) return;
        statusBox.textContent = message || '';
        statusBox.className = 'cf-status' + (isError ? ' is-error' : '');
    }

    function setLoading(isLoading) {
        sending = isLoading;
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
        if (submitLabel) submitLabel.textContent = isLoading ? 'Enviando…' : 'Enviar y pedir la llamada';
    }

    function hidden(name, value) {
        var input = form.elements[name];
        if (input) input.value = value;
    }

    function fillTracking() {
        var params = new URLSearchParams(window.location.search);
        hidden('pagina', window.location.href.split('#')[0]);
        hidden('origen', document.referrer || '');
        hidden('utm_source', params.get('utm_source') || '');
        hidden('utm_medium', params.get('utm_medium') || '');
        hidden('utm_campaign', params.get('utm_campaign') || '');
        hidden('enviado_en', new Date().toISOString());
    }

    function payload() {
        var data = {};
        new FormData(form).forEach(function (value, key) {
            data[key] = value;
        });
        data.privacidad = form.elements.privacidad.checked;
        data.marketing = form.elements.marketing.checked;
        data.idioma = document.documentElement.lang || 'es';
        return data;
    }

    function showSuccess() {
        if (!successBox) return;
        form.hidden = true;
        successBox.hidden = false;
        if (typeof successBox.focus === 'function') successBox.focus();
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'contacto_enviado', proceso: form.elements.proceso.value });
        } catch (e) { /* la analítica nunca debe romper el envío */ }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (sending) return;

        var firstInvalid = validate();
        if (firstInvalid) {
            setStatus('Revisa los campos marcados.', true);
            if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
            return;
        }

        // Trampa para bots: si el campo oculto viene relleno, fingimos éxito y no enviamos nada.
        if (form.elements.website && form.elements.website.value.trim() !== '') { showSuccess(); return; }

        setStatus('');
        setLoading(true);
        fillTracking();

        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

        fetch(form.getAttribute('action'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload()),
            signal: controller ? controller.signal : undefined
        })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (data) {
                if (!data || data.ok !== true) throw new Error('Respuesta no válida');
                showSuccess();
            })
            .catch(function () {
                setStatus('No pudimos enviar el formulario. Vuelve a intentarlo o escríbenos a info@weavewp.com — tus datos siguen aquí.', true);
            })
            .then(function () {
                if (timer) clearTimeout(timer);
                setLoading(false);
            });
    });
})();
