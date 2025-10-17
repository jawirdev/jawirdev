// script.js (Perbaikan Final)
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    let currentCategory = null;
    let currentFeature = null;

    // === UPDATE: Logika untuk Efek Kursor dan Latar Belakang ===
    const cursorFollower = document.getElementById('cursor-follower');
    window.addEventListener('mousemove', e => {
        requestAnimationFrame(() => {
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        });
    });
    window.addEventListener('mousedown', () => cursorFollower.classList.add('clicked'));
    window.addEventListener('mouseup', () => cursorFollower.classList.remove('clicked'));

    // === UPDATE: Logika untuk Partikel Beranimasi ===
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

    // --- FUNGSI ASLI ANDA (Tidak Diubah) ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }
    
    function changePage(newPageContent, onPageReadyCallback) {
        const currentPageEl = app.querySelector('.page');
        const renderNewPage = () => {
            app.innerHTML = '';
            app.appendChild(newPageContent);
            if (onPageReadyCallback) {
                setTimeout(onPageReadyCallback, 50); 
            }
        };
        if (currentPageEl) {
            currentPageEl.classList.add('page-fade-out');
            currentPageEl.addEventListener('animationend', renderNewPage, { once: true });
        } else {
            renderNewPage();
        }
    }

    // --- RENDER HALAMAN (Dimodifikasi sesuai permintaan) ---

    // Halaman 1: Diperbarui dengan kotak info baru
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
            document.querySelectorAll('.info-box').forEach(box => {
                box.addEventListener('click', () => box.classList.toggle('active'));
            });
        });
    }

    // Halaman 2: Diperbarui dengan tombol kembali
    function renderCategoriesPage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `<h2>Kategori Fitur</h2>`;
        featuresData.forEach(cat => {
            if (cat.features.length === 0) return;
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = cat.category;
            const featuresList = document.createElement('div');
            featuresList.className = 'features-list';
            cat.features.forEach(feat => {
                const featureItem = document.createElement('div');
                featureItem.className = 'feature-item';
                featureItem.textContent = feat.name;
                featureItem.addEventListener('click', () => {
                    currentCategory = cat.category;
                    currentFeature = feat.name;
                    renderFeatureTypesPage();
                });
                featuresList.appendChild(featureItem);
            });
            categoryHeader.addEventListener('click', () => {
                const currentlyOpen = document.querySelector('.features-list.open');
                if (currentlyOpen && currentlyOpen !== featuresList) {
                    currentlyOpen.classList.remove('open');
                }
                featuresList.classList.toggle('open');
            });
            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(featuresList);
            page.appendChild(categoryContainer);
        });
        const backButton = document.createElement('button');
        backButton.className = 'btn';
        backButton.textContent = 'Kembali ke Awal';
        backButton.style.marginTop = '1rem';
        backButton.addEventListener('click', renderHomePage);
        page.appendChild(backButton);
        changePage(page);
    }

    // Halaman 3: Kode asli Anda
    function renderFeatureTypesPage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>${currentFeature}</h2>
            <p>Pilih jenis kode yang kamu butuhkan:</p>
            <button class="btn type-btn" data-type="case">Case</button>
            <button class="btn type-btn" data-type="esm">Plugins ESM</button>
            <button class="btn type-btn" data-type="cjs">Plugins CJS</button>
            <button class="btn" id="back-to-categories">Kembali</button>
        `;
        page.querySelectorAll('.type-btn').forEach(button => {
            button.addEventListener('click', (e) => renderCodeViewerPage(e.target.dataset.type));
        });
        page.querySelector('#back-to-categories').addEventListener('click', renderCategoriesPage);
        changePage(page);
    }

    // Halaman 4: Diperbarui dengan tampilan window
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
        page.querySelector('#copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(codeToDisplay).then(() => showToast('Kode berhasil disalin!'));
        });
        page.querySelector('#download-btn').addEventListener('click', () => {
            const blob = new Blob([codeToDisplay], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentFeature.replace(/\s+/g, '_')}_${type}.js`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('File diunduh!');
        });
        page.querySelector('#back-to-types').addEventListener('click', renderFeatureTypesPage);
        changePage(page, () => Prism.highlightElement(codeElement));
    }

    // --- FUNGSI LAINNYA (Kode Asli Anda yang Diperbarui) ---
    function setInitialTheme() {
        const isDarkMode = localStorage.getItem('theme') !== 'light';
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);
        themeToggle.checked = isDarkMode;
    }
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    document.getElementById('year').textContent = new Date().getFullYear();

    // Diperbarui dengan info lokasi
    function updateDeviceInfo() {
        const ipEl = document.getElementById('ip-info');
        const netEl = document.getElementById('net-info');
        const batEl = document.getElementById('bat-info');
        const locEl = document.getElementById('loc-info');
        if (ipEl) {
            fetch('https://api.ipify.org?format=json')
                .then(res => res.json()).then(data => ipEl.textContent = `IP: ${data.ip}`)
                .catch(() => ipEl.textContent = 'IP: N/A');
        }
        if (netEl) {
            const connection = navigator.connection;
            netEl.textContent = `Net: ${connection ? connection.effectiveType : 'N/A'}`;
        }
        if (batEl) {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    const update = () => batEl.textContent = `Bat: ${Math.floor(battery.level * 100)}%`;
                    update();
                    battery.addEventListener('levelchange', update);
                });
            } else {
                batEl.textContent = 'Bat: N/A';
            }
        }
        if (locEl) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                            .then(res => res.json())
                            .then(data => {
                                locEl.textContent = `Lokasi: ${data.address.city || data.address.state || 'Ditemukan'}`;
                            }).catch(() => { locEl.textContent = 'Lokasi: N/A'; });
                    },
                    () => { locEl.textContent = 'Lokasi: Ditolak'; }
                );
            } else { locEl.textContent = 'Lokasi: N/A'; }
        }
    }

    // --- INISIALISASI ---
    setInitialTheme();
    createParticles(); // Panggil fungsi partikel
    renderHomePage();
});
