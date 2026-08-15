const target = "ちんこ";


const hiragana = [
    "あ","い","う","え","お",
    "か","き","く","け","こ",
    "さ","し","す","せ","そ",
    "た","ち","つ","て","と",
    "な","に","ぬ","ね","の",
    "は","ひ","ふ","へ","ほ",
    "ま","み","む","め","も",
    "や","ゆ","よ",
    "ら","り","る","れ","ろ",
    "わ","を","ん"
];


const modes = {

    LOW: {

        perfectChance: 100000,

        multiplier: 5

    },

    NORMAL: {

        perfectChance: 10000,

        multiplier: 2

    },

    HIGH: {

        perfectChance: 100,

        multiplier: 0.5

    }

};


let currentMode = "LOW";

let attempts = 0;

let bestScore = 0;

let perfectHits = 0;

let isGenerating = false;


/* ELEMENTS */

const result =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const similarityElement =
    document.getElementById("similarity");

const attemptsElement =
    document.getElementById("attempts");

const bestScoreElement =
    document.getElementById("bestScore");

const evaluation =
    document.getElementById("evaluation");

const systemMessage =
    document.getElementById("systemMessage");

const log =
    document.getElementById("log");

const generateButton =
    document.getElementById("generateButton");

const currentModeElement =
    document.getElementById("currentMode");

const perfectOddsElement =
    document.getElementById("perfectOdds");


/* LOG */

function addLog(message) {

    const time =
        new Date().toLocaleTimeString();

    log.innerHTML +=
        `<br>> [${time}] ${message}`;

    log.scrollTop = log.scrollHeight;

}


/* RANDOM CHARACTER */

function randomCharacter() {

    const index =
        Math.floor(
            Math.random() * hiragana.length
        );

    return hiragana[index];

}


/* GENERATE WORD */

function generateWord() {

    /*
     * 一定確率で完全一致
     */

    const chance =
        Math.floor(
            Math.random() *
            modes[currentMode].perfectChance
        );

    if (chance === 0) {

        return target;

    }


    let word = "";

    for (let i = 0; i < 3; i++) {

        word += randomCharacter();

    }

    return word;

}


/* SCORE */

function calculateScore(word) {

    let matches = 0;

    for (let i = 0; i < 3; i++) {

        if (word[i] === target[i]) {

            matches++;

        }

    }


    let baseScore =
        matches * (100 / 3);


    return Math.round(
        baseScore *
        modes[currentMode].multiplier
    );

}


/* RAW SIMILARITY */

function calculateSimilarity(word) {

    let matches = 0;

    for (let i = 0; i < 3; i++) {

        if (word[i] === target[i]) {

            matches++;

        }

    }

    return Math.round(
        matches * (100 / 3)
    );

}


/* EVALUATION */

function evaluate(score) {

    if (score >= 500) {

        return "LEGENDARY RESULT";

    }

    if (score >= 200) {

        return "TARGET ACQUIRED";

    }

    if (score >= 100) {

        return "HIGH MATCH";

    }

    if (score >= 67) {

        return "EXTREMELY CLOSE";

    }

    if (score >= 33) {

        return "PARTIAL MATCH";

    }

    return "NO SIGNIFICANT MATCH";

}


/* NUMBER ANIMATION */

function animateNumber(
    element,
    start,
    end,
    duration
) {

    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime)
                / duration,
                1
            );


        const value =
            Math.round(
                start +
                (end - start) *
                progress
            );


        element.textContent =
            value
                .toString()
                .padStart(3, "0");


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}


/* CHARACTER ANIMATION */

async function revealWord(word) {

    result.textContent = "";

    systemMessage.textContent =
        "GENERATING CHARACTER 1...";


    for (let i = 0; i < 3; i++) {

        await wait(450);


        result.textContent += word[i];


        if (i === 0) {

            systemMessage.textContent =
                "GENERATING CHARACTER 2...";

        }

        if (i === 1) {

            systemMessage.textContent =
                "GENERATING CHARACTER 3...";

        }

    }


    await wait(500);

}


/* WAIT */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


/* GENERATE */

async function generate() {

    if (isGenerating) {

        return;

    }


    isGenerating = true;

    generateButton.disabled = true;


    evaluation.textContent =
        "PROCESSING...";


    result.classList.remove(
        "perfect"
    );


    addLog(
        `GENERATION STARTED // MODE: ${currentMode}`
    );


    const word =
        generateWord();


    await revealWord(word);


    systemMessage.textContent =
        "ANALYZING RESULT...";


    await wait(500);


    const similarity =
        calculateSimilarity(word);


    const score =
        calculateScore(word);


    attempts++;


    if (score > bestScore) {

        bestScore = score;

    }


    if (word === target) {

        perfectHits++;

        result.classList.add(
            "perfect"
        );

        addLog(
            "!!! PERFECT MATCH DETECTED !!!"
        );

    }


    animateNumber(
        scoreElement,
        0,
        score,
        700
    );


    similarityElement.textContent =
        similarity + "%";


    attemptsElement.textContent =
        attempts
            .toString()
            .padStart(3, "0");


    bestScoreElement.textContent =
        bestScore
            .toString()
            .padStart(3, "0");


    evaluation.textContent =
        evaluate(score);


    systemMessage.textContent =
        "ANALYSIS COMPLETE";


    addLog(
        `RESULT: ${word} // SCORE: ${score}`
    );


    await wait(700);


    generateButton.disabled = false;

    isGenerating = false;

}


/* MODE */

document
    .querySelectorAll(".mode-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (isGenerating) {

                    return;

                }


                document
                    .querySelectorAll(
                        ".mode-button"
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                currentMode =
                    button.dataset.mode;


                currentModeElement.textContent =
                    currentMode;


                perfectOddsElement.textContent =
                    "1 / " +
                    modes[
                        currentMode
                    ].perfectChance
                        .toLocaleString();


                addLog(
                    `PROBABILITY MODE CHANGED: ${currentMode}`
                );

            }
        );

    });


/* BUTTON */

generateButton.addEventListener(
    "click",
    generate
);