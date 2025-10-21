const form = document.getElementById('registrationForm');
const feedback = document.getElementById('formFeedback');

const validators = {
    name: value => /^[A-ZÀ-ÖÙ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'\s]{9,}$/.test(value.trim()),
    maternalName: value => /^[A-ZÀ-ÖÙ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'\s]{9,}$/.test(value.trim()),
    cpf: value => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value.trim()),
    cellphone: value => /^\+55\(\d{2}\)9\d{4}-\d{4}$/.test(value.trim()),
    landline: value => /^\+55\(\d{2}\)[2-5]\d{3}-\d{4}$/.test(value.trim()),
    address: value => /^(Rua|Avenida|Av\.|Travessa)\s+.{10,}$/i.test(value.trim()),
    login: value => /^[A-Z]{5}$/.test(value.trim()),
    password: value => /^[A-Za-z0-9]{7}$/.test(value),
    confirmPassword: (value, fields) => value === fields.password.value && value.length > 0,
    birthDate: value => Boolean(value)
};

const errorMessages = {
    name: 'Informe pelo menos 10 caracteres iniciando com letra maiúscula.',
    maternalName: 'Informe pelo menos 10 caracteres iniciando com letra maiúscula.',
    cpf: 'Digite o CPF no formato 000.000.000-00.',
    cellphone: 'Use o formato +55(DD)9XXXX-XXXX.',
    landline: 'Use o formato +55(DD)2XXX-XXXX até +55(DD)5XXX-XXXX.',
    address: 'Comece com Rua, Avenida, Travessa ou Av. e detalhe o endereço.',
    login: 'Utilize exatamente 5 letras maiúsculas.',
    password: 'A senha deve ter 7 caracteres alfanuméricos.',
    confirmPassword: 'As senhas precisam ser idênticas.',
    birthDate: 'Informe uma data de nascimento válida.'
};

function getFieldWrapper(element) {
    return element.closest('[data-field]');
}

function showError(field, message) {
    const wrapper = getFieldWrapper(field);
    const errorElement = document.querySelector(`[data-error-for="${field.name}"]`);
    if (wrapper) {
        wrapper.dataset.invalid = 'true';
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
    field.setAttribute('aria-invalid', 'true');
}

function clearError(field) {
    const wrapper = getFieldWrapper(field);
    const errorElement = document.querySelector(`[data-error-for="${field.name}"]`);
    if (wrapper) {
        wrapper.removeAttribute('data-invalid');
    }
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.removeAttribute('aria-invalid');
}

function validateField(field, fields) {
    const validator = validators[field.name];
    if (!validator) {
        return true;
    }

    const isValid = validator(field.value, fields);
    if (!isValid) {
        showError(field, errorMessages[field.name]);
    } else {
        clearError(field);
    }
    return isValid;
}

function validateGender() {
    const genderInputs = form.querySelectorAll('input[name="gender"]');
    const errorElement = document.querySelector('[data-error-for="gender"]');
    const wrapper = genderInputs[0]?.closest('[data-field]');
    const checked = Array.from(genderInputs).some(input => input.checked);

    if (!checked) {
        if (wrapper) {
            wrapper.dataset.invalid = 'true';
        }
        if (errorElement) {
            errorElement.textContent = 'Selecione uma opção.';
        }
    } else {
        if (wrapper) {
            wrapper.removeAttribute('data-invalid');
        }
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    return checked;
}

function setFeedback(message, status) {
    if (!feedback) {
        return;
    }
    if (message) {
        feedback.textContent = message;
        feedback.dataset.status = status;
    } else {
        feedback.textContent = '';
        feedback.removeAttribute('data-status');
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = {
        name: document.getElementById('name'),
        maternalName: document.getElementById('maternalName'),
        cpf: document.getElementById('cpf'),
        cellphone: document.getElementById('cellphone'),
        landline: document.getElementById('landline'),
        address: document.getElementById('address'),
        login: document.getElementById('login'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        birthDate: document.getElementById('birthDate')
    };

    let isValid = true;

    Object.values(fields).forEach(field => {
        const fieldIsValid = validateField(field, fields);
        if (!fieldIsValid) {
            isValid = false;
        }
    });

    if (!validateGender()) {
        isValid = false;
    }

    if (!isValid) {
        setFeedback('Revise os campos destacados e tente novamente.', 'error');
        return;
    }

    Object.entries(fields).forEach(([key, input]) => {
        localStorage.setItem(key, input.value.trim());
    });

    const genderValue = form.querySelector('input[name="gender"]:checked')?.value ?? '';
    localStorage.setItem('gender', genderValue);

    form.reset();
    form.querySelectorAll('[data-field]').forEach(wrapper => wrapper.removeAttribute('data-invalid'));
    setFeedback('Formulário enviado com sucesso!', 'success');
});

form.addEventListener('reset', () => {
    setFeedback('', '');
    form.querySelectorAll('[data-field]').forEach(wrapper => wrapper.removeAttribute('data-invalid'));
    form.querySelectorAll('[data-error-for]').forEach(error => {
        error.textContent = '';
    });
});

form.addEventListener('input', event => {
    const target = event.target;
    if (target.name === 'gender') {
        validateGender();
        return;
    }
    if (target.name in validators) {
        validateField(target, {
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword')
        });
        if (target.name === 'password') {
            const confirmField = document.getElementById('confirmPassword');
            if (confirmField.value) {
                validateField(confirmField, {
                    password: document.getElementById('password'),
                    confirmPassword: confirmField
                });
            }
        }
    }
});

form.addEventListener('blur', event => {
    const target = event.target;
    if (target.name && target.name in validators) {
        validateField(target, {
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword')
        });
    }
}, true);

function loadFormData() {
    const fields = ['name', 'maternalName', 'cpf', 'cellphone', 'landline', 'address', 'login', 'password', 'confirmPassword', 'birthDate'];
    fields.forEach(key => {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            const input = document.getElementById(key);
            if (input) {
                input.value = storedValue;
            }
        }
    });

    const storedGender = localStorage.getItem('gender');
    if (storedGender) {
        const genderInput = form.querySelector(`input[name="gender"][value="${storedGender}"]`);
        if (genderInput) {
            genderInput.checked = true;
        }
    }
}

window.addEventListener('load', loadFormData);
