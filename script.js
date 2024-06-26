function getScore(x, y, centerX, centerY) {
    const dx = x - centerX;
    const dy = -(y - centerY); // Y座標を反転

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) return 50; // Bullseye
    if (distance < 20) return 25; // Outer bullseye

    // Define scoring areas based on the distance and angle
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const normalizedAngle = (angle + 360) % 360;
    
    let areas;
    if (game.mode == 2) {
        areas = [
            { start:0, end: 9, score: 0 },
            { start:351, end: 360, score: 0 },
            { start: 9, end: 27, score: 0 },
            { start: 27, end: 45, score: 0 },
            { start: 45, end: 63, score: 18 },
            { start: 63, end: 81, score: 0 },
            { start: 81, end: 99, score: 20 },
            { start: 99, end: 117, score: 0 },
            { start: 117, end: 135, score: 0 },
            { start: 135, end: 153, score: 0 },
            { start: 153, end: 171, score: 0 },
            { start: 171, end: 189, score: 0 },
            { start: 189, end: 207, score: 0 },
            { start: 207, end: 225, score: 16 },
            { start: 225, end: 243, score: 0 },
            { start: 243, end: 261, score: 19 },
            { start: 261, end: 279, score: 0 },
            { start: 279, end: 297, score: 17 },
            { start: 297, end: 315, score: 0 },
            { start: 315, end: 333, score: 15 },
            { start: 333, end: 351, score: 10 },
        ];
    }
    else {
        areas = [
            { start:0, end: 9, score: 6 },
            { start:351, end: 360, score: 6 },
            { start: 9, end: 27, score: 13 },
            { start: 27, end: 45, score: 4 },
            { start: 45, end: 63, score: 18 },
            { start: 63, end: 81, score: 1 },
            { start: 81, end: 99, score: 20 },
            { start: 99, end: 117, score: 5 },
            { start: 117, end: 135, score: 12 },
            { start: 135, end: 153, score: 9 },
            { start: 153, end: 171, score: 14 },
            { start: 171, end: 189, score: 11 },
            { start: 189, end: 207, score: 8 },
            { start: 207, end: 225, score: 16 },
            { start: 225, end: 243, score: 7 },
            { start: 243, end: 261, score: 19 },
            { start: 261, end: 279, score: 3 },
            { start: 279, end: 297, score: 17 },
            { start: 297, end: 315, score: 2 },
            { start: 315, end: 333, score: 15 },
            { start: 333, end: 351, score: 10 },
        ];
    }
    
    let baseScore = 0;
    for (const area of areas) {
        if (normalizedAngle >= area.start && normalizedAngle < area.end) {
            baseScore = area.score;
            break;
        }
    }
    
    if (distance > 190 && distance < 210) return baseScore * 2; // Outer ring (double score)
    if (distance > 110 && distance < 130) return baseScore * 3; // Middle ring (triple score)
    if (distance>=210) return baseScore*0;
    return baseScore;
}
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ダーツボードの当たり判定↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 表を生成する関数
function generateTable(currentPlayer, data, colHeaders, rowHeaders) {
    // table要素を作成
    const table = document.createElement("table");

    // thead要素を作成
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // 左上のセルにcurrentPlayerを追加
    const topLeftHeader = document.createElement("th");
    topLeftHeader.textContent = currentPlayer;
    headerRow.appendChild(topLeftHeader);

    // 行ヘッダーを追加
    rowHeaders.forEach((rowHeader) => {
        const th = document.createElement("th");
        th.textContent = rowHeader;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody要素を作成
    const tbody = document.createElement("tbody");

    // 列を追加
    colHeaders.forEach((colHeader) => {
        const row = document.createElement("tr");

        // 列ヘッダーを追加
        const th = document.createElement("th");
        th.textContent = colHeader;
        row.appendChild(th);

        // データセルを追加
        rowHeaders.forEach((rowHeader) => {
            const td = document.createElement("td");
            // dataから該当するセルの値を取得し、存在しない場合は空文字を設定
            const rowIndex = rowHeaders.indexOf(rowHeader);
            const colIndex = colHeaders.indexOf(colHeader);
            if (rowIndex !== -1 && colIndex !== -1 && data[colIndex] && data[colIndex][rowIndex] !== undefined) {
                td.textContent = data[colIndex][rowIndex];
            } else {
                td.textContent = "";
            }
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
}

function generateBoard() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    for (let i = 0; i < player.num; i++) {
        const th = document.createElement("th");
        th.textContent = `${player.score[i]}`;
        thead.appendChild(th);
        if (i === player.current) {
            th.style.backgroundColor = "#ffc107";
        }
    }
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 0; i < player.num; i++) {
        const td = document.createElement("td");
        td.textContent = `${player.name[i]}`;
        tbody.appendChild(td);

        if (i === player.current) {
            td.style.backgroundColor = "#ffc107";
        }
    }
    table.appendChild(tbody);
    return table;
}



// R1, R2, ...の列ヘッダーを生成
function generateColHeader() {
    for (let i = 1; i <= game.round[game.mode]; i++) {
        colHeaders.push(`R${i}`);
    }
}
function generateCtable(playerNames, playerScores) {
    const rowHeaders = ["20", "19", "18", "17", "16", "15", "BULL"]; // 行ヘッダー

    // テーブルの作成
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // 左上の空セルの作成
    const emptyHeaderCell = document.createElement("th");
    headerRow.appendChild(emptyHeaderCell);

    // 列ヘッダーの作成
    playerNames.forEach(name => {
        const th = document.createElement("th");
        th.textContent = name;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // テーブルボディの作成
    const tbody = document.createElement("tbody");

    // 各行を作成
    rowHeaders.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        // 行ヘッダーの作成
        const rowHeader = document.createElement("th");
        rowHeader.textContent = row;
        tr.appendChild(rowHeader);

        // 各セルの作成
        playerScores.forEach(scoreArray => {
            const td = document.createElement("td");
            td.textContent = scoreArray[rowIndex] !== undefined ? scoreArray[rowIndex] : "";
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑表示用の表を作成する関数↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ゲームの処理↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓


// 行ヘッダーと列ヘッダーを定義
const rowHeaders = ["1", "2", "3"];
let colHeaders = [];
let isEnd = false;

let player = {
    num: 1,
    name: ["Player 1", "Player 2", "Player 3", "Player 4"],
    current: 0,
    score: [0, 0, 0, 0],
    scoreTable: [[], [], [], []],
    cricket: [
        // 20, 19, 18, 17, 16, 15, BULLとする
        {open: [0, 0, 0, 0, 0, 0, 0]},
        {open: [0, 0, 0, 0, 0, 0, 0]},
        {open: [0, 0, 0, 0, 0, 0, 0]},
        {open: [0, 0, 0, 0, 0, 0, 0]},
    ]
};

let game = {
    mode: 0,
    round: [8, 10, 20],
    current: 1,
    cricket: [20, 19, 18, 17, 16, 15, 25],
    maxMark: 3
};

let roundScore = {
    score: [],
    len: 3,
	count: 0
};

// cssにplayer.numを渡す
document.documentElement.style.setProperty('--num', player.num);


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myform').addEventListener('submit', function(event) {
        event.preventDefault(); // デフォルトのフォーム送信を防止

        const formData = new FormData(this);
        const selectedGame = formData.get('gameselect');
        const selectedPlayers = formData.get('pnum');

        // 遷移先のURLを決定する
        let destination;
        switch (selectedGame) {
            case '01':
                destination = '01.html';
                break;
            case 'COUNT-UP':
                destination = 'countup.html';
                break;
            case 'CRICKET':
                destination = 'cricket.html';
                break;
            default:
                destination = 'default.html'; // デフォルトの遷移先を設定する場合
                break;
        }
        
        // URLにクエリパラメータを追加
        const url = `${destination}?pnum=${selectedPlayers}&gameselect=${selectedGame}`;

        // フォームを送信
        window.location.href = url;
    });
      
});
        // クエリパラメータから値を取得する関数
        function getQueryParamValue(key) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(key);
        }

        // pnumの値を取得してplayer.numに代入
        const pnum = getQueryParamValue('pnum');
        if (pnum) {
            player.num = parseInt(pnum);
        }

        // 必要な初期化処理をここに記述
        document.addEventListener("DOMContentLoaded", function() {
            // 初期スコア表示を設定
            let currentPlayerElement = document.getElementById("current-player");
            currentPlayerElement.textContent = `${player.name[player.current]}`;

            // 初期スコア表を生成
            updateScoreTable();
        });


document.addEventListener("DOMContentLoaded", function() {
    // ダーツボードクリック時のスコア計算
	document.getElementById('dartboard').addEventListener('click', function(event) {
		const dartboard = event.target;
		const rect = dartboard.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		let score = getScore(x, y, dartboard.width / 2, dartboard.height / 2);
		document.getElementById('score').textContent = `Score: ${score}`;
		if(roundScore.count >= roundScore.len){
			roundScore.score.shift();
		}
        // tmp-boardにスコアを表示
		roundScore.score.push(getScore(x, y, dartboard.width / 2, dartboard.height / 2))
		if(roundScore.score[0]===undefined) { ; }
		else if(roundScore.score[1]===undefined) {
			document.getElementById('scorecheck').innerHTML = `↓Score↓<br>${roundScore.score[0]}`;
		}
		else if(roundScore.score[2]===undefined) {
			document.getElementById('scorecheck').innerHTML = `↓Score↓<br>${roundScore.score[0]}<br>${roundScore.score[1]}`;
		}
		else {
            document.getElementById('scorecheck').innerHTML = `↓Score↓<br>${roundScore.score[0]}<br>${roundScore.score[1]}<br>${roundScore.score[2]}`;
		}
        // let tmp = document.getElementById("tmp-board");
        // tmp.appendChild(generateTmpBoard());
        // document.getElementById("tmp-board").appendChild(generateTmpBoard());
		roundScore.count++;
	});

    // ボタンクリック時のラウンドスコア記録
    document.getElementById('round-score').addEventListener('click', function() {
        getRoundScore();
        // 表を再生成
        updateScoreTable();
    });



    // クリケット用のテーブルを生成
    let currentPlayerElement = document.getElementById("current-player");
    currentPlayerElement.textContent = `${player.name[player.current]}`;

    // 初期スコア表を生成
    updateScoreTable();
});




function isAward() {
    let scoreSum = 0;
    for (let i = 0; i < roundScore.len; i++) {
        scoreSum += roundScore.score[i];
    }
    if (scoreSum === 180) {
        alert(`Ton 80`);
    }
    else if (scoreSum === 150) {
        alert("Hat Trick");
    }
    else if (scoreSum >= 151) {
        alert("High Ton");
    }
    else if (scoreSum >= 100) {
        alert("Low Ton");
    }
}

// CU勝者を取得
function getWinnerCU() {
    let maxScore = 0;
    let winner = 0;
    for (let i = 0; i < player.num; i++) {
        if (player.score[i] > maxScore) {
            maxScore = player.score[i];
            winner = i;
        }
    }
    alert(`${player.name[winner]} won!\nScore: ${maxScore}`);
    isEnd = true;
}

// 01勝者を取得
function getWinner01() {
    let minScore = 701;
    let winner = 0;
    for (let i = 0; i < player.num; i++) {
        if (player.score[i] < minScore) {
            minScore = player.score[i];
            winner = i;
        }
    }
    alert(`${player.name[winner]} won!\nScore: ${minScore}`);
}

// CR勝者を取得
function getWinnerCR(isClose) {
    let maxScore = 0;
    let winner = 0;
    for (let i = 0; i < player.num; i++) {
        if (!isClose[i]) {
            continue;
        }
        else
        {
            maxScore = player.score[i];
            winner = i;
        }
        for (let j = i + 1; j < player.num; j++) {
            if (isClose[j] && player.score[j] > player.score[i]) {
                maxScore = player.score[j];
                winner = j;
            }
        }
        alert(`$${player.name[winner]} won!\nScore: ${player.score[winner]}`);
        isEnd = true;
    }
}

// 勝利判定エラー出る
function isWin() {
    if (game.mode == 0) {
        if (game.current == game.round[game.mode] && player.current == player.num - 1) {
            getWinnerCU();
        }
    }
    else if (game.mode == 1) {
        if (player.score[player.current] == 0 || player.current == player.num - 1 && game.current == game.round[game.mode]) {
            getWinner01();
        }
    }
    else if (game.mode == 2) {
        if (player.num == 1) {
            for (let i = 0; i < game.cricket.length; i++) {
                if (player.cricket[player.current].open[i] < game.maxMark) {
                    return;
                }
            }
            getWinnerCR();
        }
        else {
            let isClose = [true, true, true, true]
            for (let i = 0; i < player.num; i++) {
                for (let j = 0; j < game.cricket.length; j++) {
                    if (player.cricket[i].open[j] < game.maxMark) {
                        isClose[i] = false;
                        break;
                    }
                }
            }
            getWinnerCR(isClose);
        }
    }
}

function checkCU() {
    let scoreSum = 0;
    // スコアを加算
    for (let i = 0; i < roundScore.len; i++) {
        scoreSum += roundScore.score[i];
    }
	player.score[player.current] += scoreSum;
}

function check01() {
    let isBurst = false;
    let score = player.score[player.current];
    // スコアを加算
    for (let i = 0; i < roundScore.len; i++) {
        if (isBurst) {
            roundScore.score[i] = 0;
        }
        else if (player.score[player.current] - roundScore.score[i] < 0) {
            roundScore.score[i] = 0;
            isBurst = true;
        }
        else {
            player.score[player.current] -= roundScore.score[i];
            if (player.score[player.current] == 0) {
                return;
            }
        }
    }
    if (isBurst) {
        player.score[player.current] = score;
    }
}

function checkCR() {
    let mark;
    let attack;

    for (let i = 0; i < roundScore.len; i++) {
        // 1Pの場合
        if (player.num == 1) {
            if (roundScore.score[i] == 0) {
                mark = 0;
            }
            else {
                // 20, 19 .. 16, 25までループ
                for (let j = 0; j < game.cricket.length; j++) {
                    // いずれかの倍数の場合
                    if (roundScore.score[i] % game.cricket[j] == 0) {
                        // マーク数を計算
                        mark = roundScore.score[i] / game.cricket[j];
                        // オープンしている場合
                        if (player.cricket[player.current].open[j] == game.maxMark) {
                            player.score[player.current] += roundScore.score[i];
                        }
                        // このラウンドでオープンする場合
                        else if (player.cricket[player.current].open[j] + mark >= game.maxMark) {
                            // 攻撃点数を計算
                            attack = player.cricket[player.current].open[j] + mark - game.maxMark;
                            // オープンを記録
                            player.cricket[player.current].open[j] = game.maxMark;
                            player.score[player.current] += roundScore.score[i] / mark * attack;
                        }
                        else {
                            // オープンを記録
                            player.cricket[player.current].open[j] += mark;
                        }
                        break;
                    }
                }
            }
            roundScore.score[i] = mark;
        }
        // 2P以上の場合
        else {
            let isClose = true; // クローズフラグ
            let attack; // 攻撃点数
            // 0点の場合は何もしない
            if (roundScore.score[i] == 0) {
                mark = 0;
            }
            else {
                // 20, 19 .. 16, 25までループ
                for (let j = 0; j < game.cricket.length; j++) {
                    // いずれかの倍数の場合
                    if (roundScore.score[i] % game.cricket[j] == 0) {
                        // マーク数を計算
                        mark = roundScore.score[i] / game.cricket[j];
                        // オープンしている場合
                        if (player.cricket[player.current].open[j] == game.maxMark) {
                            // 全プレイヤーを検索
                            for (let k = 0; k < player.num; k++) {
                                // オープンしていないプレイヤーに攻撃
                                if (player.cricket[k].open[j] < game.maxMark) {
                                    player.score[k] += roundScore.score[i];
                                    isClose = false;
                                }
                            }
                            // クローズの場合
                            if (isClose) {
                                mark = 0;
                            }
                        }
                        // このラウンドでオープンする場合
                        else if (player.cricket[player.current].open[j] + mark >= game.maxMark) {
                            // 攻撃点数を計算
                            attack = player.cricket[player.current].open[j] + mark - game.maxMark;
                            // オープンを記録
                            player.cricket[player.current].open[j] = game.maxMark;
                            // 全プレイヤーを検索
                            for (let k = 0; k < player.num; k++) {
                                // オープンしていないプレイヤーに攻撃
                                if (player.cricket[k].open[j] < game.maxMark) {
                                    player.score[k] += roundScore.score[i] / mark * attack;
                                    isClose = false;
                                }
                            }
                            // クローズの場合
                            if (isClose) {
                                mark -= attack;
                            }
                        }
                        else {
                            // オープンを記録
                            player.cricket[player.current].open[j] += mark;
                        }
                        break;
                    }
                }
            }
        }
        roundScore.score[i] = mark;
    }
}

// getRoundScore関数を定義
function getRoundScore() {
    // スコアが3つ未満の場合は何もしない
    if (roundScore.score.length < roundScore.len || isEnd) {
        return;
    }
    else if (game.mode == 0) {
        checkCU();
        // アワードの判定
	    isAward();
    }
    else if (game.mode == 1) {
        check01();
        // アワードの判定
	    isAward();
    }
    else if (game.mode == 2) {
        checkCR();
    }
    // 勝利判定
    isWin();
    // スコアをスコア表に反映
    player.scoreTable[player.current].push([...roundScore.score]);
    // ラウンドスコアをリセット
    roundScore.score = [];
    // ラウンドの切り替え
    if (player.current === player.num - 1) {
        game.current++;
    }
    // プレイヤーを切り替え
    player.current = (player.current + 1) % player.num;
    // 現在のプレイヤー表示を更新
    document.getElementById("current-player").textContent = `${player.name[player.current]}`;
	// ラウンドスコアをリセット
	roundScore.count = 0;
	roundScore.score = [];
	document.getElementById('scorecheck').textContent = `Score: `;
	document.getElementById('score').textContent = `Score: `;
}


// スコア表示を更新する関数
function updateScoreTable() {
    let tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = ''; // 既存の表を削除
    let scoreBord = document.getElementById("score-board");
    scoreBord.innerHTML = ''; // 既存の表を削除
    let bord = generateBoard();
    scoreBord.appendChild(bord);
    for (let i = 0; i < player.num; i++) {
        let table = generateTable(player.name[i], player.scoreTable[i], colHeaders, rowHeaders);
        tableContainer.appendChild(table);
    }
    const cricketTable = document.getElementById("cricket-table");
    cricketTable.innerHTML = ''; // 既存の表を削除
    const playerNames = player.name.slice(0, player.num); // 有効なプレイヤーの名前
    const playerScores = player.cricket.slice(0, player.num).map(player => player.open); // 有効なプレイヤーのスコア
    const ctable = generateCtable(playerNames, playerScores);
    cricketTable.appendChild(ctable);
}
 