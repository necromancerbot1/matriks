// === BUKU REFERENSI MATERI ALDABAR LINEAR ===
function renderMateriUI(c) {
    c.innerHTML = `
        <div style="max-width:850px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="font-size:2em; font-weight:500; margin-bottom:10px;">📚 Buku Referensi Matriks</h2>
                <p style="color:var(--text-secondary); font-size:1.1em;">Silabus terstruktur untuk komputasi matriks berdasarkan tingkatan akademik.</p>
            </div>
            <div class="data-card" style="border-left:5px solid var(--accent-success); margin-bottom:30px;">
                <h3 style="color:var(--accent-success); margin-top:0; font-size:1.3em;">■ Modul Fundamental (Dasar/SMP)</h3>
                <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:20px;">Pengenalan arsitektur matriks, indeks baris/kolom, serta eksekusi operasi aritmatika dasar.</p>
                <div style="background:var(--bg-base); padding:20px; border-radius:8px; border:1px solid var(--border-subtle); font-family:monospace; color:var(--text-primary); font-size:0.95em; overflow-x:auto;">
                    <b style="color:var(--brand-main);">[1] Kondisi Penjumlahan & Pengurangan:</b><br>Operasi komputasi valid eksklusif jika kedua matriks memiliki dimensi ordo (m x n) yang setara.<br><br>
                    <span style="opacity:0.8;">[ a  b ]   [ e  f ]     [ a+e  b+f ]</span><br><span style="opacity:0.8;">[ c  d ] + [ g  h ]  =  [ c+g  d+h ]</span><br><br>
                    <b style="color:var(--brand-main);">[2] Skalabilitas Matriks:</b><br>Fungsi skalar di mana suatu bilangan konstanta (k) dikalikan merata pada setiap komponen elemen matriks.<br><br><span style="opacity:0.8;">k * [ a  b ] = [ ka  kb ]</span>
                </div>
            </div>
            <div class="data-card" style="border-left:5px solid var(--brand-main); margin-bottom:30px;">
                <h3 style="color:var(--brand-main); margin-top:0; font-size:1.3em;">■ Modul Intermediat (Menengah/SMA)</h3>
                <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:20px;">Logika pemrosesan Sistem Persamaan Linear, kalkulasi nilai Determinan, pembentukan matriks Invers dan rasio Aturan Cramer.</p>
                <div style="background:var(--bg-base); padding:20px; border-radius:8px; border:1px solid var(--border-subtle); font-family:monospace; color:var(--text-primary); font-size:0.95em; overflow-x:auto;">
                    <b style="color:var(--accent-warning);">[1] Fungsi Determinan Ordo 2x2:</b><br><span style="opacity:0.8;">A = [ a  b ]  -->  Det(A) = (a * d) - (b * c)</span><br><br>
                    <b style="color:var(--accent-warning);">[2] Persamaan Invers Matriks 2x2:</b><br><span style="opacity:0.8;">A^-1 =  1 / Det(A) * [  d  -b ]</span><br><span style="opacity:0.8;">                     [ -c   a ]</span><br><br>
                    <b style="color:var(--accent-warning);">[3] Syarat Perkalian Dua Matriks:</b><br>Dimensi kolom pada matriks pertama harus kongruen dengan baris matriks kedua (Ordo: m x n * n x p = m x p).
                </div>
            </div>
            <div class="data-card" style="border-left:5px solid var(--accent-danger); margin-bottom:30px;">
                <h3 style="color:var(--accent-danger); margin-top:0; font-size:1.3em;">■ Modul Analisis Lanjut (Universitas)</h3>
                <p style="color:var(--text-secondary); font-size:0.95em; margin-bottom:20px;">Operasi algoritma lanjut menggunakan metode Eselon Baris, Evaluasi Vektor Eigen (Eigenvectors), serta analisis matriks multi-dimensi.</p>
                <div style="background:var(--bg-base); padding:20px; border-radius:8px; border:1px solid var(--border-subtle); font-family:monospace; color:var(--text-primary); font-size:0.95em; overflow-x:auto;">
                    <b style="color:var(--accent-success);">[1] Eliminasi Gauss-Jordan (Pola RREF):</b><br>Metodologi pengubahan matriks augmented menjadi bentuk Eselon Baris Tereduksi. Sangat efisien untuk mencari himpunan penyelesaian tak hingga.<br><br>
                    <b style="color:var(--accent-success);">[2] Persamaan Vektor Eigen:</b><br><span style="opacity:0.8;">Det(A - λI) = 0</span><br>Kalkulasi nilai saklar (λ) yang tidak merubah rentang arah vektor aslinya.<br><br>
                    <b style="color:var(--accent-success);">[3] Dekomposisi Rank Matriks:</b><br>Pengujian mendefinisikan jumlah baris independen secara linear dalam matriks.
                </div>
            </div>
        </div>`;
}