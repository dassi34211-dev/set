// משתנים גלובליים
let usedCards = [];
let selectedCards = [];
let selectedButtons = [];
let buttonCounter = 0;
let score = 100;
let setCounter = 0;
let playerName;

// הצגת הודעות במקום alert
const messageBox = document.createElement('div');
messageBox.id = 'messageBox';
messageBox.style.cssText = 'margin-top:20px; font-size:24px; color:#002060;';
document.body.insertBefore(messageBox, document.querySelector("#allCards"));

// פונקציה לציור קלפים אקראיים
function drawCardsRandomly(num) {
    for (let i = 0; i < num; i++) {
        let randomNumber = Math.floor(Math.random() * 81) + 1;
        if (!usedCards.includes(randomNumber)) {
            drawCard(randomNumber);
            usedCards.push(randomNumber);
        } else {
            i--;
        }
    }
}

// יצירת קלף חדש ככפתור עם תמונה
function drawCard(cardNumber) {
    buttonCounter++;
    const button = document.createElement('button');
    button.id = `btn${buttonCounter}`;

    const img = document.createElement('img');
    img.src = `images/${cardNumber}.PNG`;
    button.appendChild(img);
    button.setAttribute('data-img', cardNumber);

    document.querySelector("#allCards").appendChild(button);

    // טיפול בלחיצה על קלף
    button.addEventListener('click', (event) => {
        handleCardSelection(event, button);
    });
}

// פונקציה לטיפול בבחירת קלף
function handleCardSelection(event, button) {
    const num = +button.getAttribute('data-img');

    if (selectedButtons.includes(button.id)) {
        button.classList.remove('selected');
        removeFromArray(selectedCards, num);
        removeFromArray(selectedButtons, button.id);
    } else {
        button.classList.add('selected');
        selectedCards.push(num);
        selectedButtons.push(button.id);
    }

    if (selectedCards.length === 3) {
        setTimeout(() => {
            checkSet(selectedCards);
            selectedButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.classList.remove('selected');
            });
            selectedCards = [];
            selectedButtons = [];
        }, 100);
    }
}

// פונקציה להסרת ערך ממערך
function removeFromArray(arr, val) {
    const index = arr.indexOf(val);
    if (index !== -1) arr.splice(index, 1);
}

// כפתור התחלה מחדש
function createRestartButton() {
    const btn = document.createElement('button');
    btn.innerText = "התחל מחדש";
    btn.id = "btnRestart";
    document.querySelector("#startAgainContainer").appendChild(btn);

    btn.onclick = () => {
        document.querySelectorAll("#allCards button").forEach(b => b.remove());
        usedCards = [];
        selectedCards = [];
        selectedButtons = [];
        buttonCounter = 0;
        score = 100;
        setCounter = 0;
        drawCardsRandomly(16);
        document.querySelector("#allCards").style.display = 'block';
        document.querySelector("#btnAddCard").style.display = 'block';
        messageBox.innerText = '';
    };
}

// כפתור להוספת קלף
document.querySelector("#btnAddCard").onclick = () => {
    score -= 2;
    drawCardsRandomly(1);
}

// פונקציה לבדיקה אם 3 קלפים יוצרים סט
function checkSet(cards) {
    const checkProperty = prop => {
        const vals = cards.map(i => arrCards[i - 1][prop]);
        return (vals[0] === vals[1] && vals[1] === vals[2]) ||
               (vals[0] !== vals[1] && vals[1] !== vals[2] && vals[0] !== vals[2]);
    };

    if (cards.length === 3) {
        if (checkProperty('color') && checkProperty('shape') && checkProperty('texture') && checkProperty('count')) {
            setCounter++;
            score += 5;
            messageBox.innerText = "✅ סט נכון!";
        } else {
            score -= 3;
            messageBox.innerText = "❌ סט שגוי!";
        }
    }

    // שימוש נוסף ב-map, filter, find, replace לדוגמה:
    const cardNames = cards.map(i => arrCards[i - 1].name);
    const filtered = cardNames.filter(n => n > 10);
    const found = cardNames.find(n => n % 2 === 0);
    const replacedText = messageBox.innerText.replace("סט", "כרטיסים");
    console.log({ cardNames, filtered, found, replacedText });
}

// אירוע נוסף - Scroll
window.addEventListener('scroll', (event) => {
    document.body.style.backgroundColor = window.scrollY > 50 ? '#f0f0f0' : 'white';
});

// אירוע נוסף - Keydown
window.addEventListener('keydown', (event) => {
    if (event.key === "r") document.getElementById('btnRestart').click();
});
