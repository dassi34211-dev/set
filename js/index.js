// משתנים גלובליים
let usedCards = [];
let selectedCards = [];
let selectedButtons = [];
let buttonCounter = 0;
let score = 100;
let setCounter = 0;
let playerName;
const maxSets = 20;

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
    button.classList.add('cardButton'); 

    const img = document.createElement('img');
    img.src = `images/${cardNumber}.PNG`;
    button.appendChild(img);
    button.setAttribute('data-img', cardNumber);

    document.querySelector("#allCards").appendChild(button);

    // הדגשה בלחיצה
    button.addEventListener('click', () => {
        handleCardSelection(button);
        button.classList.toggle('selected');
    });
}

// טיפול בבחירת קלף
function handleCardSelection(button) {
    const num = +button.getAttribute('data-img');

    if (selectedButtons.includes(button.id)) {
        removeFromArray(selectedCards, num);
        removeFromArray(selectedButtons, button.id);
        button.classList.remove('selected');
    } else {
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

// הסרת ערך ממערך
function removeFromArray(arr, val) {
    const index = arr.indexOf(val);
    if (index !== -1) arr.splice(index, 1);
}

// כפתור התחלה מחדש
function createRestartButton() {
    const btn = document.createElement('button');
    btn.innerText = "התחל מחדש";
    btn.id = "btnRestart";
    btn.style.cssText = ""; // עיצוב המקורי שלך
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
        const lb = document.getElementById('leaderboard');
        if(lb) lb.style.display = 'none';
    };
}

// כפתור להוספת קלף
const btnAddCard = document.querySelector("#btnAddCard");
btnAddCard.style.cssText = ""; // עיצוב המקורי
btnAddCard.onclick = () => {
    score -= 2;
    drawCardsRandomly(1);
}

// כפתור לוח ניצחונות
const btnShowLeaderboard = document.createElement('button');
btnShowLeaderboard.id = 'btnShowLeaderboard';
btnShowLeaderboard.innerText = "לוח ניצחונות";
btnShowLeaderboard.style.cssText = ""; // עיצוב כמו שאר הכפתורים
document.querySelector("#startAgainContainer").appendChild(btnShowLeaderboard);

btnShowLeaderboard.onclick = () => {
    let lb = document.getElementById('leaderboard');
    if(!lb) {
        lb = document.createElement('div');
        lb.id = 'leaderboard';
        lb.style.cssText = 'margin-top:10px; font-size:18px; color:#ec7c31; border:1px solid #002060; padding:10px; border-radius:5px;';
        document.querySelector("#startAgainContainer").appendChild(lb);
    }
    lb.innerHTML = '';
    players.sort((a,b) => b.score - a.score);
    players.forEach(p => {
        const pElem = document.createElement('p');
        pElem.innerText = `${p.name}: ${p.score}`;
        lb.appendChild(pElem);
    });
    lb.style.display = 'block';
}

// בדיקת סט
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
            if(setCounter <= maxSets) {
                replaceSetWithNewCards(cards);
            } else {
                endGame();
            }
        } else {
            score -= 3;
            messageBox.innerText = "❌ סט שגוי!";
        }
    }
}

// החלפת סט נכון בקלפים חדשים
function replaceSetWithNewCards(setIndexes) {
    setIndexes.forEach(i => {
        const btn = Array.from(document.querySelectorAll("#allCards button"))
                        .find(b => +b.getAttribute('data-img') === i);
        if (btn) btn.remove();
        removeFromArray(usedCards, i);

        const newCardNum = generateRandomCardNumber();
        drawCard(newCardNum);
        usedCards.push(newCardNum);
    });
}

function generateRandomCardNumber() {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 81) + 1;
    } while (usedCards.includes(randomNumber));
    return randomNumber;
}

// סיום המשחק
function endGame() {
    messageBox.innerText = "סיימת את המשחק! כל הכבוד!";
    document.querySelector("#allCards").style.display = 'none';
    document.querySelector("#btnAddCard").style.display = 'none';
    updateLeaderboard();
}

// Scroll ו-Keydown
window.addEventListener('scroll', () => {
    document.body.style.backgroundColor = window.scrollY > 50 ? '#f0f0f0' : 'white';
});
window.addEventListener('keydown', (event) => {
    if(event.key === "r") document.getElementById('btnRestart').click();
});
