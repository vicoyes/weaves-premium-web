const contactMessages = {"es": {"name_company": "Escribe tu nombre y el de tu empresa.", "email": "Por favor, introduce un email válido.", "phone": "Por favor, introduce un teléfono válido.", "privacy": "Necesitamos tu autorización de privacidad para poder responderte.", "sending": "Enviando...", "received": "Recibido. Te escribimos en menos de 24 h hábiles.", "send_error": "No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos a info@weavewp.com.", "network": "Error de conexión. Verifica tu internet e inténtalo de nuevo.", "invalid_email": "Email no válido", "invalid_phone": "Teléfono no válido"}, "en": {"name_company": "Enter your name and company name.", "email": "Enter a valid email address.", "phone": "Enter a valid phone number.", "privacy": "We need your privacy consent to respond.", "sending": "Sending...", "received": "Received. We will write to you in less than 24 business hours.", "send_error": "We could not send your message. Try again or email info@weavewp.com.", "network": "Connection error. Check your connection and try again.", "invalid_email": "Invalid email address", "invalid_phone": "Invalid phone number"}};
const contactMessage = (key) => (contactMessages[document.documentElement.lang] || contactMessages.es)[key];
// ===================================
// FORMS.JS - Manejo de formularios
// ===================================

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Contact Form Handler (backend propio: /api/contacto)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const statusBox = document.getElementById('contactFormStatus');

    function setContactStatus(message, isError) {
        if (!statusBox) return;
        statusBox.textContent = message || '';
        statusBox.style.color = isError ? '#b42318' : '#0b7a6f';
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (this.dataset.sending === '1') return;

        const form = this;
        const data = Object.fromEntries(new FormData(form));
        data.privacidad = !!(form.elements.privacidad && form.elements.privacidad.checked);
        data.marketing = !!(form.elements.marketing && form.elements.marketing.checked);
        data.pagina = window.location.href.split('#')[0];
        data.origen = document.referrer || '';
        data.enviado_en = new Date().toISOString();
        data.idioma = document.documentElement.lang || 'es';
        data.lang = data.idioma;

        // Validation
        if (!data.name || data.name.trim().length < 2 || !data.company || data.company.trim().length < 2) {
            setContactStatus(contactMessage("name_company"), true);
            return;
        }
        if (!validateEmail(data.email || '')) {
            setContactStatus(contactMessage("email"), true);
            return;
        }
        if (data.phone && !validatePhone(data.phone)) {
            setContactStatus(contactMessage("phone"), true);
            return;
        }
        if (!data.privacidad) {
            setContactStatus(contactMessage("privacy"), true);
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = contactMessage("sending");
        submitBtn.disabled = true;
        form.dataset.sending = '1';
        setContactStatus('');

        try {
            const response = await fetch(form.getAttribute('action'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json().catch(() => null);

            if (response.ok && result && result.ok === true) {
                setContactStatus(contactMessage("received"), false);
                form.reset();
            } else {
                setContactStatus((result && result.error) || contactMessage("send_error"), true);
            }
        } catch (error) {
            setContactStatus(contactMessage("network"), true);
            console.error('Error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            delete form.dataset.sending;
        }
    });
}

// Real-time validation
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = 'red';
            showError(this, contactMessage("invalid_email"));
        } else {
            this.style.borderColor = '';
            removeError(this);
        }
    });
});

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = 'red';
            showError(this, contactMessage("invalid_phone"));
        } else {
            this.style.borderColor = '';
            removeError(this);
        }
    });
});

function showError(input, message) {
    removeError(input);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.cssText = 'color: red; font-size: 0.875rem; margin-top: 0.25rem;';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function removeError(input) {
    const error = input.parentElement.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Character counter for textareas
const textareas = document.querySelectorAll('textarea[maxlength]');
textareas.forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    if (maxLength) {
        const counter = document.createElement('div');
        counter.style.cssText = 'text-align: right; font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;';
        counter.textContent = `0 / ${maxLength}`;
        textarea.parentElement.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            counter.textContent = `${this.value.length} / ${maxLength}`;
            if (this.value.length >= maxLength * 0.9) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#6b7280';
            }
        });
    }
});

// Auto-save form data to localStorage
function autoSaveForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    function collectSafeFields() {
        const data = {};
        form.querySelectorAll('input, select, textarea').forEach(function (el) {
            if (!el.name) return;
            if (el.type === 'password') return;
            if (el.type === 'file') return;
            if (el.dataset && el.dataset.noAutosave === 'true') return;
            if (el.type === 'checkbox') {
                data[el.name] = el.checked ? el.value || '1' : '';
                return;
            }
            data[el.name] = el.value;
        });
        return data;
    }

    const savedData = localStorage.getItem(formId);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(function (key) {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type !== 'password' && input.type !== 'file') {
                    if (input.type === 'checkbox') {
                        input.checked = data[key] === '1' || data[key] === true || data[key] === 'on';
                    } else {
                        input.value = data[key];
                    }
                }
            });
        } catch (e) {
            /* ignore */
        }
    }

    form.addEventListener('input', function () {
        localStorage.setItem(formId, JSON.stringify(collectSafeFields()));
    });

    form.addEventListener('change', function () {
        localStorage.setItem(formId, JSON.stringify(collectSafeFields()));
    });

    form.addEventListener('submit', function () {
        localStorage.removeItem(formId);
    });
}

// El formulario de contacto ya no guarda PII en el navegador: limpia restos antiguos.
try { localStorage.removeItem('contactForm'); } catch (e) { /* ignore */ }

// Apply auto-save to forms
['diagnosticForm', 'clientRequestForm'].forEach(formId => {
    autoSaveForm(formId);
});

// File upload preview
function initFileInputPreviews() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        if (input.dataset.previewBound === '1') return;
        input.dataset.previewBound = '1';

        input.addEventListener('change', function (e) {
            const files = e.target.files;
            const container = input.closest('.form-file') || input.parentElement;
            const existingPreview = container.querySelector('.file-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            if (!files || files.length === 0) return;

            const preview = document.createElement('div');
            const inFormFile = !!input.closest('.form-file');
            preview.className = inFormFile ? 'file-preview form-file-preview' : 'file-preview';
            if (!inFormFile) {
                preview.style.cssText = 'margin-top: 0.5rem; padding: 0.5rem; background: #f3f4f6; border-radius: 0.25rem;';
            }

            function fmtSize(bytes) {
                if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
                return (bytes / 1024).toFixed(1) + ' KB';
            }

            if (files.length === 1) {
                preview.innerHTML =
                    '<strong>Archivo seleccionado:</strong><br>' +
                    files[0].name +
                    ' (' +
                    fmtSize(files[0].size) +
                    ')';
            } else {
                let list = '';
                for (let i = 0; i < files.length; i++) {
                    list += '<li>' + files[i].name + ' <span style="opacity:0.85">(' + fmtSize(files[i].size) + ')</span></li>';
                }
                preview.innerHTML =
                    '<strong>Archivos seleccionados (' + files.length + '):</strong><ul>' + list + '</ul>';
            }

            container.appendChild(preview);
        });
    });
}

initFileInputPreviews();
