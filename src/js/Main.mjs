import CodeType from "./CodeType.mjs";

export default class Main {
    constructor() {
        this.codeTypes;
        this.codeType;

        this.defaultOptions;
        this.formDefault;

        this.formCodeType;
        this.codeTypeOptions;

        this.display();
    }
    display() {
        fetch("./js/codeTypes.json")
            .then((response) => response.json())
            .then((codeTypes) => {
                this.codeTypes = codeTypes;
                let label = document.createElement("label");
                label;
                label.innerHTML = "<span class='w-1/2 text-right'>Code Type</span>";
                label.for = "codeType";
                let select = document.createElement("select");
                select.id = "codeType";
                select.classList = "w-1/2 bg-blue-800 text-blue-50 p-3 px-5 rounded-md";
                label.classList = "flex1 flex flex-row space-x-4 text-blue-50 items-center py-2";
                for (const codeTypeName in codeTypes) {
                    let option = document.createElement("option");
                    option.value = codeTypeName;
                    option.text = codeTypes[codeTypeName];
                    option.selected = codeTypeName == "qrcode" ? true : false;
                    select.appendChild(option);
                }
                select.onchange = this.createOptionsTypeCodeForm.bind(this);
                document.querySelector("#containerCodeType").appendChild(label);
                label.appendChild(select);
                this.createDefaultOptionsForm();
                this.createOptionsTypeCodeForm();
            })
            .catch((error) => {
                console.error("Error fetching code types:", error);
            });
    }
    createOptionsTypeCodeForm() {
        let codeTypeName = document.querySelector("#codeType").value;
        this.codeType = new CodeType(codeTypeName);
        import("./OptionsForm.mjs").then((module) => {
            this.formCodeType = new module.default(this.codeType);
            this.formCodeType.getOptionsForm("optionsCodeType").then(() => {
                this.codeTypeOptions = this.formCodeType.options; //ajouter les anciennes valeur pour conserver le texte quand on change de code type (si le format de texte est le même)
            });
        });
        this.addSubmitButton(this.codeTypes[codeTypeName]);
    }
    addSubmitButton(codeName) {
        let submit = document.createElement("button");
        submit.innerText = "Generate " + codeName;
        submit.classList = "bg-blue-800 text-blue-50 p-3 px-5 rounded-md text-center";
        submit.onclick = () => {
            this.codeType.generateCode(Object.assign({}, this.defaultOptions, this.codeTypeOptions));
        };
        document.querySelector("#containerSubmit").innerHTML = "";
        document.querySelector("#containerSubmit").appendChild(submit);
    }
    async createDefaultOptionsForm() {
        import("./OptionsForm.mjs").then((module) => {
            this.formDefault = new module.default();
            this.formDefault.getOptionsForm("defaultOptions").then(() => {
                this.defaultOptions = this.formDefault.options;
            });
        });
    }
}
