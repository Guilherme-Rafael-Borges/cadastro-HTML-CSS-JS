document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário para realizar validações

    const name = document.getElementById('name');
    const maternalName = document.getElementById('maternalName');
    const cpf = document.getElementById('cpf');
    const cellphone = document.getElementById('cellphone');
    const landline = document.getElementById('landline');
    const address = document.getElementById('address');
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    const nameRegex = /^[A-Z][a-zA-Z ]{9,}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cellphoneRegex = /^\+55\(21\)9\d{4}-\d{4}$/;
    const landlineRegex = /^\+55\(21\)[2345]\d{3}-\d{4}$/;
    const addressRegex = /^(Rua|Avenida|Travessa|Av\.) [\w\s]{10,}$/i;
    const loginRegex = /^[A-Z]{5}$/;
    const passwordRegex = /^[a-zA-Z0-9]{7}$/;

    let isValid = true;

    if (!nameRegex.test(name.value)) {
        alert('O campo Nome deve ter pelo menos 10 caracteres alfabéticos e começar com letra maiúscula.');
        isValid = false;
    }
    if (!nameRegex.test(maternalName.value)) {
        alert('O campo Nome Materno deve ter pelo menos 10 caracteres alfabéticos e começar com letra maiúscula.');
        isValid = false;
    }
    if (!cpfRegex.test(cpf.value)) {
        alert('O campo CPF deve estar no formato 000.000.000-00.');
        isValid = false;
    }
    if (!cellphoneRegex.test(cellphone.value)) {
        alert('O campo Telefone Celular deve estar no formato +55(21)99565-1622.');
        isValid = false;
    }
    if (!landlineRegex.test(landline.value)) {
        alert('O campo Telefone Fixo deve estar no formato +55(21)2XXX-XXXX, +55(21)3XXX-XXXX, +55(21)4XXX-XXXX ou +55(21)5XXX-XXXX.');
        isValid = false;
    }
    if (!addressRegex.test(address.value)) {
        alert('O campo Endereço Completo deve começar com Rua, Avenida, Travessa, ou Av. e ter pelo menos 10 caracteres alfanuméricos.');
        isValid = false;
    }
    if (!loginRegex.test(login.value)) {
        alert('O campo Login deve ter exatamente 5 caracteres alfabéticos em letras maiúsculas.');
        isValid = false;
    }
    if (!passwordRegex.test(password.value)) {
        alert('O campo Senha deve ter exatamente 7 caracteres alfanuméricos.');
        isValid = false;
    }
    if (password.value !== confirmPassword.value) {
        alert('As senhas não coincidem.');
        isValid = false;
    }

    if (isValid) {
        // Armazenando os dados no LocalStorage
        localStorage.setItem('name', name.value);
        localStorage.setItem('maternalName', maternalName.value);
        localStorage.setItem('cpf', cpf.value);
        localStorage.setItem('cellphone', cellphone.value);
        localStorage.setItem('landline', landline.value);
        localStorage.setItem('address', address.value);
        localStorage.setItem('login', login.value);
        localStorage.setItem('password', password.value);

        alert('Formulário enviado com sucesso!');
        document.getElementById('registrationForm').reset(); // Limpa o formulário
    }
});

// Função para preencher o formulário com os dados salvos no LocalStorage
function loadFormData() {
    if (localStorage.getItem('name')) {
        document.getElementById('name').value = localStorage.getItem('name');
        document.getElementById('maternalName').value = localStorage.getItem('maternalName');
        document.getElementById('cpf').value = localStorage.getItem('cpf');
        document.getElementById('cellphone').value = localStorage.getItem('cellphone');
        document.getElementById('landline').value = localStorage.getItem('landline');
        document.getElementById('address').value = localStorage.getItem('address');
        document.getElementById('login').value = localStorage.getItem('login');
        document.getElementById('password').value = localStorage.getItem('password');
    }
}

// Carregar os dados ao abrir a página
window.onload = loadFormData;
