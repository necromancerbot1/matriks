// === LOGIKA AUTENTIKASI DAN ENTITAS PENGGUNA ===

let pendingRegistrationRole = "";
let pendingRegistrationAge = null;
let localSessionToken = Math.random().toString(36).substring(2);

// Navigasi Antar Form (Login / Register / Reset)
window.toggleAuth = function(type) {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-register').style.display = 'none';
    let resetForm = document.getElementById('form-reset');
    if(resetForm) resetForm.style.display = 'none';

    if(type === 'reg') {
        document.getElementById('form-register').style.display = 'block';
        document.getElementById('lbl_login_desc').innerText = "Silakan lengkapi data demografi untuk registrasi.";
    } else if(type === 'reset') {
        document.getElementById('form-reset').style.display = 'block';
        document.getElementById('lbl_login_desc').innerText = "Pemulihan Akses: Masukkan surel terdaftar Anda.";
    } else {
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('lbl_login_desc').innerText = "Sistem Komputasi Aljabar Linear Terpadu";
    }
};

window.sendResetLink = function() {
    let email = document.getElementById('reset-username').value.trim();
    if(email === "") return ZeroModal.alert("Sistem menolak: Alamat surel tidak boleh kosong.");
    
    auth.sendPasswordResetEmail(email).then(() => {
        ZeroModal.alert("Tautan pemulihan kata sandi telah dikirim ke surel Anda. Silakan periksa kotak masuk (inbox).");
        toggleAuth('login'); 
        document.getElementById('reset-username').value = '';
    }).catch((error) => ZeroModal.alert("Sistem gagal memproses: " + error.message));
};

window.resetPassword = function() { 
    toggleAuth('reset'); 
};

function doRegister() {
    let email = document.getElementById('reg-username').value.trim();
    let ageInput = document.getElementById('reg-age').value.trim();
    let p1 = document.getElementById('reg-password').value;
    let p2 = document.getElementById('reg-password-confirm').value;
    let role = document.getElementById('reg-role').value; 
    
    if(email === "" || p1 === "" || ageInput === "") {
        return ZeroModal.alert("Format isian tidak valid. Mohon lengkapi seluruh parameter, termasuk usia.");
    }
    if(isNaN(ageInput) || parseInt(ageInput) < 10) {
        return ZeroModal.alert("Sistem menolak: Parameter usia di bawah batas minimum.");
    }
    if(p1 !== p2) {
        return ZeroModal.alert("Konfirmasi kata sandi tidak sinkron.");
    }
    
    // Logika Bypass Administrator Mutlak
    if(email.toLowerCase().includes('admin1')) { 
        role = "Administrator"; 
    }
    
    pendingRegistrationRole = role; 
    pendingRegistrationAge = parseInt(ageInput);
    
    auth.createUserWithEmailAndPassword(email, p1).then((userCred) => {
        // Tanamkan Token Sesi ke Database saat register
        db.collection("users").doc(userCred.user.uid).set({ sessionToken: localSessionToken }, {merge: true});
        
        ZeroModal.alert("Registrasi entitas berhasil. Menginisialisasi sesi...");
        document.getElementById('reg-username').value = ''; 
        document.getElementById('reg-age').value = '';
        document.getElementById('reg-password').value = ''; 
        document.getElementById('reg-password-confirm').value = '';
    }).catch((error) => ZeroModal.alert("Kesalahan Registrasi: " + error.message));
}

function doLogin() {
    let email = document.getElementById('login-username').value.trim();
    let p = document.getElementById('login-password').value;
    if(email === "") return;
    
    auth.signInWithEmailAndPassword(email, p).then((userCred) => {
        // Perbarui Token Sesi saat berhasil masuk
        db.collection("users").doc(userCred.user.uid).set({ sessionToken: localSessionToken }, {merge: true});
    }).catch((error) => ZeroModal.alert("Otentikasi gagal. Kredensial tidak diakui sistem."));
}

function doLogout() { 
    auth.signOut().catch((error) => ZeroModal.alert("Terminasi sesi gagal: " + error.message)); 
}

document.getElementById("login-password").addEventListener("keyup", function(event) { if (event.key === "Enter") doLogin(); });
document.getElementById("reg-password-confirm").addEventListener("keyup", function(event) { if (event.key === "Enter") doRegister(); });

window.deleteAccount = function() {
    ZeroModal.confirm("Tindakan ini akan menghapus permanen identitas, kredensial, dan data analitik Anda dari server. Lanjutkan penghapusan entitas?", function(res) {
        if(res) {
            let user = auth.currentUser;
            db.collection("users").doc(user.uid).delete().then(() => {
                user.delete().then(() => { 
                    ZeroModal.alert("Entitas Anda telah berhasil dihapus dari sistem.");
                }).catch(err => {
                    if(err.code === 'auth/requires-recent-login') { 
                        ZeroModal.alert("Keamanan Sistem: Sesi autentikasi usang. Silakan log keluar, masuk kembali, lalu ulangi proses penghapusan."); 
                    } else { 
                        ZeroModal.alert("Interupsi penghapusan: " + err.message); 
                    }
                });
            });
        }
    });
};

window.sessionUnsubscribe = null;

window.onload = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('login-wrapper').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'block';
            
            // Rekam IP Address dan Perangkat
            if(!sessionStorage.getItem("ip_logged")) {
                fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => {
                      let ua = navigator.userAgent; 
                      let deviceName = "Komputer PC / Laptop";
                      if(/Mobile|Android|iPhone|iPod|BlackBerry/i.test(ua)) deviceName = "Ponsel Pintar (Smartphone)";
                      else if(/Tablet|iPad/i.test(ua)) deviceName = "Tablet";
                      
                      db.collection("users").doc(user.uid).collection("login_history").add({ 
                          ip: data.ip, 
                          device: deviceName, 
                          timestamp: firebase.firestore.FieldValue.serverTimestamp() 
                      });
                      sessionStorage.setItem("ip_logged", "true");
                  }).catch(err => console.log("Gagal merekam data jaringan."));
            }

            // Dengarkan perubahan pada User Document (Sistem 1 Akun 1 Perangkat)
            if(window.sessionUnsubscribe) window.sessionUnsubscribe();
            
            window.sessionUnsubscribe = db.collection("users").doc(user.uid).onSnapshot(doc => {
                if(doc.exists) {
                    let d = doc.data();
                    
                    // Cek jika token sesi berbeda (Login dari perangkat lain)
                    if(d.sessionToken && d.sessionToken !== localSessionToken) {
                        auth.signOut();
                        ZeroModal.alert("Sesi Berakhir: Akun Anda baru saja masuk (login) dari perangkat lain. Akses di perangkat ini telah dihentikan demi keamanan.");
                        return;
                    }

                    currentUserData = d; 
                    if(!currentUserData.shortId || currentUserData.shortId === "00000") {
                        currentUserData.shortId = Math.floor(10000 + Math.random() * 90000).toString();
                        db.collection("users").doc(user.uid).set({ shortId: currentUserData.shortId }, {merge: true});
                    }
                    if(currentUserData.level === undefined) {
                        currentUserData.level = 1; currentUserData.exp = 0;
                        db.collection("users").doc(user.uid).set({ level: 1, exp: 0 }, {merge: true});
                    }
                    updateHeaderProfile(); 
                    changeLanguage(); 
                    if(document.getElementById('app-content').innerHTML === "") {
                        navigate(mode === 'home' ? 'home' : mode);
                    }
                } else {
                    // Buat profil jika belum ada
                    let newId = Math.floor(10000 + Math.random() * 90000).toString();
                    currentUserData = { 
                        name: user.email.split('@')[0], 
                        shortId: newId, 
                        role: pendingRegistrationRole || "Mahasiswa", 
                        age: pendingRegistrationAge || null, 
                        photoBase64: "", 
                        level: 1, 
                        exp: 0, 
                        sessionToken: localSessionToken 
                    };
                    db.collection("users").doc(user.uid).set(currentUserData).then(() => {
                        pendingRegistrationRole = ""; 
                        pendingRegistrationAge = null;
                        updateHeaderProfile(); 
                        changeLanguage(); 
                        navigate('home');
                    });
                }
            });
        } else {
            if(window.sessionUnsubscribe) { 
                window.sessionUnsubscribe(); 
                window.sessionUnsubscribe = null; 
            }
            document.getElementById('login-wrapper').style.display = 'flex';
            document.getElementById('app-wrapper').style.display = 'none';
            changeLanguage();
        }
    });
};

function updateHeaderProfile() {
    let roleColor = currentUserData.role === 'Administrator' ? 'background:linear-gradient(135deg, #ef4444, #dc2626);' : '';
    let roleHtml = currentUserData.role ? `<span class="role-badge" style="${roleColor}">${currentUserData.role}</span>` : "";
    let levelHtml = currentUserData.level ? `<span class="role-badge" style="background:linear-gradient(135deg, #f59e0b, #d97706); margin-left:8px;">Lvl ${currentUserData.level}</span>` : "";
    let imgHtml = currentUserData.photoBase64 ? `<img src="${currentUserData.photoBase64}" class="header-avatar">` : "";
    document.getElementById('display-user').innerHTML = `${t('welcome')} &nbsp; ${imgHtml} <span>${currentUserData.name}</span> ${roleHtml} ${levelHtml}`;
}

function renderProfileUI(c) {
    let avatarHtml = currentUserData.photoBase64 ? 
        `<img id="profile-pic-preview" src="${currentUserData.photoBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--bg-surface);">` : 
        `<div id="profile-pic-preview-fallback" style="width:100%; height:100%; background:var(--bg-surface-hover); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--text-primary); font-size:2.5em; font-weight:bold; border:3px solid var(--border-subtle);">${currentUserData.name.charAt(0).toUpperCase()}</div><img id="profile-pic-preview" style="display:none; width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--bg-surface);">`;
    
    let adminNotice = currentUserData.role === 'Administrator' ? `<div style="background:rgba(239, 68, 68, 0.1); color:var(--accent-danger); padding:15px; border:1px solid var(--accent-danger); border-radius:12px; margin-bottom:25px; font-weight:700;">⚠️ Otoritas Administrator Sistem Mutlak Aktif</div>` : '';
    let ageDisplay = currentUserData.age ? `${currentUserData.age} Tahun` : "Tidak disetel";

    c.innerHTML = `
        <h2 style="font-size:1.8em; margin-top:0; font-weight:700;">${t('profile_title')}</h2><div class="method-desc">${t('profile_desc')}</div>
        <div style="display:flex; gap:30px; flex-wrap:wrap; align-items:flex-start;">
            <div class="data-card" style="flex:2; min-width:300px; text-align:center;">
                ${adminNotice}
                <div style="position:relative; width:120px; height:120px; margin:0 auto 25px; box-shadow:0 10px 20px rgba(0,0,0,0.2); border-radius:50%;">
                    ${avatarHtml}
                    <input type="file" id="upload-photo" style="display:none;" accept="image/*" onchange="handlePhotoUpload(event)">
                    <button onclick="document.getElementById('upload-photo').click()" style="position:absolute; bottom:0; right:-5px; background:var(--brand-main); border:2px solid var(--bg-base); color:white; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:0 4px 10px rgba(0,0,0,0.3);" title="Perbarui Visual Entitas">📷</button>
                </div>
                <p style="color:var(--text-secondary); margin-bottom:8px; font-size:0.9em; font-weight:700; text-transform:uppercase; letter-spacing:1px;">ID Sinkronisasi Akses:</p>
                <b class="uid-box">${currentUserData.shortId}</b>
                <div style="margin:30px 0; padding:20px; background:rgba(15,23,42,0.4); border:1px solid var(--border-subtle); border-radius:16px; display:flex; justify-content:space-around;">
                    <div><span style="color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Otoritas</span><br><b style="color:var(--brand-main); font-size:1.2em;">${currentUserData.role}</b></div>
                    <div><span style="color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Demografi</span><br><b style="color:var(--accent-success); font-size:1.2em;">${ageDisplay}</b></div>
                    <div><span style="color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Peringkat</span><br><b style="color:var(--accent-warning); font-size:1.2em;">Lv. ${currentUserData.level || 1}</b></div>
                </div>
                <div style="text-align:left; margin-bottom: 25px;">
                    <label style="color:var(--text-secondary); font-size:0.95em; margin-bottom:8px; display:block; font-weight:600;">Identitas Resolusi Tampilan (6-15 karakter)</label>
                    <input type="text" id="edit-name-input" value="${currentUserData.name}" placeholder="Input identitas..." style="margin-bottom:20px;">
                    <button class="primary-btn" style="width:100%; padding:15px; font-size:1.05em;" onclick="updateProfileName()">Terapkan Parameter Konfigurasi</button>
                </div>
                <hr style="border:none; border-top:1px solid var(--border-subtle); margin:30px 0;">
                <h4 style="text-align:left; margin:0 0 15px 0; color:var(--accent-danger); font-size:1.1em;">Zona Bahaya (Danger Zone)</h4>
                <button class="danger-btn outline" style="width:100%; padding:15px; border-radius:12px;" onclick="deleteAccount()">Hapus Permanen Entitas Akun</button>
            </div>
            <div class="data-card" style="flex:1; min-width:250px;">
                <h4 style="margin-top:0; color:var(--text-primary); border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px; font-size:1.1em;">🛡️ Histori Perangkat</h4>
                <div id="login-history-container"><p style="color:var(--text-secondary); font-size:0.85em;">Memuat log jaringan...</p></div>
            </div>
        </div>`;
        
    db.collection("users").doc(auth.currentUser.uid).collection("login_history").orderBy("timestamp", "desc").limit(4).get().then(snap => {
        let histHtml = ""; 
        if(snap.empty) { histHtml = "<p style='font-size:0.85em; color:var(--text-secondary);'>Log akses kosong.</p>"; }
        snap.forEach(doc => {
            let d = doc.data(); 
            let dateStr = d.timestamp ? d.timestamp.toDate().toLocaleString('id-ID') : "Sesi Saat Ini";
            histHtml += `<div style="margin-bottom:12px; padding:15px; border:1px solid var(--border-subtle); border-radius:12px; background:rgba(15,23,42,0.4); text-align:left;"><div style="font-size:0.8em; color:var(--text-secondary); margin-bottom:5px; font-weight:600;">🕒 ${dateStr}</div><div style="font-size:0.95em; color:var(--brand-main); font-weight:700;">📱 ${d.device}</div><div style="font-size:0.85em; color:var(--text-primary); margin-top:4px;">IP: ${d.ip}</div></div>`;
        });
        document.getElementById('login-history-container').innerHTML = histHtml;
    });
}

function updateProfileName() {
    let newName = document.getElementById('edit-name-input').value.trim();
    if(newName.length < 6 || newName.length > 15) {
        return ZeroModal.alert("Sistem menolak: Dimensi identitas harus berkisar 6 hingga 15 karakter.");
    }
    db.collection("users").doc(auth.currentUser.uid).set({ name: newName }, { merge: true }).then(() => {
        currentUserData.name = newName; 
        updateHeaderProfile(); 
        ZeroModal.alert("Pembaruan parameter identitas dikonfirmasi."); 
        navigate('profile'); 
    }).catch(err => ZeroModal.alert("Kesalahan database: " + err.message));
}

window.handlePhotoUpload = function(event) {
    let file = event.target.files[0]; 
    if(!file) return; 
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas'); 
            let ctx = canvas.getContext('2d');
            let maxW = 200, maxH = 200; 
            let ratio = Math.min(maxW / img.width, maxH / img.height);
            canvas.width = img.width * ratio; 
            canvas.height = img.height * ratio; 
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            let base64 = canvas.toDataURL('image/jpeg', 0.8); 
            let fallback = document.getElementById('profile-pic-preview-fallback'); 
            if(fallback) fallback.style.display = 'none';
            let imgEl = document.getElementById('profile-pic-preview'); 
            imgEl.style.display = 'block'; 
            imgEl.src = base64;
            
            db.collection("users").doc(auth.currentUser.uid).set({ photoBase64: base64 }, { merge: true }).then(() => {
                currentUserData.photoBase64 = base64; 
                updateHeaderProfile(); 
                ZeroModal.alert("Sinkronisasi visual entitas dikonfirmasi.");
            }).catch(err => ZeroModal.alert("Kesalahan transmisi data: " + err.message));
        }; 
        img.src = e.target.result;
    }; 
    reader.readAsDataURL(file);
};