// script.js (Versi Perbaikan yang Stabil)

document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Utama ---
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    // --- Variabel Status ---
    let currentCategory = null;
    let currentFeature = null;

    // --- FITUR BARU: Logika Efek Kursor & Latar Belakang ---
    const cursorFollower = document.getElementById('cursor-follower');
    if (cursorFollower) { // Pastikan elemen ada
        window.addEventListener('mousemove', e => {
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        });
        window.addEventListener('mousedown', () => cursorFollower.classList.add('clicked'));
        window.addEventListener('mouseup', () => cursorFollower.classList.remove('clicked'));
    }

    // --- FITUR BARU: Logika Partikel Beranimasi ---
    function createParticles() {
        const particlesContainer = document.getElementById('particles-bg');
        if (!particlesContainer) return;
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 1.5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Fungsi Bantuan (Sama seperti sebelumnya) ---
    function showToast(message) { /* ...kode tidak berubah... */ }
    function changePage(newPageContent, onPageReadyCallback) { /* ...kode tidak berubah... */ }

    // --- Fungsi untuk Merender Halaman ---

    // Halaman 1: Tampilan Awal (Diperbarui)
    function renderHomePage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>Selamat Datang di Gudang Kode Bot WA</h2>
            <p>Temukan berbagai fitur siap pakai untuk bot WhatsApp-mu.</p>
            <button class="btn" id="view-features-btn">Lihat Fitur</button>
            <div class="device-info-grid">
                <div class="info-box" id="ip-box"><i class="fas fa-network-wired"></i><span id="ip-info">IP: ...</span></div>
                <div class="info-box" id="net-box"><i class="fas fa-signal"></i><span id="net-info">Net: ...</span></div>
                <div class="info-box" id="bat-box"><i class="fas fa-battery-half"></i><span id="bat-info">Bat: ...</span></div>
                <div class="info-box" id="loc-box"><i class="fas fa-map-marker-alt"></i><span id="loc-info">Lokasi: ...</span></div>
            </div>
        `;
        page.querySelector('#view-features-btn').addEventListener('click', renderCategoriesPage);
        changePage(page, () => {
            updateDeviceInfo();
            // Tambahkan event listener untuk efek klik pada info-box
            document.querySelectorAll('.info-box').forEach(box => {
                box.addEventListener('click', () => {
                    // Nonaktifkan semua box lain dulu
                    document.querySelectorAll('.info-box.active').forEach(activeBox => {
                        if (activeBox !== box) activeBox.classList.remove('active');
                    });
                    // Toggle box yang diklik
                    box.classList.toggle('active');
                });
            });
        });
    }

    // Halaman 2: Kategori (Diperbarui dengan Tombol Kembali)
    function renderCategoriesPage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `<h2>Kategori Fitur</h2>`;
        featuresData.forEach(cat => {
            // ... (logika pembuatan daftar kategori sama seperti sebelumnya) ...
        });
        
        // FITUR BARU: Tambahkan tombol kembali
        const backButton = document.createElement('button');
        backButton.className = 'btn';
        backButton.textContent = 'Kembali ke Awal';
        backButton.style.marginTop = '1rem'; // Sedikit jarak
        backButton.addEventListener('click', renderHomePage);
        page.appendChild(backButton);

        changePage(page);
    }

    // Halaman 3: Pilihan Tipe Kode (Tidak Berubah)
    function renderFeatureTypesPage() { /* ...kode tidak berubah... */ }

    // Halaman 4: Penampil Kode (Diperbarui dengan Tampilan Baru)
    function renderCodeViewerPage(type) {
        const featureData = featuresData.find(c => c.category === currentCategory).features.find(f => f.name === currentFeature);
        const codeId = featureData[`${type}Id`];
        const codeScriptElement = document.getElementById(codeId);
        const codeToDisplay = codeScriptElement ? codeScriptElement.textContent.trim() : "Error: Kode tidak ditemukan.";
        const fileName = `${featureData.name.replace(/\s+/g, '_')}_${type}.js`;

        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <div class="code-window">
                <div class="code-window-header">
                    <div class="dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
                    <div class="filename">${fileName}</div>
                </div>
                <div class="code-window-body"><pre class="language-javascript"><code id="code-output"></code></pre></div>
            </div>
            <div class="code-toolbar">
                <button class="btn" id="copy-btn"><i class="fas fa-copy"></i> Copy</button>
                <button class="btn" id="download-btn"><i class="fas fa-download"></i> Download</button>
                <button class="btn" id="back-to-types">Kembali</button>
            </div>
        `;
        const codeElement = page.querySelector('#code-output');
        codeElement.textContent = codeToDisplay;
        page.querySelector('#copy-btn').addEventListener('click', () => { /* ...kode tidak berubah... */ });
        page.querySelector('#download-btn').addEventListener('click', () => { /* ...kode tidak berubah... */ });
        page.querySelector('#back-to-types').addEventListener('click', renderFeatureTypesPage);

        changePage(page, () => Prism.highlightElement(codeElement));
    }

    // --- Fungsi Info Device (Diperbarui dengan Lokasi) ---
    function updateDeviceInfo() {
        // ... (Logika untuk IP, Net, Bat sama seperti sebelumnya) ...

        // FITUR BARU: Logika untuk mendapatkan Lokasi
        const locEl = document.getElementById('loc-info');
        if (locEl && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => { // Berhasil
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                        .then(res => res.json())
                        .then(data => {
                            locEl.textContent = `Lokasi: ${data.address.city || data.address.state || 'Tidak Diketahui'}`;
                        }).catch(() => locEl.textContent = 'Lokasi: Gagal Fetch');
                },
                () => { // Gagal/Ditolak
                    locEl.textContent = 'Lokasi: Izin Ditolak';
                }
            );
        } else if(locEl) {
            locEl.textContent = 'Lokasi: Tidak Didukung';
        }
    }

    // --- Inisialisasi Aplikasi ---
    function init() {
        // ... (Kode setInitialTheme dan renderHomePage sama seperti sebelumnya) ...
        createParticles(); // Panggil fungsi partikel saat aplikasi dimulai
        renderHomePage();
    }
    
    init(); // Jalankan semua
});
