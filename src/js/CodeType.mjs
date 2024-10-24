export default class CodeType {
    constructor(codeTypeName) {
        this.codeTypeName = codeTypeName;
        this.options;
        this.codesGenerated = [];
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
        try {
            let response = await fetch("./js/types/" + this.codeTypeName + ".json");
            let options = await response.json();
            this.options = options.options;
            return this.options;
        } catch (error) {
            console.error("Error fetching options for type :", error);
            return [];
        }
    }
    getUrlParamOfRange(optionName) {
        return "&" + optionName + "=" + document.getElementById(optionName).value;
    }
    getUrlParamOfBoolean(optionName) {
        if (document.getElementById(optionName).checked) {
            return "&" + optionName;
        } else {
            return "";
        }
    }
    getUrlParamOfSelect(optionName) {
        return "&" + optionName + "=" + document.getElementById(optionName).value;
    }
    getUrlParamOfText(optionName) {
        if (document.getElementById(optionName).value === "") {
            return "&" + optionName + "=" + document.getElementById(optionName).placeholder;
        } else {
            return "&" + optionName + "=" + document.getElementById(optionName).value;
        }
    }

    generateCode(options) {
        let option = "bcid=" + document.getElementById("codeType").value;
        for (let optionName in options) {
            let type = options[optionName].type;
            option += this["getUrlParamOf" + type.charAt(0).toUpperCase() + type.slice(1)](optionName);
        }
        let url = encodeURI("https://api-bwipjs.metafloor.com/?" + option);

        for (let code of this.codesGenerated) {
            if (code.url === url) {
                this.showImage(code.urlImage);
                return;
            }
        }
        console.log(url);
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                this.showImage(URL.createObjectURL(blob));
                this.codesGenerated.push({
                    url: url,
                    urlImage: URL.createObjectURL(blob),
                });
            })
            .catch((error) => {
                console.error("Error fetching code:", error);
            });
    }
    showImage(url) {
        let img = document.createElement("img");
        img.src = url;
        document.querySelector("#output").innerHTML = "";
        document.querySelector("#output").appendChild(img);
    }
}
