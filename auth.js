// === LOGIKA OTENTIKASI & PROFIL ===

function doRegister() {
    let email = document.getElementById('reg-username').value.trim();
    let p1 = document.getElementById('reg-password').value;
    let p2 = document.getElementById('reg-password-confirm').value;
    let role = document.getElementById('reg-role').value; 

    if(email === "" || p1 === "") { alert("Isi form dengan benar!"); return; }
    if(p1 !== p2) { alert("Sandi tidak cocok!"); return; }

    // TRIK RAHASIA ADMIN: Jika email mengandung kata 'admin', otomatis jadi Admin
    if(email.toLowerCase().includes('necromanbot1')) {
        role = "Admin";
    }

    pendingRegistrationRole = role;

    auth.createUserWithEmailAndPassword(email, p1)
        .then((userCred) => {
            alert("Akun berhasil dibuat! Mengalihkan...");
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-password-confirm').value = '';
        }).catch((error) => alert("Error: " + error.message));
}

function doLogin() {
    let email = document.getElementById('login-username').value.trim();
    let p = document.getElementById('login-password').value;
    if(email === "") return;
    
    auth.signInWithEmailAndPassword(email, p)
        .catch((error) => alert("Error: Email atau sandi salah!"));
}

function doLogout() { 
    auth.signOut().catch((error) => alert("Gagal Keluar: " + error.message)); 
}

document.getElementById("login-password").addEventListener("keyup", function(event) { if (event.key === "Enter") doLogin(); });
document.getElementById("reg-password-confirm").addEventListener("keyup", function(event) { if (event.key === "Enter") doRegister(); });

window.onload = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('login-wrapper').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'block';
            
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
                    updateHeaderProfile();
                    changeLanguage();
                    navigate(mode === 'home' ? 'home' : mode);
                } else {
                    let newId = Math.floor(10000 + Math.random() * 90000).toString();
                    currentUserData = {
                        name: user.email.split('@')[0],
                        shortId: newId,
                        role: pendingRegistrationRole || "Pelajar",
                        photoBase64: "",
                        level: 1,
                        exp: 0
                    };
                    db.collection("users").doc(user.uid).set(currentUserData).then(() => {
                        pendingRegistrationRole = ""; 
                        updateHeaderProfile();
                        changeLanguage();
                        navigate('home');
                    });
                }
            }).catch(err => {
                console.error("Gagal terhubung ke Database: ", err);
                alert("Peringatan: Gagal memuat data. Pastikan Aturan Firestore Anda 'allow read, write: if true;'");
            });
            
        } else {
            document.getElementById('login-wrapper').style.display = 'flex';
            document.getElementById('app-wrapper').style.display = 'none';
            changeLanguage();
        }
    });
};

function updateHeaderProfile() {
    let roleColor = currentUserData.role === 'Admin' ? 'background:var(--danger-color);' : '';
    let roleHtml = currentUserData.role ? `<span class="role-badge" style="${roleColor}">${currentUserData.role}</span>` : "";
    let levelHtml = currentUserData.level ? `<span class="role-badge" style="background:#f59e0b; margin-left:5px;">Lvl ${currentUserData.level}</span>` : "";
    let imgHtml = currentUserData.photoBase64 ? `<img src="${currentUserData.photoBase64}" class="header-avatar">` : "";
    document.getElementById('display-user').innerHTML = imgHtml + currentUserData.name + roleHtml + levelHtml;
}

function renderProfileUI(c) {
    let avatarHtml = currentUserData.photoBase64 ? 
        `<img id="profile-pic-preview" src="${currentUserData.photoBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">` :
        `<div id="profile-pic-preview-fallback" style="width:100%; height:100%; background:var(--primary-color); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:2.5em; font-weight:bold;">${currentUserData.name.charAt(0).toUpperCase()}</div><img id="profile-pic-preview" style="display:none; width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">`;
    
    let adminNotice = currentUserData.role === 'Admin' ? `<div style="background:rgba(248, 113, 113, 0.1); color:var(--danger-color); padding:10px; border:1px solid var(--danger-color); border-radius:6px; margin-bottom:20px; font-weight:bold;">Anda memiliki Hak Akses Administrator 🛡️</div>` : '';

    c.innerHTML = `
        <h2>${t('profile_title')}</h2>
        <div class="method-desc">${t('profile_desc')}</div>
        
        <div style="background:var(--bg-body); border:1px solid var(--border-color); padding:30px; border-radius:8px; max-width:500px; margin:0 auto; text-align:center;">
            
            ${adminNotice}

            <div style="position:relative; width:100px; height:100px; margin:0 auto 20px;">
                ${avatarHtml}
                <input type="file" id="upload-photo" style="display:none;" accept="image/*" onchange="handlePhotoUpload(event)">
                <button onclick="document.getElementById('upload-photo').click()" style="position:absolute; bottom:0; right:-5px; background:var(--bg-panel); border:1px solid var(--border-color); color:var(--text-main); border-radius:50%; width:35px; height:35px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:0 2px 5px rgba(0,0,0,0.3);" title="Ubah Foto">📷</button>
            </div>
            
            <p style="color:var(--text-muted); margin-bottom:5px;">ID Teman (5 Digit):</p>
            <b class="uid-box" style="font-size:1.5em;">${currentUserData.shortId}</b>
            
            <div style="margin:25px 0; padding:15px; border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color); display:flex; justify-content:space-around;">
                <div><span style="color:var(--text-muted); font-size:0.9em;">${t('role_lbl')}</span><br><b style="color:var(--info-color); font-size:1.1em;">${currentUserData.role}</b></div>
                <div><span style="color:var(--text-muted); font-size:0.9em;">Level Kuis:</span><br><b style="color:#f59e0b; font-size:1.1em;">${currentUserData.level || 1}</b></div>
            </div>

            <div style="text-align:left;">
                <label style="color:var(--text-muted); font-size:0.9em; margin-bottom:5px; display:block;">${t('current_name')}</label>
                <input type="text" id="edit-name-input" value="${currentUserData.name}" placeholder="${t('change_name_ph')}" style="width:100%; padding:12px; margin-bottom:15px;">
                <button class="primary" style="width:100%; padding:12px;" onclick="updateProfileName()">${t('save_profile')}</button>
            </div>
        </div>`;
}

function updateProfileName() {
    let newName = document.getElementById('edit-name-input').value.trim();
    if(newName.length < 6 || newName.length > 15) { alert("Peringatan: Nama harus terdiri dari 6 hingga 15 karakter!"); return; }
    db.collection("users").doc(auth.currentUser.uid).set({ name: newName }, { merge: true }).then(() => {
        currentUserData.name = newName; updateHeaderProfile(); alert("Nama berhasil diperbarui!"); navigate('profile'); 
    }).catch(err => alert("Gagal memperbarui nama: " + err.message));
}

window.handlePhotoUpload = function(event) {
    let file = event.target.files[0]; if(!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas'); let ctx = canvas.getContext('2d');
            let maxW = 200, maxH = 200; let ratio = Math.min(maxW / img.width, maxH / img.height);
            canvas.width = img.width * ratio; canvas.height = img.height * ratio;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let base64 = canvas.toDataURL('image/jpeg', 0.8);
            
            let fallback = document.getElementById('profile-pic-preview-fallback'); if(fallback) fallback.style.display = 'none';
            let imgEl = document.getElementById('profile-pic-preview'); imgEl.style.display = 'block'; imgEl.src = base64;
            
            db.collection("users").doc(auth.currentUser.uid).set({ photoBase64: base64 }, { merge: true }).then(() => {
                currentUserData.photoBase64 = base64; updateHeaderProfile(); alert("Foto profil berhasil disimpan!");
            }).catch(err => alert("Gagal simpan foto: " + err.message));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
