// === BUKU REFERENSI MATERI ALDABAR LINEAR ===

function renderMateriUI(c) {
    c.innerHTML = `
        <div style="max-width:1100px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:50px;">
                <h2 style="font-size:2.2em; font-weight:700; margin-bottom:10px;">📚 Perpustakaan Referensi</h2>
                <p style="color:var(--text-secondary); font-size:1.15em;">Silabus terstruktur untuk komputasi matriks berdasarkan tingkatan akademik.</p>
            </div>
            
            <div class="book-grid">
                <!-- BUKU 1 -->
                <div class="book-card" style="--card-color: var(--accent-success);">
                    <h3 style="color:var(--text-primary); margin-top:0; font-size:1.4em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px; margin-bottom:20px;">Fundamental Matriks</h3>
                    <div style="background:rgba(16, 185, 129, 0.1); color:var(--accent-success); font-size:0.8em; font-weight:700; padding:6px 12px; border-radius:8px; display:inline-block; margin-bottom:20px;">MODUL TINGKAT DASAR</div>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:25px; line-height:1.6;">Pengenalan arsitektur matriks, indeks baris/kolom, serta eksekusi operasi aritmatika penjumlahan dan pengurangan.</p>
                    <div style="background:rgba(15,23,42,0.4); padding:20px; border-radius:12px; font-family:monospace; color:var(--text-primary); font-size:0.9em; line-height:1.6;">
                        <b style="color:var(--accent-success);">[ Syarat Penjumlahan ]</b><br>
                        Ordo matriks A harus = Ordo B.<br>
                        [a b] + [e f] = [a+e b+f]<br><br>
                        <b style="color:var(--accent-success);">[ Skalabilitas ]</b><br>
                        k * [a b] = [ka kb]
                    </div>
                </div>

                <!-- BUKU 2 -->
                <div class="book-card" style="--card-color: var(--brand-main);">
                    <h3 style="color:var(--text-primary); margin-top:0; font-size:1.4em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px; margin-bottom:20px;">Aljabar Linear Intermediat</h3>
                    <div style="background:rgba(59, 130, 246, 0.1); color:var(--brand-main); font-size:0.8em; font-weight:700; padding:6px 12px; border-radius:8px; display:inline-block; margin-bottom:20px;">MODUL TINGKAT MENENGAH</div>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:25px; line-height:1.6;">Logika pemrosesan Sistem Persamaan, kalkulasi Determinan 2x2, serta abstraksi struktur dasar Aturan Cramer.</p>
                    <div style="background:rgba(15,23,42,0.4); padding:20px; border-radius:12px; font-family:monospace; color:var(--text-primary); font-size:0.9em; line-height:1.6;">
                        <b style="color:var(--brand-main);">[ Determinan Ordo 2x2 ]</b><br>
                        A = [a b; c d]<br>
                        Det(A) = (a*d) - (b*c)<br><br>
                        <b style="color:var(--brand-main);">[ Perkalian Matriks ]</b><br>
                        Kolom (A) = Baris (B)
                    </div>
                </div>

                <!-- BUKU 3 -->
                <div class="book-card" style="--card-color: var(--accent-danger);">
                    <h3 style="color:var(--text-primary); margin-top:0; font-size:1.4em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px; margin-bottom:20px;">Komputasi Matriks Lanjut</h3>
                    <div style="background:rgba(239, 68, 68, 0.1); color:var(--accent-danger); font-size:0.8em; font-weight:700; padding:6px 12px; border-radius:8px; display:inline-block; margin-bottom:20px;">MODUL UNIVERSITAS</div>
                    <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:25px; line-height:1.6;">Algoritma tinggi Eselon Baris (RREF), Vektor Eigen, serta Dekomposisi Rank Matriks berdimensi m x n.</p>
                    <div style="background:rgba(15,23,42,0.4); padding:20px; border-radius:12px; font-family:monospace; color:var(--text-primary); font-size:0.9em; line-height:1.6;">
                        <b style="color:var(--accent-danger);">[ Gauss-Jordan / RREF ]</b><br>
                        Reduksi matriks augmented (A|B) murni menjadi I|X untuk mencari himpunan tak hingga.<br><br>
                        <b style="color:var(--accent-danger);">[ Dekomposisi Rank ]</b><br>
                        Mengukur independensi linear baris.
                    </div>
                </div>
            </div>
        </div>`;
}