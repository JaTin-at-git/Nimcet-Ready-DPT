let selectedQ = document.querySelector(".selectedQ");
let xInput = document.querySelector("#x");
let notoficationPannel = document.querySelector("#warning");
let checkboxes = document.querySelectorAll("input[type='checkbox']");
let generateQuestionsButton = document.querySelector("#getQuestionsButton");

let q = 0;
let topicsSelected = {};
let totalQuestions = 0;
let ques = [];
let index = 1;
let quesArray = [];
let ansArray = [];

/////////////////
async function main() {
    addListnerToCheckboxes();
    addListenerToRange();
    addListenerToGenerateQuestions();
}

main();

//instead of checking for each image, check for (say) image 10,
//if img 10 present, check for 20th image
//if 10th image is not present, check for 5th image
//if 5th is not present check for 2nd image
//if 2nd image is not present check for 1st image
//if 1st image is not present check for 0th image
async function getTotalQuestionsOfThisTopic2(topic) {
    return await new Promise(function (resolve) {
        //just for loading animation
        selectedQ.innerHTML = "&nbsp;" + q.toString() + `/ <img style="width: 20px; display: inline-block" src='200w.webp'>`;


        var i = 10;
        var gap = 10;
        var limitAchieved = false;
        var test = document.querySelector(".test"); // this is a DOM div
        var timeout = 100; //timeout for setTimeoutFunction
        repeat(i);

        function repeat(i) {
            console.log("i: " + i);
            var img = document.createElement("img");
            img.setAttribute('alt', 'test image');
            img.setAttribute("src", "images/" + topic + "/Q/" + topic + "Q (" + i + ").jpg");
            test.appendChild(img);
            setTimeout(() => {
                console.log("Height is: " + document.querySelector(".test img").clientHeight);
                if (document.querySelector(".test img").clientHeight > 40) {
                    setTimeout(() => {
                        console.log("image " + i + " present.")
                        if (gap === 1) {
                            test.removeChild(img);
                            topicsSelected[topic] = i;
                            resolve(i);
                            //it ends here
                        } else {
                            test.removeChild(img);
                            gap = limitAchieved ? Math.floor(gap / 2) : gap;
                            repeat(i += gap);
                        }
                    }, timeout);
                } else {
                    console.log("image " + i + " NOT present.")
                    test.removeChild(img);
                    limitAchieved = true;
                    gap = Math.floor(gap / 2);
                    repeat(i -= gap);
                }
            }, timeout)
        }

    });
}

async function getMaxQuestions(topicsSelected) {
    for (const [topic] of Object.entries(topicsSelected)) {
        await getTotalQuestionsOfThisTopic2(topic).then(value => {
            totalQuestions += value;
        });
    }
    return totalQuestions;
}


///////////////
function addListnerToCheckboxes() {
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', async function () {
            if (this.checked) {
                topicsSelected[this.id] = 1;
            } else {
                delete topicsSelected[this.id];
            }
            q = Object.keys(topicsSelected).length;
            var maxQs = await getMaxQuestions(topicsSelected);
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
            // reinitialize the dictionary

            //get the questions, shuffle them
            ques = getQuestions();
            for (const question of ques) {
                createQuestionAnswerImageDOM(question);
            }
            console.log(quesArray);
            console.log(ansArray);


            //add the questions
            var sceneID1 = document.createElement("div");
            sceneID1.classList.add("sceneID1");
            sceneID1.innerHTML = `
        <div class="sceneQNA">
            <div class="QNAQ">
                <div class="QNAQ_before">` + index + `/` + q + `</div>
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
            slideNotification("That's All");
            return;
        }
        putAppropriateQuestion();
    });
}

function addFunctionalityToPreviousButton() {
    document.querySelector(".buttonPrevious").addEventListener('click', () => {
        index--;
        if (index <= 0) {
            slideNotification("Move Ahead!");
            return;
        }
        putAppropriateQuestion();
    });
}

function putAppropriateQuestion() {
    setTimeout(() => {
        document.querySelector(".QNAQ_before").innerHTML = index + "/" + q;
        document.querySelector(".QNAQ").removeChild(document.querySelector(".QNAQ img"));
        document.querySelector(".QNAQ").appendChild(quesArray[index]);
        document.querySelector(".QNAA").removeChild(document.querySelector(".QNAA img"));
        document.querySelector(".QNAA").appendChild(ansArray[index]);
        document.querySelector(".QNAA_after").classList.remove("displayNone");
    }, 100);
}

function addFunctionalityToRevealAnswer() {
    document.querySelector(".QNAA_after").addEventListener('click', () => {
        document.querySelector(".QNAA_after").classList.add("displayNone");
    });
}


///utility
function slideNotification(message) {
    notoficationPannel.innerHTML = message;
    notoficationPannel.parentNode.style.top = "50px";
    setTimeout(() => {
        notoficationPannel.parentNode.style.top = "-100%";
    }, 3000);
}

function createQuestionAnswerImageDOM(url) {
    var img = new Image();
    img.src = url;
    quesArray.push(img);
    img = new Image();
    img.src = url.replaceAll('Q', 'A');
    ansArray.push(img);
}