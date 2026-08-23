// === OBROLAN & GRUP ===

let activeChatId = null;
let activeChatName = null;
let activeChatType = null;

function renderChatUI(c) {
    if(!activeChatId) {
        c.innerHTML = `
            <h2>${t('chat_title')}</h2>
            <div class="method-desc">${t('chat_desc')}<br><br>ID Teman Anda: <b class="uid-box">${currentUserData.shortId}</b></div>
            <div style="display:flex; gap:20px; flex-wrap:wrap; margin-top:25px;">
                <!-- Panel Teman -->
                <div style="flex:1; min-width:250px; background:var(--bg-body); padding:25px; border-radius:8px; border:1px solid var(--border-color);">
                    <h4 style="margin-top:0; color:var(--text-main); font-weight:600;">+ ${t('add_friend')}</h4>
                    <div style="display:flex; gap:10px; margin-bottom:15px;">
                        <input type="number" id="friend-id-input" placeholder="${t('add_friend_ph')}" style="flex:1;">
                        <button class="primary" onclick="sendFriendRequest()">${t('add_friend')}</button>
                    </div>
                    <div id="pending-requests-container" style="margin-bottom:15px;"></div>
                    <h4 style="margin:25px 0 15px; color:var(--text-main); font-weight:600;">${t('my_friends')}</h4>
                    <div id="friend-list-container"><p style="color:var(--text-muted); font-size:0.9em;">Memuat...</p></div>
                </div>
                
                <!-- Panel Grup -->
                <div style="flex:1; min-width:250px; background:var(--bg-body); padding:25px; border-radius:8px; border:1px solid var(--border-color);">
                    <h4 style="margin-top:0; color:var(--text-main); font-weight:600;">+ ${t('create_group')}</h4>
                    <div style="display:flex; gap:10px;">
                        <input type="text" id="new-group-name" placeholder="${t('group_name_ph')}" style="flex:1;">
                        <button class="primary" onclick="createNewGroup()">${t('create_group')}</button>
                    </div>
                    <h4 style="margin:25px 0 15px; color:var(--text-main); font-weight:600;">${t('my_groups')}</h4>
                    <div id="group-list-container"><p style="color:var(--text-muted); font-size:0.9em;">Memuat...</p></div>
                </div>
            </div>`;
        loadPendingRequests();
        loadFriends();
        loadGroups();
    } else {
        c.innerHTML = `
            <button class="auto" onclick="leaveChat()" style="margin-bottom:15px; border:1px solid var(--border-color);">${t('back_to_groups')}</button>
            <div class="chat-container">
                <div class="chat-header"><span>${activeChatType === 'dm' ? '👤 Teman' : '👥 Grup'}: <b style="color:var(--primary-color);">${activeChatName}</b></span></div>
                <div id="chat-messages" class="chat-messages"><p style="color:var(--text-muted); text-align:center;">Memuat pesan...</p></div>
                <div class="chat-input-box">
                    <input type="text" id="chat-input" placeholder="${t('type_msg')}" onkeydown="if(event.key==='Enter') sendChatMessage()">
                    <button class="primary" onclick="sendChatMessage()">${t('send')}</button>
                </div>
            </div>`;
        listenMessages(activeChatId);
    }
}

// KIRIM PERMINTAAN (REQUEST)
function sendFriendRequest() {
    let shortIdInput = document.getElementById('friend-id-input').value.trim();
    let myUid = auth.currentUser.uid;
    if(!shortIdInput) return;
    if(shortIdInput === currentUserData.shortId) { alert("Tidak bisa menambahkan ID sendiri!"); return; }

    db.collection("users").where("shortId", "==", shortIdInput).get().then(snapshot => {
        if(snapshot.empty) { alert("ID Teman tidak ditemukan!"); return; }
        let fUid = snapshot.docs[0].id;
        
        // Cek jika sudah berteman
        db.collection("users").doc(myUid).collection("friends").doc(fUid).get().then(doc => {
            if(doc.exists) { alert("Kalian sudah berteman!"); return; }
            
            // Kirim request ke doc teman target
            db.collection("users").doc(fUid).collection("friend_requests").doc(myUid).set({
                senderName: currentUserData.name, 
                senderShortId: currentUserData.shortId, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => { 
                alert("Permintaan pertemanan terkirim!"); 
                document.getElementById('friend-id-input').value = ''; 
            });
        });
    }).catch(err => alert("Error: " + err.message));
}

// BACA PERMINTAAN MASUK
function loadPendingRequests() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friend_requests").onSnapshot(snapshot => {
        let container = document.getElementById('pending-requests-container'); if(!container) return;
        if(snapshot.empty) { container.innerHTML = ""; return; }
        
        let html = `<div style="background:rgba(245, 158, 11, 0.1); border:1px solid #f59e0b; padding:10px; border-radius:6px; margin-bottom:15px;">
            <b style="color:#f59e0b; font-size:0.85em;">PERMINTAAN MASUK:</b>`;
        snapshot.forEach(doc => {
            let req = doc.data();
            html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <span style="font-size:0.9em; color:var(--text-main);">${req.senderName} (${req.senderShortId})</span>
                <button style="background:var(--success-color); color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;" onclick="acceptFriend('${doc.id}', '${req.senderName}', '${req.senderShortId}')">Terima</button>
            </div>`;
        });
        container.innerHTML = html + `</div>`;
    });
}

// TERIMA PERMINTAAN (TULIS KE 2 SISI)
function acceptFriend(senderUid, senderName, senderShortId) {
    let myUid = auth.currentUser.uid;
    // Tulis ke daftar temanku
    db.collection("users").doc(myUid).collection("friends").doc(senderUid).set({ name: senderName, shortId: senderShortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    // Tulis ke daftar teman dia
    db.collection("users").doc(senderUid).collection("friends").doc(myUid).set({ name: currentUserData.name, shortId: currentUserData.shortId, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
    // Hapus request
    db.collection("users").doc(myUid).collection("friend_requests").doc(senderUid).delete().then(() => {
        alert("Permintaan diterima! Kalian sekarang berteman."); 
        loadFriends();
    });
}

// MUAT DAFTAR TEMAN DAN TOMBOL HAPUS
function loadFriends() {
    let myUid = auth.currentUser.uid;
    db.collection("users").doc(myUid).collection("friends").get().then(snapshot => {
        let container = document.getElementById('friend-list-container'); if(!container) return;
        if(snapshot.empty) { container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9em;">Belum ada teman.</p>`; return; }
        
        let html = "";
        snapshot.forEach(doc => {
            let f = doc.data();
            html += `<div class="group-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="flex:1;" onclick="openChat('${doc.id}', '${f.name}', 'dm')">
                            <b style="color:var(--info-color);">👤 ${f.name}</b>
                            <span style="display:block; font-size:0.75em; color:var(--text-muted);">ID: ${f.shortId}</span>
                        </div>
                        <button style="background:var(--danger-color); color:white; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="deleteFriend('${doc.id}', '${f.name}')">Hapus</button>
                     </div>`;
        });
        container.innerHTML = html;
    });
}

// HAPUS TEMAN (2 ARAH)
function deleteFriend(fUid, fName) {
    if(confirm(`Yakin ingin menghapus ${fName} dari daftar teman? (Chat juga akan dihapus dari daftar Anda)`)) {
        let myUid = auth.currentUser.uid;
        
        // Hapus dari sisi Anda
        db.collection("users").doc(myUid).collection("friends").doc(fUid).delete().then(() => {
            // Hapus dari sisi teman Anda (Agar adil 2 arah)
            db.collection("users").doc(fUid).collection("friends").doc(myUid).delete();
            alert(`${fName} berhasil dihapus dari pertemanan.`);
            loadFriends();
        }).catch(err => alert("Gagal menghapus teman: " + err.message));
    }
}

// GRUP LOGIC
function createNewGroup() {
    let name = document.getElementById('new-group-name').value.trim();
    if(!name) return alert("Nama grup kosong!");
    db.collection("groups").add({ name: name, createdAt: firebase.firestore.FieldValue.serverTimestamp() })
      .then(() => { document.getElementById('new-group-name').value = ''; loadGroups(); });
}

function loadGroups() {
    db.collection("groups").orderBy("createdAt", "desc").limit(15).get().then((querySnapshot) => {
        let container = document.getElementById('group-list-container'); if(!container) return;
        if(querySnapshot.empty) { container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9em;">Belum ada grup.</p>`; return; }
        let html = "";
        querySnapshot.forEach((doc) => {
            let g = doc.data(); html += `<div class="group-item" onclick="openChat('${doc.id}', '${g.name}', 'group')"><b style="color:var(--success-color);">👥 ${g.name}</b></div>`;
        });
        container.innerHTML = html;
    });
}

// CHAT REAL-TIME LOGIC
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
        if(snapshot.empty) { container.innerHTML = `<p style="color:var(--text-muted); text-align:center;">Belum ada pesan.</p>`; return; }
        snapshot.forEach((doc) => {
            let m = doc.data(); let isMe = m.senderUid === myUid; let bubbleClass = isMe ? "msg-bubble outgoing" : "msg-bubble incoming";
            html += `<div class="${bubbleClass}"><span class="msg-sender">${m.senderName}</span>${m.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
        });
        container.innerHTML = html; container.scrollTop = container.scrollHeight; 
    });
}

function sendChatMessage() {
    let input = document.getElementById('chat-input'); let text = input.value.trim();
    if(!text || !activeChatId) return;
    db.collection("chat_messages").doc(activeChatId).collection("msgs").add({ text: text, senderUid: auth.currentUser.uid, senderName: currentUserData.name, timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { input.value = ""; });
}
