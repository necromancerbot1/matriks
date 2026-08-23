// === LOGIKA JARINGAN KOMUNIKASI & FORUM KELAS ===
let activeChatId = null, activeChatName = null, activeChatType = null;

function renderChatUI(c) {
    if(!activeChatId) {
        let groupTitle = currentUserData.role === 'Administrator' ? "🛡️ Ruang Kelas Terdaftar (Akses Admin)" : t('my_groups');
        c.innerHTML = `
            <h2 style="font-size:1.6em; margin-top:0;">${t('chat_title')}</h2><div class="method-desc">${t('chat_desc')}<br><br>ID Sinkronisasi Anda: <b class="uid-box" style="margin-left:10px;">${currentUserData.shortId}</b></div>
            <div style="display:flex; gap:30px; flex-wrap:wrap; margin-top:30px;">
                <div class="data-card" style="flex:1; min-width:300px;">
                    <h4 style="margin-top:0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px;">Permintaan Sinkronisasi Entitas</h4>
                    <div style="display:flex; gap:12px; margin-bottom:20px;"><input type="number" id="friend-id-input" placeholder="Input ID Kredensial 5-Digit..." style="flex:1;"><button class="primary-btn" onclick="sendFriendRequest()">Kirim</button></div>
                    <div id="pending-requests-container" style="margin-bottom:25px;"></div>
                    <h4 style="margin:0 0 15px 0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">Koneksi Peer-to-Peer Terverifikasi</h4>
                    <div id="friend-list-container"><p style="color:var(--text-secondary); font-size:0.9em;">Menganalisis node jaringan...</p></div>
                </div>
                <div class="data-card" style="flex:1; min-width:300px;">
                    <h4 style="margin-top:0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px; margin-bottom:20px;">Registrasi Ruang Diskusi Baru</h4>
                    <div style="display:flex; gap:12px; margin-bottom:20px;"><input type="text" id="new-group-name" placeholder="Input Penamaan Ruang..." style="flex:1;"><button class="success-btn" onclick="createNewGroup()">Inisialisasi</button></div>
                    <h4 style="margin:0 0 15px 0; color:var(--text-primary); font-size:1.1em; border-bottom:1px solid var(--border-subtle); padding-bottom:15px;">${groupTitle}</h4>
                    <div id="group-list-container"><p style="color:var(--text-secondary); font-size:0.9em;">Menganalisis direktori ruang...</p></div>
                </div>
            </div>`;
        loadPendingRequests(); loadFriends(); loadGroups();
    } else {
        c.innerHTML = `<button class="secondary-btn" onclick="leaveChat()" style="margin-bottom:20px;">← Terminasi Koneksi Ruang</button>
            <div class="chat-container">
                <div class="chat-header"><span style="font-size:1.1em; font-weight:500; color:var(--text-secondary);">${activeChatType === 'dm' ? 'Jaringan Privat' : 'Jaringan Kelompok'}: <b style="color:var(--text-primary); font-weight:700;">${activeChatName}</b></span></div>
                <div id="chat-messages" class="chat-messages"><p style="color:var(--text-secondary); text-align:center; margin-top:auto; margin-bottom:auto;">Menunggu sinkronisasi data teks...</p></div>
                <div class="chat-input-box"><input type="text" id="chat-input" placeholder="Input parameter pesan..." onkeydown="if(event.key==='Enter') sendChatMessage()"><button class="primary-btn" onclick="sendChatMessage()">Transmisikan</button></div>
            </div>`;
        listenMessages(activeChatId);
    }
}

function sendFriendRequest() {
    let shortIdInput = document.getElementById('friend-id-input').value.trim(); let myUid = auth.currentUser.uid;
    if(!shortIdInput) return; if(shortIdInput === currentUserData.shortId) { alert("Sistem mendeteksi siklus. Anda tidak dapat menyinkronkan ID Anda sendiri."); return; }
    db.collection("users").where("shortId", "==", shortIdInput).get().then(snapshot => {
        if(snapshot.empty) { alert("Kegagalan penelusuran. ID Entitas tidak terdaftar di sistem."); return; }
        let fUid = snapshot.docs[0].id;
        db.collection("users").doc(myUid).collection("friends").doc(fUid).get().then(doc => {
            if(doc.exists) { alert("Entitas tersebut telah terverifikasi dalam jaringan Anda."); return; }
            db.collection("users").doc(fUid).collection("friend_requests").doc(myUid).set({ senderName: currentUserData.name, senderShortId: currentUserData.shortId, timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { 
                alert("Protokol permintaan berhasil diinisialisasi."); document.getElementById('friend-id-input').value = ''; 
            });
        });
    }).catch(err => alert("Interupsi Database: " + err.message));
}

function loadPendingRequests() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friend_requests").onSnapshot(snapshot => {
        let container = document.getElementById('pending-requests-container'); if(!container) return;
        if(snapshot.empty) { container.innerHTML = ""; return; }
        let html = `<div style="background:rgba(59, 130, 246, 0.1); border:1px solid var(--brand-main); padding:15px; border-radius:8px; margin-bottom:20px;"><b style="color:var(--brand-main); font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">Aktivitas Jaringan Tertunda:</b>`;
        snapshot.forEach(doc => {
            let req = doc.data();
            html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; background:var(--bg-base); padding:10px 15px; border-radius:6px; border:1px solid var(--border-subtle);"><span style="font-size:0.95em; color:var(--text-primary); font-weight:500;">${req.senderName} <span style="color:var(--text-secondary);">(${req.senderShortId})</span></span><button class="success-btn" style="padding:6px 15px; font-size:0.85em;" onclick="acceptFriend('${doc.id}', '${req.senderName}', '${req.senderShortId}')">Otorisasi</button></div>`;
        });
        container.innerHTML = html + `</div>`;
    });
}

function acceptFriend(senderUid, senderName, senderShortId) {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friends").doc(senderUid).set({ name: senderName, shortId: senderShortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    db.collection("users").doc(senderUid).collection("friends").doc(myUid).set({ name: currentUserData.name, shortId: currentUserData.shortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    db.collection("users").doc(myUid).collection("friend_requests").doc(senderUid).delete().then(() => { alert("Otorisasi selesai. Koneksi jaringan disetujui."); loadFriends(); });
}

function loadFriends() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friends").get().then(snapshot => {
        let container = document.getElementById('friend-list-container'); if(!container) return;
        if(snapshot.empty) { container.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9em; font-style:italic;">Tidak mendeteksi koneksi jaringan.</p>`; return; }
        let html = "";
        snapshot.forEach(doc => {
            let f = doc.data();
            html += `<div class="list-item"><div style="flex:1;" onclick="openChat('${doc.id}', '${f.name}', 'dm')"><b style="color:var(--text-primary); font-size:1.05em;">${f.name}</b><span style="display:block; font-size:0.8em; color:var(--text-secondary); margin-top:2px;">Kredensial: ${f.shortId}</span></div><button class="danger-btn outline" onclick="deleteFriend('${doc.id}', '${f.name}')">Terminasi</button></div>`;
        });
        container.innerHTML = html;
    });
}

function deleteFriend(fUid, fName) {
    if(confirm(`Konfirmasi terminasi: Memutus koneksi jaringan secara permanen dengan entitas [${fName}]?`)) {
        let myUid = auth.currentUser.uid;
        db.collection("users").doc(myUid).collection("friends").doc(fUid).delete().then(() => {
            db.collection("users").doc(fUid).collection("friends").doc(myUid).delete(); alert(`Terminasi selesai. Koneksi dengan ${fName} diakhiri.`); loadFriends();
        }).catch(err => alert("Kesalahan terminasi: " + err.message));
    }
}

function createNewGroup() {
    let name = document.getElementById('new-group-name').value.trim(); if(!name) return alert("Sistem menolak: Parameter nama ruang tidak terdefinisi.");
    db.collection("groups").add({ name: name, createdAt: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { document.getElementById('new-group-name').value = ''; loadGroups(); });
}

function loadGroups() {
    let limitCount = currentUserData.role === 'Administrator' ? 500 : 15;
    db.collection("groups").orderBy("createdAt", "desc").limit(limitCount).get().then((querySnapshot) => {
        let container = document.getElementById('group-list-container'); if(!container) return;
        if(querySnapshot.empty) { container.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9em; font-style:italic;">Direktori ruang kosong.</p>`; return; }
        let html = "";
        querySnapshot.forEach((doc) => {
            let g = doc.data(); let deleteBtn = currentUserData.role === 'Administrator' ? `<button class="danger-btn outline" style="border:none; padding:5px 10px;" onclick="event.stopPropagation(); deleteGroup('${doc.id}', '${g.name}')" title="Bypass Hapus Grup">Hapus Data</button>` : '';
            html += `<div class="list-item" onclick="openChat('${doc.id}', '${g.name}', 'group')"><div style="flex:1;"><b style="color:var(--text-primary); font-size:1.05em;">${g.name}</b></div>${deleteBtn}</div>`;
        });
        container.innerHTML = html;
    });
}

window.deleteGroup = function(groupId, groupName) {
    if(confirm(`OTORISASI ADMIN DIBUTUHKAN: Konfirmasi penghapusan absolut untuk ruang kelas [${groupName}] dari server pusat?`)) {
        db.collection("groups").doc(groupId).delete().then(() => { alert(`Eksekusi berhasil. Ruang [${groupName}] terhapus dari log server.`); loadGroups(); });
    }
}

function openChat(id, name, type) {
    if(type === 'dm') { let uids = [auth.currentUser.uid, id].sort(); activeChatId = `dm_${uids[0]}_${uids[1]}`; } else { activeChatId = id; }
    activeChatName = name; activeChatType = type; navigate('chat');
}

function leaveChat() { activeChatId = null; if(unsubscribeChat) unsubscribeChat(); navigate('chat'); }

let unsubscribeChat = null; 
function listenMessages(chatId) {
    let container = document.getElementById('chat-messages'); if(!container) return;
    if(unsubscribeChat) unsubscribeChat(); 
    unsubscribeChat = db.collection("chat_messages").doc(chatId).collection("msgs").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
        let html = ""; let myUid = auth.currentUser.uid;
        if(snapshot.empty) { container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; margin-top:auto; margin-bottom:auto; font-style:italic;">Memori log diskusi kosong.</p>`; return; }
        snapshot.forEach((doc) => {
            let m = doc.data(); let isMe = m.senderUid === myUid; let bubbleClass = isMe ? "msg-bubble outgoing" : "msg-bubble incoming";
            html += `<div class="${bubbleClass}"><span class="msg-sender">${m.senderName}</span>${m.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
        });
        container.innerHTML = html; container.scrollTop = container.scrollHeight; 
    });
}

function sendChatMessage() {
    let input = document.getElementById('chat-input'); let text = input.value.trim(); if(!text || !activeChatId) return;
    db.collection("chat_messages").doc(activeChatId).collection("msgs").add({ text: text, senderUid: auth.currentUser.uid, senderName: currentUserData.name, timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { input.value = ""; });
}
