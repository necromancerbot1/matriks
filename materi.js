// === PERPUSTAKAAN REFERENSI KOMPREHENSIF ZERO MATRIKS ===

function renderMateriUI(c) {
    c.innerHTML = `
        <div style="max-width:1100px; margin:0 auto; padding-bottom: 50px;">
            <div style="text-align:center; margin-bottom:50px;">
                <h2 style="font-size:2.5em; font-weight:800; margin-bottom:10px; color:var(--text-primary);">📚 Modul Pembelajaran Terapan</h2>
                <p style="color:var(--text-secondary); font-size:1.15em; max-width:800px; margin:0 auto;">Silabus komprehensif yang dilengkapi dengan definisi fundamental, kalkulus diferensial, dan studi kasus komputasi nyata.</p>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:40px;">
                
                <!-- BAB 1: SMP / DASAR -->
                <div class="book-card" style="--card-color: var(--accent-success); background:var(--bg-surface); padding:40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; margin-bottom:25px;">
                        <div>
                            <h3 style="color:var(--text-primary); margin:0 0 10px 0; font-size:1.8em; font-weight:700;">BAB 1: Anatomi & Fundamental Matriks</h3>
                            <p style="color:var(--text-secondary); font-size:1em; margin:0;">Mengenal Skalar, Jenis Matriks, dan Operasi Aritmatika Dasar.</p>
                        </div>
                        <div style="background:rgba(16, 185, 129, 0.15); color:var(--accent-success); font-size:0.85em; font-weight:700; padding:8px 16px; border-radius:12px; letter-spacing:1px;">TINGKAT: DASAR</div>
                    </div>
                    
                    <div style="color:var(--text-primary); font-size:1.05em; line-height:1.8;">
                        <h4 style="color:var(--accent-success); font-size:1.2em; margin-bottom:10px;">1.1 Definisi: Matriks vs Skalar</h4>
                        <p><b>Matriks</b> adalah kumpulan angka yang disusun dalam grid (baris dan kolom). Sedangkan <b>Skalar</b> adalah entitas matematika yang hanya memiliki nilai tunggal (besaran mutlak riil/konstanta), tanpa arah atau dimensi. Contoh: angka 5, -2, atau 0.5 adalah skalar.</p>
                        
                        <h4 style="color:var(--accent-success); font-size:1.2em; margin-top:30px; margin-bottom:10px;">1.2 Jenis-Jenis Matriks Khusus</h4>
                        <ul style="color:var(--text-secondary);">
                            <li><b>Matriks Identitas (I):</b> Matriks persegi yang seluruh elemen diagonal utamanya bernilai 1, dan sisanya 0. Sifat mutlak: Matriks apapun jika dikalikan <i>I</i>, hasilnya adalah matriks itu sendiri (A &times; I = A).</li>
                            <li><b>Matriks Nol (O):</b> Matriks yang seluruh elemennya bernilai 0.</li>
                            <li><b>Matriks Diagonal:</b> Matriks persegi yang elemen selain diagonal utamanya adalah 0.</li>
                            <li><b>Matriks Skalar:</b> Matriks diagonal yang seluruh angka di diagonal utamanya memiliki nilai yang sama persis.</li>
                        </ul>

                        <h4 style="color:var(--accent-success); font-size:1.2em; margin-top:30px; margin-bottom:10px;">1.3 Penjumlahan & Perkalian Skalar</h4>
                        <p>Matriks hanya dapat dijumlahkan/dikurangkan jika <b>Ordo (dimensi baris x kolom) persis sama</b>. Sedangkan Perkalian Skalar berarti mengalikan angka riil (Skalar) ke <b>seluruh elemen</b> di dalam matriks secara merata.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-success);">
                            <b style="color:var(--accent-success); font-size:1.1em; display:block; margin-bottom:15px;">📝 CONTOH SOAL: KOMBINASI SKALAR & PENJUMLAHAN</b>
                            Diketahui Skalar k = 2, Matriks A dan B:<br>
                            A = [  3   -1 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[  0    4 ]<br><br>
                            B = [  1    5 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[  2   -2 ]<br><br>
                            <b>Tentukan hasil dari (2A + B)!</b><br><br>
                            <i>Langkah 1: Selesaikan Perkalian Skalar 2A</i><br>
                            2A = [ (2&times;3)  (2&times;-1) ] = [  6  -2 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ (2&times;0)  (2&times;4)  ]   [  0   8 ]<br><br>
                            <i>Langkah 2: Jumlahkan dengan Matriks B</i><br>
                            (2A + B) = [ (6+1)  (-2+5) ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ (0+2)  (8+-2) ]<br><br>
                            <b>Hasil Akhir:</b><br>
                            = [  7   3 ]<br>
                            &nbsp;&nbsp;[  2   6 ]
                        </div>
                    </div>
                </div>

                <!-- BAB 2: SMA / MENENGAH -->
                <div class="book-card" style="--card-color: var(--brand-main); background:var(--bg-surface); padding:40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; margin-bottom:25px;">
                        <div>
                            <h3 style="color:var(--text-primary); margin:0 0 10px 0; font-size:1.8em; font-weight:700;">BAB 2: Aljabar Linear Intermediat & Trigonometri</h3>
                            <p style="color:var(--text-secondary); font-size:1em; margin:0;">Perkalian Dot, Determinan, Invers, dan Operasi Matriks Rotasi Trigonometri.</p>
                        </div>
                        <div style="background:rgba(59, 130, 246, 0.15); color:var(--brand-main); font-size:0.85em; font-weight:700; padding:8px 16px; border-radius:12px; letter-spacing:1px;">TINGKAT: MENENGAH</div>
                    </div>
                    
                    <div style="color:var(--text-primary); font-size:1.05em; line-height:1.8;">
                        <h4 style="color:var(--brand-main); font-size:1.2em; margin-bottom:10px;">2.1 Perkalian Matriks (Dot Product)</h4>
                        <p>Syarat mutlak: <b>Jumlah kolom Matriks 1 = Jumlah baris Matriks 2</b>. Prinsip kerjanya adalah "Baris dikali Kolom", di mana elemen-elemen dikalikan lalu dijumlahkan.</p>

                        <h4 style="color:var(--brand-main); font-size:1.2em; margin-top:35px; margin-bottom:10px;">2.2 Determinan & Invers Matriks 2x2</h4>
                        <p>Determinan (Det) digunakan untuk mencari Invers (A<sup>-1</sup>). Matriks dengan Det = 0 disebut <b>Matriks Singular</b> dan tidak bisa di-invers karena pembagian dengan nol tidak terdefinisi.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--brand-main);">
                            <b style="color:var(--brand-main); font-size:1.1em; display:block; margin-bottom:15px;">📝 CONTOH SOAL: DETERMINAN & INVERS</b>
                            P = [ 4   3 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[ 2   2 ]<br><br>
                            <b>Langkah 1: Cari Determinan (ad - bc)</b><br>
                            Det(P) = (4 &times; 2) - (3 &times; 2) = 8 - 6 = <b>2</b><br><br>
                            <b>Langkah 2: Cari Invers ( 1/Det &times; Adjoin )</b><br>
                            Tukar posisi a & d. Beri tanda minus pada b & c.<br>
                            P<sup>-1</sup> = 1/2 &times; [  2  -3 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ -2   4 ]<br><br>
                            <b>Hasil Invers P:</b><br>
                            = [  1   -1.5 ]<br>
                            &nbsp;&nbsp;[ -1    2   ]
                        </div>

                        <h4 style="color:var(--brand-main); font-size:1.2em; margin-top:35px; margin-bottom:10px;">2.3 Aplikasi Trigonometri dalam Matriks</h4>
                        <p>Dalam ilmu komputer (Grafika Komputer & Animasi), matriks sering diisi dengan fungsi Trigonometri (Sinus & Cosinus) untuk memutar (Rotasi) objek 2D/3D di layar koordinat.</p>

                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--brand-main);">
                            <b style="color:var(--brand-main); font-size:1.1em; display:block; margin-bottom:15px;">📝 KASUS: DETERMINAN MATRIKS TRIGONOMETRI</b>
                            Diketahui Matriks Rotasi R sebesar sudut &theta;:<br>
                            R = [  cos(&theta;)   -sin(&theta;) ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[  sin(&theta;)    cos(&theta;) ]<br><br>
                            <b>Buktikan bahwa Determinan R selalu bernilai 1!</b><br><br>
                            <i>Eksekusi (ad - bc):</i><br>
                            Det(R) = (cos(&theta;) &times; cos(&theta;)) - (-sin(&theta;) &times; sin(&theta;))<br>
                            Det(R) = cos&sup2;(&theta;) - (-sin&sup2;(&theta;))<br>
                            Det(R) = cos&sup2;(&theta;) + sin&sup2;(&theta;)<br><br>
                            Berdasarkan <b>Hukum Identitas Trigonometri Dasar Pythagoras</b>, nilai dari <i>cos&sup2;(&theta;) + sin&sup2;(&theta;)</i> mutlak bernilai 1.<br><br>
                            <b>Maka Terbukti: Det(R) = 1</b>
                        </div>
                    </div>
                </div>

                <!-- BAB 3: UNIVERSITAS / S1 (MATRIKS) -->
                <div class="book-card" style="--card-color: var(--accent-danger); background:var(--bg-surface); padding:40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; margin-bottom:25px;">
                        <div>
                            <h3 style="color:var(--text-primary); margin:0 0 10px 0; font-size:1.8em; font-weight:700;">BAB 3: Komputasi Algoritma Matriks Lanjut</h3>
                            <p style="color:var(--text-secondary); font-size:1em; margin:0;">Reduksi Baris (RREF), Dekomposisi Rank, dan Nilai Eigen.</p>
                        </div>
                        <div style="background:rgba(239, 68, 68, 0.15); color:var(--accent-danger); font-size:0.85em; font-weight:700; padding:8px 16px; border-radius:12px; letter-spacing:1px;">TINGKAT: UNIVERSITAS (S1)</div>
                    </div>
                    
                    <div style="color:var(--text-primary); font-size:1.05em; line-height:1.8;">
                        <h4 style="color:var(--accent-danger); font-size:1.2em; margin-bottom:10px;">3.1 Eliminasi Gauss-Jordan (Pola RREF)</h4>
                        <p>Menggunakan <i>Operasi Baris Elementer (OBE)</i> untuk mengubah matriks menjadi <b>Eselon Baris Tereduksi</b> (diagonal utama berisi 1, sisanya 0). Ini adalah algoritma terbaik untuk mencari himpunan penyelesaian persamaan berukuran raksasa secara terprogram.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-danger);">
                            <b style="color:var(--accent-danger); font-size:1.1em; display:block; margin-bottom:15px;">📝 KASUS: CARI VARIABEL X & Y DENGAN GAUSS-JORDAN</b>
                            Persamaan:<br>
                            2x + y = 5<br>
                            1x - y = 1<br><br>
                            <b>Langkah 1: Bentuk Augmented Matrix [A | B]</b><br>
                            R1: [ 2   1  |  5 ]<br>
                            R2: [ 1  -1  |  1 ]<br><br>
                            <b>Langkah 2: Tukar R1 dan R2 agar Pivot lebih mudah</b><br>
                            R1: [ 1  -1  |  1 ]<br>
                            R2: [ 2   1  |  5 ]<br><br>
                            <b>Langkah 3: Nol-kan nilai di bawah Pivot (R2 = R2 - 2*R1)</b><br>
                            R2 = [ (2-2)  (1 - (-2))  |  (5 - 2) ]<br>
                            R1: [ 1  -1  |  1 ]<br>
                            R2: [ 0   3  |  3 ]<br><br>
                            <b>Langkah 4: Jadikan Pivot R2 menjadi 1 (R2 = R2 / 3)</b><br>
                            R1: [ 1  -1  |  1 ]<br>
                            R2: [ 0   1  |  1 ]<br><br>
                            <b>Langkah 5: Nol-kan nilai di atas Pivot R2 (R1 = R1 + R2)</b><br>
                            R1: [ 1   0  |  2 ]<br>
                            R2: [ 0   1  |  1 ]<br><br>
                            <b>Hasil Akhir RREF:</b><br>
                            x = 2<br>
                            y = 1
                        </div>

                        <h4 style="color:var(--accent-danger); font-size:1.2em; margin-top:35px; margin-bottom:10px;">3.2 Peringkat (Rank) Matriks</h4>
                        <p>Rank sebuah matriks menunjukkan jumlah baris yang <b>independen secara linear</b> (tidak bisa dibentuk dari penjumlahan baris-baris lainnya). Jika jumlah variabel dalam persamaan lebih banyak daripada nilai Rank-nya, sistem dipastikan memiliki solusi yang tak terhingga.</p>

                        <h4 style="color:var(--accent-danger); font-size:1.2em; margin-top:35px; margin-bottom:10px;">3.3 Nilai Eigen (Eigenvalues)</h4>
                        <p>Nilai skalar <b>&lambda;</b> yang membuktikan bahwa matriks A dikali vektor <b>x</b> memiliki hasil yang ekuivalen dengan <b>&lambda;</b> dikali vektor <b>x</b>. Secara komputasi, Eigen digunakan untuk algoritma <i>PageRank Google</i> dan <i>Face Recognition</i>.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-danger);">
                            <b style="color:var(--accent-danger); font-size:1.1em; display:block; margin-bottom:15px;">📝 KASUS: MENCARI NILAI EIGEN (&lambda;)</b>
                            A = [ 3   0 ]<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[ 0   2 ]<br><br>
                            <b>Rumus Persamaan Karakteristik: Det(A - &lambda;I) = 0</b><br>
                            | (3-&lambda;)    0   |<br>
                            |   0    (2-&lambda;) | = 0<br><br>
                            <b>Hitung Determinan:</b><br>
                            (3-&lambda;) &times; (2-&lambda;) - (0 &times; 0) = 0<br>
                            (3-&lambda;)(2-&lambda;) = 0<br><br>
                            <b>Hasil Akar (Spektrum Nilai Eigen):</b><br>
                            &lambda;<sub>1</sub> = 3<br>
                            &lambda;<sub>2</sub> = 2
                        </div>
                    </div>
                </div>

                <!-- BAB 4: UNIVERSITAS / S1 (KALKULUS) -->
                <div class="book-card" style="--card-color: var(--accent-warning); background:var(--bg-surface); padding:40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; margin-bottom:25px;">
                        <div>
                            <h3 style="color:var(--text-primary); margin:0 0 10px 0; font-size:1.8em; font-weight:700;">BAB 4: Kalkulus Diferensial</h3>
                            <p style="color:var(--text-secondary); font-size:1em; margin:0;">Konsep Turunan (Derivatives), Turunan Trigonometri, dan Aturan Rantai.</p>
                        </div>
                        <div style="background:rgba(245, 158, 11, 0.15); color:var(--accent-warning); font-size:0.85em; font-weight:700; padding:8px 16px; border-radius:12px; letter-spacing:1px;">TINGKAT: UNIVERSITAS (S1)</div>
                    </div>
                    
                    <div style="color:var(--text-primary); font-size:1.05em; line-height:1.8;">
                        <h4 style="color:var(--accent-warning); font-size:1.2em; margin-bottom:10px;">4.1 Definisi Turunan & Aturan Pangkat</h4>
                        <p><b>Turunan (Diferensial)</b> adalah tingkat perubahan sesaat dari suatu fungsi terhadap variabel bebasnya. Secara geometris, turunan mengukur gradien (kemiringan) garis singgung pada suatu kurva. Dalam ilmu komputer, turunan adalah fondasi dari algoritma optimasi seperti <i>Gradient Descent</i> pada <i>Machine Learning</i>.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-warning);">
                            <b style="color:var(--accent-warning); font-size:1.1em; display:block; margin-bottom:15px;">Aturan Pangkat (Power Rule):</b>
                            Jika f(x) = a &times; x<sup>n</sup><br>
                            Maka f'(x) = a &times; n &times; x<sup>n-1</sup><br><br>
                            <b>Contoh:</b><br>
                            f(x) = 4x<sup>3</sup> &rarr; f'(x) = 4 &times; 3 &times; x<sup>3-1</sup> = <b>12x<sup>2</sup></b>
                        </div>

                        <h4 style="color:var(--accent-warning); font-size:1.2em; margin-top:35px; margin-bottom:10px;">4.2 Turunan Fungsi Trigonometri</h4>
                        <p>Turunan trigonometri mengevaluasi laju perubahan pada fungsi gelombang periodik. Ini sangat krusial dalam pemrosesan sinyal digital (Audio/Visual) dan pergerakan objek osilasi di dunia nyata.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-warning);">
                            <b style="color:var(--accent-warning); font-size:1.1em; display:block; margin-bottom:15px;">Identitas Turunan Trigonometri Absolut:</b>
                            &bull; d/dx [ sin(x) ] = <b>cos(x)</b><br>
                            &bull; d/dx [ cos(x) ] = <b>-sin(x)</b><br>
                            &bull; d/dx [ tan(x) ] = <b>sec<sup>2</sup>(x)</b><br>
                            &bull; d/dx [ cot(x) ] = <b>-csc<sup>2</sup>(x)</b><br>
                            &bull; d/dx [ sec(x) ] = <b>sec(x) &times; tan(x)</b><br>
                            &bull; d/dx [ csc(x) ] = <b>-csc(x) &times; cot(x)</b>
                        </div>

                        <h4 style="color:var(--accent-warning); font-size:1.2em; margin-top:35px; margin-bottom:10px;">4.3 Aturan Rantai (Chain Rule) & Kasus Nyata</h4>
                        <p>Aturan rantai digunakan ketika kita harus menurunkan sebuah "fungsi bersarang" (Fungsi Komposisi). Aturan dasarnya: Turunkan fungsi terluar terlebih dahulu, biarkan fungsi di dalamnya utuh, lalu kalikan dengan turunan dari fungsi yang ada di dalam tersebut.</p>
                        
                        <div style="background:rgba(15,23,42,0.6); padding:25px; border-radius:12px; font-family:monospace; margin:20px 0; border:1px solid var(--border-subtle); border-left:4px solid var(--accent-warning);">
                            <b style="color:var(--accent-warning); font-size:1.1em; display:block; margin-bottom:15px;">📝 KASUS: TURUNAN TRIGONOMETRI KOMPLEKS</b>
                            Tentukan turunan pertama ( y' ) dari:<br>
                            y = 5 &times; sin(3x<sup>2</sup> - 4x)<br><br>
                            <b>Langkah 1: Identifikasi Fungsi Luar & Dalam</b><br>
                            Fungsi Luar = 5 &times; sin(u)<br>
                            Fungsi Dalam (u) = 3x<sup>2</sup> - 4x<br><br>
                            <b>Langkah 2: Turunkan Fungsi Dalam (u')</b><br>
                            u' = (3 &times; 2 &times; x) - 4 = <b>6x - 4</b><br><br>
                            <b>Langkah 3: Terapkan Aturan Rantai ( y' = Luar' &times; Dalam' )</b><br>
                            y' = 5 &times; cos(3x<sup>2</sup> - 4x) &times; (6x - 4)<br><br>
                            <b>Hasil Akhir:</b><br>
                            y' = (30x - 20) &times; cos(3x<sup>2</sup> - 4x)
                        </div>
                    </div>
                </div>

            </div>
        </div>`;
}