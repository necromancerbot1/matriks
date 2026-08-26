// === LOGIKA JARINGAN KOMUNIKASI & FORUM KELAS ===

let activeChatId = null, activeChatName = null, activeChatType = null;
let pendingChatImageBase64 = null; // Menyimpan gambar sementara sebelum dikirim

function renderChatUI(c) {
    if(!activeChatId) {
        let groupTitle = currentUserData.role === 'Administrator' ? "🛡️ Direktori Ruang (Otoritas Mutlak Admin)" : t('my_groups');
        c.innerHTML = `
            <h2 style="font-size:1.8em; margin-top:0; font-weight:700;">${t('chat_title')}</h2><div class="method-desc">${t('chat_desc')}<br><br>ID Sinkronisasi Anda: <b class="uid-box" style="margin-left:10px;">${currentUserData.shortId}</b></div>
            <div style="display:flex; gap:30px; flex-wrap:wrap; margin-top:30px;">
                
                <!-- KOLOM 1: PEER TO PEER (DM) -->
                <div class="data-card" style="flex:1; min-width:300px;">
                    <h4 style="margin-top:0; color:var(--text-primary); font-size:1.15em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px;">Koneksi Entitas Privat</h4>
                    <div style="display:flex; gap:12px; margin-bottom:20px;">
                        <input type="number" id="friend-id-input" placeholder="Input ID Kredensial (5-Digit)..." style="flex:1;">
                        <button class="primary-btn" onclick="sendFriendRequest()">Kirim</button>
                    </div>
                    <div id="pending-requests-container" style="margin-bottom:25px;"></div>
                    <h4 style="margin:0 0 15px 0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">Daftar Teman Jaringan</h4>
                    <div id="friend-list-container"><p style="color:var(--text-secondary); font-size:0.9em;">Menganalisis node jaringan...</p></div>
                </div>
                
                <!-- KOLOM 2: FORUM KELAS (GRUP) -->
                <div class="data-card" style="flex:1; min-width:300px;">
                    <h4 style="margin-top:0; color:var(--text-primary); font-size:1.15em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px;">Registrasi Ruang Diskusi (Grup)</h4>
                    <div style="display:flex; gap:12px; margin-bottom:20px;">
                        <input type="text" id="new-group-name" placeholder="Input Penamaan Ruang..." style="flex:1;">
                        <button class="success-btn" onclick="createNewGroup()">Inisialisasi</button>
                    </div>
                    <h4 style="margin:0 0 15px 0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">${groupTitle}</h4>
                    <div id="group-list-container"><p style="color:var(--text-secondary); font-size:0.9em;">Menganalisis direktori ruang...</p></div>
                </div>
            </div>`;
        loadPendingRequests(); 
        loadFriends(); 
        loadGroups();
    } else {
        // TAMPILAN DALAM RUANG CHAT
        c.innerHTML = `
            <button class="secondary-btn" onclick="leaveChat()" style="margin-bottom:20px; border-radius:12px;">← Terminasi Koneksi Ruang</button>
            <div class="chat-container">
                <div class="chat-header">
                    <div>
                        <span style="font-size:0.85em; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">${activeChatType === 'dm' ? 'Jaringan Privat' : 'Jaringan Kelompok'}</span><br>
                        <b style="color:var(--text-primary); font-weight:800; font-size:1.3em;">${activeChatName}</b>
                    </div>
                </div>
                
                <div id="chat-messages" class="chat-messages"><p style="color:var(--text-secondary); text-align:center; margin-top:auto; margin-bottom:auto;">Menunggu sinkronisasi data teks...</p></div>
                
                <!-- AREA PREVIEW GAMBAR SEBELUM DIKIRIM -->
                <div id="chat-img-preview-box" style="display:none; padding:10px 20px; background:var(--bg-surface-hover); border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle); position:relative;">
                    <button onclick="removeChatImage()" style="position:absolute; top:5px; right:10px; background:var(--accent-danger); color:#fff; border:none; border-radius:50%; width:25px; height:25px; font-size:12px; cursor:pointer;">X</button>
                    <img id="chat-img-preview" src="" style="height:60px; border-radius:8px; object-fit:cover; border:2px solid var(--brand-main);">
                </div>

                <div class="chat-input-box">
                    <input type="file" id="chat-photo-input" style="display:none;" accept="image/*" onchange="handleChatImageUpload(event)">
                    <button class="secondary-btn" style="padding:15px; border-radius:14px; background:rgba(15,23,42,0.5);" title="Lampirkan Foto" onclick="document.getElementById('chat-photo-input').click()">📷</button>
                    <input type="text" id="chat-input" placeholder="Ketik pesan diskusi..." style="flex:1; border-radius:14px;" onkeydown="if(event.key==='Enter') sendChatMessage()">
                    <button class="primary-btn" style="border-radius:14px;" onclick="sendChatMessage()">Kirim</button>
                </div>
            </div>`;
        listenMessages(activeChatId);
    }
}

window.handleChatImageUpload = function(event) {
    let file = event.target.files[0]; 
    if(!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas'); 
            let ctx = canvas.getContext('2d');
            let maxW = 500, maxH = 500; 
            let ratio = Math.min(maxW / img.width, maxH / img.height);
            canvas.width = img.width * ratio; 
            canvas.height = img.height * ratio; 
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Kompresi kualitas gambar (0.6) agar cepat dikirim dan tidak boros database
            pendingChatImageBase64 = canvas.toDataURL('image/jpeg', 0.6); 
            document.getElementById('chat-img-preview').src = pendingChatImageBase64;
            document.getElementById('chat-img-preview-box').style.display = 'block';
        }; 
        img.src = e.target.result;
    }; 
    reader.readAsDataURL(file);
}

window.removeChatImage = function() {
    pendingChatImageBase64 = null;
    document.getElementById('chat-img-preview-box').style.display = 'none';
    document.getElementById('chat-photo-input').value = '';
}

function sendFriendRequest() {
    let shortIdInput = document.getElementById('friend-id-input').value.trim(); 
    let myUid = auth.currentUser.uid;
    
    if(!shortIdInput) return; 
    if(shortIdInput === currentUserData.shortId) { 
        return ZeroModal.alert("Sistem mendeteksi siklus. Anda tidak dapat menyinkronkan ID Anda sendiri."); 
    }
    
    db.collection("users").where("shortId", "==", shortIdInput).get().then(snapshot => {
        if(snapshot.empty) { 
            return ZeroModal.alert("Kegagalan penelusuran. ID Entitas tidak terdaftar di sistem."); 
        }
        let fUid = snapshot.docs[0].id;
        db.collection("users").doc(myUid).collection("friends").doc(fUid).get().then(doc => {
            if(doc.exists) { 
                return ZeroModal.alert("Entitas tersebut telah terverifikasi dalam jaringan Anda."); 
            }
            db.collection("users").doc(fUid).collection("friend_requests").doc(myUid).set({ 
                senderName: currentUserData.name, 
                senderShortId: currentUserData.shortId, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            }).then(() => { 
                ZeroModal.alert("Protokol permintaan berhasil diinisialisasi."); 
                document.getElementById('friend-id-input').value = ''; 
            });
        });
    }).catch(err => ZeroModal.alert("Interupsi Database: " + err.message));
}

function loadPendingRequests() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friend_requests").onSnapshot(snapshot => {
        let container = document.getElementById('pending-requests-container'); 
        if(!container) return;
        if(snapshot.empty) { container.innerHTML = ""; return; }
        
        let html = `<div style="background:rgba(59, 130, 246, 0.05); border:1px solid rgba(59, 130, 246, 0.3); padding:15px; border-radius:12px; margin-bottom:20px;"><b style="color:var(--brand-main); font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">Aktivitas Jaringan Tertunda:</b>`;
        snapshot.forEach(doc => {
            let req = doc.data();
            html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; background:var(--bg-base); padding:12px 18px; border-radius:10px; border:1px solid var(--border-subtle);"><span style="font-size:0.95em; color:var(--text-primary); font-weight:600;">${req.senderName} <span style="color:var(--text-secondary); font-weight:400;">(${req.senderShortId})</span></span><button class="success-btn" style="padding:8px 16px; font-size:0.85em;" onclick="acceptFriend('${doc.id}', '${req.senderName}', '${req.senderShortId}')">Otorisasi</button></div>`;
        });
        container.innerHTML = html + `</div>`;
    });
}

function acceptFriend(senderUid, senderName, senderShortId) {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friends").doc(senderUid).set({ name: senderName, shortId: senderShortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    db.collection("users").doc(senderUid).collection("friends").doc(myUid).set({ name: currentUserData.name, shortId: currentUserData.shortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    db.collection("users").doc(myUid).collection("friend_requests").doc(senderUid).delete().then(() => { 
        ZeroModal.alert("Otorisasi selesai. Koneksi jaringan disetujui."); 
        loadFriends(); 
    });
}

function loadFriends() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friends").get().then(snapshot => {
        let container = document.getElementById('friend-list-container'); 
        if(!container) return;
        if(snapshot.empty) { 
            container.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9em; font-style:italic;">Tidak mendeteksi koneksi jaringan.</p>`; 
            return; 
        }
        
        let html = "";
        snapshot.forEach(doc => {
            let f = doc.data();
            html += `<div class="list-item"><div style="flex:1;" onclick="openChat('${doc.id}', '${f.name}', 'dm')"><b style="color:var(--text-primary); font-size:1.1em;">${f.name}</b><span style="display:block; font-size:0.85em; color:var(--text-secondary); margin-top:4px;">Kredensial: <span style="font-family:monospace; color:var(--brand-main);">${f.shortId}</span></span></div><button class="danger-btn outline" onclick="deleteFriend('${doc.id}', '${f.name}')">Terminasi</button></div>`;
        });
        container.innerHTML = html;
    });
}

function deleteFriend(fUid, fName) {
    ZeroModal.confirm(`Konfirmasi terminasi: Memutus koneksi jaringan secara permanen dengan entitas [${fName}]?`, function(res) {
        if(res) {
            let myUid = auth.currentUser.uid;
            db.collection("users").doc(myUid).collection("friends").doc(fUid).delete().then(() => {
                db.collection("users").doc(fUid).collection("friends").doc(myUid).delete(); 
                ZeroModal.alert(`Terminasi selesai. Koneksi dengan ${fName} diakhiri.`); 
                loadFriends();
            }).catch(err => ZeroModal.alert("Kesalahan terminasi: " + err.message));
        }
    });
}

function createNewGroup() {
    let name = document.getElementById('new-group-name').value.trim(); 
    if(!name) return ZeroModal.alert("Sistem menolak: Parameter nama ruang tidak terdefinisi.");
    
    db.collection("groups").add({ 
        name: name, 
        adminUid: auth.currentUser.uid, // Entitas yang membuat grup akan menjadi Admin Grup
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
    }).then(() => { 
        document.getElementById('new-group-name').value = ''; 
        loadGroups(); 
    });
}

function loadGroups() {
    let isAbsoluteAdmin = currentUserData.role === 'Administrator';
    let limitCount = isAbsoluteAdmin ? 500 : 15; 
    let myUid = auth.currentUser.uid;
    
    db.collection("groups").orderBy("createdAt", "desc").limit(limitCount).get().then((querySnapshot) => {
        let container = document.getElementById('group-list-container'); 
        if(!container) return;
        if(querySnapshot.empty) { 
            container.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9em; font-style:italic;">Direktori ruang kosong.</p>`; 
            return; 
        }
        
        let html = "";
        querySnapshot.forEach((doc) => {
            let g = doc.data(); 
            let isGroupAdmin = g.adminUid === myUid;
            
            let deleteBtn = "";
            // Admin Mutlak bisa hapus grup mana saja (Hapus Mutlak)
            if (isAbsoluteAdmin) { 
                deleteBtn = `<button class="danger-btn outline" style="border:none; padding:8px 12px; border-radius:8px;" onclick="event.stopPropagation(); deleteGroup('${doc.id}', '${g.name}')">Hapus Mutlak</button>`; 
            } 
            // Pemilik Grup bisa membongkar grup miliknya sendiri
            else if (isGroupAdmin) { 
                deleteBtn = `<button class="danger-btn outline" style="border:none; padding:8px 12px; border-radius:8px;" onclick="event.stopPropagation(); deleteGroup('${doc.id}', '${g.name}')">Bongkar Ruang</button>`; 
            }

            html += `<div class="list-item" onclick="openChat('${doc.id}', '${g.name}', 'group')">
                        <div style="flex:1;">
                            <b style="color:var(--text-primary); font-size:1.1em;">${g.name}</b>
                            ${isGroupAdmin ? '<span style="font-size:0.75em; color:var(--accent-warning); margin-left:8px; font-weight:700; background:rgba(245, 158, 11, 0.1); padding:4px 8px; border-radius:6px;">Pemilik Ruang</span>' : ''}
                        </div>
                        ${deleteBtn}
                     </div>`;
        });
        container.innerHTML = html;
    });
}

window.deleteGroup = function(groupId, groupName) {
    ZeroModal.confirm(`Konfirmasi penghapusan: Apakah Anda yakin ingin memusnahkan ruang kelas [${groupName}] dari server pusat?`, function(res) {
        if(res) { 
            db.collection("groups").doc(groupId).delete().then(() => { 
                ZeroModal.alert(`Eksekusi berhasil. Ruang [${groupName}] terhapus dari log server.`); 
                loadGroups(); 
            }); 
        }
    });
}

function openChat(id, name, type) {
    // Protokol Keamanan: Mencegah Administrator Mutlak mengintip isi percakapan kelas
    if(type === 'group' && currentUserData.role === 'Administrator') {
        return ZeroModal.alert("Otoritas Ditolak: Protokol privasi sistem mencegah Administrator Mutlak untuk masuk dan memantau isi percakapan di dalam ruang kelas.");
    }
    
    if(type === 'dm') { 
        let uids = [auth.currentUser.uid, id].sort(); 
        activeChatId = `dm_${uids[0]}_${uids[1]}`; 
    } else { 
        activeChatId = id; 
    }
    
    activeChatName = name; 
    activeChatType = type; 
    navigate('chat');
}

function leaveChat() { 
    activeChatId = null; 
    pendingChatImageBase64 = null; 
    if(unsubscribeChat) unsubscribeChat(); 
    navigate('chat'); 
}

let unsubscribeChat = null; 

function listenMessages(chatId) {
    let container = document.getElementById('chat-messages'); 
    if(!container) return;
    
    if(unsubscribeChat) unsubscribeChat(); 
    
    unsubscribeChat = db.collection("chat_messages").doc(chatId).collection("msgs").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
        let html = ""; 
        let myUid = auth.currentUser.uid;
        
        if(snapshot.empty) { 
            container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; margin-top:auto; margin-bottom:auto; font-style:italic;">Memori log diskusi kosong.</p>`; 
            return; 
        }
        
        snapshot.forEach((doc) => {
            let m = doc.data(); 
            let isMe = m.senderUid === myUid; 
            let bubbleClass = isMe ? "msg-bubble outgoing" : "msg-bubble incoming";
            
            // Format Pesan Teks dan Gambar (Bisa berdampingan)
            let imgTag = m.imageUrl ? `<img src="${m.imageUrl}" style="max-width:100%; border-radius:8px; margin-bottom:8px; display:block; cursor:pointer;">` : "";
            let textTag = m.text ? m.text.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
            
            html += `<div class="${bubbleClass}"><span class="msg-sender">${m.senderName}</span>${imgTag}${textTag}</div>`;
        });
        
        container.innerHTML = html; 
        container.scrollTop = container.scrollHeight; 
    });
}

function sendChatMessage() {
    let input = document.getElementById('chat-input'); 
    let text = input.value.trim(); 
    
    if(!text && !pendingChatImageBase64) return;
    if(!activeChatId) return;
    
    let msgData = { 
        text: text, 
        senderUid: auth.currentUser.uid, 
        senderName: currentUserData.name, 
        timestamp: firebase.firestore.FieldValue.serverTimestamp() 
    };
    
    if(pendingChatImageBase64) {
        msgData.imageUrl = pendingChatImageBase64;
    }
    
    input.value = ""; 
    removeChatImage(); // Kosongkan preview gambar
    
    db.collection("chat_messages").doc(activeChatId).collection("msgs").add(msgData);
}