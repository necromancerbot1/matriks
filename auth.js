// === LOGIKA AUTENTIKASI DAN ENTITAS PENGGUNA ===

// Fungsi untuk menukar tampilan form Login dan Register
window.toggleAuth = function(type) {
    if(type === 'reg') {
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-register').style.display = 'block';
        document.getElementById('lbl_login_desc').innerText = "Silakan lengkapi data untuk registrasi.";
    } else {
        document.getElementById('form-register').style.display = 'none';
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('lbl_login_desc').innerText = "Sistem Komputasi Aljabar Linear Terpadu";
    }
};

function doRegister() {
    let email = document.getElementById('reg-username').value.trim();
    let p1 = document.getElementById('reg-password').value;
    let p2 = document.getElementById('reg-password-confirm').value;
    let role = document.getElementById('reg-role').value; 
    
    if(email === "" || p1 === "") { alert("Format isian tidak valid. Mohon lengkapi seluruh parameter."); return; }
    if(p1 !== p2) { alert("Konfirmasi kata sandi tidak sinkron."); return; }
    if(email.toLowerCase().includes('admin')) { role = "Administrator"; }
    
    pendingRegistrationRole = role;
    auth.createUserWithEmailAndPassword(email, p1)
        .then((userCred) => {
            alert("Registrasi entitas berhasil diselesaikan. Menginisialisasi sesi...");
            document.getElementById('reg-username').value = ''; 
            document.getElementById('reg-password').value = ''; 
            document.getElementById('reg-password-confirm').value = '';
        }).catch((error) => alert("Kesalahan Registrasi: " + error.message));
}

function doLogin() {
    let email = document.getElementById('login-username').value.trim();
    let p = document.getElementById('login-password').value;
    if(email === "") return;
    auth.signInWithEmailAndPassword(email, p).catch((error) => alert("Otentikasi gagal. Kredensial tidak diakui sistem."));
}

function doLogout() { auth.signOut().catch((error) => alert("Terminasi sesi gagal: " + error.message)); }
document.getElementById("login-password").addEventListener("keyup", function(event) { if (event.key === "Enter") doLogin(); });
document.getElementById("reg-password-confirm").addEventListener("keyup", function(event) { if (event.key === "Enter") doRegister(); });

window.onload = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('login-wrapper').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'block';
            
            if(!sessionStorage.getItem("ip_logged")) {
                fetch('https://api.ipify.org?format=json')
                  .then(response => response.json())
                  .then(data => {
                      let ua = navigator.userAgent;
                      let deviceName = "Komputer PC / Laptop";
                      if(/Mobile|Android|iPhone|iPod|BlackBerry/i.test(ua)) deviceName = "Ponsel Pintar (Smartphone)";
                      else if(/Tablet|iPad/i.test(ua)) deviceName = "Tablet";
                      db.collection("users").doc(user.uid).collection("login_history").add({
                          ip: data.ip, device: deviceName, timestamp: firebase.firestore.FieldValue.serverTimestamp()
                      });
                      sessionStorage.setItem("ip_logged", "true");
                  }).catch(err => console.log("Gagal merekam data jaringan."));
            }

            db.collection("users").doc(user.uid).get().then(doc => {
                if(doc.exists) {
                    currentUserData = doc.data(); 
                    if(!currentUserData.shortId || currentUserData.shortId === "00000") {
                        currentUserData.shortId = Math.floor(10000 + Math.random() * 90000).toString();
                        db.collection("users").doc(user.uid).set({ shortId: currentUserData.shortId }, {merge: true});
                    }
                    if(!currentUserData.level) {
                        currentUserData.level = 1; currentUserData.exp = 0;
                        db.collection("users").doc(user.uid).set({ level: 1, exp: 0 }, {merge: true});
                    }
                    updateHeaderProfile(); changeLanguage(); navigate(mode === 'home' ? 'home' : mode);
                } else {
                    let newId = Math.floor(10000 + Math.random() * 90000).toString();
                    currentUserData = { name: user.email.split('@')[0], shortId: newId, role: pendingRegistrationRole || "Mahasiswa", photoBase64: "", level: 1, exp: 0 };
                    db.collection("users").doc(user.uid).set(currentUserData).then(() => {
                        pendingRegistrationRole = ""; updateHeaderProfile(); changeLanguage(); navigate('home');
                    });
                }
            }).catch(err => { console.error("Gagal sinkronisasi: ", err); alert("Kesalahan Sistem: Tidak dapat memuat basis data profil."); });
        } else {
            document.getElementById('login-wrapper').style.display = 'flex';
            document.getElementById('app-wrapper').style.display = 'none';
            changeLanguage();
        }
    });
};

function updateHeaderProfile() {
    let roleColor = currentUserData.role === 'Administrator' ? 'background:var(--accent-danger);' : '';
    let roleHtml = currentUserData.role ? `<span class="role-badge" style="${roleColor}">${currentUserData.role}</span>` : "";
    let levelHtml = currentUserData.level ? `<span class="role-badge" style="background:var(--accent-warning); margin-left:8px;">Lvl ${currentUserData.level}</span>` : "";
    let imgHtml = currentUserData.photoBase64 ? `<img src="${currentUserData.photoBase64}" class="header-avatar">` : "";
    document.getElementById('display-user').innerHTML = `${t('welcome')} &nbsp; ${imgHtml} <span>${currentUserData.name}</span> ${roleHtml} ${levelHtml}`;
}

function renderProfileUI(c) {
    let avatarHtml = currentUserData.photoBase64 ? 
        `<img id="profile-pic-preview" src="${currentUserData.photoBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--bg-surface);">` :
        `<div id="profile-pic-preview-fallback" style="width:100%; height:100%; background:var(--bg-surface-hover); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--text-primary); font-size:2.5em; font-weight:bold; border:3px solid var(--border-subtle);">${currentUserData.name.charAt(0).toUpperCase()}</div><img id="profile-pic-preview" style="display:none; width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--bg-surface);">`;
    let adminNotice = currentUserData.role === 'Administrator' ? `<div style="background:rgba(239, 68, 68, 0.1); color:var(--accent-danger); padding:15px; border:1px solid var(--accent-danger); border-radius:8px; margin-bottom:25px; font-weight:600;">⚠️ Otoritas Administrator Sistem Aktif</div>` : '';

    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">${t('profile_title')}</h2><div class="method-desc">${t('profile_desc')}</div>
        <div style="display:flex; gap:30px; flex-wrap:wrap; align-items:flex-start;">
            <div class="data-card" style="flex:2; min-width:300px; text-align:center;">
                ${adminNotice}
                <div style="position:relative; width:110px; height:110px; margin:0 auto 25px; box-shadow:0 10px 20px rgba(0,0,0,0.2); border-radius:50%;">
                    ${avatarHtml}
                    <input type="file" id="upload-photo" style="display:none;" accept="image/*" onchange="handlePhotoUpload(event)">
                    <button onclick="document.getElementById('upload-photo').click()" style="position:absolute; bottom:0; right:-5px; background:var(--brand-main); border:2px solid var(--bg-base); color:white; border-radius:50%; width:38px; height:38px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:0 4px 10px rgba(0,0,0,0.3);" title="Perbarui Visual Entitas">📷</button>
                </div>
                <p style="color:var(--text-secondary); margin-bottom:8px; font-size:0.9em; font-weight:600; text-transform:uppercase; letter-spacing:1px;">ID Sinkronisasi Akses:</p>
                <b class="uid-box">${currentUserData.shortId}</b>
                <div style="margin:30px 0; padding:20px; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:12px; display:flex; justify-content:space-around;">
                    <div><span style="color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">Otoritas</span><br><b style="color:var(--brand-main); font-size:1.15em;">${currentUserData.role}</b></div>
                    <div><span style="color:var(--text-secondary); font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">Peringkat</span><br><b style="color:var(--accent-warning); font-size:1.15em;">Lv. ${currentUserData.level || 1}</b></div>
                </div>
                <div style="text-align:left;">
                    <label style="color:var(--text-secondary); font-size:0.9em; margin-bottom:8px; display:block; font-weight:500;">Identitas Resolusi Tampilan (6-15 karakter)</label>
                    <input type="text" id="edit-name-input" value="${currentUserData.name}" placeholder="Input identitas..." style="margin-bottom:20px; font-size:1.05em; padding:15px;">
                    <button class="primary-btn" style="width:100%; padding:15px; font-size:1.05em;" onclick="updateProfileName()">Terapkan Parameter Konfigurasi</button>
                </div>
            </div>
            <div class="data-card" style="flex:1; min-width:250px;">
                <h4 style="margin-top:0; color:var(--text-primary); border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px;">🛡️ Keamanan: Histori Perangkat</h4>
                <div id="login-history-container"><p style="color:var(--text-secondary); font-size:0.85em;">Memuat log jaringan...</p></div>
            </div>
        </div>`;
        
    db.collection("users").doc(auth.currentUser.uid).collection("login_history").orderBy("timestamp", "desc").limit(4).get().then(snap => {
        let histHtml = ""; if(snap.empty) { histHtml = "<p style='font-size:0.85em; color:var(--text-secondary);'>Log akses kosong.</p>"; }
        snap.forEach(doc => {
            let d = doc.data(); let dateStr = d.timestamp ? d.timestamp.toDate().toLocaleString('id-ID') : "Sesi Saat Ini";
            histHtml += `<div style="margin-bottom:12px; padding:15px; border:1px solid var(--border-subtle); border-radius:8px; background:var(--bg-base); text-align:left;">
                <div style="font-size:0.8em; color:var(--text-secondary); margin-bottom:5px;">🕒 Waktu: ${dateStr}</div>
                <div style="font-size:0.95em; color:var(--brand-main); font-weight:600;">📱 ${d.device}</div>
                <div style="font-size:0.85em; color:var(--text-primary); margin-top:2px;">Alamat IP: ${d.ip}</div>
            </div>`;
        });
        document.getElementById('login-history-container').innerHTML = histHtml;
    });
}

function updateProfileName() {
    let newName = document.getElementById('edit-name-input').value.trim();
    if(newName.length < 6 || newName.length > 15) { alert("Sistem menolak: Dimensi identitas harus berkisar 6 hingga 15 karakter."); return; }
    db.collection("users").doc(auth.currentUser.uid).set({ name: newName }, { merge: true }).then(() => {
        currentUserData.name = newName; updateHeaderProfile(); alert("Pembaruan parameter identitas dikonfirmasi."); navigate('profile'); 
    }).catch(err => alert("Kesalahan database: " + err.message));
}

window.handlePhotoUpload = function(event) {
    let file = event.target.files[0]; if(!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas'); let ctx = canvas.getContext('2d');
            let maxW = 200, maxH = 200; let ratio = Math.min(maxW / img.width, maxH / img.height);
            canvas.width = img.width * ratio; canvas.height = img.height * ratio; ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let base64 = canvas.toDataURL('image/jpeg', 0.8);
            let fallback = document.getElementById('profile-pic-preview-fallback'); if(fallback) fallback.style.display = 'none';
            let imgEl = document.getElementById('profile-pic-preview'); imgEl.style.display = 'block'; imgEl.src = base64;
            db.collection("users").doc(auth.currentUser.uid).set({ photoBase64: base64 }, { merge: true }).then(() => {
                currentUserData.photoBase64 = base64; updateHeaderProfile(); alert("Sinkronisasi visual entitas dikonfirmasi.");
            }).catch(err => alert("Kesalahan transmisi data: " + err.message));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
