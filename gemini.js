// === LOGIKA AI TUTOR DENGAN SOFT UI & ENKRIPSI KUNCI (BASE64) ===

// API Key "AQ.Ab8RN6LcPbtufzbbzA6zGh9gGIZCLvTlvqYlE7KIcZkBLQdJhw" di-encode ke Base64
const ENCODED_KEY = "QVEuQWI4Uk42TGNQYnR1ZnpiYnpBNnpHaDlnR0laQ0x2VGx2cVlsRTdLSWNaa0JMUWRKaHc="; 
const GEMINI_API_KEY = atob(ENCODED_KEY); 

const systemPrompt = [
    { role: "user", parts: [{ text: "Anda adalah Asisten Akademik, sistem pendamping virtual elegan pada platform Zero Matriks. Meskipun keahlian utama Anda adalah matematika dan aljabar linear, Anda sangat ramah dan diizinkan menjawab pertanyaan apa pun di luar matematika. Jawablah dengan bahasa Indonesia yang sangat profesional, suportif, dan mudah dipahami. Gunakan format yang rapi. Jangan pernah menyebutkan bahwa Anda adalah AI buatan Google." }] },
    { role: "model", parts: [{ text: "Tentu. Saya adalah Asisten Akademik Anda di Zero Matriks. Saya siap membantu Anda menganalisis komputasi matematika, mengeksplorasi ilmu sains, maupun menjawab berbagai pertanyaan umum dengan gaya yang elegan dan profesional." }] }
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
    if(confirm("Apakah Anda ingin menyetel ulang seluruh percakapan dengan Asisten Akademik?")) {
        localStorage.removeItem("zeroBotHistory");
        geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
        renderAIHistory();
    }
}

function renderGeminiUI(c) {
    loadChatHistory();
    
    // Perubahan UI yang drastis: Menggunakan soft border, gradasi bayangan, dan rounded corners
    c.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
                <h2 style="font-size:1.8em; margin:0; font-weight:600; color:var(--text-primary);">✨ Asisten Akademik</h2>
                <div style="color:var(--text-secondary); font-size:0.95em; margin-top:5px;">Rekan diskusi virtual untuk analisis matematis dan eksplorasi ilmu pengetahuan.</div>
            </div>
            <button onclick="clearAIHistory()" style="background:var(--bg-surface); border:1px solid var(--border-subtle); padding:10px 15px; border-radius:12px; color:var(--accent-danger); font-size:1em; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.3s; box-shadow:0 2px 10px rgba(0,0,0,0.1);" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='var(--bg-surface)'">
                🗑️ <span style="font-weight:500; font-size:0.9em;">Reset Diskusi</span>
            </button>
        </div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-surface); border:1px solid rgba(255,255,255,0.05); border-radius:20px; box-shadow:0 8px 30px rgba(0,0,0,0.2); display:flex; flex-direction:column;">
            
            <div id="ai-chat-messages" style="flex:1; overflow-y:auto; padding:30px; display:flex; flex-direction:column; gap:20px; background:var(--bg-base);">
                <!-- Pesan akan dimuat di sini -->
            </div>
            
            <div style="padding:20px; background:var(--bg-surface); border-top:1px solid rgba(255,255,255,0.05); display:flex; gap:12px; align-items:center;">
                <input type="text" id="ai-chat-input" placeholder="Ketik pertanyaan atau instruksi Anda di sini..." style="flex:1; padding:15px 20px; font-size:1.05em; border-radius:16px; border:1px solid var(--border-subtle); background:var(--bg-base); color:var(--text-primary); transition:0.3s;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='var(--border-subtle)'" onkeydown="if(event.key==='Enter') sendAIPrompt()">
                <button onclick="sendAIPrompt()" style="background:linear-gradient(135deg, #3b82f6, #2563eb); border:none; padding:15px 25px; border-radius:16px; color:#fff; font-weight:600; font-size:1.05em; cursor:pointer; transition:0.3s; box-shadow:0 4px 15px rgba(59,130,246,0.3);">Kirim</button>
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
        
        let senderName = isUser ? currentUserData.name : "✨ Asisten Zero";
        let alignSelf = isUser ? "align-self:flex-end;" : "align-self:flex-start;";
        let bgColor = isUser ? "background:linear-gradient(135deg, #3b82f6, #2563eb); color:#ffffff; box-shadow:0 4px 15px rgba(59,130,246,0.25);" : "background:#1e293b; color:#f8fafc; border:1px solid rgba(255,255,255,0.06); box-shadow:0 4px 15px rgba(0,0,0,0.15);";
        let borderRadius = isUser ? "border-radius:20px 20px 4px 20px;" : "border-radius:20px 20px 20px 4px;";
        
        let text = msg.parts[0].text;
        text = text.replace(/\*\*(.*?)\*\*/g, '<b style="color:#93c5fd;">$1</b>');
        text = text.replace(/\n/g, '<br>');
        
        html += `<div style="max-width:80%; padding:16px 22px; font-size:0.95em; line-height:1.6; ${alignSelf} ${bgColor} ${borderRadius}">
                    <span style="font-size:0.8em; opacity:0.8; margin-bottom:8px; display:block; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">${senderName}</span>
                    <div>${text}</div>
                 </div>`;
    }
    
    if(geminiHistory.length <= 2) {
        html = `<div style="text-align:center; margin:auto; color:var(--text-secondary); opacity:0.7;">
                    <div style="font-size:3em; margin-bottom:15px;">✨</div>
                    <p style="font-size:1.1em; font-weight:500;">Ruang Diskusi Kosong</p>
                    <p style="font-size:0.9em;">Kirimkan pesan pertama Anda untuk memulai eksplorasi.</p>
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
    geminiHistory.push({ role: "user", parts: [{ text: text }] });
    saveChatHistory();
    renderAIHistory();
    
    let container = document.getElementById("ai-chat-messages");
    container.innerHTML += `<div id="ai-thinking" style="max-width:80%; padding:16px 22px; font-size:0.95em; align-self:flex-start; background:#1e293b; color:var(--text-secondary); border:1px solid rgba(255,255,255,0.06); border-radius:20px 20px 20px 4px; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                                <span style="font-size:0.8em; opacity:0.8; margin-bottom:8px; display:block; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">✨ Asisten Zero</span>
                                <i>Menganalisis data...</i>
                            </div>`;
    container.scrollTop = container.scrollHeight;
    
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
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
            let errMsg = data.error ? data.error.message : "Sistem gagal memvalidasi respons.";
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Interupsi Komunikasi:** " + errMsg }] });
        }
        
        saveChatHistory();
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Timeout Koneksi:** Gagal merespons. Periksa koneksi internet Anda. (" + err.message + ")" }] });
        saveChatHistory();
        renderAIHistory();
    }
}
