// script.js (Versi Final yang Diperbaiki)

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    // --- State Management ---
    let currentCategory = null;
    let currentFeature = null;

    // --- UTILITY FUNCTIONS ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }
    
    // Fungsi changePage dengan callback untuk menangani animasi
    function changePage(newPageContent, onPageReadyCallback) {
        const currentPageEl = app.querySelector('.page');
        
        const renderNewPage = () => {
            app.innerHTML = '';
            app.appendChild(newPageContent);
            if (onPageReadyCallback && typeof onPageReadyCallback === 'function') {
                // Memberi jeda sedikit agar elemen benar-benar siap
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

    // --- PAGE RENDERERS ---
    
    // Halaman 1: Tampilan Awal
    function renderHomePage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>Selamat Datang di Gudang Kode Bot WA</h2>
            <p>Temukan berbagai fitur siap pakai untuk bot WhatsApp-mu.</p>
            <button class="btn" id="view-features-btn">Lihat Fitur</button>
            <div class="device-info-box">
                 <span id="ip-info">IP: Loading...</span>
                 <span id="net-info">Net: Loading...</span>
                 <span id="bat-info">Bat: Loading...</span>
            </div>
        `;
        page.querySelector('#view-features-btn').addEventListener('click', renderCategoriesPage);
        changePage(page, updateDeviceInfo); // Memanggil update info SETELAH halaman muncul
    }

    // Halaman 2: Daftar Kategori
    function renderCategoriesPage() {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `<h2>Kategori Fitur</h2>`;
        
        featuresData.forEach(cat => {
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

        changePage(page);
    }

    // Halaman 3: Pilihan Jenis Kode
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
            button.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                renderCodeViewerPage(type);
            });
        });

        page.querySelector('#back-to-categories').addEventListener('click', renderCategoriesPage);
        changePage(page);
    }

    // Halaman 4: Penampil Kode (INI BAGIAN YANG DIPERBAIKI SECARA TOTAL)
    function renderCodeViewerPage(type) {
        const feature = featuresData
            .find(cat => cat.category === currentCategory)
            .features.find(feat => feat.name === currentFeature);

        const codeToDisplay = feature[type];

        const page = document.createElement('div');
        page.className = 'page';
        
        // 1. Buat kerangka HTML-nya dulu, dengan blok kode yang KOSONG
        page.innerHTML = `
            <h2>${currentFeature} - ${type.toUpperCase()}</h2>
            <div class="code-toolbar">
                <button class="btn" id="copy-btn"><i class="fas fa-copy"></i> Copy</button>
                <button class="btn" id="download-btn"><i class="fas fa-download"></i> Download</button>
                <button class="btn" id="back-to-types">Kembali</button>
            </div>
            <pre class="language-javascript"><code id="code-output"></code></pre>
        `;
        
        // 2. Isi blok kode yang kosong tadi dengan kodemu secara aman menggunakan .textContent
        const codeElement = page.querySelector('#code-output');
        codeElement.textContent = codeToDisplay;

        // 3. Tambahkan fungsi untuk tombol-tombol
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

        // 4. Tampilkan halaman, dan SETELAH ITU baru warnai kodenya
        changePage(page, () => {
            Prism.highlightElement(codeElement);
        });
    }

    // --- THEME SWITCHER ---
    function setInitialTheme() {
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggle.checked = false;
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });

    // --- FOOTER YEAR ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- DEVICE INFO ---
    function updateDeviceInfo() {
        const ipEl = document.getElementById('ip-info');
        const netEl = document.getElementById('net-info');
        const batEl = document.getElementById('bat-info');

        if (!ipEl) return; // Pengaman jika elemen tidak ditemukan

        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => ipEl.textContent = `IP: ${data.ip}`)
            .catch(() => ipEl.textContent = 'IP: N/A');

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        netEl.textContent = `Net: ${connection ? connection.effectiveType : 'N/A'}`;

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

    // --- INITIALIZE APP ---
    setInitialTheme();
    renderHomePage();
});
