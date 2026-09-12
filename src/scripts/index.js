let data = `
* Section header
  * Sub-section A
    * (-0.1) Criteria 1
    * (-0.1) Criteria 2
  * Sub-section B
    * (-0.1) Criteria 3
    * (-0.1) Criteria 4
`

function refreshResult() {
    let checkboxList = document.getElementById("checkbox-list");
    let resultList = document.getElementById("result-list");

    resultList.innerHTML = "";
    for (let child of checkboxList.children) {
        if (child.firstElementChild.checked) {
            resultList.innerHTML += child.lastElementChild.innerHTML + "<br>";
        }
    }
}

/**
 * 
 * @param {String} line 
 */
function parseLine(line) {
    let newLine = ""
    let stopReplacing = false

    // Convert bullet points to spaces
    for (let char of line) {
        if (!stopReplacing && (char == "*" || char == "-")) {
            stopReplacing = true;
            continue;
        }

        if (stopReplacing) newLine += char;
        else if (char == " ") newLine += "&emsp;";
    }

    // Convert modifiers (bold, italics, strikethrough)
    newLine = newLine.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    newLine = newLine.replaceAll(/\*(.*?)\*/g, "<em>$1</em>");
    newLine = newLine.replaceAll(/\~\~(.*?)\~\~/g, "<s>$1</s>");

    // Remove extra backslash
    newLine = newLine.replaceAll(/\\(.)/g, "$1");
    return newLine;
}

/**
 * 
 * @param {HTMLUListElement} parentElement 
 */
function createList(parentElement) {
    let dataList = data.split("\n");
    let id = 1;
    parentElement.innerHTML = "";
    for (let line of dataList) {
        if (line == "") {
            continue;
        }
        let newElement = document.createElement("li");
        let newLine = parseLine(line);
        newElement.innerHTML = `<input type="checkbox" id="${id}"><label for="${id}">${newLine}</label>`;
        let checkbox = newElement.firstElementChild;
        // let checkbox = document.createElement("input");
        checkbox.addEventListener("click", refreshResult);
        if (!newLine.startsWith("&")) {
            checkbox.setAttribute("checked", true);
        }
        parentElement.appendChild(newElement);
        id++;
    }
    refreshResult();
}

function onDOMContentLoaded() {
    let checkboxList = document.getElementById("checkbox-list");
    let dataListTextarea = document.getElementById("data-list-textarea");
    dataListTextarea.addEventListener("input", function(ev) {
      data = dataListTextarea.value;
      createList(checkboxList)
    })
    createList(checkboxList);
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);