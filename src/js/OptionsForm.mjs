export default class OptionsForm {
    constructor(codeType) {
        this.codeType = codeType;
        this.options;
    }
    async getOptionsForm() {
        if (this.codeType) {
            this.options = await this.codeType.getOptions();
        } else {
            let response = await fetch("./js/defaultOptions.json");
            this.options = await response.json();
        }
        this.createForm();
    }
    createForm() {
        let form = document.createElement("form");
        for (const inputName in this.options) {
            let input = this.options[inputName];
            let type = input.type;
            form.appendChild(this.createFormElement(inputName));
        }
        document.querySelector("#containerForms").appendChild(form);
    }
    createInputText(name, options) {
        let input = document.createElement("input");
        input.type = "text";
        input.id = name;
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
        label.innerText = this.options[inputName].label;
        label.for = name;
        label.appendChild(
            this[
                "createInput" +
                    this.options[inputName].type[0].toUpperCase() +
                    this.options[inputName].type.slice(1)
            ](inputName, this.options[inputName].typeOptions)
        );
        let br = document.createElement("br");
        label.appendChild(br);
        return label;
    }
}
