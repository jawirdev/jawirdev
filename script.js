// script.js (Versi Update)

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    let currentCategory = null;
    let currentFeature = null;

    // === UPDATE: Logika untuk Efek Mouse dan Background ===
    const cursorFollower = document.getElementById('cursor-follower');
    
    window.addEventListener('mousemove', e => {
        // Update posisi custom cursor
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
        
        // Update posisi cahaya background
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
    });
    
    window.addEventListener('mousedown', () => cursorFollower.classList.add('clicked'));
    window.addEventListener('mouseup', () => cursorFollower.classList.remove('clicked'));

    // === UPDATE: Logika untuk Partikel Beranimasi ===
    function createParticles() {
        const particlesContainer = document.getElementById('particles-bg');
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 5 + 8}s`;
            particlesContainer.appendChild(particle);
        }
    }

    function showToast(message) { /* ... fungsi tidak berubah ... */ }
    function changePage(newPageContent, onPageReadyCallback) { /* ... fungsi tidak berubah ... */ }

    // Halaman 1: Tampilan Awal (UPDATED)
    function renderHomePage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>Selamat Datang di Gudang Kode Bot WA</h2>
            <p>Temukan berbagai fitur siap pakai untuk bot WhatsApp-mu.</p>
            <button class="btn" id="view-features-btn">Lihat Fitur</button>
            <div class="device-info-grid">
                <div class="info-box" id="ip-box"><i class="fas fa-network-wired"></i> <span id="ip-info">IP: ...</span></div>
                <div class="info-box" id="net-box"><i class="fas fa-signal"></i> <span id="net-info">Net: ...</span></div>
                <div class="info-box" id="bat-box"><i class="fas fa-battery-half"></i> <span id="bat-info">Bat: ...</span></div>
                <div class="info-box" id="loc-box"><i class="fas fa-map-marker-alt"></i> <span id="loc-info">Lokasi: ...</span></div>
            </div>
        `;
        page.querySelector('#view-features-btn').addEventListener('click', renderCategoriesPage);
        changePage(page, () => {
            updateDeviceInfo();
            // Tambahkan event listener untuk info box
            document.querySelectorAll('.info-box').forEach(box => {
                box.addEventListener('click', () => box.classList.toggle('active'));
            });
        });
    }

    // Halaman 2: Daftar Kategori (UPDATED)
    function renderCategoriesPage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `<h2>Kategori Fitur</h2>`;
        // ... (logika forEach untuk membuat kategori tidak berubah)
        // Tambahkan tombol kembali di akhir
        const backButton = document.createElement('button');
        backButton.className = 'btn';
        backButton.textContent = 'Kembali ke Awal';
        backButton.style.marginTop = '1rem';
        backButton.addEventListener('click', renderHomePage);
        page.appendChild(backButton);
        changePage(page);
    }

    // Halaman 3: Pilihan Jenis Kode
    function renderFeatureTypesPage() { /* ... fungsi tidak berubah ... */ }

    // Halaman 4: Penampil Kode (UPDATED)
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
                    <div class="dots">
                        <div class="dot red"></div>
                        <div class="dot yellow"></div>
                        <div class="dot green"></div>
                    </div>
                    <div class="filename">${fileName}</div>
                </div>
                <div class="code-window-body">
                    <pre class="language-javascript"><code id="code-output"></code></pre>
                </div>
            </div>
            <div class="code-toolbar">
                <button class="btn" id="copy-btn"><i class="fas fa-copy"></i> Copy</button>
                <button class="btn" id="download-btn"><i class="fas fa-download"></i> Download</button>
                <button class="btn" id="back-to-types">Kembali</button>
            </div>
        `;
        const codeElement = page.querySelector('#code-output');
        codeElement.textContent = codeToDisplay;
        
        page.querySelector('#copy-btn').addEventListener('click', () => { /* ... logika tidak berubah ... */ });
        page.querySelector('#download-btn').addEventListener('click', () => { /* ... logika tidak berubah ... */ });
        page.querySelector('#back-to-types').addEventListener('click', renderFeatureTypesPage);

        changePage(page, () => Prism.highlightElement(codeElement));
    }

    // Fungsi Info Device (UPDATED)
    function updateDeviceInfo() {
        // ... (Fungsi untuk IP, Net, Bat tidak berubah)
        
        // UPDATE: Tambahkan Info Lokasi
        const locEl = document.getElementById('loc-info');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                    .then(res => res.json())
                    .then(data => {
                        locEl.textContent = `Lokasi: ${data.address.city || data.address.state}`;
                    }).catch(() => locEl.textContent = 'Lokasi: N/A');
            }, () => {
                locEl.textContent = 'Lokasi: Ditolak';
            });
        } else {
            locEl.textContent = 'Lokasi: N/A';
        }
    }
    
    // Inisialisasi Aplikasi
    function init() {
        setInitialTheme();
        createParticles(); // Panggil fungsi untuk membuat partikel
        renderHomePage();
    }
    
    init(); // Jalankan inisialisasi
});

