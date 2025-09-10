// ניהול שחקנים ושמירת ניקוד
let players = [];

// הוספת שחקן למערך
function addPlayer(name, score) {
    players.push({name, score});
}

// שמירה ל-localStorage
function savePlayersToLocalStorage() {
    localStorage.setItem("playersData", JSON.stringify(players));
}

// טעינה מ-localStorage
function loadPlayersFromLocalStorage() {
    const data = localStorage.getItem("playersData");
    if (data) players = JSON.parse(data);
}

// התחלת המשחק עם שם השחקן
function startGame() {
    const form = document.querySelector("#formStartGame");
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        playerName = document.getElementById('inputPlayerName').value.trim();

        if (playerName) {
            addPlayer(playerName, score); // הוספה למערך
            savePlayersToLocalStorage();   // שמירה

            drawCardsRandomly(16);
            document.querySelector("#pageStart").style.display = 'none';
            document.querySelector("#btnAddCard").style.display = 'block';
            createRestartButton();
        } else {
            const msgBox = document.getElementById('messageBox');
            msgBox.innerText = '❗ אנא הזן שם תקין.';
        }
    });
}

// עדכון לוח הניצחונות
function updateLeaderboard() {
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

// טעינת הנתונים בעת טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    loadPlayersFromLocalStorage();
    startGame();
});
