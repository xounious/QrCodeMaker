export default class OptionsForm {
    constructor(codeType) {
        this.codeType = codeType || null;
        this.options;
    }
    async getOptionsForm(containerId) {
        if (this.codeType) {
            this.options = await this.codeType.getOptions();
        } else {
            let response = await fetch("./js/defaultOptions.json");
            this.options = await response.json();
        }
        this.createForm(containerId);
    }
    createForm(containerId) {
        document.getElementById(containerId).innerHTML = "";
        for (const inputName in this.options) {
            let input = this.options[inputName];
            let type = input.type;
            document
                .getElementById(containerId)
                .appendChild(this.createFormElement(inputName));
        }
        // enleve la border bottom du dernier label
        document
            .getElementById(containerId)
            .lastElementChild.classList.remove("border-b");
    }
    createInputText(name, options) {
        let input = document.createElement("input");
        input.type = "text";
        input.id = name;
        input.placeholder = "https://example.com";
        input.classList = "w-1/2 bg-blue-800 text-blue-50 p-3 px-5 rounded-md";
        input.required = true;
        input.pattern = this["getPattern" + options.supportedData]();
        return input;
    }
    getPatternASCII_extended() {
        return "[\\x00-\\xFF]*";
    }

    createInputSelect(name, options) {
        let select = document.createElement("select");
        select.id = name;
        select.classList = "w-1/2 bg-blue-800 text-blue-50 p-3 px-5 rounded-md";
        options.options.forEach((options) => {
            let option = document.createElement("option");
            option.value = options.value;
            option.innerText = options.label;
            option.selected = options.selected | false;
            select.appendChild(option);
        });
        return select;
    }
    createInputBoolean(name, options) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = name;
        checkbox.checked = options.defaultValue;
        return checkbox;
    }
    createInputRange(name, options) {
        let range = document.createElement("input");
        range.type = "range";
        range.id = name;
        range.min = options.min | -Infinity;
        range.max = options.max | Infinity;
        range.step = options.step | 1;
        range.setAttribute("value", options.defaultValue);
        return range;
    }
    createFormElement(inputName) {
        let label = document.createElement("label");
        label.innerHTML =
            "<span class='w-1/2 text-right'>" +
            this.options[inputName].label +
            "</span>";
        label.for = name;
        label.classList =
            "flex1 flex flex-row space-x-4 text-blue-50 items-center border-b border-blue-50 py-2";
        label.appendChild(
            this[
                "createInput" +
                    this.options[inputName].type[0].toUpperCase() +
                    this.options[inputName].type.slice(1)
            ](inputName, this.options[inputName].typeOptions)
        );
        return label;
    }
}
