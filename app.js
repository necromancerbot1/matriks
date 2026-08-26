// === MESIN ZEROMODAL (PENGGANTI ALERT/CONFIRM/PROMPT) ===
window.ZeroModal = {
    callback: null,
    init: function() {
        this.overlay = document.getElementById('zero-modal-overlay');
        this.title = document.getElementById('zero-modal-title');
        this.desc = document.getElementById('zero-modal-desc');
        this.input = document.getElementById('zero-modal-input');
        this.btnOk = document.getElementById('zero-modal-btn-ok');
        this.btnCancel = document.getElementById('zero-modal-btn-cancel');
        this.icon = document.getElementById('zero-modal-icon');
        
        this.btnOk.onclick = () => {
            this.close();
            if(this.callback) {
                let val = this.input.style.display !== 'none' ? this.input.value : true;
                this.callback(val);
            }
        };
        this.btnCancel.onclick = () => {
            this.close();
            if(this.callback) this.callback(null);
        };
    },
    show: function(type, msg, cb) {
        if(!this.overlay) this.init();
        this.callback = cb;
        this.desc.innerHTML = msg;
        this.input.value = '';
        
        if(type === 'alert') {
            this.title.innerText = 'Pemberitahuan Sistem';
            this.icon.innerText = '💬';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'none';
            this.btnOk.innerText = 'Tutup';
            this.btnOk.className = 'primary-btn';
        } else if(type === 'confirm') {
            this.title.innerText = 'Konfirmasi Tindakan';
            this.icon.innerText = '⚠️';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'block';
            this.btnOk.innerText = 'Lanjutkan';
            this.btnOk.className = 'danger-btn';
        } else if(type === 'prompt') {
            this.title.innerText = 'Input Sistem';
            this.icon.innerText = '✍️';
            this.input.style.display = 'block';
            this.btnCancel.style.display = 'block';
            this.btnOk.innerText = 'Kirim';
            this.btnOk.className = 'primary-btn';
            setTimeout(() => this.input.focus(), 100);
        }
        
        this.overlay.style.display = 'flex';
        setTimeout(() => this.overlay.classList.add('show'), 10);
    },
    close: function() {
        this.overlay.classList.remove('show');
        setTimeout(() => this.overlay.style.display = 'none', 250);
    },
    alert: function(msg, cb) { this.show('alert', msg, cb); },
    confirm: function(msg, cb) { this.show('confirm', msg, cb); },
    prompt: function(msg, cb) { this.show('prompt', msg, cb); }
};

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

let currentUserData = { name: "Pengguna", role: "Mahasiswa", shortId: "00000", photoBase64: "", level: 1, exp: 0 };
let lang = 'id';
let mode = 'home';
let rows = 2, cols = 3;

// === KAMUS BAHASA ===
const tr = {
    id: { 
        login_desc: "Sistem Komputasi Aljabar Linear Terpadu", login_user: "Alamat Surel...", login_pass: "Kata Sandi...", login_btn: "Otentikasi Masuk", welcome: "Sesi:", logout: "Keluar Sesi", login_toggle_reg: "Registrasi Pengguna Baru", login_toggle_log: "Sudah Terdaftar? Masuk", btn_register: "Buat Akun", reg_user: "Alamat Surel...", reg_pass: "Buat Kata Sandi...", reg_pass2: "Konfirmasi Sandi...", opt_student: "Mahasiswa / Pelajar", opt_teacher: "Dosen / Pengajar", msg_pass_nomatch: "Otentikasi sandi tidak valid!",
        nav_home: "Dasbor Utama", nav_gauss: "Eliminasi Gauss-Jordan", nav_cramer: "Aturan Cramer", nav_addsub: "Operasi Dasar (+/-)", nav_trans: "Transpos Matriks", nav_rank: "Peringkat (Rank)", nav_det: "Determinan", nav_cofactor: "Kofaktor", nav_inv: "Invers Matriks", nav_chat: "Forum Diskusi", nav_quiz: "Evaluasi & Peringkat", nav_profile: "Pengaturan Profil", nav_materi: "Buku Referensi", nav_gemini: "✨ Asisten Akademik",
        desc_gauss: "Transformasi matriks menjadi bentuk Eselon Baris Tereduksi (RREF).", desc_cramer: "Metode analitik penyelesaian Sistem Persamaan Linear.", desc_addsub: "Komputasi penjumlahan dan pengurangan elemen matriks bersesuaian.", desc_trans: "Operasi penukaran orientasi baris menjadi kolom (A^T).", desc_rank: "Identifikasi jumlah maksimum vektor baris/kolom yang independen linear.", desc_det: "Kalkulasi nilai determinan melalui reduksi ke Matriks Segitiga Atas.", desc_cofactor: "Pembentukan matriks dari evaluasi determinan sub-matriks.", desc_inv: "Kalkulasi matriks invers menggunakan metode eliminasi Gauss-Jordan.",
        ui_size: "Ordo Matriks:", ui_var: "Variabel (n):", ui_row: "Baris (m):", ui_col: "Kolom (n):", ui_set: "Terapkan Dimensi", ui_in: "Parameter Input", ui_calc: "Jalankan Komputasi", ui_clr: "Reset Input", ui_clrall: "Reset Seluruh Form", ui_step: "Tampilkan Detail Algoritma", ui_log: "Log Pemrosesan", step_init: "Inisialisasi Matriks", step_res: "Matriks Evaluasi Akhir", alert_max: "Batas maksimum ordo adalah 100x100.", no_sol: "Sistem Inkosisten (Tidak terdefinisi).", inf_sol: "Sistem dependen (Solusi tak hingga).", btn_auto_pm: "Generate Data (+/-)", btn_auto_p: "Generate Data (+)", mat_a: "Matriks A", mat_b: "Matriks B", mat_d: "Matriks Utama (D)", step_proc: "Proses Eksekusi", step_swap: "Operasi Tukar Baris", step_div: "Reduksi Baris {r} dengan Pivot {p}", step_elim: "Eliminasi Elemen Kolom {c}", step_eq: "Himpunan Penyelesaian:", step_elim_pivot: "Eliminasi Berdasarkan Pivot", step_swap_det: "Tukar Baris R{r1} ↔ R{r2} (Det × -1)", step_elim_det: "Eliminasi Sub-Pivot Kolom {c}", step_det_tri: "Hasil Reduksi Matriks Segitiga Atas", step_det_form: "Kalkulasi: Det = Sign × (Produk Diagonal Utama)", zero_row_col: "Sistem mendeteksi baris/kolom bernilai nol. Det = 0", step_cof1: "Fase 1: Evaluasi Minor (M) & Kofaktor (C)", step_cof2: "Fase 2: Ekstraksi Matriks Minor", step_cof3: "Fase 3: Pola Tanda Kofaktor", step_div_p: "Normalisasi dengan Pivot {p}", step_elim_p: "Eliminasi Elemen", step_inv_ext: "Matriks Invers Terekstraksi", note_aug: "*Evaluasi menggunakan protokol augmented matrix.",
        home_sub: "Infrastruktur komputasi untuk evaluasi analitik Aljabar Linear.", feat_title: "Spesifikasi Sistem", f1_t: "Presisi Tinggi", f1_d: "Mempertahankan arsitektur rasional (pecahan) untuk akurasi data.", f2_t: "Data Generator", f2_d: "Sistem penghasil matriks uji dengan garansi penyelesaian bulat.", f3_t: "Optimasi Komputasi", f3_d: "Penerapan reduksi algoritma segitiga atas untuk efisiensi RAM.", f4_t: "Aksesibilitas Multi-Bahasa", f4_d: "Dukungan antarmuka fungsional global.",
        chat_title: "Forum Diskusi Jaringan", chat_desc: "Lakukan sinkronisasi koneksi melalui ID Identitas Pengguna.", uid_info: "Kredensial ID Jaringan Anda.", add_friend: "Kirim Permintaan Koneksi", add_friend_ph: "Input ID Kredensial...", my_friends: "Daftar Koneksi Aktif", create_group: "Buat Ruang", group_name_ph: "Nama Ruang Diskusi...", my_groups: "Akses Ruang Diskusi", back_to_groups: "← Kembali ke Direktori", send: "Kirim Data", type_msg: "Input transmisi teks...",
        profile_title: "Konfigurasi Entitas Pengguna", profile_desc: "Manajemen kredensial, IP Log, dan hak akses sistem.", save_profile: "Terapkan Konfigurasi", current_name: "Identitas Tampilan:", change_name_ph: "Input string (6-15 karakter)...", role_lbl: "Otoritas Sistem:",
        quiz_title: "Modul Evaluasi Akademik", quiz_desc: "Pilih instrumen evaluasi berdasarkan kurikulum pendidikan.", btn_start: "Inisialisasi Evaluasi", leaderboard: "Indeks Prestasi Global (Top 10)"
    },
    en: { 
        login_desc: "Linear Algebra Integrated System", login_user: "Email Address...", login_pass: "Password...", login_btn: "System Login", welcome: "Session:", logout: "Terminate Session", login_toggle_reg: "Register New Entity", login_toggle_log: "Already Registered? Login", btn_register: "Create Account", reg_user: "Email Address...", reg_pass: "Create Password...", reg_pass2: "Confirm Password...", opt_student: "Student", opt_teacher: "Lecturer / Teacher", msg_pass_nomatch: "Authentication failed: Passwords mismatch!",
        nav_home: "Main Dashboard", nav_gauss: "Gauss-Jordan", nav_cramer: "Cramer's Rule", nav_addsub: "Basic Ops (+/-)", nav_trans: "Transpose", nav_rank: "Matrix Rank", nav_det: "Determinant", nav_cofactor: "Cofactor", nav_inv: "Inverse Matrix", nav_chat: "Discussion Forum", nav_quiz: "Evaluation & Ranking", nav_profile: "Entity Settings", nav_materi: "Reference Library", nav_gemini: "✨ Virtual Assistant",
        desc_gauss: "Transforms matrix into RREF.", desc_cramer: "Solves linear equations.", desc_addsub: "Element-wise operations.", desc_trans: "Swaps rows with columns.", desc_rank: "Independent rows.", desc_det: "Upper triangular matrix reduction.", desc_cofactor: "Sub-matrices determinant.", desc_inv: "Gauss-Jordan reduction.",
        ui_size: "Matrix Order:", ui_var: "Variables (n):", ui_row: "Rows (m):", ui_col: "Cols (n):", ui_set: "Apply Dims", ui_in: "Input Parameters", ui_calc: "Execute Compute", ui_clr: "Clear Input", ui_clrall: "Clear All", ui_step: "Show Algorithm Steps", ui_log: "Processing Log", step_init: "Initialization", step_res: "Final Result Matrix", alert_max: "Max limit is 100x100.", no_sol: "Inconsistent System.", inf_sol: "Infinite solutions.", btn_auto_pm: "Gen Data (+/-)", btn_auto_p: "Gen Data (+)", mat_a: "Matrix A", mat_b: "Matrix B", mat_d: "Matrix D", step_proc: "Execution", step_swap: "Row Swap", step_div: "Row {r} div {p}", step_elim: "Eliminate col {c}", step_eq: "Solution Set:", step_elim_pivot: "Eliminate by Pivot", step_swap_det: "Swap Row (Det × -1)", step_elim_det: "Eliminate below pivot", step_det_tri: "Upper Triangular", step_det_form: "Det = Sign × (Diagonal)", zero_row_col: "Zero row/col. Det = 0", step_cof1: "Phase 1: Minor & Cofactor", step_cof2: "Phase 2: Minor Matrix", step_cof3: "Phase 3: Sign Pattern", step_div_p: "Normalize by {p}", step_elim_p: "Eliminate", step_inv_ext: "Extracted Inverse", note_aug: "*Augmented matrix protocol.",
        home_sub: "Computational infrastructure for Linear Algebra.", feat_title: "System Specs", f1_t: "High Precision", f1_d: "Fraction architecture.", f2_t: "Data Generator", f2_d: "Integer solution guarantee.", f3_t: "Optimization", f3_d: "Upper triangular reduction.", f4_t: "Multilingual", f4_d: "Global interface.",
        chat_title: "Network Forum", chat_desc: "Sync via ID.", uid_info: "Your ID Credential.", add_friend: "Send Connection", add_friend_ph: "5-Digit ID...", my_friends: "Active Connections", create_group: "Create Space", group_name_ph: "Space Name...", my_groups: "Discussion Spaces", back_to_groups: "← Back", send: "Transmit", type_msg: "Input text...",
        profile_title: "Entity Config", profile_desc: "Credentials, IP Logs, & Access.", save_profile: "Apply Config", current_name: "Display Name:", change_name_ph: "String (6-15 chars)...", role_lbl: "Authority:",
        quiz_title: "Academic Evaluation", quiz_desc: "Choose curriculum instrument.", btn_start: "Initialize Eval", leaderboard: "Global GPA (Top 10)"
    },
    jp: { nav_home: "ホーム", nav_gauss: "ガウス消去法", nav_cramer: "クラメルの公式", nav_gemini: "✨ アシスタント", nav_chat: "チャット", nav_profile: "プロフィール", login_btn: "ログイン", logout: "ログアウト" },
    zh: { nav_home: "首页", nav_gauss: "高斯消元", nav_cramer: "克莱姆法则", nav_gemini: "✨ 虚拟助手", nav_chat: "聊天", nav_profile: "个人资料", login_btn: "登录", logout: "登出" },
    ru: { nav_home: "Главная", nav_gauss: "Гаусс-Жордан", nav_cramer: "Крамер", nav_gemini: "✨ Помощник", nav_chat: "Чат", nav_profile: "Профиль", login_btn: "Войти", logout: "Выйти" },
    es: { nav_home: "Inicio", nav_gauss: "Gauss-Jordan", nav_cramer: "Cramer", nav_gemini: "✨ Asistente", nav_chat: "Chat", nav_profile: "Perfil", login_btn: "Entrar", logout: "Salir" },
    fr: { nav_home: "Accueil", nav_gauss: "Gauss-Jordan", nav_cramer: "Cramer", nav_gemini: "✨ Assistant", nav_chat: "Chat", nav_profile: "Profil", login_btn: "Connecter", logout: "Déconnexion" },
    de: { nav_home: "Startseite", nav_gauss: "Gauß-Jordan", nav_cramer: "Cramer", nav_gemini: "✨ Assistent", nav_chat: "Chat", nav_profile: "Profil", login_btn: "Einloggen", logout: "Abmelden" },
    ar: { nav_home: "الرئيسية", nav_gauss: "جوردان-جاوس", nav_cramer: "كرامر", nav_gemini: "✨ مساعد", nav_chat: "محادثة", nav_profile: "ملفي", login_btn: "دخول", logout: "خروج" },
    ko: { nav_home: "홈", nav_gauss: "가우스-조르당", nav_cramer: "크래머", nav_gemini: "✨ 어시스턴트", nav_chat: "채팅", nav_profile: "프로필", login_btn: "로그인", logout: "로그아웃" }
};

function t(k) { 
    try {
        if (tr[lang] && tr[lang][k]) return tr[lang][k];
        if (tr.en && tr.en[k]) return tr.en[k];
        if (tr.id && tr.id[k]) return tr.id[k];
        return k; 
    } catch(e) { return k; }
}

function changeLanguage() { 
    lang = document.getElementById('languageSelect').value; 
    document.getElementById('login-lang').value = lang;
    document.querySelectorAll('.sidebar a').forEach(e => { 
        let k = e.getAttribute('data-lang'); if(t(k) !== k) e.innerText = t(k); 
    }); 
    
    let welcomeText = t('welcome');
    if(!document.getElementById('display-user').innerHTML.includes(welcomeText)) {
        document.getElementById('display-user').innerHTML = `${welcomeText} &nbsp; ${currentUserData.photoBase64 ? '<img src="'+currentUserData.photoBase64+'" class="header-avatar">' : ''} <span>${currentUserData.name}</span>`;
    }
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
            <div style="text-align:center; padding: 20px 0; animation: fadeIn 0.8s;">
                <h2 style="font-size:2.5em; font-weight:300; margin-bottom:10px; border:none; color:var(--text-primary);">Zero<b style="font-weight:700; color:var(--brand-main);">Matriks</b></h2>
                <p style="font-size:1.1em; color:var(--text-secondary); max-width:600px; margin:0 auto 50px;">${t('home_sub')}</p>
                <div style="text-align: left;">
                    <h3 style="font-size:1.3em; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:10px;">${t('feat_title')}</h3>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
                        <div class="data-card"><div style="width:40px; height:4px; background:var(--brand-main); margin-bottom:15px; border-radius:2px;"></div><h4 style="margin:0 0 10px; font-size:1.1em;">${t('f1_t')}</h4><p style="margin:0; font-size:0.9em; color:var(--text-secondary);">${t('f1_d')}</p></div>
                        <div class="data-card"><div style="width:40px; height:4px; background:var(--brand-main); margin-bottom:15px; border-radius:2px;"></div><h4 style="margin:0 0 10px; font-size:1.1em;">${t('f2_t')}</h4><p style="margin:0; font-size:0.9em; color:var(--text-secondary);">${t('f2_d')}</p></div>
                        <div class="data-card"><div style="width:40px; height:4px; background:var(--brand-main); margin-bottom:15px; border-radius:2px;"></div><h4 style="margin:0 0 10px; font-size:1.1em;">${t('f3_t')}</h4><p style="margin:0; font-size:0.9em; color:var(--text-secondary);">${t('f3_d')}</p></div>
                        <div class="data-card"><div style="width:40px; height:4px; background:var(--brand-main); margin-bottom:15px; border-radius:2px;"></div><h4 style="margin:0 0 10px; font-size:1.1em;">${t('f4_t')}</h4><p style="margin:0; font-size:0.9em; color:var(--text-secondary);">${t('f4_d')}</p></div>
                    </div>
                </div>
            </div>`; return;
    }

    if(m === 'profile') { renderProfileUI(c); return; }
    if(m === 'chat') { renderChatUI(c); return; }
    if(m === 'quiz') { renderQuizUI(c); return; }
    if(m === 'materi') { renderMateriUI(c); return; }
    if(m === 'gemini') { renderGeminiUI(c); return; }

    let isSq = (m === 'det' || m === 'inv' || m === 'cofactor');
    let isCr = (m === 'cramer');
    let isDbl = (m === 'addsub');
    let html = `<h2 style="font-size:1.6em; margin-top:0;">${t('nav_'+m)}</h2><div class="method-desc">${t('desc_'+m)}</div><div class="setup-box">`;
    
    if(isSq) { html += `<span style="font-weight:600;">${t('ui_size')}</span><input type="number" id="dim-n" value="${rows}" min="1" max="100" style="width:80px;"><span>x</span><span id="dim-n-disp" style="font-weight:600;">${rows}</span><button class="primary-btn" onclick="buildGrid('sq')">${t('ui_set')}</button>`; } 
    else if(isCr) { let v = cols - 1; html += `<span style="font-weight:600;">${t('ui_var')}</span><input type="number" id="dim-n" value="${v}" min="1" max="100" style="width:80px;"><button class="primary-btn" onclick="buildGrid('cr')">${t('ui_set')}</button>`; } 
    else { html += `<span style="font-weight:600;">${t('ui_row')}</span><input type="number" id="dim-row" value="${rows}" min="1" max="100" style="width:80px;"><span style="font-weight:600; margin-left:15px;">${t('ui_col')}</span><input type="number" id="dim-col" value="${cols}" min="1" max="100" style="width:80px;"><button class="primary-btn" onclick="buildGrid('${isDbl?'db':'sg'}')">${t('ui_set')}</button>`; }
    
    c.innerHTML = html + `</div><div id="matrix-input-area"></div><div id="solution-area"></div>`;
    if(isSq || isCr) { document.getElementById('dim-n').addEventListener('input', function() { let d = document.getElementById('dim-n-disp'); if(d) d.innerText = this.value; }); }
    buildGrid(isSq ? 'sq' : isCr ? 'cr' : isDbl ? 'db' : 'sg');
}

function buildGrid(type) {
    document.getElementById('solution-area').innerHTML = '';
    if(type === 'sq') { rows = cols = parseInt(document.getElementById('dim-n').value); } 
    else if(type === 'cr') { rows = parseInt(document.getElementById('dim-n').value); cols = rows + 1; } 
    else { rows = parseInt(document.getElementById('dim-row').value); cols = parseInt(document.getElementById('dim-col').value); }
    if(rows > 100 || cols > 100) return ZeroModal.alert(t('alert_max'));
    
    let html = `<div class="matrix-input-box">`;
    if(type === 'db') {
        html += `<div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:30px;"><div><h3 style="color:var(--brand-main); text-align:center; font-weight:600;">${t('mat_a')}</h3>${genHTML('A', rows, cols)}</div><div><h3 style="color:var(--brand-main); text-align:center; font-weight:600;">${t('mat_b')}</h3>${genHTML('B', rows, cols)}</div></div><div class="flex-center" style="margin-top:30px;"><button class="secondary-btn" onclick="aF('A',1); aF('B',1);">${t('btn_auto_pm')}</button><button class="secondary-btn" onclick="aF('A',0); aF('B',0);">${t('btn_auto_p')}</button><button class="danger-btn outline" onclick="cM('A'); cM('B');">${t('ui_clrall')}</button><button class="primary-btn" onclick="solve('add')">Eksekusi: A + B</button><button class="primary-btn" onclick="solve('sub')">Eksekusi: A - B</button></div>`;
    } else {
        html += `<h3 style="color:var(--brand-main); text-align:center; font-weight:600; margin-bottom: 25px;">${t('ui_in')}</h3>${genHTML('A', rows, cols)}<div class="flex-center" style="margin-top:30px;"><button class="secondary-btn" onclick="aF('A',1)">${t('btn_auto_pm')}</button><button class="secondary-btn" onclick="aF('A',0)">${t('btn_auto_p')}</button><button class="danger-btn outline" onclick="cM('A')">${t('ui_clr')}</button><button class="primary-btn" onclick="solve('${mode}')">${t('ui_calc')}</button></div>`;
    }
    document.getElementById('matrix-input-area').innerHTML = html + `<div style="margin-top: 25px; text-align: center; color: var(--text-secondary); font-weight: 500;"><label style="cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;"><input type="checkbox" id="show-steps" checked style="width:auto; transform:scale(1.2);"> ${t('ui_step')}</label></div></div>`;
}

function genHTML(pf, r, c) { let h = `<div style="display:inline-flex; flex-direction:column; align-items:center;">`; for(let i=0; i<r; i++) { h += `<div class="grid-row">`; for(let j=0; j<c; j++) { h += `<input type="number" class="matrix-cell" id="c_${pf}_${i}_${j}" placeholder="0">`; } h += `</div>`; } return h + `</div>`; }
function cM(pf) { for(let i=0; i<rows; i++) { for(let j=0; j<cols; j++) { let c = document.getElementById(`c_${pf}_${i}_${j}`); if(c) c.value = ''; } } document.getElementById('solution-area').innerHTML = ''; }
function aF(pf, neg) { let isSystem = (mode === 'gauss' || mode === 'cramer') && cols > 1; let X = []; if(isSystem) { for(let j=0; j<cols-1; j++) { X.push(neg ? Math.floor(Math.random() * 11) - 5 : Math.floor(Math.random() * 10)); } } for(let i=0; i<rows; i++) { let bVal = 0; for(let j=0; j<cols; j++) { let c = document.getElementById(`c_${pf}_${i}_${j}`); if(c) { let val = neg ? Math.floor(Math.random() * 19) - 9 : Math.floor(Math.random() * 10); if(isSystem) { if(j < cols - 1) { c.value = val; bVal += val * X[j]; } else { c.value = bVal; } } else { c.value = val; } } } } }
function getM(pf, r, c) { let m = []; for(let i=0; i<r; i++) { let rw = []; for(let j=0; j<c; j++) { let v = parseFloat(document.getElementById(`c_${pf}_${i}_${j}`).value); rw.push(isNaN(v) ? 0 : v); } m.push(rw); } return m; }
function fN(n) { if(typeof n === 'string') return n; if(Math.abs(n) < 1e-10) return "0"; if(Math.abs(n) > 1e10) return n.toExponential(3); let sign = n < 0 ? "-" : ""; let val = Math.abs(n); if(Math.abs(val - Math.round(val)) < 1e-10) return sign + Math.round(val); let h1 = 1, h2 = 0, k1 = 0, k2 = 1; let b = val; for(let i = 0; i < 30; i++) { let a = Math.floor(b); let auxH = h1; h1 = a * h1 + h2; h2 = auxH; let auxK = k1; k1 = a * k1 + k2; k2 = auxK; if (Math.abs(val - (h1 / k1)) < 1e-7) { if (k1 === 1) return sign + h1; return sign + h1 + "/" + k1; } if (Math.abs(b - a) < 1e-10) break; b = 1 / (b - a); } return sign + parseFloat(val.toFixed(4)); }
function rT(m, title, isA=false, dI=-1) { let h = `<div class="step-panel"><div class="step-title">${title}</div><div style="overflow-x:auto;"><table class="matrix-table"><tbody>`; m.forEach(r => { h += `<tr>`; r.forEach((v,i) => { h += `<td ${(isA && i === dI) ? 'class="divider"' : ''}>${fN(v)}</td>`; }); h += `</tr>`; }); return h + `</tbody></table></div></div>`; }
function cln(m) { return JSON.parse(JSON.stringify(m)); }
function cD(m) { if(!m.length) return 0; if(m.length === 1) return m[0][0]; let mt = cln(m), n = mt.length, d = 1; for(let i=0; i<n; i++) { let p = mt[i][i]; if(Math.abs(p) < 1e-10) { let s = false; for(let k=i+1; k<n; k++) { if(Math.abs(mt[k][i]) > 1e-10) { let tp = mt[i]; mt[i] = mt[k]; mt[k] = tp; d *= -1; p = mt[i][i]; s = true; break; } } if(!s) return 0; } for(let k=i+1; k<n; k++) { let f = mt[k][i]/p; for(let j=i; j<n; j++) { mt[k][j] -= f * mt[i][j]; } } d *= mt[i][i]; } return d; }

function solve(op) {
    let A = getM('A', rows, cols); let s = document.getElementById('solution-area'); let showSteps = document.getElementById('show-steps').checked;
    let htmlOut = `<div style="margin-top:40px; border-top:1px solid var(--border-subtle); padding-top:25px;"><h3 style="color:var(--brand-main); font-weight:600; text-transform:uppercase; letter-spacing:1px; font-size:1em;">📋 ${t('ui_log')}</h3>`;
    
    if (op === 'add' || op === 'sub') { 
        let B = getM('B', rows, cols); let C = [], SM = []; let sign = (op === 'add') ? '+' : '-'; 
        for(let i=0; i<rows; i++) { 
            let rC = [], rS = []; 
            for(let j=0; j<cols; j++) { 
                let val = (op === 'add') ? (A[i][j] + B[i][j]) : (A[i][j] - B[i][j]); 
                rC.push(val); 
                if(showSteps) rS.push(`${fN(A[i][j])} ${sign} ${fN(B[i][j])}`); 
            } 
            C.push(rC); if(showSteps) SM.push(rS); 
        } 
        if(showSteps) { htmlOut += rT(A, t('mat_a')) + rT(B, t('mat_b')) + rT(SM, t('step_proc')); } 
        htmlOut += rT(C, `${t('step_res')} (A ${sign} B)`);
    } 
    else if (op === 'trans') { 
        let C = []; for(let j=0; j<cols; j++) { let rw = []; for(let i=0; i<rows; i++) { rw.push(A[i][j]); } C.push(rw); } 
        if(showSteps) htmlOut += rT(A, t('step_init')); htmlOut += rT(C, `${t('step_res')} (${cols}x${rows})`);
    } 
    else if (op === 'gauss') { 
        let m = cln(A); if(showSteps) htmlOut += rT(m, t('step_init')); let r = rows, c = cols, lead = 0; 
        for(let rt=0; rt<r; rt++) { 
            if(c <= lead) break; let i = rt; while(Math.abs(m[i][lead]) < 1e-10) { i++; if(r === i) { i = rt; lead++; if(c === lead) break; } } 
            if(c === lead) break; 
            if(i !== rt) { let tp = m[i]; m[i] = m[rt]; m[rt] = tp; if(showSteps) htmlOut += rT(cln(m), t('step_swap')); } 
            let p = m[rt][lead]; 
            if(Math.abs(p) > 1e-10) { for(let j=0; j<c; j++) { m[rt][j] /= p; } if(showSteps && Math.abs(p - 1) > 1e-10) htmlOut += rT(cln(m), t('step_div').replace('{r}', rt+1).replace('{p}', fN(p))); } 
            let eli = false; for(let k=0; k<r; k++) { if(k !== rt) { let f = m[k][lead]; if(Math.abs(f) > 1e-10) { for(let j=0; j<c; j++) { m[k][j] -= f * m[rt][j]; } eli = true; } } } 
            if(showSteps && eli) htmlOut += rT(cln(m), t('step_elim').replace('{c}', lead+1)); lead++; 
        } 
        if(!showSteps) htmlOut += rT(m, t('step_res')); 
        let isConsistent = true; let rankA = 0; 
        for(let i=0; i<rows; i++) { 
            let allZeroA = true; for(let j=0; j<cols-1; j++) { if (Math.abs(m[i][j]) > 1e-10) { allZeroA = false; break; } } 
            let bZero = Math.abs(m[i][cols-1]) <= 1e-10; if (!allZeroA) { rankA++; } else if (!bZero) { isConsistent = false; break; } 
        } 
        htmlOut += `<div class="result-box">`; 
        if (cols > 1) { 
            if (!isConsistent) { htmlOut += `<h4 style="margin:0 0 10px 0; color:var(--accent-danger);">${t('no_sol')}</h4><span style="font-size:0.85em; color:var(--text-secondary);">${t('note_aug')}</span>`; } 
            else if (rankA < cols - 1) { htmlOut += `<h4 style="margin:0 0 10px 0; color:var(--accent-warning);">${t('inf_sol')}</h4><span style="font-size:0.85em; color:var(--text-secondary);">${t('note_aug')}</span>`; } 
            else { htmlOut += `<h4 style="margin:0 0 15px 0; color:var(--accent-success);">${t('step_eq')}</h4>`; for(let i=0; i<cols-1; i++) { let val = fN(m[i][cols-1]); if (Math.abs(m[i][cols-1]) < 1e-10) val = 0; htmlOut += `X<sub>${i+1}</sub> = <b>${val}</b><br>`; } } 
        } else { htmlOut += `<span style="font-size:0.9em; color:var(--text-secondary);">*Matriks struktur 1 kolom tidak dapat diverifikasi nilainya.</span>`; } 
        htmlOut += `</div>`;
    } 
    else if (op === 'rank') { 
        let m = cln(A); if(showSteps) htmlOut += rT(m, t('step_init')); let rk = cols; 
        for(let rw=0; rw<rk; rw++) { 
            if(Math.abs(m[rw][rw]) > 1e-10) { 
                for(let c=0; c<rows; c++) { if(c !== rw) { let mt = m[c][rw]/m[rw][rw]; for(let i=0; i<rk; i++) { m[c][i] -= mt * m[rw][i]; } } } 
                if(showSteps && rw < rows-1) htmlOut += rT(cln(m), t('step_elim_pivot')); 
            } else { 
                let rd = true; for(let i=rw+1; i<rows; i++) { if(Math.abs(m[i][rw]) > 1e-10) { let tp = m[rw]; m[rw] = m[i]; m[i] = tp; if(showSteps) htmlOut += rT(cln(m), t('step_swap')); rd = false; break; } } 
                if(rd) { rk--; for(let i=0; i<rows; i++) { m[i][rw] = m[i][rk]; } } rw--; 
            } 
        } 
        htmlOut += `<div class="result-box">Indeks Rank = <b style="color:var(--brand-main); font-size:1.2em;">${rk}</b></div>`;
    } 
    else if (op === 'det') { 
        let m = cln(A); let n = rows; if(showSteps) htmlOut += rT(m, t('step_init')); let detSign = 1; let isZero = false; 
        for(let i=0; i<n; i++) { 
            let pivot = m[i][i]; 
            if(Math.abs(pivot) < 1e-10) { 
                let swapped = false; for(let k=i+1; k<n; k++) { if(Math.abs(m[k][i]) > 1e-10) { let temp = m[i]; m[i] = m[k]; m[k] = temp; detSign *= -1; pivot = m[i][i]; swapped = true; if(showSteps) htmlOut += rT(cln(m), t('step_swap_det').replace('{r1}', i+1).replace('{r2}', k+1)); break; } } 
                if(!swapped) { isZero = true; break; } 
            } 
            let eliminated = false; for(let k=i+1; k<n; k++) { let factor = m[k][i] / pivot; if(Math.abs(factor) > 1e-10) { for(let j=i; j<n; j++) { m[k][j] -= factor * m[i][j]; } eliminated = true; } } 
            if(showSteps && eliminated) htmlOut += rT(cln(m), t('step_elim_det').replace('{c}', i+1)); 
        } 
        let finalDet = 1; 
        if(isZero) { 
            finalDet = 0; if(showSteps) { htmlOut += `<div class="result-box" style="color:var(--accent-danger); font-weight:600;">${t('zero_row_col')}</div>`; } else { htmlOut += `<div class="result-box">Determinan = <b style="color:var(--brand-main);">0</b></div>`; } 
        } else { 
            let diags = []; for(let i=0; i<n; i++) { finalDet *= m[i][i]; diags.push(fN(m[i][i])); } 
            finalDet *= detSign; if(Math.abs(finalDet) < 1e-10) finalDet = 0; 
            if(showSteps) { htmlOut += `<div class="result-box" style="text-align:left;"><span style="color:var(--text-primary); font-weight:600;">${t('step_det_tri')}</span><br><br><span style="color:var(--text-secondary);">${t('step_det_form')}</span><br><span style="color:var(--text-secondary);">Det = ${detSign < 0 ? '(-1)' : '1'} &times; (${diags.join(' &times; ')})</span><br><hr style="border-color:var(--border-subtle); margin:20px 0;">Determinan Akhir = <b style="color:var(--brand-main); font-size:1.3em;">${fN(finalDet)}</b></div>`; } 
            else { htmlOut += `<div class="result-box">Determinan = <b style="color:var(--brand-main); font-size:1.2em;">${fN(finalDet)}</b></div>`; } 
        }
    } 
    else if (op === 'cramer') { 
        let m = cln(A); let n = rows; let D = []; for(let i=0; i<n; i++) { D.push(m[i].slice(0,n)); } 
        let detD = cD(D); if(Math.abs(detD) < 1e-10) detD = 0; 
        if(showSteps) htmlOut += rT(D, t('mat_d')); htmlOut += `<div class="result-box" style="padding:20px;">Det(D) = <b>${fN(detD)}</b></div>`; 
        if(Math.abs(detD) === 0) { htmlOut += `<div class="result-box" style="color:var(--accent-danger); font-weight:600;">${t('no_sol')} (Det(D) = 0)</div>`; } 
        else { 
            for(let v=0; v<n; v++) { 
                let Dx = cln(D); for(let i=0; i<n; i++) { Dx[i][v] = m[i][n]; } 
                let detDx = cD(Dx); if(Math.abs(detDx) < 1e-10) detDx = 0; 
                if(showSteps) htmlOut += rT(Dx, t('mat_d') + `<sub>${v+1}</sub>`); 
                let x = detDx / detD; if(Math.abs(x) < 1e-10) x = 0; 
                htmlOut += `<div class="result-box" style="margin-top:20px;">Det(D<sub>${v+1}</sub>) = <b>${fN(detDx)}</b><br><span style="color:var(--text-secondary); display:block; margin:10px 0;">Kalkulasi: X<sub>${v+1}</sub> = Det(D<sub>${v+1}</sub>) / Det(D)</span>X<sub>${v+1}</sub> = ${fN(detDx)} / ${fN(detD)} = <b style="font-size:1.3em; color:var(--brand-main);">${fN(x)}</b></div>`; 
            } 
        }
    } 
    else if (op === 'cofactor') { 
        if(rows === 1) { htmlOut += rT([[1]], t('step_res')); s.innerHTML = htmlOut; return; } 
        let C = []; let MinorMat = []; let st = `<div class="result-box" style="text-align:left;"><h4 style="margin-top:0; color:var(--brand-main);">${t('step_cof1')}</h4><p style="color:var(--text-secondary); margin-bottom:20px;">Formulasi: C<sub>ij</sub> = (-1)<sup>i+j</sup> &times; Det(M<sub>ij</sub>)</p><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">`; 
        if(showSteps) htmlOut += rT(A, t('step_init')); 
        for(let i=0; i<rows; i++) { 
            let rC = []; let rM = []; 
            for(let j=0; j<cols; j++) { 
                let mr = []; for(let r=0; r<rows; r++) { if(r === i) continue; let mR = []; for(let c=0; c<cols; c++) { if(c === j) continue; mR.push(A[r][c]); } mr.push(mR); } 
                let dM = cD(mr); if(Math.abs(dM) < 1e-10) dM = 0; let sg = ((i+j)%2 === 0) ? 1 : -1; let cf = sg * dM; let ds = ""; if(Math.abs(cf) < 1e-10) cf = 0; rC.push(cf); rM.push(dM); 
                if(showSteps) { 
                    if(mr.length === 2) { let a = mr[0][0], b = mr[0][1], cv = mr[1][0], d = mr[1][1]; ds = `(${fN(a)} &times; ${fN(d)}) - (${fN(b)} &times; ${fN(cv)})`; } else if(mr.length === 1) { ds = `${fN(mr[0][0])}`; } 
                    let mh = `<div style="overflow-x:auto;"><table class="matrix-table" style="font-size:0.9em; margin:10px 0; box-shadow:none;"><tbody>`; mr.forEach(rr => { mh += `<tr>`; rr.forEach(v => mh += `<td>${fN(v)}</td>`); mh += `</tr>`; }); mh += `</tbody></table></div>`; 
                    st += `<div style="background:var(--bg-surface); padding:20px; border-radius:12px; border:1px solid var(--border-subtle);"><span style="color:var(--text-primary); font-weight:600;">Posisi: R${i+1}, C${j+1}</span><br>Sub-Matriks (M) = ${mh}<span style="font-size:0.9em; color:var(--text-secondary);">Evaluasi Det(M) = ${ds}</span><br>Nilai M = <b>${fN(dM)}</b><hr style="border-color:var(--border-subtle); margin:15px 0;">Kofaktor (C) = (-1)<sup>${i+1}+${j+1}</sup> &times; M<br>C = <span style="color:${sg>0?'var(--text-primary)':'var(--accent-danger)'}; font-weight:600;">${sg>0?'(+1)':'(-1)'}</span> &times; ${fN(dM)} = <b style="color:var(--brand-main); font-size:1.2em;">${fN(cf)}</b></div>`; 
                } 
            } 
            C.push(rC); MinorMat.push(rM); 
        } 
        if(showSteps) { htmlOut += st + `</div></div>` + rT(MinorMat, t('step_cof2')); let sM = []; for(let i=0; i<rows; i++) { let sr = []; for(let j=0; j<cols; j++) { sr.push(((i+j)%2 === 0) ? '+' : '-'); } sM.push(sr); } htmlOut += rT(sM, t('step_cof3')); } 
        htmlOut += rT(C, t('step_res'));
    } 
    else if (op === 'inv') { 
        let ag = []; for(let i=0; i<rows; i++) { let rw = [...A[i]]; for(let j=0; j<rows; j++) { rw.push(i === j ? 1 : 0); } ag.push(rw); } 
        if(showSteps) htmlOut += rT(cln(ag), "Inisialisasi Matriks Augmented [A | I]", true, rows); let l = 0, ps = true; 
        for(let r=0; r<rows; r++) { 
            if(rows <= l) break; let i = r; while(Math.abs(ag[i][l]) < 1e-10) { i++; if(rows === i) { i = r; l++; if(rows === l) { ps = false; break; } } } 
            if(!ps) break; 
            if(i !== r) { let tp = ag[i]; ag[i] = ag[r]; ag[r] = tp; if(showSteps) htmlOut += rT(cln(ag), t('step_swap'), true, rows); } 
            let p = ag[r][l]; 
            if(Math.abs(p - 1) > 1e-10) { for(let j=0; j<rows*2; j++) { ag[r][j] /= p; } if(showSteps) htmlOut += rT(cln(ag), t('step_div_p').replace('{p}', fN(p)), true, rows); } 
            let el = false; for(let k=0; k<rows; k++) { if(k !== r) { let f = ag[k][l]; if(Math.abs(f) > 1e-10) { for(let j=0; j<rows*2; j++) { ag[k][j] -= f * ag[r][j]; } el = true; } } } 
            if(showSteps && el) htmlOut += rT(cln(ag), t('step_elim_p'), true, rows); l++; 
        } 
        if(!ps) { htmlOut += `<div class="result-box" style="color:var(--accent-danger); font-weight:600;">${t('no_sol')} (Determinan = 0)</div>`; } 
        else { let I = []; for(let i=0; i<rows; i++) { I.push(ag[i].slice(rows)); } if(!showSteps) { htmlOut += rT(I, t('step_res')); } else { htmlOut += `<div class="result-box" style="font-weight:600; padding:20px; color:var(--accent-success);">${t('step_inv_ext')}</div>` + rT(I, `A<sup>-1</sup>`); } } 
    }
    
    htmlOut += `</div>`; s.innerHTML = htmlOut; s.scrollIntoView({ behavior: 'smooth' });
}