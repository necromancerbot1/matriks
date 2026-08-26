// === LOGIKA AI TUTOR (Integrasi Google Gemini API) ===

// API Key Anda sudah ditanamkan di sini:
const GEMINI_API_KEY = "."; 

// Prompt dasar agar AI bisa menjawab topik apa saja dengan persona akademis
const systemPrompt = [
    { role: "user", parts: [{ text: "Anda adalah ZeroBot, asisten virtual akademis yang tertanam pada antarmuka sistem Zero Matriks. Meskipun keahlian utama Anda adalah matematika dan aljabar linear, Anda diizinkan untuk menjawab pertanyaan apa pun dari pengguna di luar topik matematika (termasuk sains, pemrograman, umum, dsb). Jawablah semua instruksi pengguna dengan lugas, akurat, dan sangat profesional menggunakan bahasa Indonesia. Jangan pernah bilang Anda adalah AI bahasa buatan Google." }] },
    { role: "model", parts: [{ text: "Instruksi diterima. Identitas disetel sebagai ZeroBot. Saya siap membantu entitas pengguna untuk menguraikan permasalahan matematis, komputasi matriks, maupun menjawab pertanyaan lintas disiplin ilmu dengan profesional." }] }
];

// Array riwayat chat dinamis
let geminiHistory = [];

// Fungsi untuk memuat riwayat chat dari Local Storage browser
function loadChatHistory() {
    let savedHistory = localStorage.getItem("zeroBotHistory");
    if(savedHistory) {
        geminiHistory = JSON.parse(savedHistory);
    } else {
        geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
    }
}

// Fungsi untuk menyimpan riwayat chat ke Local Storage browser
function saveChatHistory() {
    localStorage.setItem("zeroBotHistory", JSON.stringify(geminiHistory));
}

// Fungsi untuk menghapus riwayat chat (Tombol Tong Sampah)
window.clearAIHistory = function() {
    if(confirm("Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dengan ZeroBot?")) {
        localStorage.removeItem("zeroBotHistory");
        geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
        renderAIHistory();
    }
}

function renderGeminiUI(c) {
    loadChatHistory(); // Muat memori saat antarmuka dibuka
    
    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">🤖 Modul AI Tutor (ZeroBot)</h2>
        <div class="method-desc">Sistem kecerdasan buatan berbasis *Large Language Model*. Ajukan instruksi, konsep komputasi, atau topik apa pun untuk dibahas bersama sistem.</div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-base); border:1px solid #a855f7; box-shadow:0 0 15px rgba(168, 85, 247, 0.15);">
            <div class="chat-header" style="background:var(--bg-surface); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1.1em; font-weight:500; color:var(--text-secondary);">Status Modul Engine: <b style="color:#a855f7; font-weight:700;">🟢 Online (API Ready)</b></span>
                <!-- INI DIA TOMBOL TONG SAMPAHNYA -->
                <button onclick="clearAIHistory()" style="background:transparent; border:none; color:var(--accent-danger); font-size:1.4em; cursor:pointer; padding:0 5px;" title="Hapus Riwayat Obrolan">🗑️</button>
            </div>
            
            <div id="ai-chat-messages" class="chat-messages" style="flex:1; overflow-y:auto; padding:25px; display:flex; flex-direction:column; gap:15px;">
                <!-- Pesan akan dimuat lewat renderAIHistory() -->
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
    // Mulai dari indeks 2 untuk menyembunyikan 2 pesan instruksi awal bot
    for(let i = 2; i < geminiHistory.length; i++) {
        let msg = geminiHistory[i];
        let isUser = msg.role === "user";
        let bubbleClass = isUser ? "msg-bubble outgoing" : "msg-bubble incoming";
        let senderName = isUser ? currentUserData.name : "ZeroBot 🤖";
        
        let text = msg.parts[0].text;
        
        // Membersihkan format Markdown yang dikirim Google menjadi HTML
        text = text.replace(/\*\*(.*?)\*\*/g, '<b style="color:#a855f7;">$1</b>');
        text = text.replace(/\n/g, '<br>');
        
        let bgColor = isUser ? "background-color:var(--brand-main);" : "background-color:var(--bg-surface); border:1px solid var(--border-subtle);";
        
        html += `<div class="${bubbleClass}" style="${bgColor}">
                    <span class="msg-sender" style="font-size:0.8em; opacity:0.8; margin-bottom:6px; display:block; color:var(--text-primary);">${senderName}</span>
                    <div style="line-height:1.6; font-size:0.95em; color:var(--text-primary);">${text}</div>
                 </div>`;
    }
    
    // Tampilkan pesan kosong jika belum ada interaksi pengguna
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
    
    // Tampilkan pesan user ke layar dan simpan
    geminiHistory.push({ role: "user", parts: [{ text: text }] });
    saveChatHistory();
    renderAIHistory();
    
    let container = document.getElementById("ai-chat-messages");
    container.innerHTML += `<div class="msg-bubble incoming" id="ai-thinking" style="background-color:var(--bg-surface); border:1px solid #a855f7;"><span class="msg-sender">ZeroBot 🤖</span><i style="color:var(--text-secondary);">Mengompilasi data dari server Google...</i></div>`;
    container.scrollTop = container.scrollHeight;
    
    // Keamanan Mutlak: Cek eksistensi Key
    if(GEMINI_API_KEY === "" || !GEMINI_API_KEY) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Sistem Menolak:** Kredensial API Key Gemini kosong. Developer harap memasukkan API Key di file `gemini.js` baris ke-4." }] });
        saveChatHistory();
        renderAIHistory();
        return;
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: geminiHistory })
        });
        
        const data = await response.json();
        document.getElementById("ai-thinking").remove();
        
        // Evaluasi Respon Server Google
        if(response.ok && data.candidates && data.candidates.length > 0) {
            let aiText = data.candidates[0].content.parts[0].text;
            geminiHistory.push({ role: "model", parts: [{ text: aiText }] });
        } else {
            let errMsg = data.error ? data.error.message : "Respons tidak dikenal dari Node Eksternal.";
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Otorisasi API Gagal:** " + errMsg + "<br><br>*(Pesan Developer: Pastikan API Key yang dimasukkan valid dan fitur Gemini API sudah diaktifkan di Google Cloud Console untuk project Anda)*" }] });
        }
        
        saveChatHistory(); // Simpan riwayat terbaru setelah AI merespons
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Timeout Koneksi:** Gagal menghubungi server AI. Pastikan perangkat memiliki koneksi internet. (Error Log: " + err.message + ")" }] });
        saveChatHistory();
        renderAIHistory();
    }
}
