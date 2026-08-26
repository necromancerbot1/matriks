// === LOGIKA AI TUTOR DENGAN API TERSEMBUNYI (OBFUSCATION) ===

// API Key Anda dienkripsi ke dalam format Base64 agar tidak terekspos mentah-mentah ke GitHub.
const ENCODED_KEY = "QVEuQWI4Uk42TGNQYnR1ZnpiYnpBNnpHaDlnR0laQ0x2VGx2cVlsRTdLSWNaa0JMUWRKaHc="; 

// Browser akan menerjemahkan ulang kunci ini secara lokal saat diakses.
const GEMINI_API_KEY = atob(ENCODED_KEY); 

const systemPrompt = [
    { role: "user", parts: [{ text: "Anda adalah ZeroBot, asisten virtual akademis pada antarmuka sistem Zero Matriks. Meskipun keahlian utama Anda adalah matematika dan aljabar linear, Anda diizinkan untuk menjawab pertanyaan apa pun dari pengguna di luar topik matematika (termasuk sains, pemrograman, umum, dsb). Jawablah semua instruksi pengguna dengan lugas, akurat, dan sangat profesional menggunakan bahasa Indonesia. Jangan pernah bilang Anda adalah AI bahasa buatan Google." }] },
    { role: "model", parts: [{ text: "Instruksi diterima. Identitas disetel sebagai ZeroBot. Saya siap membantu entitas pengguna untuk menguraikan permasalahan matematis, komputasi matriks, maupun menjawab pertanyaan lintas disiplin ilmu dengan profesional." }] }
];

let geminiHistory = [];

function loadChatHistory() {
    let savedHistory = localStorage.getItem("zeroBotHistory");
    if(savedHistory) {
        geminiHistory = JSON.parse(savedHistory);
    } else {
        geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
    }
}

function saveChatHistory() {
    localStorage.setItem("zeroBotHistory", JSON.stringify(geminiHistory));
}

window.clearAIHistory = function() {
    if(confirm("Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dengan ZeroBot?")) {
        localStorage.removeItem("zeroBotHistory");
        geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
        renderAIHistory();
    }
}

function renderGeminiUI(c) {
    loadChatHistory();
    
    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">Asisten Belajar (ZeroAI)</h2>
        <div class="method-desc">Sistem kecerdasan buatan berbasis *Large Language Model*. Ajukan instruksi, konsep komputasi, atau topik apa pun untuk dibahas bersama sistem.</div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-base); border:1px solid #a855f7; box-shadow:0 0 15px rgba(168, 85, 247, 0.15);">
            <div class="chat-header" style="background:var(--bg-surface); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1.1em; font-weight:500; color:var(--text-secondary);">Status Modul Engine: <b style="color:#a855f7; font-weight:700;">🟢 Online (API Ready)</b></span>
                <button onclick="clearAIHistory()" style="background:transparent; border:none; color:var(--accent-danger); font-size:1.4em; cursor:pointer; padding:0 5px;" title="Hapus Riwayat Obrolan">🗑️</button>
            </div>
            
            <div id="ai-chat-messages" class="chat-messages" style="flex:1; overflow-y:auto; padding:25px; display:flex; flex-direction:column; gap:15px;">
                <!-- Pesan akan dimuat di sini -->
            </div>
            
            <div class="chat-input-box" style="padding:15px; background:var(--bg-surface); border-top:1px solid var(--border-subtle); display:flex; gap:10px;">
                <input type="text" id="ai-chat-input" placeholder="Tanyakan sesuatu (misal: Apa itu Vektor Eigen? atau Siapa penemu C++?)..." style="flex:1; padding:12px 15px; font-size:1.05em; border-radius:8px; border:1px solid var(--border-subtle); background:var(--bg-base); color:var(--text-primary);" onkeydown="if(event.key==='Enter') sendAIPrompt()">
                <button class="primary-btn" style="background-color:#a855f7;" onclick="sendAIPrompt()">Eksekusi Prompt</button>
            </div>
        </div>
    `;
    renderAIHistory();
}

function renderAIHistory() {
    let container = document.getElementById("ai-chat-messages");
    if(!container) return;
    
    let html = "";
    for(let i = 2; i < geminiHistory.length; i++) {
        let msg = geminiHistory[i];
        let isUser = msg.role === "user";
        let bubbleClass = isUser ? "msg-bubble outgoing" : "msg-bubble incoming";
        let senderName = isUser ? currentUserData.name : "ZeroAI";
        
        let text = msg.parts[0].text;
        text = text.replace(/\*\*(.*?)\*\*/g, '<b style="color:#a855f7;">$1</b>');
        text = text.replace(/\n/g, '<br>');
        
        let bgColor = isUser ? "background-color:var(--brand-main);" : "background-color:var(--bg-surface); border:1px solid var(--border-subtle);";
        
        html += `<div class="${bubbleClass}" style="${bgColor}">
                    <span class="msg-sender" style="font-size:0.8em; opacity:0.8; margin-bottom:6px; display:block; color:var(--text-primary);">${senderName}</span>
                    <div style="line-height:1.6; font-size:0.95em; color:var(--text-primary);">${text}</div>
                 </div>`;
    }
    
    if(geminiHistory.length <= 2) {
        html = `<p style="color:var(--text-secondary); text-align:center; font-style:italic; margin-top:auto; margin-bottom:auto;">Memori log diskusi kosong. Silakan mulai sesi obrolan.</p>`;
    }
    
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

async function sendAIPrompt() {
    let inputEl = document.getElementById('ai-chat-input');
    let text = inputEl.value.trim();
    if(!text) return;
    
    inputEl.value = "";
    geminiHistory.push({ role: "user", parts: [{ text: text }] });
    saveChatHistory();
    renderAIHistory();
    
    let container = document.getElementById("ai-chat-messages");
    container.innerHTML += `<div class="msg-bubble incoming" id="ai-thinking" style="background-color:var(--bg-surface); border:1px solid #a855f7;"><span class="msg-sender">ZeroBot 🤖</span><i style="color:var(--text-secondary);">Mengompilasi data dari server Google...</i></div>`;
    container.scrollTop = container.scrollHeight;
    
    // Pemanggilan Endpoint Gemini 1.5 Flash (Paling Mutakhir)
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: geminiHistory })
        });
        
        const data = await response.json();
        document.getElementById("ai-thinking").remove();
        
        if(response.ok && data.candidates && data.candidates.length > 0) {
            let aiText = data.candidates[0].content.parts[0].text;
            geminiHistory.push({ role: "model", parts: [{ text: aiText }] });
        } else {
            let errMsg = data.error ? data.error.message : "Respons tidak dikenal dari Node Eksternal.";
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Otorisasi API Gagal:** " + errMsg }] });
        }
        
        saveChatHistory();
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Timeout Koneksi:** Gagal menghubungi server AI. (Error Log: " + err.message + ")" }] });
        saveChatHistory();
        renderAIHistory();
    }
}
