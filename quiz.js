// === LOGIKA KUIS MENGHITUNG (20 SOAL BERLEVEL), KALKULATOR MINI & LEADERBOARD ===

// Array 20 Soal Aljabar Linear (Kalkulasi Matematis)
const quizData = [
    // --- LEVEL 1: MUDAH ---
    { lvl: "Mudah", q: "Berapa hasil dari [2  3] + [1  4]?", options: ["[3  7]", "[2  12]", "[1  -1]", "[3  12]"], ans: 0 },
    { lvl: "Mudah", q: "Hitung pengurangan matriks: [5  8] - [2  3]", options: ["[3  5]", "[7  11]", "[10  24]", "[3  -5]"], ans: 0 },
    { lvl: "Mudah", q: "Jika A = [4  2], hitunglah 3A (Skalar x Matriks)", options: ["[12  6]", "[7  5]", "[12  2]", "[4  6]"], ans: 0 },
    { lvl: "Mudah", q: "Hasil kali matriks baris [1  2] dengan matriks kolom [3; 4] adalah...", options: ["11", "5", "8", "3"], ans: 0 }, // 1*3 + 2*4 = 11
    { lvl: "Mudah", q: "Hitung Determinan dari matriks 2x2: \n| 3  2 |\n| 1  4 |", options: ["10", "14", "12", "5"], ans: 0 }, // 12 - 2 = 10
    { lvl: "Mudah", q: "Hitung Determinan matriks 2x2: \n| 5 -2 |\n| 3  1 |", options: ["11", "3", "-1", "7"], ans: 0 }, // 5 - (-6) = 11
    { lvl: "Mudah", q: "Jika Determinan suatu matriks 2x2 adalah 0, maka matriks tersebut disebut...", options: ["Singular", "Ortogonal", "Identitas", "Simetris"], ans: 0 },
    
    // --- LEVEL 2: MENENGAH ---
    { lvl: "Menengah", q: "Matriks A=[2  1; 4  3]. Berapa nilai Kofaktor C_12 (Baris 1, Kolom 2)?", options: ["-4", "4", "-1", "2"], ans: 0 }, // (-1)^(1+2) * M_12 = -1 * 4 = -4
    { lvl: "Menengah", q: "Matriks A=[2  1; 4  3]. Berapa Kofaktor C_22?", options: ["2", "-2", "3", "1"], ans: 0 }, // (-1)^(2+2) * M_22 = 1 * 2 = 2
    { lvl: "Menengah", q: "Jika A = [1 0; 0 1] dan B = [5 6; 7 8], maka A x B = ...", options: ["[1 0; 0 1]", "[5 6; 7 8]", "[0 0; 0 0]", "[6 6; 7 9]"], ans: 1 },
    { lvl: "Menengah", q: "Jika matriks P ordo 2x3 dan matriks Q ordo 3x4, maka PxQ menghasilkan ordo...", options: ["2x4", "3x3", "2x3", "Tidak bisa"], ans: 0 },
    { lvl: "Menengah", q: "Hitung Determinan 2x2: \n| -4  -3 |\n| -2   5 |", options: ["-26", "-14", "26", "14"], ans: 0 }, // -20 - 6 = -26
    { lvl: "Menengah", q: "Diketahui persamaan 2x + y = 5 dan x - y = 1. Berapa nilai Determinan Utama (D) menggunakan Cramer?", options: ["-3", "3", "-1", "1"], ans: 0 }, // |2 1; 1 -1| = -2 - 1 = -3
    { lvl: "Menengah", q: "Berapa rank maksimum dari matriks 3x4?", options: ["3", "4", "7", "12"], ans: 0 },
    
    // --- LEVEL 3: SULIT ---
    { lvl: "Sulit", q: "A = [2 0; 0 2]. Berapa nilai Determinan dari A^3 (A pangkat 3)?", options: ["64", "8", "16", "32"], ans: 0 }, // Det(A) = 4. Det(A^3) = 4^3 = 64
    { lvl: "Sulit", q: "Nilai eigen dari matriks identitas I (ordo 2x2) adalah...", options: ["λ = 1", "λ = 0", "λ = 2", "Tidak ada"], ans: 0 },
    { lvl: "Sulit", q: "Berapa nilai Determinan dari matriks Segitiga Atas:\n| 2  5  7 |\n| 0  3  1 |\n| 0  0  4 |", options: ["24", "14", "0", "9"], ans: 0 }, // 2*3*4 = 24
    { lvl: "Sulit", q: "Matriks X = [4  2; 2  1]. Hitung nilai Determinan X.", options: ["0", "8", "4", "2"], ans: 0 }, // 4 - 4 = 0
    { lvl: "Sulit", q: "Karena Determinan X (soal sebelumnya) adalah 0, maka matriks X...", options: ["Tidak punya Invers", "Punya Invers", "Ortogonal", "Skalar"], ans: 0 },
    { lvl: "Sulit", q: "Hitung (A x B)^T jika diketahui A^T = [1 2] dan B^T = [3; 4].", options: "Ingat sifat: (AB)^T = B^T x A^T", options: ["B^T x A^T", "A^T x B^T", "A x B", "A^T + B^T"], ans: 0 }
];

let currentQuestion = 0;
let score = 0;

function renderQuizUI(c) {
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
                
                <!-- PANEL KUIS -->
                <div id="quiz-panel" style="flex:2; min-width:300px; background:var(--bg-body); border:1px solid var(--border-color); padding:30px; border-radius:8px;">
                    <div style="text-align:center; padding:40px 0;">
                        <button class="primary" style="font-size:1.2em; padding:15px 40px;" onclick="startQuiz()">Tantang Kuis Menghitung!</button>
                    </div>
                </div>

                <div style="flex:1; display:flex; flex-direction:column; gap:25px;">
                    <!-- PANEL KALKULATOR MINI -->
                    <div style="background:var(--bg-panel); border:1px solid var(--border-color); padding:20px; border-radius:8px;">
                        <h4 style="margin:0 0 15px 0; color:var(--info-color); text-align:center;">🧮 Kalkulator Mini</h4>
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
        // Menggunakan evaluasi sederhana untuk angka & operator dasar
        calcStr = eval(calcStr).toString(); 
    } catch(e) { 
        calcStr = "Error"; 
    }
    document.getElementById('calc-display').value = calcStr;
    calcStr = ""; // Reset setelah sama dengan
}


// LOGIKA KUIS UTAMA
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    let qData = quizData[currentQuestion];
    let panel = document.getElementById('quiz-panel');
    
    // Render baris ganti untuk soal matriks agar terlihat rapi
    let formattedQuestion = qData.q.replace(/\n/g, "<br>");
    
    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; color:var(--text-muted); font-weight:600;">
            <span>Soal ${currentQuestion + 1} / ${quizData.length}</span>
            <span style="color:var(--success-color);">Tingkat: ${qData.lvl}</span>
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
    if(selectedIdx === quizData[currentQuestion].ans) {
        score += 15; // Setiap jawaban benar mendapat 15 EXP
    }
    
    currentQuestion++;
    if(currentQuestion < quizData.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

// LOGIKA KALKULASI EXP & LEVEL TERPERCAYA (BUG FIXED)
function finishQuiz() {
    let panel = document.getElementById('quiz-panel');
    
    // Pastikan angka diambil dalam format Integer murni untuk mencegah Bug String
    let oldLevel = parseInt(currentUserData.level) || 1;
    let oldExp = parseInt(currentUserData.exp) || 0;
    
    // Kalkulasi Total EXP baru
    let totalExpObtained = oldExp + score;
    
    // Sistem Level: Tiap 100 EXP = Naik 1 Level
    let addedLevel = Math.floor(totalExpObtained / 100);
    let newLevel = oldLevel + addedLevel;
    let newExp = totalExpObtained % 100;
    
    let msg = score > 150 ? "Luar biasa! Matematika Anda hebat! 🌟" : "Terus berlatih! Kalkulator selalu siap membantu. 👍";
    
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
            <button class="primary" onclick="startQuiz()">Main Lagi (Farming EXP)</button>
        </div>`;
        
    // SIMPAN KE FIRESTORE (Memaksa tipe Data Integer)
    db.collection("users").doc(auth.currentUser.uid).set({
        level: Number(newLevel),
        exp: Number(newExp)
    }, {merge: true}).then(() => {
        // Update Memori Lokal
        currentUserData.level = newLevel;
        currentUserData.exp = newExp;
        updateHeaderProfile(); // Panggil fungsi di auth.js untuk update Badge UI
        
        // PUSH KE LEADERBOARD GLOBAL UNTUK RANKING
        let totalRawScore = (newLevel * 100) + newExp; // Variabel pancingan untuk menentukan Ranking
        
        db.collection("leaderboard").doc(auth.currentUser.uid).set({
            name: currentUserData.name,
            level: Number(newLevel),
            totalExp: Number(totalRawScore), 
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true}).then(() => {
            loadLeaderboard(); // Segarkan UI papan peringkat
        });
    }).catch(err => alert("Gagal menyimpan EXP: " + err.message));
}

// LOGIKA PAPAN PERINGKAT
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
