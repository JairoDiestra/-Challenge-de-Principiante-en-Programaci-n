// Definir constantes
const msgContainer = getElement('msg-container');
const inputText = getElement('input-text');
const msgText = getElement('msg-text');
const encryptBtn = getElement('encrypt-btn');
const decryptBtn = getElement('decrypt-btn');
const outputSection = getElement('output-section');
const figureImg = getElement('figure-img');
const outputText = getElement('output-text');
const outputMsg = getElement('output-msg');
const copyBtn = getElement('copy-btn');

let key = new Map([
	["e", "enter"],
	["o", "ober"],
	["i", "imes"],
	["a", "ai"],
	["u", "ufat"]
]);

// Crear un Map para desencriptar basado en el Map de encriptar
const keyDecrytpor = reverseMap(key);

// ---- Funciones base

// Función para invertir un Map
function reverseMap(map) {
    return new Map([...map.entries()].map(([key, value]) => [value, key]));
}

// Construye una expresión regular a partir de las claves del Map
function buildRegularExpression(map) {
    return new RegExp([...map.keys()].join('|'), 'g');
}

// Reemplaza los textos basados en un Map de sustituciones
function replaceTextWithMap(map, text) {
    const regex = buildRegularExpression(map);
    return text.replace(regex, (match) => map.get(match));
}

// Función para definir constante para id
function getElement(id) {
    return document.getElementById(id);
}

// Función para modificar texto a través de un elemento constante
function updateElementText(element, text) {
    if (element) {
        element.innerHTML = text;
    } else {
        console.warn("updateElementText: Elemento no válido.");
    }
}

// Añadir una clase a un elemento constante
function addClass(element, className) {
    if (element) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    } else {
        console.warn("addClass: Elemento no válido.");
    }
}

// Remover una clase de un elemento constante
function removeClass(element, className) {
    if (element) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    } else {
        console.warn("removeClass: Elemento no válido.");
    }
}

// ---- Funciones 

// 1. Verificar contenido de texto, mayúsculas y caracteres especiales
function validateTextContent() {
    let text = inputText.value;
    let normalizedText = text.normalize("NFD").replace(/[^\w\sñÑ]|[\u0300-\u036f]/g, "");

    if (text === "") {
        updateElementText(msgText, "No se ha encontrado texto");
        addClass(msgContainer, "content__input__messageB");
        addClass(msgText, "message__textB");

    } else if (text !== text.toLowerCase()) {
        updateElementText(msgText, "No se aceptan mayúsculas");
        addClass(msgContainer, "content__input__messageB");
        addClass(msgText, "message__textB");

    } else if (text !== normalizedText) {
        updateElementText(msgText, "No se aceptan caracteres especiales");
        addClass(msgContainer, "content__input__messageB");
        addClass(msgText, "message__textB");

    } else {
        removeClass(msgContainer, "content__input__messageB");
        removeClass(msgText, "message__textB");
        return true;
    }
}

// 2. Añadir cambios visuales
function applyChanges() {
    decryptBtn.disabled = false;
    addClass(decryptBtn, "actions__decryptB");
    updateElementText(msgText, "Solo letras minúsculas y sin acentos");
    addClass(outputSection, "content__outputB");
    addClass(outputText, "content__output__textB");
    addClass(figureImg, "hide__element");
    addClass(outputMsg, "hide__element");
    removeClass(copyBtn, "hide__element");
}

// 3. Remover cambios visuales
function resetChanges() {
    decryptBtn.disabled = true;
    removeClass(decryptBtn, "actions__decryptB");
    updateElementText(msgText, "Solo letras minúsculas y sin acentos");
    removeClass(outputSection, "content__outputB");
    removeClass(outputText, "content__output__textB");
    removeClass(figureImg, "hide__element");
    removeClass(outputMsg, "hide__element");
    addClass(copyBtn, "hide__element");
}

// 4. Encriptar texto
function encryptText(inputText) {
    return replaceTextWithMap(key, inputText);
}

// 5. Desencriptar texto
function decryptText(inputText) {
    return replaceTextWithMap(keyDecrytpor, inputText);
}

// 6. Evento de clic para botón de encriptar
encryptBtn.addEventListener('click', () => {
    if (validateTextContent()) {
        let text = inputText.value;
        applyChanges();
        let encryptedText = encryptText(text);
        updateElementText(outputText, encryptedText);
    }
});

// 7. Evento de clic para botón de desencriptar
decryptBtn.addEventListener('click', () => {
    if (validateTextContent()) {
        applyChanges();
        let text = inputText.value;
        let decryptedText = decryptText(text);
        updateElementText(outputText, decryptedText);
    }
});

// 8. Evento de clic para botón de copiar
copyBtn.addEventListener('click', () => {
    if (outputText) {
        outputText.select();

        try {
            document.execCommand('copy');
            alert('Se ha copiado correctamente el texto');
        } catch (error) {
            console.error('Error al copiar el texto: ', error);
            alert('Hubo un problema al copiar el texto.');
        }

        resetChanges();
        updateElementText(inputText, '');
        updateElementText(outputText, '');
        decryptBtn.disabled = false;
    } else {
        console.warn('Elemento de texto no encontrado.');
    }
});
