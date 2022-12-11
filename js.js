let selectedQ = document.querySelector(".selectedQ");
let xInput = document.querySelector("#x");
let notoficationPannel = document.querySelector("#warning");
let checkboxes = document.querySelectorAll("input[type='checkbox']");
let generateQuestionsButton = document.querySelector("#getQuestionsButton");

let totalQInDatabase = {
    "circle": 42,
    "straightLines": 34,
    "parabola": 37,
    "ellipseHyperbola": 53,
    "vector": 62
};

let q = 0;
let topicsSelected = {};
let totalQuestions = 0;
let ques = [];
let index = 0;

/////////////////
async function main() {
    addListnerToCheckboxes();
    addListenerToRange();
    addListenerToGenerateQuestions();
}

main();

function getMaxQuestions(topicsSelected) {
    totalQuestions = 0;
    for (const [topic] of Object.entries(topicsSelected)) {
        totalQuestions += totalQInDatabase[topic];
    }
    return totalQuestions;
}


///////////////
function addListnerToCheckboxes() {
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', async function () {
            if (this.checked) {
                topicsSelected[this.id] = totalQInDatabase[this.id];
            } else {
                delete topicsSelected[this.id];
            }
            q = Object.keys(topicsSelected).length;
            var maxQs = getMaxQuestions(topicsSelected);
            xInput.setAttribute("min", q.toString());
            xInput.setAttribute("max", maxQs.toString());
            xInput.setAttribute("value", q.toString());
            selectedQ.innerHTML = "&nbsp;" + q.toString() + `/${maxQs}&nbsp;`;
        });
    }
}

function addListenerToRange() {
    xInput.addEventListener('change', async () => {
        q = parseInt(xInput.value);
        xInput.setAttribute("value", q.toString());
        selectedQ.innerHTML = "&nbsp;" + q.toString() + `/${totalQuestions} &nbsp;`;
    });
}


function addListenerToGenerateQuestions() {
    generateQuestionsButton.addEventListener('click', async () => {
        if (q === 0) {
            slideNotification("Please select at least one topic.")
        } else if (totalQuestions < q) {
            slideNotification("Please select more topic.")
        } else {
            //clear the previous questions
            document.querySelector(".scene").innerHTML = "";

            //get the questions, shuffle them
            ques = getQuestions();

            //add the questions
            var sceneID1 = document.createElement("div");
            sceneID1.classList.add("sceneID1");
            sceneID1.innerHTML = `
        <div class="sceneQNA">
            <div class="QNAQ">
                <div class="QNAQ_before">` + (index + 1) + `/` + q + `</div>
                <img src="` + ques[0] + `" >
            </div>
            <div class="QNAA">
                <div class="QNAA_after">Click to Show Answer</div>
                <img src="` + ques[0].replaceAll('Q', 'A') + `">
            </div>
        </div>
        <div class="buttonNext">Next</div>
        <div class="buttonPrevious">Previous</div>
            `;
            document.querySelector(".scene").appendChild(sceneID1);
            addFunctionalityToNextButton();
            addFunctionalityToPreviousButton();
            addFunctionalityToRevealAnswer();
            preloadNextQNA();
        }
    });
}


//get random questions from differnt topics
function getQuestions() {
    var questions = [];
    const keys = Object.keys(topicsSelected);

    while (questions.length < q) {
        var luckyTopic = keys[Math.floor(Math.random() * keys.length)];
        var luckyQno = Math.floor(Math.random() * topicsSelected[luckyTopic]) + 1;
        var qAddress = "images/" + luckyTopic + "/Q/" + luckyTopic + "Q (" + luckyQno + ").jpg";
        if (!questions.includes(qAddress)) {
            questions.push(qAddress);
        }
    }
    return questions;
}

function addFunctionalityToNextButton() {
    document.querySelector(".buttonNext").addEventListener('click', () => {
        index++;
        if (index >= q) {
            index = q - 1;
            slideNotification("That's All");
            return;
        }
        putAppropriateQuestion();
    });
}

function addFunctionalityToPreviousButton() {
    document.querySelector(".buttonPrevious").addEventListener('click', () => {
        index--;
        if (index < 0) {
            index = 0;
            slideNotification("Move Ahead!");
            return;
        }
        putAppropriateQuestion();
    });
}

function putAppropriateQuestion() {
    console.log("index: " + index);
    document.querySelector(".QNAQ_before").innerHTML = (index + 1) + "/" + q;
    document.querySelector(".QNAQ img").setAttribute('src', ques[index]);
    document.querySelector(".QNAA img").setAttribute('src', ques[index].replaceAll("Q", "A"));
    document.querySelector(".QNAA_after").classList.remove("displayNone");
    preloadNextQNA();
}

function addFunctionalityToRevealAnswer() {
    document.querySelector(".QNAA_after").addEventListener('click', () => {
        document.querySelector(".QNAA_after").classList.add("displayNone");
    });
}

function preloadNextQNA() {
    try {
        var imgQ = new Image();
        imgQ.src = ques[index + 1];
        var imgA = new Image();
        imgA.src = ques[index + 1].replaceAll('Q', 'A');
    } catch (e) {
        //pass
    }
}

///utility
function slideNotification(message) {
    notoficationPannel.innerHTML = message;
    notoficationPannel.parentNode.style.top = "50px";
    setTimeout(() => {
        notoficationPannel.parentNode.style.top = "-100%";
    }, 3000);
}
