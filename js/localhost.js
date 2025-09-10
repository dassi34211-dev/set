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

// טעינת הנתונים בעת טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    loadPlayersFromLocalStorage();
    startGame();
});
