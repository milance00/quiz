//elements
export function createDiv(class_name, text) {
  const div = document.createElement("div");
  if (class_name) div.className = class_name;
  if (text) div.innerText = text;
  return div;
}
export function createSpan(class_name, text) {
  const span = document.createElement("span");
  if (class_name) span.className = class_name;
  if (text) span.innerText = text;
  return span;
}
export function createButton(class_name, text, id, onClickFunction) {
  const btn = document.createElement("button");
  if (class_name) btn.className = class_name;
  if (text) btn.innerText = text;
  if (id) btn.id = id;
  if (onClickFunction) btn.onclick = onClickFunction;
  return btn;
}

export function createLabel(forElement, text) {
  const label = document.createElement("label");
  if (forElement) label.setAttribute("for", forElement);
  if (text) label.textContent = text;
  return label;
}
export function createInput(type, id, nameInput, placeholder, value) {
  const input = document.createElement("input");
  if (type) input.type = type;
  if (id) input.id = id;
  if (nameInput) input.name = nameInput;
  if (placeholder) input.placeholder = placeholder;
  if (value) input.value = value;
  return input;
}
export function createH1(text) {
  const h1 = document.createElement("h1");
  if (text) h1.innerText = text;
  return h1;
}
export function createH3(text) {
  const h3 = document.createElement("h3");
  if (text) h3.innerText = text;
  return h3;
}
export function createForm(id) {
  const form = document.createElement("form");
  if (id) form.id = id;
  return form;
}
export function createSelect(id, nameSelect) {
  const select = document.createElement("select");
  if (id) select.id = id;
  if (nameSelect) select.name = nameSelect;
  return select;
}
export function createOption(value, text) {
  const option = document.createElement("option");
  if (value) option.value = value;
  if (text) option.textContent = text;
  return option;
}
export function createFormElement(
  labelText,
  inputType,
  inputId,
  inputName,
  placeholder,
  inputValue
) {
  const formElement = createDiv("formElement", null);
  const label = createLabel(inputId, labelText);
  const input = createInput(
    inputType,
    inputId,
    inputName,
    placeholder,
    inputValue
  );

  formElement.appendChild(label);
  formElement.appendChild(input);

  return formElement;
}
