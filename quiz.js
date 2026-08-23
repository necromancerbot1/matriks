// === LOGIKA KUIS (PILIHAN LEVEL), KALKULATOR MINI & LEADERBOARD ===

const quizDatabase = {
    smp: [
        { q: "Berapa hasil dari [2  3] + [1  4]?", options: ["[3  7]", "[2  12]", "[1  -1]", "[3  12]"], ans: 0 },
        { q: "Hitung pengurangan matriks: [5  8] - [2  3]", options: ["[3  5]", "[7  11]", "[10  24]", "[3  -5]"], ans: 0 },
        { q: "Jika A = [4  2], hitunglah 3A (Skalar x Matriks)", options: ["[12  6]", "[7  5]", "[12  2]", "[4  6]"], ans: 0 },
        { q: "Diketahui persamaan x + y = 10 dan x - y = 4. Berapa nilai x?", options: ["7", "6", "3", "5"], ans: 0 },
        { q: "Berapa hasil dari 2 * [3  -1]?", options: ["[6  -2]", "[5  1]", "[6  -1]", "[3  -2]"], ans: 0 },
        { q: "Hasil kali matriks baris [1  2] dengan matriks kolom [3; 4] adalah...", options: ["11", "5", "8", "3"], ans: 0 }
    ],
    sma: [
        { q: "Hitung Determinan dari matriks 2x2: \n| 3  2 |\n| 1  4 |", options: ["10", "14", "12", "5"], ans: 0 },
        { q: "Matriks A=[2  1; 4  3]. Berapa nilai Kofaktor C_12 (Baris 1, Kolom 2)?", options: ["-4", "4", "-1", "2"], ans: 0 },
        { q: "Jika matriks P ordo 2x3 dan matriks Q ordo 3x4, maka PxQ menghasilkan ordo...", options: ["2x4", "3x3", "2x3", "Tidak bisa"], ans: 0 },
        { q: "Jika Determinan suatu matriks 2x2 adalah 0, maka matriks tersebut...", options: ["Tidak punya Invers (Singular)", "Punya Invers", "Identitas", "Simetris"], ans: 0 },
        { q: "Jika A = [1 0; 0 1] dan B = [5 6; 7 8], maka A x B = ...", options: ["[5 6; 7 8]", "[1 0; 0 1]", "[0 0; 0 0]", "[6 6; 7 9]"], ans: 0 },
        { q: "Diketahui 2x + y = 5 dan x - y = 1. Berapa nilai Determinan Utama (D) menggunakan Cramer?", options: ["-3", "3", "-1", "1"], ans: 0 }
    ],
    mahasiswa: [
        { q: "A = [2 0; 0 2]. Berapa nilai Determinan dari A^3 (A pangkat 3)?", options: ["64", "8", "16", "32"], ans: 0 },
        { q: "Nilai eigen dari matriks identitas I (ordo 2x2) adalah...", options: ["λ = 1", "λ = 0", "λ = 2", "Tidak ada"], ans: 0 },
        { q: "Berapa rank maksimum dari matriks 3x4?", options: ["3", "4", "7", "12"], ans: 0 },
        { q: "Metode mengubah matriks menjadi bentuk Eselon Baris Tereduksi disebut...", options: ["Eliminasi Gauss-Jordan", "Sarrus", "Kofaktor", "Cramer"], ans: 0 },
        { q: "Hitung (A x B)^T jika diketahui A^T = [1 2] dan B^T = [3; 4].\n(Ingat sifat: (AB)^T = B^T x A^T)", options: ["B^T x A^T", "A^T x B^T", "A x B", "A^T + B^T"], ans: 0 },
        { q: "Berapa nilai Determinan dari matriks Segitiga Atas:\n| 2  5  7 |\n| 0  3  1 |\n| 0  0  4 |", options: ["24", "14", "0", "9"], ans: 0 }
    ]
};

let activeQuizArray = [];
let currentQuestion = 0;
let score = 0;
let currentExpReward = 0;

function renderQuizUI(c) {
    let adminResetBtn = currentUserData.role === 'Admin' ? 
        `<button style="background:var(--danger-color); color:white; border:none; padding:10px; width:100%; border-radius:6px; margin-bottom:15px; cursor:pointer; font-weight:bold; font-size:1em;" onclick="resetLeaderboard()">🚨 Reset Peringkat Mingguan</button>` : '';

    c.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <div style="text-align:center; margin-bottom:25px;">
                <h2>${t('quiz_title')}</h2>
                <p>${t('quiz_desc')}</p>
                <div style="background:var(--bg-panel); border:1px solid var(--border-color); padding:15px 30px; border-radius:8px; display:inline-block; margin-top:10px;">
                    <span style="font-size:0.9em; color:var(--text-muted);">Status Saat Ini:</span><br>
                    <b style="font-size:1.5em; color:#f59e0b;">Level ${currentUserData.level || 1}</b> | EXP: ${currentUserData.exp || 0}
                </div>
            </div>
            
            <div style="display:flex; width:100%; gap:25px; flex-wrap:wrap;">
                
                <!-- PANEL PEMILIHAN LEVEL / SOAL -->
                <div id="quiz-panel" style="flex:2; min-width:300px; background:var(--bg-body); border:1px solid var(--border-color); padding:30px; border-radius:8px;">
                    <h3 style="color:var(--text-main); font-weight:500; text-align:center; margin-top:0;">Pilih Tingkat Kesulitan</h3>
                    <div style="display:flex; flex-direction:column; gap:15px; margin-top:20px;">
                        <button style="background:var(--bg-panel); border:1px solid var(--border-color); color:var(--text-main); padding:20px; border-radius:8px; font-size:1.1em; cursor:pointer; text-align:left; transition:0.3s;" onclick="startQuiz('smp', 10)">
                            <b style="color:#34d399;">🟢 Tingkat SMP (Dasar)</b><br><span style="font-size:0.85em; color:var(--text-muted);">Operasi Dasar & Persamaan Linear. (+10 EXP / Soal Benar)</span>
                        </button>
                        <button style="background:var(--bg-panel); border:1px solid var(--border-color); color:var(--text-main); padding:20px; border-radius:8px; font-size:1.1em; cursor:pointer; text-align:left; transition:0.3s;" onclick="startQuiz('sma', 15)">
                            <b style="color:#60a5fa;">🔵 Tingkat SMA (Menengah)</b><br><span style="font-size:0.85em; color:var(--text-muted);">Determinan, Invers & Kofaktor 2x2. (+15 EXP / Soal Benar)</span>
                        </button>
                        <button style="background:var(--bg-panel); border:1px solid var(--border-color); color:var(--text-main); padding:20px; border-radius:8px; font-size:1.1em; cursor:pointer; text-align:left; transition:0.3s;" onclick="startQuiz('mahasiswa', 25)">
                            <b style="color:#f87171;">🔴 Tingkat Mahasiswa (Sulit)</b><br><span style="font-size:0.85em; color:var(--text-muted);">Sifat Lanjut, Vektor Eigen & Rank. (+25 EXP / Soal Benar)</span>
                        </button>
                    </div>
                </div>

                <div style="flex:1; display:flex; flex-direction:column; gap:25px;">
                    <!-- PANEL KALKULATOR MINI -->
                    <div style="background:var(--bg-panel); border:1px solid var(--border-color); padding:20px; border-radius:8px;">
                        <h4 style="margin:0 0 15px 0; color:var(--info-color); text-align:center;">Kalkulator Mini</h4>
                        <input type="text" id="calc-display" style="width:100%; padding:10px; font-size:1.2em; text-align:right; margin-bottom:10px; background:var(--bg-body); color:var(--text-main); border:1px solid var(--border-color); border-radius:4px;" readonly placeholder="0">
                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:5px;">
                            <button onclick="calcPress('7')">7</button><button onclick="calcPress('8')">8</button><button onclick="calcPress('9')">9</button><button class="primary" onclick="calcPress('/')">÷</button>
                            <button onclick="calcPress('4')">4</button><button onclick="calcPress('5')">5</button><button onclick="calcPress('6')">6</button><button class="primary" onclick="calcPress('*')">×</button>
                            <button onclick="calcPress('1')">1</button><button onclick="calcPress('2')">2</button><button onclick="calcPress('3')">3</button><button class="primary" onclick="calcPress('-')">-</button>
                            <button onclick="calcPress('C')" style="background:var(--danger-color); color:white; border-color:var(--danger-color);">C</button><button onclick="calcPress('0')">0</button><button onclick="calcEval()" style="background:var(--success-color); color:white; border-color:var(--success-color);">=</button><button class="primary" onclick="calcPress('+')">+</button>
                        </div>
                    </div>

                    <!-- PANEL LEADERBOARD -->
                    <div style="background:var(--bg-body); border:1px solid var(--border-color); padding:20px; border-radius:8px;">
                        <h4 style="margin:0 0 15px 0; color:#f59e0b; text-align:center;">🏆 ${t('leaderboard')}</h4>
                        ${adminResetBtn}
                        <div id="leaderboard-container"><p style="text-align:center; color:var(--text-muted); font-size:0.9em;">Memuat...</p></div>
                    </div>
                </div>
            </div>
        </div>`;
        
    loadLeaderboard();
}

// LOGIKA KALKULATOR
let calcStr = "";
window.calcPress = function(val) {
    if(val === 'C') { calcStr = ""; }
    else { calcStr += val; }
    document.getElementById('calc-display').value = calcStr || "0";
}
window.calcEval = function() {
    try { 
        calcStr = eval(calcStr).toString(); 
    } catch(e) { 
        calcStr = "Error"; 
    }
    document.getElementById('calc-display').value = calcStr;
    calcStr = ""; 
}

// LOGIKA KUIS
function startQuiz(levelKey, expPerQuestion) {
    activeQuizArray = quizDatabase[levelKey];
    currentExpReward = expPerQuestion;
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    let qData = activeQuizArray[currentQuestion];
    let panel = document.getElementById('quiz-panel');
    let formattedQuestion = qData.q.replace(/\n/g, "<br>");
    
    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; color:var(--text-muted); font-weight:600;">
            <span>Soal ${currentQuestion + 1} / ${activeQuizArray.length}</span>
            <span style="color:var(--success-color);">EXP Didapat: +${score}</span>
        </div>
        <h3 style="margin-top:0; color:var(--text-main); font-weight:500; font-size:1.2em; line-height:1.5; margin-bottom:25px; padding:15px; background:var(--bg-panel); border-radius:8px;">
            ${formattedQuestion}
        </h3>
        <div style="display:flex; flex-direction:column; gap:10px;">`;
        
    qData.options.forEach((opt, idx) => {
        html += `<button style="text-align:left; background:var(--bg-body); border:1px solid var(--border-color); padding:15px; font-size:1em; border-radius:6px; cursor:pointer; font-family:monospace; font-size:1.1em;" onclick="checkAnswer(${idx})">${opt}</button>`;
    });
    
    html += `</div>`;
    panel.innerHTML = html;
}

function checkAnswer(selectedIdx) {
    if(selectedIdx === activeQuizArray[currentQuestion].ans) {
        score += currentExpReward;
    }
    currentQuestion++;
    if(currentQuestion < activeQuizArray.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    let panel = document.getElementById('quiz-panel');
    
    let oldLevel = parseInt(currentUserData.level) || 1;
    let oldExp = parseInt(currentUserData.exp) || 0;
    
    let totalExpObtained = oldExp + score;
    let addedLevel = Math.floor(totalExpObtained / 100);
    let newLevel = oldLevel + addedLevel;
    let newExp = totalExpObtained % 100;
    
    let msg = score > 0 ? "Luar biasa! Matematika Anda hebat! 🌟" : "Terus berlatih! Kalkulator selalu siap membantu. 👍";
    
    panel.innerHTML = `
        <div style="text-align:center; padding:20px 0;">
            <h3 style="color:var(--text-main); font-size:1.5em; margin-bottom:10px;">Kuis Selesai!</h3>
            <h1 style="color:var(--primary-color); font-size:3em; margin:0;">+${score} <span style="font-size:0.3em; color:var(--text-muted);">EXP Didapat</span></h1>
            <p style="color:var(--text-muted); margin-bottom:25px;">${msg}</p>
            <div style="background:var(--bg-panel); border:1px solid var(--border-color); padding:15px; border-radius:8px; display:inline-block; margin-bottom:25px;">
                <span style="font-size:0.9em; color:var(--text-muted);">Level Anda Kini:</span><br>
                <b style="font-size:1.5em; color:#f59e0b;">Level ${newLevel}</b>
            </div>
            <br>
            <button class="primary" onclick="renderQuizUI(document.getElementById('app-content'))">Main Lagi (Farming EXP)</button>
        </div>`;
        
    db.collection("users").doc(auth.currentUser.uid).set({
        level: Number(newLevel),
        exp: Number(newExp)
    }, {merge: true}).then(() => {
        currentUserData.level = newLevel;
        currentUserData.exp = newExp;
        updateHeaderProfile(); 
        
        let totalRawScore = (newLevel * 100) + newExp; 
        
        db.collection("leaderboard").doc(auth.currentUser.uid).set({
            name: currentUserData.name,
            level: Number(newLevel),
            totalExp: Number(totalRawScore), 
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true}).then(() => {
            loadLeaderboard(); 
        });
    }).catch(err => alert("Gagal menyimpan EXP: " + err.message));
}

function loadLeaderboard() {
    db.collection("leaderboard").orderBy("totalExp", "desc").limit(10).get().then(snapshot => {
        let container = document.getElementById('leaderboard-container');
        if(!container) return;
        if(snapshot.empty) { container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.9em;">Belum ada data.</p>`; return; }
        
        let html = `<table style="width:100%; border-collapse:collapse;">
            <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); font-size:0.85em; text-align:left;">
                <th style="padding-bottom:10px;">Rank</th>
                <th style="padding-bottom:10px;">Nama</th>
                <th style="padding-bottom:10px;">Level</th>
            </tr>`;
        
        let rank = 1;
        snapshot.forEach(doc => {
            let d = doc.data();
            let rankStr = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
            let isMe = doc.id === auth.currentUser.uid;
            let bg = isMe ? 'background:rgba(96, 165, 250, 0.1);' : '';
            let nameCol = isMe ? `<b style="color:var(--primary-color);">${d.name}</b>` : d.name;
            
            html += `<tr style="border-bottom:1px solid var(--border-color); ${bg}">
                <td style="padding:12px 0; font-weight:bold;">${rankStr}</td>
                <td style="padding:12px 0; font-size:0.95em;">${nameCol}</td>
                <td style="padding:12px 0; color:#f59e0b; font-weight:bold;">Lvl ${d.level}</td>
            </tr>`;
            rank++;
        });
        container.innerHTML = html + `</table>`;
    });
}

window.resetLeaderboard = function() {
    if(confirm("PERINGATAN ADMIN: Apakah Anda yakin ingin MENGHAPUS SEMUA DATA PERINGKAT mingguan? Tindakan ini tidak dapat dibatalkan!")) {
        db.collection("leaderboard").get().then(snapshot => {
            if(snapshot.empty) { alert("Papan peringkat sudah kosong."); return; }
            let batch = db.batch();
            snapshot.forEach(doc => { batch.delete(doc.ref); });
            batch.commit().then(() => {
                alert("Sistem berhasil me-reset Papan Peringkat Mingguan!"); loadLeaderboard();
            }).catch(err => alert("Gagal mereset: " + err.message));
        });
    }
}
