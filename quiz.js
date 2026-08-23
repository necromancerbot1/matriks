// === LOGIKA KUIS (20 SOAL BERLEVEL) & LEADERBOARD ===

// Array 20 Soal Aljabar Linear Bertingkat (Level 1 - 20)
const quizData = [
    { q: "Berapa dimensi dari matriks baris yang memiliki 4 kolom?", options: ["4x1", "1x4", "4x4", "1x1"], ans: 1 },
    { q: "Jika matriks A berordo 2x3 dan B berordo 3x4, maka ordo matriks AB adalah?", options: ["2x3", "3x4", "2x4", "Tidak bisa dikalikan"], ans: 2 },
    { q: "Elemen identitas penjumlahan matriks adalah...", options: ["Matriks Identitas (I)", "Matriks Skalar", "Matriks Nol (O)", "Matriks Persegi"], ans: 2 },
    { q: "Syarat agar dua matriks dapat dijumlahkan adalah...", options: ["Harus matriks persegi", "Ordonya sama", "Jumlah baris A = jumlah kolom B", "Elemennya sama"], ans: 1 },
    { q: "Transpose dari matriks kolom (n x 1) akan menghasilkan matriks...", options: ["Baris (1 x n)", "Persegi (n x n)", "Nol", "Kolom (1 x n)"], ans: 0 },
    { q: "Jika A^T = A, maka A disebut matriks...", options: ["Miring", "Simetris", "Skew-Simetris", "Identitas"], ans: 1 },
    { q: "Berapa nilai determinan dari matriks identitas (I)?", options: ["0", "-1", "1", "Tak terhingga"], ans: 2 },
    { q: "Jika matriks memiliki satu baris yang semua elemennya 0, maka nilai determinannya adalah...", options: ["1", "-1", "Tidak ada", "0"], ans: 3 },
    { q: "Matriks yang tidak memiliki invers disebut matriks...", options: ["Singular", "Non-singular", "Ortogonal", "Skalar"], ans: 0 },
    { q: "Penyelesaian persamaan linear AX = B menggunakan aturan Cramer memanfaatkan rasio dari...", options: ["Rank", "Determinan", "Invers", "Transpose"], ans: 1 },
    { q: "Metode mengubah matriks menjadi bentuk Eselon Baris Tereduksi disebut...", options: ["Sarrus", "Kofaktor", "Eliminasi Gauss-Jordan", "Cramer"], ans: 2 },
    { q: "Nilai Minor M_11 didapat dengan cara...", options: ["Menghapus baris 1 & kolom 1", "Menambahkan baris 1", "Mengalikan diagonal", "Membagi elemen"], ans: 0 },
    { q: "Rumus umum mencari matriks Invers A^-1 adalah...", options: ["1/Det(A) * Adjoin(A)", "Det(A) * A^T", "A * I", "1/A"], ans: 0 },
    { q: "Tanda kofaktor C_ij bernilai negatif (-) jika...", options: ["i + j genap", "i * j ganjil", "i + j ganjil", "i = j"], ans: 2 },
    { q: "Rank matriks menunjukkan jumlah maksimum vektor baris yang saling...", options: ["Dependen", "Independen Linear", "Sama", "Nol"], ans: 1 },
    { q: "Jika Det(A) = 5, maka Det(A^T) adalah...", options: ["-5", "1/5", "5", "0"], ans: 2 },
    { q: "Dalam ruang 3D, jika 3 bidang sejajar, maka persamaan linear tersebut memiliki...", options: ["Satu solusi", "Tak hingga solusi", "Tidak ada solusi", "Tiga solusi"], ans: 2 },
    { q: "Sifat perkalian matriks A(BC) = (AB)C disebut sifat...", options: ["Komutatif", "Distributif", "Asosiatif", "Identitas"], ans: 2 },
    { q: "Nilai eigen (Eigenvalue) dicari dengan persamaan...", options: ["Det(A) = 0", "Det(A - λI) = 0", "AX = B", "A = λX"], ans: 1 },
    { q: "Vektor yang tidak berubah arah saat dikalikan dengan matriks disebut...", options: ["Vektor Nol", "Vektor Satuan", "Eigenvector", "Vektor Basis"], ans: 2 }
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
                        <button class="primary" style="font-size:1.2em; padding:15px 40px;" onclick="startQuiz()">${t('btn_start')}</button>
                    </div>
                </div>

                <!-- PANEL LEADERBOARD -->
                <div style="flex:1; min-width:250px; background:var(--bg-body); border:1px solid var(--border-color); padding:25px; border-radius:8px;">
                    <h4 style="margin:0 0 15px 0; color:#f59e0b; text-align:center;">🏆 ${t('leaderboard')}</h4>
                    <div id="leaderboard-container"><p style="text-align:center; color:var(--text-muted); font-size:0.9em;">Memuat...</p></div>
                </div>
            </div>
        </div>`;
        
    loadLeaderboard();
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    let qData = quizData[currentQuestion];
    let panel = document.getElementById('quiz-panel');
    
    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; color:var(--text-muted); font-weight:600;">
            <span>Level ${currentQuestion + 1} / ${quizData.length}</span>
            <span>Skor: ${score}</span>
        </div>
        <h3 style="margin-top:0; color:var(--text-main); font-weight:500; font-size:1.2em; line-height:1.5; margin-bottom:25px;">${qData.q}</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">`;
        
    qData.options.forEach((opt, idx) => {
        html += `<button style="text-align:left; background:var(--bg-panel); border:1px solid var(--border-color); padding:15px; font-size:1em; border-radius:6px; cursor:pointer;" onclick="checkAnswer(${idx})">${opt}</button>`;
    });
    
    html += `</div>`;
    panel.innerHTML = html;
}

function checkAnswer(selectedIdx) {
    if(selectedIdx === quizData[currentQuestion].ans) {
        score += 10; // Benar +10
    }
    
    currentQuestion++;
    if(currentQuestion < quizData.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    let panel = document.getElementById('quiz-panel');
    let oldLevel = currentUserData.level || 1;
    let oldExp = currentUserData.exp || 0;
    
    // Kalkulasi Leveling (100 exp = 1 Level)
    let newExp = oldExp + score;
    let addedLevel = Math.floor(newExp / 100);
    let newLevel = oldLevel + addedLevel;
    let remainderExp = newExp % 100;
    
    let msg = score > 100 ? "Luar biasa! 🌟" : "Terus berlatih! 👍";
    
    panel.innerHTML = `
        <div style="text-align:center; padding:20px 0;">
            <h3 style="color:var(--text-main); font-size:1.5em; margin-bottom:10px;">Kuis Selesai!</h3>
            <h1 style="color:var(--primary-color); font-size:3em; margin:0;">${score} <span style="font-size:0.3em; color:var(--text-muted);">EXP</span></h1>
            <p style="color:var(--text-muted); margin-bottom:25px;">${msg}</p>
            <div style="background:var(--bg-panel); border:1px solid var(--border-color); padding:15px; border-radius:8px; display:inline-block; margin-bottom:25px;">
                <span style="font-size:0.9em; color:var(--text-muted);">Level Anda Kini:</span><br>
                <b style="font-size:1.5em; color:#f59e0b;">Level ${newLevel}</b>
            </div>
            <br>
            <button class="primary" onclick="startQuiz()">Main Lagi</button>
        </div>`;
        
    // Simpan ke Firestore User Document
    db.collection("users").doc(auth.currentUser.uid).set({
        level: newLevel,
        exp: remainderExp
    }, {merge: true}).then(() => {
        currentUserData.level = newLevel;
        currentUserData.exp = remainderExp;
        updateHeaderProfile();
        
        // Push ke Global Leaderboard Document
        db.collection("leaderboard").doc(auth.currentUser.uid).set({
            name: currentUserData.name,
            level: newLevel,
            totalExp: (newLevel * 100) + remainderExp, // Untuk sorting
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true}).then(() => {
            loadLeaderboard(); // Segarkan papan peringkat
        });
    });
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