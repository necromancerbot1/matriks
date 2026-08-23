// === LOGIKA AI TUTOR (Integrasi Google Gemini API) ===

// ⚠️ GANTI TEKS DI BAWAH INI DENGAN API KEY DARI GOOGLE AI STUDIO
const GEMINI_API_KEY = "AQ.Ab8RN6LcPbtufzbbzA6zGh9gGIZCLvTlvqYlE7KIcZkBLQdJhw"; 

let geminiHistory = [
    { role: "user", parts: [{ text: "Anda adalah ZeroBot, asisten virtual akademis yang tertanam pada antarmuka sistem Zero Matriks. Anda ahli dalam matematika dan komputasi aljabar linear. Jawablah instruksi pengguna dengan lugas, akurat, dan sangat profesional menggunakan bahasa Indonesia. Jangan pernah bilang Anda adalah AI bahasa buatan Google." }] },
    { role: "model", parts: [{ text: "Instruksi diterima. Identitas disetel sebagai ZeroBot. Saya siap membantu entitas pengguna untuk menguraikan permasalahan matematis dan komputasi matriks." }] }
];

function renderGeminiUI(c) {
    c.innerHTML = `
        <h2 style="font-size:1.6em; margin-top:0;">🤖 Modul AI Tutor (ZeroBot)</h2>
        <div class="method-desc">Sistem kecerdasan buatan berbasis *Large Language Model*. Ajukan instruksi, konsep komputasi, atau analisis algoritma matriks untuk diverifikasi oleh sistem.</div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-base); border:1px solid #a855f7; box-shadow:0 0 15px rgba(168, 85, 247, 0.15);">
            <div class="chat-header" style="background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);">
                <span style="font-size:1.1em; font-weight:500; color:var(--text-secondary);">Status Modul Engine: <b style="color:#a855f7; font-weight:700;">🟢 Online (API Ready)</b></span>
            </div>
            
            <div id="ai-chat-messages" class="chat-messages" style="flex:1; overflow-y:auto; padding:25px; display:flex; flex-direction:column; gap:15px;">
                <!-- Pesan akan dimuat lewat renderAIHistory() -->
            </div>
            
            <div class="chat-input-box" style="padding:15px; background:var(--bg-surface); border-top:1px solid var(--border-subtle); display:flex; gap:10px;">
                <input type="text" id="ai-chat-input" placeholder="Input prompt analisis (misal: Jabarkan logika Gauss-Jordan)..." style="flex:1; padding:12px 15px; font-size:1.05em; border-radius:8px; border:1px solid var(--border-subtle); background:var(--bg-base); color:var(--text-primary);" onkeydown="if(event.key==='Enter') sendAIPrompt()">
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
    // Mulai dari indeks 1 untuk menyembunyikan instruksi parameter sistem (System Prompt)
    for(let i = 1; i < geminiHistory.length; i++) {
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
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

async function sendAIPrompt() {
    let inputEl = document.getElementById('ai-chat-input');
    let text = inputEl.value.trim();
    if(!text) return;
    
    inputEl.value = "";
    
    // Tampilkan pesan user ke layar
    geminiHistory.push({ role: "user", parts: [{ text: text }] });
    renderAIHistory();
    
    let container = document.getElementById("ai-chat-messages");
    container.innerHTML += `<div class="msg-bubble incoming" id="ai-thinking" style="background-color:var(--bg-surface); border:1px solid #a855f7;"><span class="msg-sender">ZeroBot 🤖</span><i style="color:var(--text-secondary);">Mengompilasi data dari server Google...</i></div>`;
    container.scrollTop = container.scrollHeight;
    
    // Peringatan jika API Key belum diubah
    if(GEMINI_API_KEY === "MASUKKAN_KUNCI_API_BARU_ANDA_DI_SINI" || GEMINI_API_KEY === "") {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Sistem Menolak:** Kredensial API Key Gemini belum dikonfigurasi. Developer harap memasukkan API Key di file `gemini.js` baris ke-4." }] });
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
        
        // Cek Keberhasilan Pemanggilan API
        if(response.ok && data.candidates && data.candidates.length > 0) {
            let aiText = data.candidates[0].content.parts[0].text;
            geminiHistory.push({ role: "model", parts: [{ text: aiText }] });
        } else {
            let errMsg = data.error ? data.error.message : "Respons tidak dikenal dari Node Eksternal.";
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Otorisasi API Gagal:** " + errMsg + "<br><br>*(Pesan Developer: Pastikan API Key yang dimasukkan valid dan fitur Gemini API sudah diaktifkan di Google Cloud Console untuk project Anda)*" }] });
        }
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Timeout Koneksi:** Gagal menghubungi server AI. Pastikan perangkat memiliki koneksi internet. (Error Log: " + err.message + ")" }] });
        renderAIHistory();
    }
}
