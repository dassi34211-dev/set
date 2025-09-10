const SetGame = {
    // משתנים גלובליים
    usedCards: [],
    selectedCards: [],
    selectedButtons: [],
    buttonCounter: 0,
    score: 100,
    setCounter: 0,
    playerName: '',
    maxSets: 20,
    players: [],
    messageBox: null,

    // אתחול המשחק
    init() {
        this.createMessageBox();
        this.hideElementsOnStart();
        this.bindEvents();
        this.loadPlayersFromLocalStorage();
    },

    // יצירת תיבת הודעות
    createMessageBox() {
        this.messageBox = document.createElement('div');
        this.messageBox.id = 'messageBox';
        this.messageBox.style.cssText = 'margin-top:20px; font-size:24px; color:#002060;';
        document.body.insertBefore(this.messageBox, document.querySelector("#allCards"));
    },

    // הסתרת כפתורים ולוח בהתחלה
    hideElementsOnStart() {
        const addCardBtn = document.querySelector("#btnAddCard");
        if (addCardBtn) addCardBtn.style.display = 'none';

        const leaderboard = document.getElementById('leaderboard');
        if (leaderboard) leaderboard.style.display = 'none';
    },

    // ציור קלפים אקראיים
    drawCardsRandomly(num) {
        for (let i = 0; i < num; i++) {
            let randomNumber = Math.floor(Math.random() * 81) + 1;
            if (!this.usedCards.includes(randomNumber)) {
                this.drawCard(randomNumber);
                this.usedCards.push(randomNumber);
            } else {
                i--;
            }
        }
    },

    // יצירת קלף חדש ככפתור
    drawCard(cardNumber) {
        this.buttonCounter++;
        const button = document.createElement('button');
        button.id = `btn${this.buttonCounter}`;
        button.classList.add('cardButton');

        const img = document.createElement('img');
        img.src = `images/${cardNumber}.PNG`;
        button.appendChild(img);
        button.setAttribute('data-img', cardNumber);

        document.querySelector("#allCards").appendChild(button);

        // אירוע לחיצה על קלף
        button.addEventListener('click', () => {
            this.handleCardSelection(button);
            button.classList.toggle('selected');
        });
    },

    // טיפול בבחירת קלף
    handleCardSelection(button) {
        const num = +button.getAttribute('data-img');

        if (this.selectedButtons.includes(button.id)) {
            this.removeFromArray(this.selectedCards, num);
            this.removeFromArray(this.selectedButtons, button.id);
            button.classList.remove('selected');
        } else {
            this.selectedCards.push(num);
            this.selectedButtons.push(button.id);
        }

        if (this.selectedCards.length === 3) {
            setTimeout(() => {
                this.checkSet(this.selectedCards);
                this.selectedButtons.forEach(id => {
                    const btn = document.getElementById(id);
                    if (btn) btn.classList.remove('selected');
                });
                this.selectedCards = [];
                this.selectedButtons = [];
            }, 100);
        }
    },

    // הסרת ערך ממערך
    removeFromArray(arr, val) {
        const index = arr.indexOf(val);
        if (index !== -1) arr.splice(index, 1);
    },

    // יצירת כפתור התחלה מחדש
    createRestartButton() {
        const btn = document.createElement('button');
        btn.innerText = "התחל מחדש";
        btn.id = "btnRestart";
        document.querySelector("#startAgainContainer").appendChild(btn);

        btn.onclick = () => {
            document.querySelectorAll("#allCards button").forEach(b => b.remove());
            this.usedCards = [];
            this.selectedCards = [];
            this.selectedButtons = [];
            this.buttonCounter = 0;
            this.score = 100;
            this.setCounter = 0;
            this.drawCardsRandomly(16);

            document.querySelector("#allCards").style.display = 'block';
            document.querySelector("#btnAddCard").style.display = 'block';
            this.messageBox.innerText = '';
            const lb = document.getElementById('leaderboard');
            if (lb) lb.style.display = 'none';
        };
    },

    // חיבור אירועים
    bindEvents() {
        // כפתור הוספת קלף
        const btnAddCard = document.querySelector("#btnAddCard");
        btnAddCard.onclick = () => {
            this.score -= 2;
            this.drawCardsRandomly(1);
        };

        // כפתורי הוראות
        const btnInstructions = document.getElementById('btnInstructions');
        const instructionsBox = document.getElementById('instructionsBox');
        const closeInstructions = document.getElementById('closeInstructions');

        btnInstructions.addEventListener('click', () => instructionsBox.style.display = 'block');
        closeInstructions.addEventListener('click', () => instructionsBox.style.display = 'none');

        // שינוי רקע בעת גלילה
        window.addEventListener('scroll', () => {
            document.body.style.backgroundColor = window.scrollY > 50 ? '#f0f0f0' : 'white';
        });

        // התחלה מחדש עם מקש "r"
        window.addEventListener('keydown', (event) => {
            if(event.key === "r") document.getElementById('btnRestart').click();
        });

        // התחלת המשחק דרך טופס
        const form = document.querySelector("#formStartGame");
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.playerName = document.getElementById('inputPlayerName').value.trim();

            if (this.playerName) {
                this.addPlayer(this.playerName, this.score);
                this.savePlayersToLocalStorage();
                this.drawCardsRandomly(16);
                document.querySelector("#pageStart").style.display = 'none';
                document.querySelector("#btnAddCard").style.display = 'block';
                this.createRestartButton();
            } else {
                this.showMessage('❗ אנא הזן שם תקין.');
            }
        });
    },

    // בדיקת סט נכון
    checkSet(cards) {
        const checkProperty = prop => {
            const vals = cards.map(i => arrCards[i - 1][prop]);
            return (vals[0] === vals[1] && vals[1] === vals[2]) ||
                   (vals[0] !== vals[1] && vals[1] !== vals[2] && vals[0] !== vals[2]);
        };

        if (cards.length === 3) {
            if (checkProperty('color') && checkProperty('shape') && checkProperty('texture') && checkProperty('count')) {
                this.setCounter++;
                this.score += 5;
                this.showMessage("✅ סט נכון!");
                if(this.setCounter <= this.maxSets) this.replaceSetWithNewCards(cards);
                else this.endGame();
            } else {
                this.score -= 3;
                this.showMessage("❌ סט שגוי!");
            }
        }
    },

    // הצגת הודעה זמנית
    showMessage(msg) {
        this.messageBox.innerText = msg;
        setTimeout(() => this.messageBox.innerText = '', 5000);
    },

    // החלפת סט בקלפים חדשים
    replaceSetWithNewCards(setIndexes) {
        setIndexes.forEach(i => {
            const btn = Array.from(document.querySelectorAll("#allCards button"))
                            .find(b => +b.getAttribute('data-img') === i);
            if (btn) btn.remove();
            this.removeFromArray(this.usedCards, i);

            const newCardNum = this.generateRandomCardNumber();
            this.drawCard(newCardNum);
            this.usedCards.push(newCardNum);
        });
    },

    generateRandomCardNumber() {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 81) + 1;
        } while (this.usedCards.includes(randomNumber));
        return randomNumber;
    },

    endGame() {
        this.showMessage("סיימת את המשחק! כל הכבוד!");
        document.querySelector("#allCards").style.display = 'none';
        document.querySelector("#btnAddCard").style.display = 'none';
        this.updateLeaderboard();
    },

    addPlayer(name, score) {
        this.players.push({name, score});
    },

    savePlayersToLocalStorage() {
        localStorage.setItem("playersData", JSON.stringify(this.players));
    },

    loadPlayersFromLocalStorage() {
        const data = localStorage.getItem("playersData");
        if (data) this.players = JSON.parse(data);
    },

    updateLeaderboard() {
        let lb = document.getElementById('leaderboard');
        if(!lb) {
            lb = document.createElement('div');
            lb.id = 'leaderboard';
            lb.style.cssText = 'margin-top:10px; font-size:18px; color:#ec7c31; border:1px solid #002060; padding:10px; border-radius:5px;';
            document.querySelector("#startAgainContainer").appendChild(lb);
        }
        lb.innerHTML = '';
        this.players.sort((a,b) => b.score - a.score);
        this.players.forEach(p => {
            const pElem = document.createElement('p');
            pElem.innerText = `${p.name}: ${p.score}`;
            lb.appendChild(pElem);
        });
        lb.style.display = 'block';
    }
};

// אתחול המשחק
document.addEventListener('DOMContentLoaded', () => SetGame.init());
