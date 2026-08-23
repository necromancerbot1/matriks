// === LOGIKA GAMIFIKASI KUIS ===
const quizDatabase = {
    smp: [
        { q: "Evaluasi: [2  3] + [1  4] = ?", options: ["[3  7]", "[2  12]", "[1  -1]", "[3  12]"], ans: 0 },
        { q: "Evaluasi: [5  8] - [2  3] = ?", options: ["[3  5]", "[7  11]", "[10  24]", "[3  -5]"], ans: 0 },
        { q: "Jika Matriks A = [4  2], kalkulasi skalar 3A:", options: ["[12  6]", "[7  5]", "[12  2]", "[4  6]"], ans: 0 },
        { q: "Evaluasi Sistem Persamaan: x + y = 10 dan x - y = 4. Variabel x bernilai?", options: ["7", "6", "3", "5"], ans: 0 },
        { q: "Evaluasi skalar: 2 * [3  -1] = ?", options: ["[6  -2]", "[5  1]", "[6  -1]", "[3  -2]"], ans: 0 },
        { q: "Produk perkalian matriks baris [1  2] dengan matriks kolom [3; 4] berdasar kaidah algebra:", options: ["11", "5", "8", "3"], ans: 0 }
    ],
    sma: [
        { q: "Kalkulasi Determinan ordo 2x2: \n| 3  2 |\n| 1  4 |", options: ["10", "14", "12", "5"], ans: 0 },
        { q: "Matriks A=[2  1; 4  3]. Definisikan nilai Kofaktor C_12.", options: ["-4", "4", "-1", "2"], ans: 0 },
        { q: "Operasi produk matriks P (2x3) dan matriks Q (3x4) mendefinisikan matriks baru berordo:", options: ["2x4", "3x3", "2x3", "Tidak Terdefinisi"], ans: 0 },
        { q: "Matriks dengan parameter determinan absolut 0 diklasifikasikan sebagai:", options: ["Matriks Singular", "Matriks Invertible", "Matriks Identitas", "Matriks Simetris"], ans: 0 },
        { q: "Diketahui A = [1 0; 0 1] dan B = [5 6; 7 8]. Evaluasi A * B:", options: ["[5 6; 7 8]", "[1 0; 0 1]", "[0 0; 0 0]", "[6 6; 7 9]"], ans: 0 },
        { q: "Diketahui model: 2x + y = 5 dan x - y = 1. Identifikasi parameter Determinan Sistem (D):", options: ["-3", "3", "-1", "1"], ans: 0 }
    ],
    mahasiswa: [
        { q: "Matriks A = [2 0; 0 2]. Evaluasi fungsi determinan eksponensial Det(A^3):", options: ["64", "8", "16", "32"], ans: 0 },
        { q: "Identifikasi spektrum nilai eigen (λ) dari matriks identitas standar ordo 2x2:", options: ["λ = 1", "λ = 0", "λ = 2", "Null"], ans: 0 },
        { q: "Tentukan indeks Rank terikat maksimum untuk matriks berdimensi 3x4:", options: ["3", "4", "7", "12"], ans: 0 },
        { q: "Algoritma terstandar modifikasi matriks menjadi RREF:", options: ["Eliminasi Gauss-Jordan", "Metode Sarrus", "Ekspansi Kofaktor", "Dekomposisi LU"], ans: 0 },
        { q: "Evaluasi transpos (A * B)^T berdasar fungsi parameter A^T = [1 2] dan B^T = [3; 4]:", options: ["B^T * A^T", "A^T * B^T", "A * B", "A^T + B^T"], ans: 0 },
        { q: "Kalkulasi determinan struktur Matriks Segitiga Atas:\n| 2  5  7 |\n| 0  3  1 |\n| 0  0  4 |", options: ["24", "14", "0", "9"], ans: 0 }
    ]
};

let activeQuizArray = [], currentQuestion = 0, score = 0, currentExpReward = 0;

function renderQuizUI(c) {
    let adminResetBtn = currentUserData.role === 'Administrator' ? `<button class="danger-btn" style="width:100%; padding:15px; margin-bottom:25px; font-size:1em; letter-spacing:1px; text-transform:uppercase;" onclick="resetLeaderboard()">⚠️ Otoritas: Reset Indeks Prestasi</button>` : '';
    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">${t('quiz_title')}</h2><div class="method-desc">${t('quiz_desc')}</div>
        <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); padding:15px 30px; border-radius:12px; display:inline-block; margin-bottom:30px; text-align:center;">
                <span style="font-size:0.85em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Profil Prestasi Akademik:</span><br><b style="font-size:1.6em; color:var(--accent-warning);">Lvl ${currentUserData.level || 1}</b> <span style="color:var(--text-secondary); margin:0 10px;">|</span> <b style="color:var(--brand-main); font-size:1.2em;">${currentUserData.exp || 0} EXP</b>
            </div>
            <div style="display:flex; width:100%; gap:30px; flex-wrap:wrap; align-items:flex-start;">
                <div id="quiz-panel" class="data-card" style="flex:2; min-width:320px;">
                    <h3 style="color:var(--text-primary); font-weight:600; text-align:center; margin-top:0; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">Konfigurasi Tingkat Evaluasi</h3>
                    <div style="display:flex; flex-direction:column; gap:15px; margin-top:25px;">
                        <button class="secondary-btn" style="padding:25px; display:flex; flex-direction:column; align-items:flex-start; height:auto; text-align:left;" onclick="startQuiz('smp', 10)"><b style="color:var(--accent-success); font-size:1.1em; margin-bottom:5px;">■ Tingkat Fundamental (Dasar)</b><span style="font-size:0.9em; color:var(--text-secondary); font-weight:400;">Fokus Operasi Dasar. (+10 EXP per resolusi)</span></button>
                        <button class="secondary-btn" style="padding:25px; display:flex; flex-direction:column; align-items:flex-start; height:auto; text-align:left;" onclick="startQuiz('sma', 15)"><b style="color:var(--brand-main); font-size:1.1em; margin-bottom:5px;">■ Tingkat Menengah (Intermediat)</b><span style="font-size:0.9em; color:var(--text-secondary); font-weight:400;">Determinan & Kofaktor 2x2. (+15 EXP per resolusi)</span></button>
                        <button class="secondary-btn" style="padding:25px; display:flex; flex-direction:column; align-items:flex-start; height:auto; text-align:left;" onclick="startQuiz('mahasiswa', 25)"><b style="color:var(--accent-danger); font-size:1.1em; margin-bottom:5px;">■ Tingkat Akademik Lanjut (Universitas)</b><span style="font-size:0.9em; color:var(--text-secondary); font-weight:400;">Dekomposisi & Vektor Eigen. (+25 EXP per resolusi)</span></button>
                    </div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; gap:30px; min-width:300px;">
                    <div class="data-card">
                        <h4 style="margin:0 0 20px 0; color:var(--text-primary); text-align:center; font-size:1.1em;">Modul Komputasi Ekstra</h4>
                        <input type="text" id="calc-display" style="width:100%; padding:15px; font-size:1.3em; text-align:right; margin-bottom:15px; background:var(--bg-base); color:var(--text-primary); border:1px solid var(--border-subtle); border-radius:8px; font-family:monospace;" readonly placeholder="0.00">
                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                            <button class="secondary-btn" onclick="calcPress('7')">7</button><button class="secondary-btn" onclick="calcPress('8')">8</button><button class="secondary-btn" onclick="calcPress('9')">9</button><button class="primary-btn" onclick="calcPress('/')">÷</button>
                            <button class="secondary-btn" onclick="calcPress('4')">4</button><button class="secondary-btn" onclick="calcPress('5')">5</button><button class="secondary-btn" onclick="calcPress('6')">6</button><button class="primary-btn" onclick="calcPress('*')">×</button>
                            <button class="secondary-btn" onclick="calcPress('1')">1</button><button class="secondary-btn" onclick="calcPress('2')">2</button><button class="secondary-btn" onclick="calcPress('3')">3</button><button class="primary-btn" onclick="calcPress('-')">-</button>
                            <button class="danger-btn" onclick="calcPress('C')">C</button><button class="secondary-btn" onclick="calcPress('0')">0</button><button class="success-btn" onclick="calcEval()">=</button><button class="primary-btn" onclick="calcPress('+')">+</button>
                        </div>
                    </div>
                    <div class="data-card" style="padding:0; overflow:hidden;">
                        <div style="padding:20px; background:var(--bg-surface-hover); border-bottom:1px solid var(--border-subtle);"><h4 style="margin:0; color:var(--accent-warning); text-align:center; font-size:1.1em;">${t('leaderboard')}</h4></div>
                        <div style="padding:20px;">${adminResetBtn}<div id="leaderboard-container"><p style="text-align:center; color:var(--text-secondary); font-size:0.9em; font-style:italic;">Memproses query database...</p></div></div>
                    </div>
                </div>
            </div>
        </div>`;
    loadLeaderboard();
}

let calcStr = "";
window.calcPress = function(val) { if(val === 'C') { calcStr = ""; } else { calcStr += val; } document.getElementById('calc-display').value = calcStr || "0"; }
window.calcEval = function() { try { calcStr = eval(calcStr).toString(); } catch(e) { calcStr = "Error"; } document.getElementById('calc-display').value = calcStr; calcStr = ""; }

function startQuiz(levelKey, expPerQuestion) { activeQuizArray = quizDatabase[levelKey]; currentExpReward = expPerQuestion; currentQuestion = 0; score = 0; showQuestion(); }

function showQuestion() {
    let qData = activeQuizArray[currentQuestion]; let panel = document.getElementById('quiz-panel'); let formattedQuestion = qData.q.replace(/\n/g, "<br>");
    let html = `<div style="display:flex; justify-content:space-between; margin-bottom:20px; color:var(--text-secondary); font-weight:600; font-size:0.9em; text-transform:uppercase; letter-spacing:1px;"><span>Evaluasi ${currentQuestion + 1} / ${activeQuizArray.length}</span><span style="color:var(--brand-main);">Akumulasi EXP: +${score}</span></div><h3 style="margin-top:0; color:var(--text-primary); font-weight:500; font-size:1.25em; line-height:1.6; margin-bottom:30px; padding:25px; background:var(--bg-base); border-radius:12px; border:1px solid var(--border-subtle);">${formattedQuestion}</h3><div style="display:flex; flex-direction:column; gap:12px;">`;
    qData.options.forEach((opt, idx) => { html += `<button class="secondary-btn" style="text-align:left; padding:18px 20px; font-size:1.05em; border-radius:8px; font-family:monospace; justify-content:flex-start;" onclick="checkAnswer(${idx})">${opt}</button>`; });
    panel.innerHTML = html + `</div>`;
}

function checkAnswer(selectedIdx) { if(selectedIdx === activeQuizArray[currentQuestion].ans) { score += currentExpReward; } currentQuestion++; if(currentQuestion < activeQuizArray.length) { showQuestion(); } else { finishQuiz(); } }

function finishQuiz() {
    let panel = document.getElementById('quiz-panel');
    let oldLevel = parseInt(currentUserData.level) || 1; let oldExp = parseInt(currentUserData.exp) || 0;
    let totalExpObtained = oldExp + score; let addedLevel = Math.floor(totalExpObtained / 100); let newLevel = oldLevel + addedLevel; let newExp = totalExpObtained % 100;
    let msg = score > 0 ? "Evaluasi berhasil didokumentasikan ke sistem." : "Akurasi rendah. Sistem merekomendasikan komputasi ulang.";
    
    panel.innerHTML = `<div style="text-align:center; padding:30px 0;"><h3 style="color:var(--text-primary); font-size:1.5em; margin-bottom:15px; font-weight:500;">Terminasi Evaluasi Selesai</h3><h1 style="color:var(--accent-success); font-size:3.5em; font-weight:700; margin:0 0 10px 0;">+${score} <span style="font-size:0.25em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:2px; display:block; margin-top:5px;">Total EXP Diklaim</span></h1><p style="color:var(--text-secondary); margin-bottom:35px; font-size:1.1em;">${msg}</p><div style="background:var(--bg-base); border:1px solid var(--border-subtle); padding:20px 40px; border-radius:12px; display:inline-block; margin-bottom:35px;"><span style="font-size:0.85em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Pembaruan Peringkat Profil:</span><br><b style="font-size:1.8em; color:var(--accent-warning);">Lvl ${newLevel}</b></div><br><button class="primary-btn" style="padding:15px 40px; font-size:1.1em;" onclick="renderQuizUI(document.getElementById('app-content'))">Kembali ke Direktori Evaluasi</button></div>`;
        
    db.collection("users").doc(auth.currentUser.uid).set({ level: Number(newLevel), exp: Number(newExp) }, {merge: true}).then(() => {
        currentUserData.level = newLevel; currentUserData.exp = newExp; updateHeaderProfile(); 
        let totalRawScore = (newLevel * 100) + newExp; 
        db.collection("leaderboard").doc(auth.currentUser.uid).set({ name: currentUserData.name, level: Number(newLevel), totalExp: Number(totalRawScore), lastPlayed: firebase.firestore.FieldValue.serverTimestamp() }, {merge: true}).then(() => { loadLeaderboard(); });
    }).catch(err => alert("Interupsi basis data saat sinkronisasi EXP: " + err.message));
}

function loadLeaderboard() {
    db.collection("leaderboard").orderBy("totalExp", "desc").limit(10).get().then(snapshot => {
        let container = document.getElementById('leaderboard-container'); if(!container) return;
        if(snapshot.empty) { container.innerHTML = `<p style="text-align:center; color:var(--text-secondary); font-style:italic;">Indeks tabel belum tersedia.</p>`; return; }
        let html = `<table style="width:100%; border-collapse:collapse; text-align:left;"><tr style="border-bottom:2px solid var(--border-subtle); color:var(--text-secondary); font-size:0.8em; text-transform:uppercase; letter-spacing:1px;"><th style="padding:10px 5px;">Posisi</th><th style="padding:10px 5px;">Entitas</th><th style="padding:10px 5px;">Peringkat</th></tr>`;
        let rank = 1;
        snapshot.forEach(doc => {
            let d = doc.data(); let isMe = doc.id === auth.currentUser.uid; let bg = isMe ? 'background:rgba(59, 130, 246, 0.1);' : ''; let nameCol = isMe ? `<b style="color:var(--brand-main);">${d.name}</b>` : d.name;
            html += `<tr style="border-bottom:1px solid var(--border-subtle); ${bg}"><td style="padding:15px 5px; font-weight:700; color:var(--text-primary); font-size:1.1em;">#${rank}</td><td style="padding:15px 5px; font-size:0.95em; font-weight:500; color:var(--text-primary);">${nameCol}</td><td style="padding:15px 5px; color:var(--accent-warning); font-weight:700;">Lv. ${d.level}</td></tr>`; rank++;
        });
        container.innerHTML = html + `</table>`;
    });
}

window.resetLeaderboard = function() {
    if(confirm("OTORISASI ADMIN DIBUTUHKAN: Apakah Anda yakin mengeksekusi penghapusan absolut pada tabel indeks prestasi mingguan?")) {
        db.collection("leaderboard").get().then(snapshot => {
            if(snapshot.empty) { alert("Sistem merespons: Indeks tabel telah dikosongkan."); return; }
            let batch = db.batch(); snapshot.forEach(doc => { batch.delete(doc.ref); });
            batch.commit().then(() => { alert("Operasi berhasil. Tabel peringkat global telah diatur ulang."); loadLeaderboard(); }).catch(err => alert("Kegagalan operasi batch: " + err.message));
        });
    }
}
