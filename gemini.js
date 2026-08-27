// === LOGIKA SISTEM PAKAR (ASISTEN AKADEMIK) ===

// Mengenkripsi kunci API
const ENCODED_KEY = "QVEuQWI4Uk42TGNQYnR1ZnpiYnpBNnpHaDlnR0laQ0x2VGx2cVlsRTdLSWNaa0JMUWRKaHc="; 
const GEMINI_API_KEY = atob(ENCODED_KEY); 

const systemPrompt = [
    { role: "user", parts: [{ text: "Mulai saat ini, Anda adalah Asisten Akademik, sebuah modul sistem pakar yang tertanam secara native pada platform Zero Matriks. Anda dilarang keras menyebut diri Anda sebagai AI, Bot, Program, Asisten Virtual, ChatGPT, atau produk buatan Google. Jika ditanya identitas, Anda adalah 'Modul Sistem Pakar Zero Matriks'. Jawablah setiap pertanyaan menggunakan bahasa Indonesia formal yang sangat elegan, profesional, berpendidikan, dan mudah dimengerti. Keahlian utama Anda adalah kalkulasi matematika dan komputasi sains, tetapi Anda bebas merespons topik ilmu pengetahuan lain." }] },
    { role: "model", parts: [{ text: "Instruksi otorisasi diterima. Saya adalah Modul Sistem Pakar Zero Matriks. Saya telah menyelaraskan protokol komunikasi saya untuk memberikan analisis akademik, komputasi matematis, dan eksplorasi ilmu pengetahuan secara profesional dan elegan. Saya siap menerima parameter data dari Anda." }] }
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
    ZeroModal.confirm("Sistem akan melakukan pembersihan memori (Wipe). Seluruh rekaman diskusi, kalkulasi, dan analisis sebelumnya akan dihapus secara absolut. Lanjutkan proses Wipe?", function(res) {
        if(res) {
            localStorage.removeItem("zeroBotHistory");
            geminiHistory = JSON.parse(JSON.stringify(systemPrompt));
            renderAIHistory();
            ZeroModal.alert("Pembersihan memori selesai. Ruang diskusi analitik telah dikosongkan.");
        }
    });
}

function renderGeminiUI(c) {
    loadChatHistory();
    
    c.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; background:var(--bg-surface); padding:20px 30px; border-radius:16px; border:1px solid var(--border-subtle); box-shadow:0 10px 20px rgba(0,0,0,0.1);">
            <div>
                <h2 style="font-size:1.8em; margin:0; font-weight:700; color:var(--text-primary);">✨ Modul Sistem Pakar</h2>
                <div style="color:var(--text-secondary); font-size:1em; margin-top:5px;">Sistem pendukung untuk analisis komputasi dan pemecahan masalah multidisiplin.</div>
            </div>
            <button class="secondary-btn" onclick="clearAIHistory()" style="border-radius:12px; padding:12px 20px; color:var(--accent-danger); font-weight:600; border:1px solid rgba(239, 68, 68, 0.3);">
                🧹 Bersihkan Memori Diskusi
            </button>
        </div>
        
        <div class="chat-container" style="height: 550px; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:24px; box-shadow:inset 0 2px 15px rgba(0,0,0,0.15); display:flex; flex-direction:column;">
            
            <div id="ai-chat-messages" style="flex:1; overflow-y:auto; padding:30px; display:flex; flex-direction:column; gap:20px; background:var(--bg-base);">
                <!-- Pesan akan dimuat di sini -->
            </div>
            
            <div style="padding:20px; background:var(--bg-surface); border-top:1px solid var(--border-subtle); display:flex; gap:15px; align-items:center;">
                <input type="text" id="ai-chat-input" placeholder="Ajukan topik diskusi atau input parameter matematis di sini..." style="flex:1; padding:16px 20px; font-size:1.05em; border-radius:16px; border:1px solid var(--border-subtle); background:rgba(15,23,42,0.4); color:var(--text-primary);" onkeydown="if(event.key==='Enter') sendAIPrompt()">
                <button onclick="sendAIPrompt()" class="primary-btn" style="padding:16px 30px; border-radius:16px; font-size:1.05em;">Eksekusi Sistem</button>
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
        
        let senderName = isUser ? currentUserData.name : "✨ Modul Pakar Zero";
        let alignSelf = isUser ? "align-self:flex-end;" : "align-self:flex-start;";
        let bgColor = isUser ? "background:linear-gradient(135deg, #3b82f6, #2563eb); color:#ffffff; box-shadow:0 4px 15px rgba(59,130,246,0.25);" : "background:rgba(30, 41, 59, 0.8); color:var(--text-primary); border:1px solid var(--border-subtle); box-shadow:0 4px 15px rgba(0,0,0,0.1);";
        let borderRadius = isUser ? "border-radius:20px 20px 4px 20px;" : "border-radius:20px 20px 20px 4px;";
        
        let text = msg.parts[0].text;
        
        // Membersihkan format Bintang
        text = text.replace(/\*\*(.*?)\*\*/g, '<b style="color:var(--brand-main);">$1</b>');
        text = text.replace(/\n/g, '<br>');
        
        html += `<div style="max-width:80%; padding:18px 24px; font-size:0.95em; line-height:1.7; ${alignSelf} ${bgColor} ${borderRadius}">
                    <span style="font-size:0.8em; opacity:0.8; margin-bottom:10px; display:block; font-weight:700; text-transform:uppercase; letter-spacing:1px;">${senderName}</span>
                    <div>${text}</div>
                 </div>`;
    }
    
    if(geminiHistory.length <= 2) {
        html = `
            <div style="text-align:center; margin:auto; color:var(--text-secondary); opacity:0.7;">
                <div style="font-size:3.5em; margin-bottom:15px; filter:drop-shadow(0 0 10px rgba(59,130,246,0.3));">✨</div>
                <p style="font-size:1.2em; font-weight:600; margin:0 0 5px 0;">Modul Analitik Online</p>
                <p style="font-size:0.95em;">Memori cache dalam keadaan bersih. Silakan masukkan input pertama Anda.</p>
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
    container.innerHTML += `
        <div id="ai-thinking" style="max-width:80%; padding:18px 24px; font-size:0.95em; align-self:flex-start; background:rgba(30, 41, 59, 0.8); color:var(--text-secondary); border:1px solid var(--border-subtle); border-radius:20px 20px 20px 4px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            <span style="font-size:0.8em; opacity:0.8; margin-bottom:10px; display:block; font-weight:700; text-transform:uppercase; letter-spacing:1px;">✨ Modul Pakar Zero</span>
            <i style="animation:pulse 1.5s infinite;">Sistem sedang mengkompilasi data analitik pusat...</i>
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
            let errMsg = data.error ? data.error.message : "Sistem pusat menolak permintaan data karena format tidak valid.";
            geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Interupsi Komunikasi:** " + errMsg }] });
        }
        
        saveChatHistory(); 
        renderAIHistory();
        
    } catch(err) {
        document.getElementById("ai-thinking").remove();
        geminiHistory.push({ role: "model", parts: [{ text: "⚠️ **Timeout Sinkronisasi:** Gagal menyinkronkan data dengan server pusat. Silakan periksa stabilitas koneksi internet Anda. (" + err.message + ")" }] });
        saveChatHistory(); 
        renderAIHistory();
    }
}