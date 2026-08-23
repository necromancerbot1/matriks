// === KONFIGURASI FIREBASE CLOUD ===
const firebaseConfig = {
    apiKey: "AIzaSyCFwwLiL4FBgAQ13OHVnWVGwxsApcDSR7U",
    authDomain: "zeromatriks-f3062.firebaseapp.com",
    projectId: "zeromatriks-f3062",
    storageBucket: "zeromatriks-f3062.firebasestorage.app",
    messagingSenderId: "379008700427",
    appId: "1:379008700427:web:988a7fa91f3367a123770e",
    measurementId: "G-7E7D2CLSNX"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variabel Global
let currentUserData = { name: "Guest", role: "Pelajar", shortId: "00000", photoBase64: "", level: 1, exp: 0 };
let pendingRegistrationRole = ""; 
let lang = 'id';
let mode = 'home';
let rows = 2, cols = 3;

// === KAMUS BAHASA ===
const tr = {
    id: { 
        login_desc: "Sistem komputasi Aljabar Linear.", login_user: "Masukkan Email...", login_pass: "Kata Sandi...", login_btn: "Masuk Sistem", welcome: "Halo", logout: "Keluar", login_toggle_reg: "Belum punya akun? Daftar", login_toggle_log: "Sudah punya akun? Masuk", btn_register: "Daftar Akun", reg_user: "Masukkan Email Anda...", reg_pass: "Buat Kata Sandi...", reg_pass2: "Konfirmasi Sandi...", opt_student: "🎓 Pelajar", opt_teacher: "👨‍🏫 Pengajar", msg_pass_nomatch: "Sandi tidak cocok!",
        nav_home: "Beranda", nav_gauss: "Eliminasi Gauss-Jordan", nav_cramer: "Aturan Cramer", nav_addsub: "Penjumlahan / Pengurangan", nav_trans: "Transpos Matriks", nav_rank: "Rank Matriks", nav_det: "Determinan", nav_cofactor: "Matriks Kofaktor", nav_inv: "Invers Matriks", nav_chat: "👥 Diskusi Kelas", nav_quiz: "🎮 Kuis & Ranking", nav_profile: "⚙️ Profil Saya", nav_materi: "📚 Buku Materi",
        desc_gauss: "Mengubah matriks menjadi bentuk eselon baris tereduksi (RREF).", desc_cramer: "Menyelesaikan sistem persamaan linear.", desc_addsub: "Penjumlahan dan pengurangan elemen bersesuaian.", desc_trans: "Menukar elemen baris menjadi kolom.", desc_rank: "Jumlah maksimum vektor baris independen.", desc_det: "Metode reduksi baris ke Matriks Segitiga Atas.", desc_cofactor: "Dibentuk dari nilai determinan sub-matriks.", desc_inv: "Metode reduksi Gauss-Jordan.",
        ui_size: "Ukuran:", ui_var: "Variabel:", ui_row: "Baris:", ui_col: "Kolom:", ui_set: "Atur Matriks", ui_in: "Input Matriks", ui_calc: "Kalkulasi", ui_clr: "Bersihkan", ui_clrall: "Bersih Semua", ui_step: "Tampilkan Langkah", ui_log: "Log Solusi", step_init: "Matriks Awal", step_res: "Hasil Akhir", alert_max: "Maksimal ordo 100x100!", no_sol: "Sistem tidak konsisten.", inf_sol: "Sistem memiliki tak terhingga solusi.", btn_auto_pm: "Acak (+/-)", btn_auto_p: "Acak (+)", mat_a: "Matriks A", mat_b: "Matriks B", mat_d: "Matriks D", step_proc: "Proses", step_swap: "Tukar Baris", step_div: "Bagi Baris {r} dengan {p}", step_elim: "Eliminasi kolom {c}", step_eq: "Penyelesaian:", step_elim_pivot: "Eliminasi Pivot", step_swap_det: "Tukar Baris: R{r1} ↔ R{r2} (Det × -1)", step_elim_det: "Eliminasi di bawah pivot Kolom {c}", step_det_tri: "Perkalian Segitiga Atas", step_det_form: "Det = Tanda × (Hasil Kali Diagonal)", zero_row_col: "Baris/Kolom nol terdeteksi. Det = 0", step_cof1: "1: Minor & Kofaktor", step_cof2: "2: Matriks Minor", step_cof3: "3: Tanda Kofaktor", step_div_p: "Bagi dengan {p}", step_elim_p: "Eliminasi", step_inv_ext: "Invers Diekstrak", note_aug: "*Asumsi kolom terakhir adalah konstanta.",
        home_sub: "Alat komputasi aljabar linear real-time.", feat_title: "Kapabilitas", f1_t: "Presisi", f1_d: "Format pecahan terjaga.", f2_t: "Uji Coba", f2_d: "Generator solusi bilangan bulat.", f3_t: "Optimasi", f3_d: "Reduksi beban komputasi.", f4_t: "Multilingual", f4_d: "Multi bahasa fungsional.",
        chat_title: "Diskusi & Pertemanan (2 Arah)", chat_desc: "Kirim permintaan teman dengan ID 5 Digit.", uid_info: "Berikan ID ini ke teman Anda.", add_friend: "Kirim Permintaan", add_friend_ph: "5-Digit ID Teman...", my_friends: "Teman & Permintaan", create_group: "Buat", group_name_ph: "Nama Grup...", my_groups: "Daftar Kelas", back_to_groups: "← Kembali", send: "Kirim", type_msg: "Tulis pesan...",
        profile_title: "Pengaturan Profil", profile_desc: "Kelola identitas akun Anda.", save_profile: "Simpan Perubahan", current_name: "Nama Anda:", change_name_ph: "Nama (6-15 karakter)...", role_lbl: "Status:",
        quiz_title: "Kuis Aljabar & Leaderboard", quiz_desc: "Pilih tingkat kesulitan, kumpulkan EXP, dan naik level!", btn_start: "Mulai Kuis", leaderboard: "Papan Peringkat (Top 10)"
    },
    en: { 
        // Mode EN disingkat untuk menghemat karakter. Default tetap ID.
        login_btn: "Login", welcome: "Hello", logout: "Logout", nav_home: "Home", nav_materi: "📚 Study Book", nav_quiz: "🎮 Quiz", nav_chat: "👥 Class Chat", nav_profile: "⚙️ Profile"
    }
};

function t(k) { return tr[lang][k] || tr.en[k] || k; }

function changeLanguage() { 
    lang = document.getElementById('languageSelect').value; 
    document.getElementById('login-lang').value = lang;
    document.querySelectorAll('.sidebar a').forEach(e => { 
        let k = e.getAttribute('data-lang'); if(t(k)) e.innerText = t(k); 
    }); 
    document.getElementById('lbl_welcome').innerText = t('welcome');
    document.getElementById('btn_logout').innerText = t('logout');
    navigate(mode); 
}

function changeLangFromLogin() {
    document.getElementById('languageSelect').value = document.getElementById('login-lang').value;
    lang = document.getElementById('languageSelect').value;
    changeLanguage();
}

function navigate(m) {
    mode = m; 
    document.querySelectorAll('.sidebar a').forEach(e => e.classList.remove('active')); 
    if(document.getElementById('nav-' + m)) document.getElementById('nav-' + m).classList.add('active');
    let c = document.getElementById('app-content');
    
    if(m === 'home') {
        c.innerHTML = `
            <div class="hero-section"><h2>Zero <b>Matriks</b></h2><p>${t('home_sub')}</p>
                <div style="text-align: left; margin-top: 60px;">
                    <h3 style="color:var(--text-main); font-weight:500; font-size: 1.25em; margin-bottom: 25px; border-bottom: 1px solid var(--border-color); padding-bottom:15px;">${t('feat_title')}</h3>
                    <div class="feature-grid">
                        <div class="feature-card"><div class="card-accent"></div><h4>${t('f1_t')}</h4><p>${t('f1_d')}</p></div>
                        <div class="feature-card"><div class="card-accent"></div><h4>${t('f2_t')}</h4><p>${t('f2_d')}</p></div>
                        <div class="feature-card"><div class="card-accent"></div><h4>${t('f3_t')}</h4><p>${t('f3_d')}</p></div>
                        <div class="feature-card"><div class="card-accent"></div><h4>${t('f4_t')}</h4><p>${t('f4_d')}</p></div>
                    </div>
                </div>
            </div>`; return;
    }

    if(m === 'profile') { renderProfileUI(c); return; }
    if(m === 'chat') { renderChatUI(c); return; }
    if(m === 'quiz') { renderQuizUI(c); return; }
    if(m === 'materi') { renderMateriUI(c); return; } // Panggilan ke File Baru

    let isSq = (m === 'det' || m === 'inv' || m === 'cofactor');
    let isCr = (m === 'cramer');
    let isDbl = (m === 'addsub');
    let html = `<h2>${t('nav_'+m)}</h2><div class="method-desc">${t('desc_'+m)}</div><div class="setup-box"><div class="dim-input-group">`;
    
    if(isSq) { html += `<span>${t('ui_size')}</span><input type="number" id="dim-n" value="${rows}" min="1" max="100"><span>x</span><span id="dim-n-disp">${rows}</span><button class="primary" onclick="buildGrid('sq')">${t('ui_set')}</button>`; } 
    else if(isCr) { let v = cols - 1; html += `<span>${t('ui_var')}</span><input type="number" id="dim-n" value="${v}" min="1" max="100"><button class="primary" onclick="buildGrid('cr')">${t('ui_set')}</button>`; } 
    else { html += `<span>${t('ui_row')}</span><input type="number" id="dim-row" value="${rows}" min="1" max="100"><span>${t('ui_col')}</span><input type="number" id="dim-col" value="${cols}" min="1" max="100"><button class="primary" onclick="buildGrid('${isDbl?'db':'sg'}')">${t('ui_set')}</button>`; }
    
    c.innerHTML = html + `</div></div><div id="matrix-input-area"></div><div id="solution-area"></div>`;
    if(isSq || isCr) { document.getElementById('dim-n').addEventListener('input', function() { let d = document.getElementById('dim-n-disp'); if(d) d.innerText = this.value; }); }
    buildGrid(isSq ? 'sq' : isCr ? 'cr' : isDbl ? 'db' : 'sg');
}

// === KALKULATOR MATRIKS LOGIC ===
function buildGrid(type) {
    document.getElementById('solution-area').innerHTML = '';
    if(type === 'sq') { rows = cols = parseInt(document.getElementById('dim-n').value); } 
    else if(type === 'cr') { rows = parseInt(document.getElementById('dim-n').value); cols = rows + 1; } 
    else { rows = parseInt(document.getElementById('dim-row').value); cols = parseInt(document.getElementById('dim-col').value); }
    if(rows > 100 || cols > 100) return alert(t('alert_max'));
    
    let html = `<div class="matrix-input-box">`;
    if(type === 'db') {
        html += `<div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:20px;"><div><h3 style="color:var(--primary-color); text-align:center; font-weight:500;">${t('mat_a')}</h3>${genHTML('A', rows, cols)}</div><div><h3 style="color:var(--primary-color); text-align:center; font-weight:500;">${t('mat_b')}</h3>${genHTML('B', rows, cols)}</div></div><div class="flex-center"><button class="auto" onclick="aF('A',1); aF('B',1);">${t('btn_auto_pm')}</button><button class="auto" onclick="aF('A',0); aF('B',0);">${t('btn_auto_p')}</button><button onclick="cM('A'); cM('B');">${t('ui_clrall')}</button><button class="primary" onclick="solve('add')">A + B</button><button class="primary" onclick="solve('sub')">A - B</button></div>`;
    } else {
        html += `<h3 style="color:var(--primary-color); text-align:center; font-weight:500; font-size:1.1em; margin-bottom: 20px;">${t('ui_in')}</h3>${genHTML('A', rows, cols)}<div class="flex-center"><button class="auto" onclick="aF('A',1)">${t('btn_auto_pm')}</button><button class="auto" onclick="aF('A',0)">${t('btn_auto_p')}</button><button onclick="cM('A')">${t('ui_clr')}</button><button class="primary" onclick="solve('${mode}')">${t('ui_calc')}</button></div>`;
    }
    document.getElementById('matrix-input-area').innerHTML = html + `<div class="toggle-container"><label><input type="checkbox" id="show-steps" checked> ${t('ui_step')}</label></div></div>`;
}

function genHTML(pf, r, c) { let h = `<div class="scroll-wrapper"><div style="display:inline-flex; flex-direction:column; align-items:center;">`; for(let i=0; i<r; i++) { h += `<div class="grid-row">`; for(let j=0; j<c; j++) { h += `<input type="number" id="c_${pf}_${i}_${j}" placeholder="0">`; } h += `</div>`; } return h + `</div></div>`; }
function cM(pf) { for(let i=0; i<rows; i++) { for(let j=0; j<cols; j++) { let c = document.getElementById(`c_${pf}_${i}_${j}`); if(c) c.value = ''; } } document.getElementById('solution-area').innerHTML = ''; }
function aF(pf, neg) { let isSystem = (mode === 'gauss' || mode === 'cramer') && cols > 1; let X = []; if(isSystem) { for(let j=0; j<cols-1; j++) { X.push(neg ? Math.floor(Math.random() * 11) - 5 : Math.floor(Math.random() * 10)); } } for(let i=0; i<rows; i++) { let bVal = 0; for(let j=0; j<cols; j++) { let c = document.getElementById(`c_${pf}_${i}_${j}`); if(c) { let val = neg ? Math.floor(Math.random() * 19) - 9 : Math.floor(Math.random() * 10); if(isSystem) { if(j < cols - 1) { c.value = val; bVal += val * X[j]; } else { c.value = bVal; } } else { c.value = val; } } } } }
function getM(pf, r, c) { let m = []; for(let i=0; i<r; i++) { let rw = []; for(let j=0; j<c; j++) { let v = parseFloat(document.getElementById(`c_${pf}_${i}_${j}`).value); rw.push(isNaN(v) ? 0 : v); } m.push(rw); } return m; }
function fN(n) { if(typeof n === 'string') return n; if(Math.abs(n) < 1e-10) return "0"; if(Math.abs(n) > 1e10) return n.toExponential(3); let sign = n < 0 ? "-" : ""; let val = Math.abs(n); if(Math.abs(val - Math.round(val)) < 1e-10) return sign + Math.round(val); let h1 = 1, h2 = 0, k1 = 0, k2 = 1; let b = val; for(let i = 0; i < 30; i++) { let a = Math.floor(b); let auxH = h1; h1 = a * h1 + h2; h2 = auxH; let auxK = k1; k1 = a * k1 + k2; k2 = auxK; if (Math.abs(val - (h1 / k1)) < 1e-7) { if (k1 === 1) return sign + h1; return sign + h1 + "/" + k1; } if (Math.abs(b - a) < 1e-10) break; b = 1 / (b - a); } return sign + parseFloat(val.toFixed(4)); }
function rT(m, title, isA=false, dI=-1) { let h = `<div class="step-panel step-render"><div class="step-title">${title}</div><div style="overflow-x:auto;"><table class="matrix-table"><tbody>`; m.forEach(r => { h += `<tr>`; r.forEach((v,i) => { h += `<td ${(isA && i === dI) ? 'class="divider"' : ''}>${fN(v)}</td>`; }); h += `</tr>`; }); return h + `</tbody></table></div></div>`; }
function cln(m) { return JSON.parse(JSON.stringify(m)); }
function cD(m) { if(!m.length) return 0; if(m.length === 1) return m[0][0]; let mt = cln(m), n = mt.length, d = 1; for(let i=0; i<n; i++) { let p = mt[i][i]; if(Math.abs(p) < 1e-10) { let s = false; for(let k=i+1; k<n; k++) { if(Math.abs(mt[k][i]) > 1e-10) { let tp = mt[i]; mt[i] = mt[k]; mt[k] = tp; d *= -1; p = mt[i][i]; s = true; break; } } if(!s) return 0; } for(let k=i+1; k<n; k++) { let f = mt[k][i]/p; for(let j=i; j<n; j++) { mt[k][j] -= f * mt[i][j]; } } d *= mt[i][i]; } return d; }

function solve(op) {
    let A = getM('A', rows, cols); let s = document.getElementById('solution-area'); let showSteps = document.getElementById('show-steps').checked;
    let htmlOut = `<h3 style="margin-top:40px; color:var(--text-main); font-weight:500; font-size:1.15em; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">${t('ui_log')}</h3>`;
    
    if (op === 'add' || op === 'sub') { let B = getM('B', rows, cols); let C = [], SM = []; let sign = (op === 'add') ? '+' : '-'; for(let i=0; i<rows; i++) { let rC = [], rS = []; for(let j=0; j<cols; j++) { let val = (op === 'add') ? (A[i][j] + B[i][j]) : (A[i][j] - B[i][j]); rC.push(val); if(showSteps) rS.push(`${fN(A[i][j])} ${sign} ${fN(B[i][j])}`); } C.push(rC); if(showSteps) SM.push(rS); } if(showSteps) { htmlOut += rT(A, t('mat_a')) + rT(B, t('mat_b')) + rT(SM, t('step_proc')); } htmlOut += rT(C, `${t('step_res')} (A ${sign} B)`);
    } else if (op === 'trans') { let C = []; for(let j=0; j<cols; j++) { let rw = []; for(let i=0; i<rows; i++) { rw.push(A[i][j]); } C.push(rw); } if(showSteps) htmlOut += rT(A, t('step_init')); htmlOut += rT(C, `${t('step_res')} (${cols}x${rows})`);
    } else if (op === 'gauss') { let m = cln(A); if(showSteps) htmlOut += rT(m, t('step_init')); let r = rows, c = cols, lead = 0; for(let rt=0; rt<r; rt++) { if(c <= lead) break; let i = rt; while(Math.abs(m[i][lead]) < 1e-10) { i++; if(r === i) { i = rt; lead++; if(c === lead) break; } } if(c === lead) break; if(i !== rt) { let tp = m[i]; m[i] = m[rt]; m[rt] = tp; if(showSteps) htmlOut += rT(cln(m), t('step_swap')); } let p = m[rt][lead]; if(Math.abs(p) > 1e-10) { for(let j=0; j<c; j++) { m[rt][j] /= p; } if(showSteps && Math.abs(p - 1) > 1e-10) htmlOut += rT(cln(m), t('step_div').replace('{r}', rt+1).replace('{p}', fN(p))); } let eli = false; for(let k=0; k<r; k++) { if(k !== rt) { let f = m[k][lead]; if(Math.abs(f) > 1e-10) { for(let j=0; j<c; j++) { m[k][j] -= f * m[rt][j]; } eli = true; } } } if(showSteps && eli) htmlOut += rT(cln(m), t('step_elim').replace('{c}', lead+1)); lead++; } if(!showSteps) htmlOut += rT(m, t('step_res')); let isConsistent = true; let rankA = 0; for(let i=0; i<rows; i++) { let allZeroA = true; for(let j=0; j<cols-1; j++) { if (Math.abs(m[i][j]) > 1e-10) { allZeroA = false; break; } } let bZero = Math.abs(m[i][cols-1]) <= 1e-10; if (!allZeroA) { rankA++; } else if (!bZero) { isConsistent = false; break; } } htmlOut += `<div class="result-box">`; if (cols > 1) { if (!isConsistent) { htmlOut += `<h4 style="margin:0 0 5px 0; color:var(--danger-color); font-weight:500;">${t('no_sol')}</h4><span style="font-size:0.85em; color:var(--text-muted);">${t('note_aug')}</span>`; } else if (rankA < cols - 1) { htmlOut += `<h4 style="margin:0 0 5px 0; color:var(--info-color); font-weight:500;">${t('inf_sol')}</h4><span style="font-size:0.85em; color:var(--text-muted);">${t('note_aug')}</span>`; } else { htmlOut += `<h4 style="margin:0; color:var(--primary-color); padding-bottom:15px; font-weight:500;">${t('step_eq')}</h4>`; for(let i=0; i<cols-1; i++) { let val = fN(m[i][cols-1]); if (Math.abs(m[i][cols-1]) < 1e-10) val = 0; htmlOut += `X<sub>${i+1}</sub> &nbsp;=&nbsp; <b>${val}</b><br>`; } } } else { htmlOut += `<span style="font-size:0.9em; color:var(--text-muted);">*Matriks 1 kolom tidak dapat dievaluasi.</span>`; } htmlOut += `</div>`;
    } else if (op === 'rank') { let m = cln(A); if(showSteps) htmlOut += rT(m, t('step_init')); let rk = cols; for(let rw=0; rw<rk; rw++) { if(Math.abs(m[rw][rw]) > 1e-10) { for(let c=0; c<rows; c++) { if(c !== rw) { let mt = m[c][rw]/m[rw][rw]; for(let i=0; i<rk; i++) { m[c][i] -= mt * m[rw][i]; } } } if(showSteps && rw < rows-1) htmlOut += rT(cln(m), t('step_elim_pivot')); } else { let rd = true; for(let i=rw+1; i<rows; i++) { if(Math.abs(m[i][rw]) > 1e-10) { let tp = m[rw]; m[rw] = m[i]; m[i] = tp; if(showSteps) htmlOut += rT(cln(m), t('step_swap')); rd = false; break; } } if(rd) { rk--; for(let i=0; i<rows; i++) { m[i][rw] = m[i][rk]; } } rw--; } } htmlOut += `<div class="result-box">Rank &nbsp;=&nbsp; <b style="color:var(--primary-color);">${rk}</b></div>`;
    } else if (op === 'det') { let m = cln(A); let n = rows; if(showSteps) htmlOut += rT(m, t('step_init')); let detSign = 1; let isZero = false; for(let i=0; i<n; i++) { let pivot = m[i][i]; if(Math.abs(pivot) < 1e-10) { let swapped = false; for(let k=i+1; k<n; k++) { if(Math.abs(m[k][i]) > 1e-10) { let temp = m[i]; m[i] = m[k]; m[k] = temp; detSign *= -1; pivot = m[i][i]; swapped = true; if(showSteps) htmlOut += rT(cln(m), t('step_swap_det').replace('{r1}', i+1).replace('{r2}', k+1)); break; } } if(!swapped) { isZero = true; break; } } let eliminated = false; for(let k=i+1; k<n; k++) { let factor = m[k][i] / pivot; if(Math.abs(factor) > 1e-10) { for(let j=i; j<n; j++) { m[k][j] -= factor * m[i][j]; } eliminated = true; } } if(showSteps && eliminated) htmlOut += rT(cln(m), t('step_elim_det').replace('{c}', i+1)); } let finalDet = 1; if(isZero) { finalDet = 0; if(showSteps) { htmlOut += `<div class="result-box" style="color:var(--danger-color); font-weight:500;">${t('zero_row_col')}</div>`; } else { htmlOut += `<div class="result-box">Determinant &nbsp;=&nbsp; <b style="color:var(--primary-color);">0</b></div>`; } } else { let diags = []; for(let i=0; i<n; i++) { finalDet *= m[i][i]; diags.push(fN(m[i][i])); } finalDet *= detSign; if(Math.abs(finalDet) < 1e-10) finalDet = 0; if(showSteps) { htmlOut += `<div class="result-box" style="text-align:left; background:var(--bg-panel); border-color:var(--border-color);"><span style="color:var(--text-main); font-weight:500;">${t('step_det_tri')}</span><br><br><span style="color:var(--text-muted); font-size:0.95em;">${t('step_det_form')}</span><br><span style="color:var(--text-muted); font-size:0.95em;">Det = ${detSign < 0 ? '(-1)' : '1'} &times; (${diags.join(' &times; ')})</span><br><hr style="border-color:var(--border-color); margin:15px 0;">Determinant &nbsp;=&nbsp; <b style="color:var(--primary-color); font-size:1.15em;">${fN(finalDet)}</b></div>`; } else { htmlOut += `<div class="result-box">Determinant &nbsp;=&nbsp; <b style="color:var(--primary-color);">${fN(finalDet)}</b></div>`; } }
    } else if (op === 'cramer') { let m = cln(A); let n = rows; let D = []; for(let i=0; i<n; i++) { D.push(m[i].slice(0,n)); } let detD = cD(D); if(Math.abs(detD) < 1e-10) detD = 0; if(showSteps) htmlOut += rT(D, t('mat_d')); htmlOut += `<div class="result-box" style="padding:15px;">Det(D) &nbsp;=&nbsp; <b>${fN(detD)}</b></div>`; if(Math.abs(detD) === 0) { htmlOut += `<div class="result-box" style="color:var(--danger-color); font-weight:500;">${t('no_sol')} (Det = 0)</div>`; } else { for(let v=0; v<n; v++) { let Dx = cln(D); for(let i=0; i<n; i++) { Dx[i][v] = m[i][n]; } let detDx = cD(Dx); if(Math.abs(detDx) < 1e-10) detDx = 0; if(showSteps) htmlOut += rT(Dx, t('mat_d') + `<sub>${v+1}</sub>`); let x = detDx / detD; if(Math.abs(x) < 1e-10) x = 0; htmlOut += `<div class="result-box" style="margin-top:20px; overflow-x:auto;">Det(D<sub>${v+1}</sub>) = <b>${fN(detDx)}</b><br><span style="color:var(--text-muted); font-size:0.9em; display:inline-block; margin:8px 0;">X<sub>${v+1}</sub> = Det(D<sub>${v+1}</sub>) / Det(D)</span><br>X<sub>${v+1}</sub> = ${fN(detDx)} / ${fN(detD)} &nbsp;=&nbsp; <b style="font-size:1.15em; color:var(--primary-color);">${fN(x)}</b></div>`; } }
    } else if (op === 'cofactor') { if(rows === 1) { htmlOut += rT([[1]], t('step_res')); s.innerHTML = htmlOut; return; } let C = []; let MinorMat = []; let st = `<div class="result-box" style="text-align:left; background:var(--bg-body); border-color:var(--border-color);"><h4 style="color:var(--text-main); margin-top:0; font-weight:500;">${t('step_cof1')}</h4><p style="color:var(--text-muted); font-size:0.9em; margin-bottom:20px;">C<sub>ij</sub> = (-1)<sup>i+j</sup> &times; Det(M<sub>ij</sub>)</p><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">`; if(showSteps) htmlOut += rT(A, t('step_init')); for(let i=0; i<rows; i++) { let rC = []; let rM = []; for(let j=0; j<cols; j++) { let mr = []; for(let r=0; r<rows; r++) { if(r === i) continue; let mR = []; for(let c=0; c<cols; c++) { if(c === j) continue; mR.push(A[r][c]); } mr.push(mR); } let dM = cD(mr); if(Math.abs(dM) < 1e-10) dM = 0; let sg = ((i+j)%2 === 0) ? 1 : -1; let cf = sg * dM; let ds = ""; if(Math.abs(cf) < 1e-10) cf = 0; rC.push(cf); rM.push(dM); if(showSteps) { if(mr.length === 2) { let a = mr[0][0], b = mr[0][1], cv = mr[1][0], d = mr[1][1]; ds = `(${fN(a)} &times; ${fN(d)}) - (${fN(b)} &times; ${fN(cv)})`; } else if(mr.length === 1) { ds = `${fN(mr[0][0])}`; } let mh = `<div style="overflow-x:auto;"><table class="matrix-table" style="font-size:0.85em; margin:10px 0; border:none; box-shadow:none;"><tbody>`; mr.forEach(rr => { mh += `<tr>`; rr.forEach(v => mh += `<td style="padding:6px; background:var(--bg-body); border-color:var(--border-color);">${fN(v)}</td>`); mh += `</tr>`; }); mh += `</tbody></table></div>`; st += `<div style="background:var(--bg-panel); padding:20px; border-radius:8px; border:1px solid var(--border-color);"><span style="color:var(--text-main); font-weight:500;">R${i+1}, C${j+1}</span><br>M = ${mh}<span style="font-size:0.85em; color:var(--text-muted);">Det(M) = ${ds}</span><br>M = <b>${fN(dM)}</b><hr style="border-color:var(--border-color); margin:15px 0;">C = (-1)<sup>${i+1}+${j+1}</sup> &times; M<br>C = <span style="color:${sg>0?'var(--text-main)':'var(--danger-color)'}; font-weight:500;">${sg>0?'(+1)':'(-1)'}</span> &times; ${fN(dM)} &nbsp;=&nbsp; <b style="color:var(--primary-color);">${fN(cf)}</b></div>`; } } C.push(rC); MinorMat.push(rM); } if(showSteps) { htmlOut += st + `</div></div>` + rT(MinorMat, t('step_cof2')); let sM = []; for(let i=0; i<rows; i++) { let sr = []; for(let j=0; j<cols; j++) { sr.push(((i+j)%2 === 0) ? '+' : '-'); } sM.push(sr); } htmlOut += rT(sM, t('step_cof3')); } htmlOut += rT(C, t('step_res'));
    } else if (op === 'inv') { let ag = []; for(let i=0; i<rows; i++) { let rw = [...A[i]]; for(let j=0; j<rows; j++) { rw.push(i === j ? 1 : 0); } ag.push(rw); } if(showSteps) htmlOut += rT(cln(ag), "[A | I]", true, rows); let l = 0, ps = true; for(let r=0; r<rows; r++) { if(rows <= l) break; let i = r; while(Math.abs(ag[i][l]) < 1e-10) { i++; if(rows === i) { i = r; l++; if(rows === l) { ps = false; break; } } } if(!ps) break; if(i !== r) { let tp = ag[i]; ag[i] = ag[r]; ag[r] = tp; if(showSteps) htmlOut += rT(cln(ag), t('step_swap'), true, rows); } let p = ag[r][l]; if(Math.abs(p - 1) > 1e-10) { for(let j=0; j<rows*2; j++) { ag[r][j] /= p; } if(showSteps) htmlOut += rT(cln(ag), t('step_div_p').replace('{p}', fN(p)), true, rows); } let el = false; for(let k=0; k<rows; k++) { if(k !== r) { let f = ag[k][l]; if(Math.abs(f) > 1e-10) { for(let j=0; j<rows*2; j++) { ag[k][j] -= f * ag[r][j]; } el = true; } } } if(showSteps && el) htmlOut += rT(cln(ag), t('step_elim_p'), true, rows); l++; } if(!ps) { htmlOut += `<div class="result-box" style="color:var(--danger-color); font-weight:500;">${t('no_sol')} (Det = 0)</div>`; } else { let I = []; for(let i=0; i<rows; i++) { I.push(ag[i].slice(rows)); } if(!showSteps) { htmlOut += rT(I, t('step_res')); } else { htmlOut += `<div class="result-box" style="font-weight:500; padding:15px;">${t('step_inv_ext')}</div>` + rT(I, `A<sup>-1</sup>`); } } }
    
    s.innerHTML = htmlOut; s.scrollIntoView({ behavior: 'smooth' });
}
