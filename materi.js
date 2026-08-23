// === LOGIKA BUKU MATERI (E-BOOK) ===

function renderMateriUI(c) {
    c.innerHTML = `
        <div style="max-width:800px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:30px;">
                <h2> Buku Materi Aljabar Linear</h2>
                <p style="color:var(--text-muted);">Pilih rangkuman aljabar berdasarkan tingkat pendidikan.</p>
            </div>

            <!-- MATERI SMP -->
            <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-left:4px solid #34d399; border-radius:8px; padding:25px; margin-bottom:20px;">
                <h3 style="color:#34d399; margin-top:0;">🟢 Tingkat SMP: Operasi Dasar & SPLDV</h3>
                <p style="color:var(--text-muted); font-size:0.95em;">Di tingkat ini, Anda diperkenalkan pada konsep dasar baris dan kolom serta penjumlahan matriks.</p>
                <div style="background:var(--bg-body); padding:15px; border-radius:6px; font-family:monospace; color:var(--text-main); font-size:0.9em; overflow-x:auto;">
                    <b>1. Penjumlahan & Pengurangan:</b><br>
                    Matriks hanya bisa dijumlah/dikurang jika ordonya (ukuran baris x kolom) SAMA.<br>
                    [ a  b ] + [ e  f ] = [ a+e  b+f ]<br>
                    [ c  d ]   [ g  h ]   [ c+g  d+h ]<br><br>
                    
                    <b>2. Perkalian Skalar:</b><br>
                    Mengalikan sebuah angka dengan semua elemen matriks.<br>
                    k * [ a  b ] = [ ka  kb ]
                </div>
            </div>

            <!-- MATERI SMA -->
            <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-left:4px solid #60a5fa; border-radius:8px; padding:25px; margin-bottom:20px;">
                <h3 style="color:#60a5fa; margin-top:0;">🔵 Tingkat SMA: Determinan, Invers & Cramer</h3>
                <p style="color:var(--text-muted); font-size:0.95em;">Matriks mulai digunakan untuk memecahkan sistem persamaan linear dengan teknik Invers dan Cramer.</p>
                <div style="background:var(--bg-body); padding:15px; border-radius:6px; font-family:monospace; color:var(--text-main); font-size:0.9em; overflow-x:auto;">
                    <b>1. Determinan 2x2:</b><br>
                    A = [ a  b ]  -->  Det(A) = (a * d) - (b * c)<br>
                        [ c  d ]<br><br>

                    <b>2. Invers Matriks 2x2:</b><br>
                    A^-1 =  1 / Det(A) * [  d  -b ]<br>
                                         [ -c   a ]<br><br>

                    <b>3. Syarat Perkalian:</b><br>
                    Kolom matriks pertama HARUS SAMA dengan baris matriks kedua (m x n * n x p = m x p).
                </div>
            </div>

            <!-- MATERI MAHASISWA -->
            <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-left:4px solid #f87171; border-radius:8px; padding:25px; margin-bottom:20px;">
                <h3 style="color:#f87171; margin-top:0;">🔴 Tingkat Mahasiswa: Eselon Baris, Eigen & Rank</h3>
                <p style="color:var(--text-muted); font-size:0.95em;">Penggunaan algoritma eliminasi canggih seperti Gauss-Jordan dan analisis ruang vektor (Vektor Eigen).</p>
                <div style="background:var(--bg-body); padding:15px; border-radius:6px; font-family:monospace; color:var(--text-main); font-size:0.9em; overflow-x:auto;">
                    <b>1. Eliminasi Gauss-Jordan (RREF):</b><br>
                    Mengubah matriks augmented menjadi bentuk eselon baris tereduksi (diagonal utamanya 1, sisanya 0).<br><br>

                    <b>2. Persamaan Nilai Eigen (Eigenvalues):</b><br>
                    Det(A - λI) = 0<br>
                    Dicari nilai konstanta (λ) yang tidak mengubah orientasi vektor aslinya.<br><br>

                    <b>3. Rank Matriks:</b><br>
                    Jumlah maksimum baris/kolom yang saling independen linear (tidak bisa dijadikan 0 semua lewat eliminasi Gauss).
                </div>
            </div>
        </div>`;
}