import CodeType from "./CodeType.mjs";

class Main {
    constructor() {
        this.defaultOptionsFormIsCreated = false;
        this.codeTypes;
        globalThis.defaultOptions;
        this.display();
    }
    async display() {
        let response = await fetch("./js/codeTypes.json");
        let codeTypes = await response.json();
        this.codeTypes = codeTypes;
        let form = document.createElement("form");
        let label = document.createElement("label");
        label.innerText = "Code Type ";
        label.for = "codeType";
        let select = document.createElement("select");
        select.id = "codeType";
        for (const codeTypeName in codeTypes) {
            let option = document.createElement("option");
            option.value = codeTypeName;
            option.text = codeTypes[codeTypeName];
            option.selected = codeTypeName == "qrcode" ? true : false;
            select.appendChild(option);
        }
        form.appendChild(label);
        label.appendChild(select);
        document.querySelector("#containerForms").appendChild(form);

        select.onchange = this.createOptionsForm.bind(this);
        // affiche par défault les options du premier code type selectionné

        this.createOptionsForm();
    }
    async createOptionsForm() {
        if (!this.defaultOptionsFormIsCreated) {
            this.createDefaultOptionsForm();
            this.defaultOptionsFormIsCreated = true;
        }
        let codeTypeName = document
            .querySelector("label")
            .querySelector("select").value;

        codeType = await new CodeType(codeTypeName);
        import("./OptionsForm.mjs").then((module) => {
            let createForm = new module.default(codeType);
            createForm.getOptionsForm();
        });
        let submit = document.createElement("button");
        submit.innerText = "Générer " + this.codeTypes[codeTypeName];
        submit.onclick = () => {
            codeType.generate(this.defaultOptions);
        };
        document.querySelector("#containerSubmit").appendChild(submit);
    }
    async createDefaultOptionsForm() {
        import("./OptionsForm.mjs").then((module) => {
            let createForm = new module.default();
            createForm.getOptionsForm().then(() => {
                this.defaultOptions = createForm.options;
                console.log(this.defaultOptions);
            });
        });
    }
}

export default new Main();
