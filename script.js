// Initialize game state
let gameState = {
    hp: 3,
    round: 1,
    keyCount: 0,
    eliminationCount: 0,
    addhpCount: 0,
    playerName: '',
    studentId: '',
    playerClass: '',
    isKeyActive: false, // Track if key is active for current round
    levelsPassed: 0, // Record number of levels player has gone through
    currentRoundGates: null // Store gates for the current round
};

// Load state from localStorage on startup
function loadState() {
    const saved = localStorage.getItem('fortuneGateState');
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState = { ...gameState, ...parsed };
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('fortuneGateState', JSON.stringify(gameState));
}

// Global initialization
loadState();

// Handle specific page logic based on filename
const path = window.location.pathname;
const page = path.split("/").pop() || 'index.html';

if (page === 'index.html') {
    localStorage.removeItem('fortuneGateState'); // Reset on index
} else if (page === 'rule1.html') {
    const nextBtn = document.getElementById('page2button');
    if (nextBtn) nextBtn.onclick = () => window.location.href = 'rule2.html';
} else if (page === 'rule2.html') {
    const nextBtn = document.getElementById('page3button');
    if (nextBtn) nextBtn.onclick = () => window.location.href = 'rule3.html';
} else if (page === 'rule3.html') {
    const nextBtn = document.getElementById('page4button');
    if (nextBtn) nextBtn.onclick = () => window.location.href = 'info.html';
} else if (page === 'info.html') {
    const startBtn = document.getElementById('page5button');
    if (startBtn) {
        startBtn.onclick = function(e) {
            e.preventDefault();
            gameState.playerName = document.getElementById('name').value;
            gameState.studentId = document.getElementById('studentid').value;
            gameState.playerClass = document.getElementById('class').value;
            gameState.round = 1;
            gameState.hp = 3;
            gameState.keyCount = 0;
            gameState.eliminationCount = 0;
            gameState.addhpCount = 0;
            gameState.isKeyActive = false;
            gameState.levelsPassed = 0;
            gameState.currentRoundGates = null;
            saveState();
            window.location.href = 'no1.html';
        };
    }
} else if (page.startsWith('no') && page.endsWith('.html')) {
    const roundNum = parseInt(page.replace('no', '').replace('.html', ''));
    if (!isNaN(roundNum)) {
        gameState.round = roundNum;
        gameState.isKeyActive = false; // Reset key activation for new round
        gameState.currentRoundGates = null; // Clear gates for new round
        saveState();
        const numberElem = document.getElementById('number');
        if (numberElem && !page.includes('no1.html') && !page.includes('no2.html')) {
            setTimeout(() => { window.location.href = 'general.html'; }, 2000);
        } else {
            const numberImg = document.getElementById('number');
            if (numberImg) {
                 numberImg.addEventListener('animationend', function() {
                    setTimeout(() => { window.location.href = 'general.html'; }, 2000);
                });
            }
        }
    }
} else if (page === 'general.html') {
    const container = document.body;
    
    // UI Elements for HP and Cards
    const statsDiv = document.createElement('div');
    statsDiv.style = "position: absolute; top: 8%; left: 15%; z-index: 10; display: flex; gap: 20px; align-items: center;";
    
    const hpText = document.createElement('div');
    hpText.style = "font-size: 30px; font-family: 'Ma Shan Zheng'; color: #BB2526; background: rgba(255,255,255,0.7); padding: 5px 15px; border-radius: 10px;";
    hpText.innerText = `生命值: ${gameState.hp}`;
    statsDiv.appendChild(hpText);

    if (gameState.keyCount > 0) {
        const keyContainer = document.createElement('div');
        keyContainer.style = "position: relative; cursor: pointer;";
        const keyImg = document.createElement('img');
        keyImg.src = "https://i.imgur.com/b20hgGa.png";
        keyImg.style = "width: 60px;";
        keyImg.title = `钥匙 x${gameState.keyCount} (点击使用)`;
        
        const countBadge = document.createElement('div');
        countBadge.style = "position: absolute; bottom: 0; right: 0; background: #BB2526; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 14px; display: flex; align-items: center; justify-content: center; font-family: 'Arial';";
        countBadge.innerText = gameState.keyCount;
        
        keyContainer.appendChild(keyImg);
        keyContainer.appendChild(countBadge);
        
        keyContainer.onclick = () => {
            if (confirm("确定要使用钥匙开启门D吗？（本轮有效）")) {
                gameState.keyCount--;
                gameState.isKeyActive = true;
                saveState();
                alert("钥匙已激活！现在可以进入门D。");
                location.reload();
            }
        };
        statsDiv.appendChild(keyContainer);
    }
    if (gameState.eliminationCount > 0) {
        const elimContainer = document.createElement('div');
        elimContainer.style = "position: relative; cursor: pointer;";
        const elimImg = document.createElement('img');
        elimImg.src = "https://i.imgur.com/5DXw431.png"; 
        elimImg.style = "width: 60px;";
        elimImg.title = `排除卡 x${gameState.eliminationCount} (点击使用)`;
        
        const countBadge = document.createElement('div');
        countBadge.style = "position: absolute; bottom: 0; right: 0; background: #BB2526; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 14px; display: flex; align-items: center; justify-content: center; font-family: 'Arial';";
        countBadge.innerText = gameState.eliminationCount;
        
        elimContainer.appendChild(elimImg);
        elimContainer.appendChild(countBadge);
        
        elimContainer.onclick = () => {
            if (confirm("确定要使用排除卡吗？")) {
                gameState.eliminationCount--;
                saveState();
                const activeGates = Array.from(document.querySelectorAll('.game-gate'));
                if (activeGates.length > 0) {
                    const visibleGates = activeGates.filter(g => g.style.display !== 'none');
                    if (visibleGates.length > 0) {
                        const randomGate = visibleGates[Math.floor(Math.random() * visibleGates.length)];
                        randomGate.style.display = 'none';
                        alert("排除卡已使用，一扇门已消失！");
                        // Don't reload, just update count badge if possible or let state persist
                        countBadge.innerText = gameState.eliminationCount;
                        if (gameState.eliminationCount === 0) elimContainer.style.display = 'none';
                    }
                }
            }
        };
        statsDiv.appendChild(elimContainer);
    }
    // Add HP Card if available
    if (gameState.addhpCount > 0) {
        const addHpContainer = document.createElement('div');
        addHpContainer.style = "position: relative; cursor: pointer;";
        const addHpImg = document.createElement('img');
        addHpImg.src = "https://i.imgur.com/pYKUYaH.png";
        addHpImg.style = "width: 60px;";
        addHpImg.title = `生命卡 x${gameState.addhpCount} (点击使用)`;
        
        const countBadge = document.createElement('div');
        countBadge.style = "position: absolute; bottom: 0; right: 0; background: #BB2526; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 14px; display: flex; align-items: center; justify-content: center; font-family: 'Arial';";
        countBadge.innerText = gameState.addhpCount;
        
        addHpContainer.appendChild(addHpImg);
        addHpContainer.appendChild(countBadge);
        
        addHpContainer.onclick = () => {
            if (gameState.hp < 3) {
                if (confirm("使用生命值+1卡？")) {
                    gameState.hp += 1;
                    gameState.addhpCount--;
                    saveState();
                    hpText.innerText = `生命值: ${gameState.hp}`;
                    countBadge.innerText = gameState.addhpCount;
                    if (gameState.addhpCount === 0) addHpContainer.style.display = 'none';
                }
            } else {
                alert("生命值已满！");
            }
        };
        statsDiv.appendChild(addHpContainer);
    }
    container.appendChild(statsDiv);

    // Timer
    let timeLeft = 10;
    const timerDiv = document.createElement('div');
    timerDiv.style = "position: absolute; top: 7%; right: 27%; font-size: 40px; font-family: 'ZCOOL KuaiLe'; color: #BB2526; z-index: 10;";
    timerDiv.innerText = `时间: ${timeLeft}s`;
    container.appendChild(timerDiv);

    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDiv.innerText = `时间: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);

    // Random Gates or Stored Gates
    const gateTypes = ['A', 'B', 'C', 'D'];
    let selectedGates;
    if (gameState.currentRoundGates) {
        selectedGates = gameState.currentRoundGates;
    } else {
        selectedGates = [];
        for(let i=0; i<3; i++) {
            selectedGates.push(gateTypes[Math.floor(Math.random() * gateTypes.length)]);
        }
        gameState.currentRoundGates = selectedGates;
        saveState();
    }

    const positions = [{ left: '20%', top: '50%' }, { left: '50%', top: '50%' }, { left: '80%', top: '50%' }];
    selectedGates.forEach((type, index) => {
        const gate = document.createElement('img');
        gate.className = 'game-gate';
        gate.src = getGateImg(type);
        gate.style = `position: absolute; left: ${positions[index].left}; top: ${positions[index].top}; transform: translate(-50%, -50%); width: 320px; cursor: pointer; transition: 0.3s;`;
        gate.onmouseover = () => gate.style.transform = 'translate(-50%, -50%) scale(1.05)';
        gate.onmouseout = () => gate.style.transform = 'translate(-50%, -50%) scale(1)';
        gate.onclick = () => {
            if (type === 'D' && !gameState.isKeyActive) {
                alert('你需要先激活钥匙才能进入门D！');
                return;
            }
            clearInterval(timerInterval);
            handleGateChoice(type);
        };
        container.appendChild(gate);
    });

    function handleTimeout() {
        gameState.hp -= 1;
        saveState();
        if (gameState.hp <= 0) window.location.href = 'lose.html';
        else window.location.href = 'minushp.html';
    }
} else if (page === 'thanks.html') {
    const container = document.body;
    const scoreText = document.createElement('div');
    scoreText.style = "position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; font-family: 'Ma Shan Zheng'; color: #BB2526; text-align: center; width: 100%; z-index: 10;";
    scoreText.innerText = `您已成功通过: ${gameState.levelsPassed-1} 轮`;
    container.appendChild(scoreText);
}

function getGateImg(type) {
    const urls = {
        'A': 'https://i.imgur.com/mL3vqAO.png',
        'B': 'https://i.imgur.com/wCgkrm3.png',
        'C': 'https://i.imgur.com/GcBnXpW.png',
        'D': 'https://i.imgur.com/cYgi26i.png'
    };
    return urls[type];
}

function handleGateChoice(type) {
    const rand = Math.random();
    let risk = 0.2;
    if (type === 'A') risk = 0.15;
    if (type === 'B') risk = 0.3;
    if (type === 'C') risk = 0.5;
    if (type === 'D') risk = 0.05;

    if (rand < risk) {
        gameState.hp -= 1;
        gameState.levelsPassed++; // Record level passed even on HP loss
        saveState();
        if (gameState.hp <= 0) window.location.href = 'lose.html';
        else window.location.href = 'minushp.html';
    } else {
        const itemRand = Math.random();
        gameState.levelsPassed++; // Record level passed on safe passage
        saveState();
        if (itemRand < 0.1) {
            gameState.keyCount++;
            saveState();
            window.location.href = 'key.html';
        } else if (itemRand < 0.2 && gameState.hp < 3) {
            gameState.addhpCount++; // Store item instead of immediate use
            saveState();
            window.location.href = 'addhp.html';
        } else if (itemRand < 0.3) {
            gameState.eliminationCount++;
            saveState();
            window.location.href = 'elimination.html';
        } else {
            window.location.href = 'live.html';
        }
    }
}

// Global page transitions
if (['live.html', 'key.html', 'addhp.html', 'elimination.html'].includes(page)) {
    setTimeout(() => {
        gameState.round++;
        saveState();
        if (gameState.round > 25) {
            gameState.levelsPassed++; // Record final level for victory
            saveState();
            window.location.href = 'victory.html';
        }
        else window.location.href = `no${gameState.round}.html`;
    }, 2000);
}

if (page === 'minushp.html') {
    setTimeout(() => {
        window.location.href = 'nian1.html'; // Always nian1 per request
    }, 2000);
}

if (page === 'nian1.html') {
    setTimeout(() => {
        gameState.round++;
        saveState();
        if (gameState.round > 25) window.location.href = 'victory.html';
        else window.location.href = `no${gameState.round}.html`;
    }, 5000); // 5s per request
}

if (page === 'victory.html') {
    setTimeout(() => window.location.href = 'thanks.html', 5000);
}

if (page === 'lose.html') {
    setTimeout(() => window.location.href = 'thanks.html', 3000);
}
