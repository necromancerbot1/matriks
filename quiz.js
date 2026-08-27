// === LOGIKA GAMIFIKASI & TRY OUT UTBK ===

let activeQuizArray = []; 
let currentQuestion = 0; 
let score = 0; 
let currentExpReward = 0;
let userAnswers = []; 

// MESIN GENERATOR SOAL ACAK DINAMIS (PROCEDURAL GENERATOR)
function generateQuestions(level, count) {
    let generated = [];
    for(let i = 0; i < count; i++) {
        let qText = "", correctAns = "", options = [];
        let type = Math.floor(Math.random() * 3);
        
        let a = Math.floor(Math.random() * 10) - 5; 
        let b = Math.floor(Math.random() * 10) - 5;
        let c = Math.floor(Math.random() * 10) - 5; 
        let d = Math.floor(Math.random() * 10) - 5;
        let e = Math.floor(Math.random() * 10) - 5; 
        let f = Math.floor(Math.random() * 10) - 5;
        let k = Math.floor(Math.random() * 5) + 2;

        if(level === 'smp') {
            if(type === 0) {
                qText = `Diketahui Matriks A = [${a}  ${b} ; ${c}  ${d}] dan Matriks B = [${e}  ${f} ; ${a}  ${b}].<br>Tentukan hasil penjumlahan A + B :`;
                correctAns = `[${a+e}  ${b+f} ; ${c+a}  ${d+b}]`;
                options = [correctAns, `[${a-e}  ${b-f} ; ${c-a}  ${d-b}]`, `[${a+e+1}  ${b+f} ; ${c+a}  ${d+b-1}]`, `[${a+b}  ${c+d} ; ${e+f}  ${a+b}]`];
            } else if(type === 1) {
                qText = `Kalkulasi Skalar: Jika Matriks P = [${a}  ${b} ; ${c}  ${d}], tentukan nilai dari ${k}P :`;
                correctAns = `[${k*a}  ${k*b} ; ${k*c}  ${k*d}]`;
                options = [correctAns, `[${k*a}  ${k*c} ; ${k*b}  ${k*d}]`, `[${a+k}  ${b+k} ; ${c+k}  ${d+k}]`, `[${k*b}  ${k*a} ; ${k*d}  ${k*c}]`];
            } else {
                qText = `Tentukan hasil pengurangan dari Matriks [${e}  ${a}] - [${f}  ${b}] :`;
                correctAns = `[${e-f}  ${a-b}]`;
                options = [correctAns, `[${f-e}  ${b-a}]`, `[${e+f}  ${a+b}]`, `[${(e-f)*2}  ${(a-b)*2}]`];
            }
        } 
        else if(level === 'sma') {
            if(type === 0) {
                qText = `Tentukan nilai Determinan dari matriks ordo 2x2 berikut:<br>| ${a}  ${b} |<br>| ${c}  ${d} |`;
                let det = (a*d) - (b*c); 
                correctAns = `${det}`;
                options = [correctAns, `${det+2}`, `${(a*c)-(b*d)}`, `${det*-1}`];
            } else if(type === 1) {
                qText = `Diketahui Matriks Q = [${a}  ${b} ; ${c}  ${d}].<br>Bentuk Transpos (Q<sup>T</sup>) dari matriks tersebut adalah:`;
                correctAns = `[${a}  ${c} ; ${b}  ${d}]`;
                options = [correctAns, `[${d}  ${b} ; ${c}  ${a}]`, `[${-a}  ${-b} ; ${-c}  ${-d}]`, `[${a}  ${b} ; ${c}  ${d}]`];
            } else {
                qText = `Tentukan Trace (Jejak) dari matriks berordo 2x2 dengan elemen diagonal utama ${a} dan ${d} :`;
                correctAns = `${a+d}`;
                options = [correctAns, `${a*d}`, `${a-d}`, `${(a+d)*2}`];
            }
        } 
        else {
            if(type === 0) {
                qText = `Jika diketahui Determinan dari Matriks A adalah ${k}. Berapakah nilai Determinan dari Matriks Transpos A ( Det(A<sup>T</sup>) )?`;
                correctAns = `${k}`; 
                options = [correctAns, `${parseFloat((1/k).toFixed(2))}`, `-${k}`, `${k*k}`];
            } else if(type === 1) {
                qText = `Sebuah Matriks Segitiga Atas memiliki elemen diagonal utama bernilai ${a}, ${b}, dan ${c}. Berapakah nilai determinannya?`;
                let det = a * b * c; 
                correctAns = `${det}`;
                options = [correctAns, `${a+b+c}`, `0`, `${det*-1}`];
            } else {
                qText = `Matriks A berukuran 3x3 dikalikan dengan skalar ${k}. Jika Det(A) = ${b}, maka Det(${k}A) bernilai:`;
                let det = Math.pow(k, 3) * b; 
                correctAns = `${det}`;
                options = [correctAns, `${k*b}`, `${Math.pow(k,2)*b}`, `${k+b}`];
            }
        }
        
        let shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        let correctIdx = shuffledOptions.indexOf(correctAns);
        
        generated.push({ q: qText, options: shuffledOptions, ans: correctIdx });
    }
    return generated;
}

function renderQuizUI(c) {
    let adminResetBtn = currentUserData.role === 'Administrator' ? `<button class="danger-btn outline" style="width:100%; margin-top:20px;" onclick="resetLeaderboard()">⚠️ Reset Mutlak Peringkat Global</button>` : '';
    
    c.innerHTML = `
        <h2 style="font-size:1.8em; margin-top:0; font-weight:700;">📝 Simulasi Try Out Akademik</h2>
        <div class="method-desc">Latih kemampuan komputasi matriks Anda melalui modul simulasi layaknya Ujian Masuk Perguruan Tinggi. Soal di-<i>generate</i> secara dinamis setiap sesi.</div>
        
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
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('smp', 20, 10)" onmouseover="this.style.borderColor='var(--accent-success)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--accent-success); font-size:1.2em; display:block; margin-bottom:10px;">■ Fundamental (Dasar)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;"><b>20 Soal.</b> Fokus Operasi Dasar (+/-).<br>Reward: +10 EXP per soal.</p>
                </div>
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('sma', 50, 15)" onmouseover="this.style.borderColor='var(--brand-main)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--brand-main); font-size:1.2em; display:block; margin-bottom:10px;">■ Intermediat (Menengah)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;"><b>50 Soal.</b> Determinan & Transpos 2x2.<br>Reward: +15 EXP per soal.</p>
                </div>
                <div class="data-card" style="cursor:pointer; transition:0.3s;" onclick="startQuiz('mahasiswa', 100, 25)" onmouseover="this.style.borderColor='var(--accent-danger)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                    <b style="color:var(--accent-danger); font-size:1.2em; display:block; margin-bottom:10px;">■ Akademik Lanjut (S1)</b>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin:0;"><b>100 Soal.</b> Sifat Matriks & Analisis.<br>Reward: +25 EXP per soal.</p>
                </div>
            </div>
        </div>

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

let calcStr = "";
window.calcPress = function(val) { 
    if(val === 'C') { calcStr = ""; } 
    else { calcStr += val; } 
    let disp = document.getElementById('calc-display');
    if(disp) disp.value = calcStr || "0"; 
}
window.calcEval = function() { 
    try { calcStr = eval(calcStr).toString(); } 
    catch(e) { calcStr = "Error"; } 
    let disp = document.getElementById('calc-display');
    if(disp) disp.value = calcStr; 
    calcStr = ""; 
}

function startQuiz(levelKey, totalQuestions, expPerQuestion) { 
    activeQuizArray = generateQuestions(levelKey, totalQuestions); 
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
    for(let i=0; i<activeQuizArray.length; i++) { 
        navBtns += `<button class="utbk-nav-btn ${i===currentQuestion?'active':''}" id="nav-btn-${i}" onclick="jumpToQuestion(${i})">${i+1}</button>`; 
    }

    main.innerHTML = `
        <div class="utbk-container">
            <div class="utbk-question-card" id="utbk-question-area" style="flex:2.5;">
                <!-- Pertanyaan -->
            </div>
            
            <div style="flex:1; display:flex; flex-direction:column; gap:20px; min-width:280px;">
                <div class="utbk-nav-card" style="position:static; margin-bottom:0; padding:20px;">
                    <span style="font-weight:700; color:var(--text-primary); text-transform:uppercase; letter-spacing:1px; font-size:0.9em;">Navigasi Soal</span>
                    <div class="utbk-nav-grid" style="grid-template-columns:repeat(5, 1fr); max-height:200px; overflow-y:auto; padding-right:5px; margin-bottom:15px;">
                        ${navBtns}
                    </div>
                    <button class="success-btn" style="width:100%; border-radius:12px; margin-top:10px;" onclick="submitUTBK()">Selesaikan Ujian</button>
                </div>

                <div class="data-card" style="padding:20px;">
                    <h4 style="margin:0 0 15px 0; color:var(--text-primary); text-align:center; font-size:0.9em; text-transform:uppercase; letter-spacing:1px;">Kalkulator Sistem</h4>
                    <input type="text" id="calc-display" style="width:100%; padding:12px; font-size:1.2em; text-align:right; margin-bottom:15px; background:rgba(15,23,42,0.6); color:var(--text-primary); border:1px solid var(--border-subtle); border-radius:8px; font-family:monospace;" readonly placeholder="0.00">
                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;">
                        <button class="secondary-btn" style="padding:10px;" onclick="calcPress('7')">7</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('8')">8</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('9')">9</button><button class="primary-btn" style="padding:10px;" onclick="calcPress('/')">÷</button>
                        <button class="secondary-btn" style="padding:10px;" onclick="calcPress('4')">4</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('5')">5</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('6')">6</button><button class="primary-btn" style="padding:10px;" onclick="calcPress('*')">×</button>
                        <button class="secondary-btn" style="padding:10px;" onclick="calcPress('1')">1</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('2')">2</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('3')">3</button><button class="primary-btn" style="padding:10px;" onclick="calcPress('-')">-</button>
                        <button class="danger-btn" style="padding:10px;" onclick="calcPress('C')">C</button><button class="secondary-btn" style="padding:10px;" onclick="calcPress('0')">0</button><button class="success-btn" style="padding:10px;" onclick="calcEval()">=</button><button class="primary-btn" style="padding:10px;" onclick="calcPress('+')">+</button>
                    </div>
                </div>
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
            <b style="color:var(--text-secondary); font-size:1.1em;">Soal No. ${currentQuestion + 1} dari ${activeQuizArray.length}</b>
        </div>
        <p style="font-size:1.2em; line-height:1.7; color:var(--text-primary); margin-bottom:30px;">${qData.q}</p>
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
        btn.className = `utbk-nav-btn ${i===currentQuestion?'active':''} ${userAnswers[i]!==null && i!==currentQuestion ?'answered':''}`;
    }
}

window.submitUTBK = function() {
    let unanswered = userAnswers.filter(a => a === null).length;
    let msg = unanswered > 0 ? `Anda masih memiliki ${unanswered} soal yang belum dijawab. Yakin ingin mengakhiri ujian?` : "Yakin ingin menyelesaikan ujian ini?";
    
    ZeroModal.confirm(msg, function(res) {
        if(res) {
            score = 0;
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