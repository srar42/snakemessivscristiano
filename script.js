// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-button');
    const clearScoresButton = document.getElementById('clear-scores-button');
    const scoreContainer = document.getElementById('score');
    const highScoresList = document.getElementById('high-scores-list');
    const difficultySelect = document.getElementById('difficulty');
    const gameModeSelect = document.getElementById('game-mode');
    const modal = document.getElementById('high-scores-modal');
    const closeButton = document.getElementById('close-button');
    const settings = document.getElementById('settings');
    const countdown = document.getElementById('countdown');
    const gameSize = 320; // Ajustado para el nuevo tamaño de bloque
    const blockSize = 40; // Ajustado para el nuevo tamaño de bloque
    let gameInterval;
    let countdownInterval;
    let snake;
    let food;
    let direction;
    let nextDirection;
    let score;
    let gameSpeed = 200;
    let snakeClass = 'snake';
    let foodClass = 'food';
    let eatSoundMessi = new Audio('messi-eat.mp3');
    let eatSoundCristiano = new Audio('cristiano-eat.mp3');
    let gameOverSound = new Audio('game-over.mp3');
    let eatSound;

    startButton.addEventListener('click', startCountdown);
    clearScoresButton.addEventListener('click', clearHighScores);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function startCountdown() {
        let count = 3;
        countdown.textContent = count;
        countdown.classList.remove('hidden');
        settings.classList.add('hidden');
        startButton.disabled = true;

        clearInterval(countdownInterval); // Clear any previous interval

        countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdown.textContent = count;
            } else {
                clearInterval(countdownInterval);
                countdown.classList.add('hidden');
                startGame();
            }
        }, 1000);
    }

    function startGame() {
        gameSpeed = parseInt(difficultySelect.value);
        const gameMode = gameModeSelect.value;
        if (gameMode === 'messi') {
            snakeClass = 'snake';
            foodClass = 'food';
            eatSound = eatSoundMessi;
        } else {
            snakeClass = 'food';
            foodClass = 'snake';
            eatSound = eatSoundCristiano;
        }
        resetGame();
        startButton.textContent = 'Reiniciar Juego';
        startButton.disabled = false;
        gameInterval = setInterval(updateGame, gameSpeed);
    }

    function resetGame() {
        clearInterval(gameInterval);
        gameArea.innerHTML = '';
        gameArea.classList.remove('flash');
        snake = [{ x: 0, y: 0 }];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        updateScore();
        drawSnake();
        placeFood();
    }

    function drawSnake() {
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.left = `${segment.x}px`;
            snakeElement.style.top = `${segment.y}px`;
            snakeElement.classList.add(snakeClass);
            gameArea.appendChild(snakeElement);
        });
    }

    function placeFood() {
        const x = Math.floor(Math.random() * (gameSize / blockSize)) * blockSize;
        const y = Math.floor(Math.random() * (gameSize / blockSize)) * blockSize;
        food = { x, y };
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.classList.add(foodClass);
        gameArea.appendChild(foodElement);
    }

    function updateGame() {
        const head = { ...snake[0] };

        switch (nextDirection) {
            case 'up':
                head.y -= blockSize;
                break;
            case 'down':
                head.y += blockSize;
                break;
            case 'left':
                head.x -= blockSize;
                break;
            case 'right':
                head.x += blockSize;
                break;
        }

        if (head.x < 0 || head.x >= gameSize || head.y < 0 || head.y >= gameSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScore();
            eatSound.play().catch(error => console.error('Error al reproducir el sonido:', error));
            flashBackground();
            placeFood();
        } else {
            snake.pop();
        }

        gameArea.innerHTML = '';
        drawSnake();
        drawFood();
        direction = nextDirection;
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.classList.add(foodClass);
        gameArea.appendChild(foodElement);
    }

    function updateScore() {
        scoreContainer.textContent = score;
    }

    function flashBackground() {
        gameArea.classList.add('flash');
        setTimeout(() => {
            gameArea.classList.remove('flash');
        }, 300);
    }

    function endGame() {
        clearInterval(gameInterval);
        gameOverSound.play().catch(error => console.error('Error al reproducir el sonido:', error));
        alert(`Juego terminado. Puntuación: ${score}`);
        saveHighScore(score);
        displayHighScores();
        openModal();
        settings.classList.remove('hidden');
        startButton.textContent = 'Iniciar Juego';
        resetGame();
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });

    function saveHighScore(score) {
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        if (highScores.length > 10) highScores = highScores.slice(0, 10);
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
    }

    function clearHighScores() {
        localStorage.removeItem('highScores');
        displayHighScores();
    }

    function openModal() {
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    displayHighScores();
});


