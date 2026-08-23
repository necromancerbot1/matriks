// === LOGIKA AI TUTOR (Integrasi Google Gemini API) ===

// ⚠️ PENTING: Anda harus menempelkan API KEY GEMINI Anda di bawah ini
// Dapatkan gratis di: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "MASUKKAN_API_KEY_ANDA_DISINI"; 

let geminiHistory = [
    { role: "user", parts: [{ text: "Anda adalah ZeroBot, asisten AI terintegrasi di sistem Zero Matriks. Anda ahli dalam matematika dan aljabar linear. Jawablah pertanyaan pengguna dengan ringkas, ramah, dan sangat profesional menggunakan bahasa Indonesia. Jangan pernah bilang Anda AI bahasa dari Google." }] },
    { role: "model", parts: [{ text: "Siap, saya mengerti. Saya adalah ZeroBot, AI Tutor Aljabar Linear Anda. Saya siap membantu Anda menguasai matriks dan perhitungan matematis." }] }
];

function renderGeminiUI(c) {
    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">🤖 AI Tutor (ZeroBot)</h2>
        <div class="method-desc">Sistem kecerdasan buatan terintegrasi Gemini API. Tanyakan materi, penjelasan rumus, atau konsep komputasi matriks langsung kepada Asisten Virtual Anda di sini.</div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-base); border:1px solid #a855f7; box-shadow:0 0 15px rgba(168, 85, 247, 0.15);">
            <div class="chat-header" style="background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);">
                <span style="font-size:1.1em; font-weight:500; color:var(--text-secondary);">Status Modul AI: <b style="color:#a855f7; font-weight:700;">🟢 Online (Gemini 1.5 Flash)</b></span>
            </div>
            
            <div id="ai-chat-messages" class="chat-messages" style="flex:1; overflow-y:auto; padding:25px; display:flex; flex-direction:column; gap:15px;">
                <p style="color:var(--text-secondary); text-align:center; font-style:italic;">Membangunkan Asisten Virtual...</p>
            </div>
            
            <div class="chat-input-box" style="padding:15px; background:var(--bg-surface); border-top:1px solid var(--border-subtle); display:flex; gap:10px;">
                <input type="text" id="ai-chat-input" placeholder="Tanyakan materi (misal: Tolong jelaskan Vektor Eigen)..." style="flex:1; padding:12px 15px; font-size:1.05em; border-radius:8px; border:1px solid var(--border-subtle); background:var(--bg-base); color:var(--text-primary);" onkeydown="if(event.key==='Enter') sendAIPrompt()">
                <button class="primary-btn" style="background-color:#a855f7;" onclick="sendAIPrompt()">Kirim Query</button>
            </div>
        </div>
        <div style="margin-top:15px; font-size:0.85em; color:var(--accent-warning);">
            *Catatan Developer: Jika bot error, pastikan Anda telah menempelkan kunci <b>GEMINI_API_KEY</b> Anda yang asli di dalam baris kode file <code>gemini.js</code>.
        </div>
    `;
    renderAIHistory();
}

function renderAIHistory() {
    let container = document.getElementById("ai-chat-messages");
    if(!container) return;
    
    let html = "";
    // Mulai dari index 1 (skip prompt instruksi di index 0)
    for(let i = 1; i < geminiHistory.length; i++) {
        let msg = geminiHistory[i];
        let isUser = msg.role === "user";
        let bubbleClass = isUser ? "msg-bubble outgoing" : "msg-bubble incoming";
        let senderName = isUser ? currentUserData.name : "ZeroBot 🤖";
        
        let text = msg.parts[0].text;
        // Pengecekan spasi dan baris untuk tampilan rapi
        text = text.replace(/\*\*(.*?)\*\*/g, '<b style="color:#a855f7;">$1</b>');
        text = text.replace(/\n/g, '<br>');
        
        let bgColor = isUser ? "background-color:var(--brand-main);" : "background-color:var(--bg-surface);";
        
        html += `<div class="${bubbleClass}" style="${bgColor}">
                    <span class="msg-sender" style="font-size:0.8em; opacity:0.8; margin-bottom:6px; display:block;">${senderName}</span>
                    <div style="line-height:1.6; font-size:0.95em;">${text}</div>
                 </div>`;
    }
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

async function sendAIPrompt() {
    let inputEl = document.getElementById('ai-chat-input');
    let text = inputEl.value.trim();
    if(!text) return;
    
    inputEl.value = "";
    
    // 1. Tampilkan pertanyaan pengguna ke layar
    geminiHistory.push({ role: "user", parts: [{ text: text }] });
    renderAIHistory();
    
    let container = document.getElementById("ai-chat-messages");
    container.innerHTML += `<div class="msg-bubble incoming" id="ai-thinking" style="background-color:var(--bg-surface); border:1px solid #a855f7;"><span class="msg-sender">ZeroBot 🤖</span><i style="color:var(--text-secondary);">Sedang menganalisis pertanyaan Anda...</i></div>`;
    container.scrollTop = container.scrollHeight;
    
    // 2. Cek apakah API Key sudah diisi oleh Anda
    if(GEMINI_API_KEY === "MASUKKAN_API_KEY_ANDA_DISINI" || GEMINI_API_KEY === "") {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Sistem Menolak:** Kredensial API Key Gemini kosong. Developer harap memasukkan API Key di file `gemini.js`." }] });
        renderAIHistory();
        return;
    }

    // 3. Menghubungi Server Google Gemini
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: geminiHistory })
        });
        
        const data = await response.json();
        document.getElementById("ai-thinking").remove();
        
        if(data.candidates && data.candidates.length > 0) {
            let aiText = data.candidates[0].content.parts[0].text;
            geminiHistory.push({ role: "model", parts: [{ text: aiText }] });
        } else {
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Sistem Error:** Respons dari server AI tidak valid." }] });
        }
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Koneksi Terputus:** Gagal menjangkau server AI. Error: " + err.message }] });
        renderAIHistory();
    }
}