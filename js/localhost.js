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
        event.preventDefault(); // שימוש ב-preventDefault
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

// שימוש נוסף ב-DOM: יצירת רשימת שחקנים
function showLeaderboard() {
    const leaderboard = document.createElement('div');
    leaderboard.id = 'leaderboard';
    leaderboard.style.cssText = 'margin-top:20px; font-size:20px; color:#ec7c31;';
    
    // מיון לפי ניקוד בסדר יורד
    players.sort((a, b) => b.score - a.score);

    players.forEach(p => {
        const pElem = document.createElement('p');
        pElem.innerText = `${p.name}: ${p.score}`;
        leaderboard.appendChild(pElem);
    });

    document.body.appendChild(leaderboard);
}

// אירוע נוסף – כפתור להצגת לוח אלופים
const btnShowLeaderboard = document.createElement('button');
btnShowLeaderboard.id = 'btnShowLeaderboard';
btnShowLeaderboard.innerText = 'לוח אלופים';
btnShowLeaderboard.style.cssText = 'margin-top:10px; font-size:18px;';
document.body.appendChild(btnShowLeaderboard);
btnShowLeaderboard.addEventListener('click', showLeaderboard);

// טעינת הנתונים בעת טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    loadPlayersFromLocalStorage();
    startGame();
});
