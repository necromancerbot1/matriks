// === LOGIKA GAMIFIKASI & TRY OUT UTBK ===

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
let userAnswers = []; // Melacak jawaban (Tipe Data: Array Null)

function renderQuizUI(c) {
    let adminResetBtn = currentUserData.role === 'Administrator' ? `<button class="danger-btn outline" style="width:100%; margin-top:20px;" onclick="resetLeaderboard()">⚠️ Reset Mutlak Peringkat Global</button>` : '';
    
    c.innerHTML = `
        <h2 style="font-size:1.8em; margin-top:0; font-weight:700;">📝 Simulasi Try Out Akademik</h2>
        <div class="method-desc">Latih kemampuan komputasi matriks Anda melalui modul simulasi layaknya Ujian Masuk Perguruan Tinggi.</div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:20px 30px; border-radius:16px; border:1px solid var(--border-subtle); margin-bottom:30px; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
            <div>
                <span style="font-size:0.85em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Status Akademik:</span><br>
                <b style="font-size:1.8em; color:var(--accent-warning);">Lvl ${currentUserData.level || 1}</b> <span style="color:var(--border-subtle); margin:0 15px; font-size:1.5em;">|</span> <b style="color:var(--brand-main); font-size:1.4em;">${currentUserData.exp || 0} EXP</b>
            </div>
            <button class="secondary-btn" style="padding:15px 25px; border-radius:12px;" onclick="toggleLeaderboard()">🏆 Lihat Peringkat Global</button>
        </div>
        
        <div id="quiz-main-container">
            <h3 style="color:var(--text-primary); font-weight:700; border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:25px;">Pilih Instrumen Ujian</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('smp', 10)" onmouseover="this.style.borderColor='var(--accent-success)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--accent-success); font-size:1.2em; display:block; margin-bottom:10px;">■ Fundamental (Dasar)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;">Fokus Operasi Dasar (+/-).<br>Reward: +10 EXP per soal.</p>
                </div>
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('sma', 15)" onmouseover="this.style.borderColor='var(--brand-main)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--brand-main); font-size:1.2em; display:block; margin-bottom:10px;">■ Intermediat (Menengah)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;">Determinan & Kofaktor 2x2.<br>Reward: +15 EXP per soal.</p>
                </div>
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('mahasiswa', 25)" onmouseover="this.style.borderColor='var(--accent-danger)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--accent-danger); font-size:1.2em; display:block; margin-bottom:10px;">■ Akademik Lanjut (S1)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;">Dekomposisi & Vektor Eigen.<br>Reward: +25 EXP per soal.</p>
                </div>
            </div>
        </div>

        <!-- MODAL PERINGKAT GLOBAL -->
        <div id="leaderboard-modal" style="display:none; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:20px; padding:30px; box-shadow:0 15px 40px rgba(0,0,0,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">
                <h3 style="margin:0; font-size:1.4em; color:var(--accent-warning);">🏆 Indeks Prestasi Global (Top 10)</h3>
                <button class="secondary-btn" style="border:none;" onclick="toggleLeaderboard()">Tutup [X]</button>
            </div>
            <div id="leaderboard-container"><p style="text-align:center; color:var(--text-secondary); font-style:italic;">Memproses query database...</p></div>
            ${adminResetBtn}
        </div>
    `;
    loadLeaderboard();
}

window.toggleLeaderboard = function() {
    let qMain = document.getElementById('quiz-main-container');
    let lModal = document.getElementById('leaderboard-modal');
    if(lModal.style.display === 'none') { 
        qMain.style.display = 'none'; 
        lModal.style.display = 'block'; 
    } else { 
        lModal.style.display = 'none'; 
        qMain.style.display = 'block'; 
    }
}

function startQuiz(levelKey, expPerQuestion) { 
    activeQuizArray = quizDatabase[levelKey]; 
    currentExpReward = expPerQuestion; 
    currentQuestion = 0; 
    score = 0; 
    userAnswers = new Array(activeQuizArray.length).fill(null);
    
    document.getElementById('leaderboard-modal').style.display = 'none';
    buildUTBKLayout(); 
}

function buildUTBKLayout() {
    let main = document.getElementById('quiz-main-container');
    let navBtns = '';
    
    // Membuat Grid Nomor Navigasi UTBK
    for(let i=0; i<activeQuizArray.length; i++) { 
        navBtns += `<button class="utbk-nav-btn ${i===currentQuestion?'active':''}" id="nav-btn-${i}" onclick="jumpToQuestion(${i})">${i+1}</button>`; 
    }

    main.innerHTML = `
        <div class="utbk-container">
            <!-- Kolom Kiri: Pertanyaan -->
            <div class="utbk-question-card" id="utbk-question-area">
                <!-- Diisi oleh renderCurrentQuestion() -->
            </div>
            
            <!-- Kolom Kanan: Navigasi dan Kalkulator -->
            <div class="utbk-nav-card">
                <span style="font-weight:700; color:var(--text-primary); text-transform:uppercase; letter-spacing:1px; font-size:0.9em;">Navigasi Soal</span>
                <div class="utbk-nav-grid">${navBtns}</div>
                <button class="primary-btn" style="width:100%; margin-top:25px; border-radius:12px;" onclick="submitUTBK()">Akhiri Ujian</button>
            </div>
        </div>
    `;
    renderCurrentQuestion();
}

window.jumpToQuestion = function(idx) { 
    currentQuestion = idx; 
    renderCurrentQuestion(); 
    updateNavUI(); 
}

function renderCurrentQuestion() {
    let qData = activeQuizArray[currentQuestion]; 
    let qArea = document.getElementById('utbk-question-area');
    let formattedQuestion = qData.q.replace(/\n/g, "<br>");
    let optionsHtml = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    qData.options.forEach((opt, idx) => { 
        let isSelected = userAnswers[currentQuestion] === idx;
        optionsHtml += `
            <div class="utbk-option ${isSelected?'selected':''}" onclick="selectAnswer(${idx})">
                <div class="utbk-opt-label">${letters[idx]}</div>
                <div style="flex:1;">${opt}</div>
            </div>`; 
    });

    qArea.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:25px; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">
            <b style="color:var(--text-secondary); font-size:1.1em;">Soal No. ${currentQuestion + 1}</b>
        </div>
        <p style="font-size:1.2em; line-height:1.7; color:var(--text-primary); margin-bottom:30px;">${formattedQuestion}</p>
        <div style="display:flex; flex-direction:column; gap:10px;">${optionsHtml}</div>
        
        <div style="display:flex; justify-content:space-between; margin-top:40px; border-top:1px solid var(--border-subtle); padding-top:20px;">
            <button class="secondary-btn" onclick="if(currentQuestion>0) jumpToQuestion(currentQuestion-1)">← Soal Sebelumnya</button>
            <button class="primary-btn" onclick="if(currentQuestion<activeQuizArray.length-1) jumpToQuestion(currentQuestion+1) ; else submitUTBK()">Selanjutnya →</button>
        </div>
    `;
}

window.selectAnswer = function(idx) { 
    userAnswers[currentQuestion] = idx; 
    renderCurrentQuestion(); 
    updateNavUI(); 
}

function updateNavUI() {
    for(let i=0; i<activeQuizArray.length; i++) {
        let btn = document.getElementById(`nav-btn-${i}`);
        if(!btn) continue;
        
        // Logika warna grid: aktif (biru), sudah dijawab (hijau), kosong (abu-abu)
        btn.className = `utbk-nav-btn ${i===currentQuestion?'active':''} ${userAnswers[i]!==null && i!==currentQuestion ?'answered':''}`;
    }
}

window.submitUTBK = function() {
    let unanswered = userAnswers.filter(a => a === null).length;
    let msg = unanswered > 0 ? `Anda masih memiliki ${unanswered} soal yang belum dijawab. Yakin ingin mengakhiri ujian?` : "Yakin ingin menyelesaikan ujian ini?";
    
    ZeroModal.confirm(msg, function(res) {
        if(res) {
            score = 0;
            // Evaluasi jawaban
            for(let i=0; i<activeQuizArray.length; i++) { 
                if(userAnswers[i] === activeQuizArray[i].ans) score += currentExpReward; 
            }
            finishQuiz();
        }
    });
}

function finishQuiz() {
    let main = document.getElementById('quiz-main-container');
    let oldLevel = parseInt(currentUserData.level) || 1; 
    let oldExp = parseInt(currentUserData.exp) || 0;
    
    let totalExpObtained = oldExp + score; 
    let addedLevel = Math.floor(totalExpObtained / 100); 
    let newLevel = oldLevel + addedLevel; 
    let newExp = totalExpObtained % 100;
    
    let msg = score > 0 ? "Evaluasi berhasil didokumentasikan ke sistem." : "Akurasi rendah. Sistem merekomendasikan komputasi ulang.";
    
    main.innerHTML = `
        <div style="text-align:center; padding:50px 0; background:var(--bg-surface); border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
            <h3 style="color:var(--text-primary); font-size:1.8em; margin-bottom:15px; font-weight:700;">Ujian Selesai Dikerjakan</h3>
            <h1 style="color:var(--accent-success); font-size:4.5em; font-weight:800; margin:0 0 10px 0;">+${score} <span style="font-size:0.2em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:2px; display:block; margin-top:10px;">Total EXP Diklaim</span></h1>
            <p style="color:var(--text-secondary); margin-bottom:40px; font-size:1.15em;">${msg}</p>
            <div style="background:rgba(15,23,42,0.5); border:1px solid var(--border-subtle); padding:25px 50px; border-radius:16px; display:inline-block; margin-bottom:40px;">
                <span style="font-size:0.85em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Status Peringkat Terkini:</span><br>
                <b style="font-size:2em; color:var(--accent-warning);">Lvl ${newLevel}</b>
            </div><br>
            <button class="primary-btn" style="padding:15px 40px; font-size:1.15em; border-radius:12px;" onclick="renderQuizUI(document.getElementById('app-content'))">Kembali ke Direktori Evaluasi</button>
        </div>`;
        
    db.collection("users").doc(auth.currentUser.uid).set({ level: Number(newLevel), exp: Number(newExp) }, {merge: true}).then(() => {
        currentUserData.level = newLevel; 
        currentUserData.exp = newExp; 
        updateHeaderProfile(); 
        
        let totalRawScore = (newLevel * 100) + newExp; 
        db.collection("leaderboard").doc(auth.currentUser.uid).set({ 
            name: currentUserData.name, 
            level: Number(newLevel), 
            totalExp: Number(totalRawScore), 
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp() 
        }, {merge: true}).then(() => { loadLeaderboard(); });
    }).catch(err => ZeroModal.alert("Interupsi sinkronisasi EXP: " + err.message));
}

function loadLeaderboard() {
    db.collection("leaderboard").orderBy("totalExp", "desc").limit(10).get().then(snapshot => {
        let container = document.getElementById('leaderboard-container'); 
        if(!container) return;
        
        if(snapshot.empty) { 
            container.innerHTML = `<p style="text-align:center; color:var(--text-secondary); font-style:italic;">Indeks tabel belum tersedia.</p>`; 
            return; 
        }
        
        let html = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; text-align:left; font-size:1.05em;">
                    <tr style="background:rgba(15,23,42,0.5); color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">
                        <th style="padding:15px; border-radius:10px 0 0 10px;">Posisi</th>
                        <th style="padding:15px;">Entitas Pribadi</th>
                        <th style="padding:15px; border-radius:0 10px 10px 0;">Peringkat</th>
                    </tr>`;
        let rank = 1;
        snapshot.forEach(doc => {
            let d = doc.data(); 
            let isMe = doc.id === auth.currentUser.uid; 
            let bg = isMe ? 'background:rgba(59, 130, 246, 0.15); border-radius:10px;' : ''; 
            let nameCol = isMe ? `<b style="color:var(--brand-main);">${d.name}</b>` : d.name;
            
            html += `<tr style="${bg}; transition:0.2s;">
                        <td style="padding:16px 15px; font-weight:800; color:var(--text-primary);">#${rank}</td>
                        <td style="padding:16px 15px; font-weight:600; color:var(--text-primary);">${nameCol}</td>
                        <td style="padding:16px 15px; color:var(--accent-warning); font-weight:800;">Lv. ${d.level}</td>
                     </tr>`; 
            rank++;
        });
        container.innerHTML = html + `</table></div>`;
    });
}

window.resetLeaderboard = function() {
    ZeroModal.confirm("OTORISASI ADMIN DIBUTUHKAN: Apakah Anda yakin mengeksekusi penghapusan absolut pada tabel indeks prestasi global?", function(res) {
        if(res) {
            db.collection("leaderboard").get().then(snapshot => {
                if(snapshot.empty) { return ZeroModal.alert("Sistem merespons: Indeks tabel telah dikosongkan."); }
                
                let batch = db.batch(); 
                snapshot.forEach(doc => { batch.delete(doc.ref); });
                
                batch.commit().then(() => { 
                    ZeroModal.alert("Operasi berhasil. Tabel peringkat global telah diatur ulang."); 
                    loadLeaderboard(); 
                }).catch(err => ZeroModal.alert("Kegagalan operasi batch: " + err.message));
            });
        }
    });
}