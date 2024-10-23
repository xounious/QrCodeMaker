export default class CodeType {
    constructor(codeTypeName) {
        this.codeTypeName = codeTypeName;
        this.options;
    }
    static async getAllTypes() {
        try {
            let response = await fetch("./js/codes.json");
            let data = await response.json();
            let codeTypes = [];
            for (let codeType in data.types) {
                codeTypes.push(codeType);
            }
            return codeTypes;
        } catch (error) {
            console.error("Error fetching code types:", error);
            return [];
        }
    }
    async getOptions() {
        let response = await fetch("./js/types/" + this.codeTypeName + ".json");
        let options = await response.json();
        this.options = options.options;
        return this.options;
    }
    generate(defaultOptions) {
        let totalOptions = Object.assign({}, defaultOptions, this.options);
        let option = "bcid=" + document.getElementById("codeType").value;
        for (const optionName in totalOptions) {
            let value = document.getElementById(optionName).value;
            if (value && value != "" && value != "on") {
                option += "&" + optionName + "=" + value;
            } else {
                if (document.getElementById(optionName).checked) {
                    option += "&" + optionName;
                }
            }
        }
        let url = "https://api-bwipjs.metafloor.com/?" + option;
        url = encodeURI(url);
        console.log(url);

        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                let url = URL.createObjectURL(blob);
                let img = document.createElement("img");
                img.src = url;
                img.style.padding = "10px";
                document.querySelector("#output").appendChild(img);
            });
    }
}
