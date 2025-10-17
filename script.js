// script.js

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    // --- State Management ---
    let currentPage = 'home';
    let currentCategory = null;
    let currentFeature = null;

    // --- UTILITY FUNCTIONS ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    function changePage(newPageContent) {
        const currentPageEl = app.querySelector('.page');
        if (currentPageEl) {
            currentPageEl.classList.add('page-fade-out');
            currentPageEl.addEventListener('animationend', () => {
                app.innerHTML = '';
                app.appendChild(newPageContent);
            }, { once: true });
        } else {
            app.innerHTML = '';
            app.appendChild(newPageContent);
        }
    }

    // --- PAGE RENDERERS ---
    
    // Halaman 1: Tampilan Awal
    function renderHomePage() {
        currentPage = 'home';
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>Selamat Datang di Gudang Kode Bot WA</h2>
            <p>Temukan berbagai fitur siap pakai untuk bot WhatsApp-mu.</p>
            <button class="btn" id="view-features-btn">Lihat Fitur</button>
        `;
        page.querySelector('#view-features-btn').addEventListener('click', () => {
            renderCategoriesPage();
        });
        changePage(page);
    }

    // Halaman 2: Daftar Kategori
    function renderCategoriesPage() {
        currentPage = 'categories';
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
        currentPage = 'types';
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

    // Halaman 4: Penampil Kode
    function renderCodeViewerPage(type) {
        currentPage = 'viewer';
        const feature = featuresData
            .find(cat => cat.category === currentCategory)
            .features.find(feat => feat.name === currentFeature);

        const code = feature[type];

        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>${currentFeature} - ${type.toUpperCase()}</h2>
            <div class="code-toolbar">
                <button class="btn" id="copy-btn"><i class="fas fa-copy"></i> Copy</button>
                <button class="btn" id="download-btn"><i class="fas fa-download"></i> Download</button>
                <button class="btn" id="back-to-types">Kembali</button>
            </div>
            <pre><code class="language-javascript">${Prism.highlight(code, Prism.languages.javascript, 'javascript')}</code></pre>
        `;
        
        page.querySelector('#copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                showToast('Kode berhasil disalin!');
            }).catch(err => {
                showToast('Gagal menyalin kode.');
            });
        });

        page.querySelector('#download-btn').addEventListener('click', () => {
            const blob = new Blob([code], { type: 'text/javascript' });
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
        changePage(page);
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
        if (themeToggle.checked) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- FOOTER YEAR ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- DEVICE INFO ---
    function updateDeviceInfo() {
        // IP (needs external API)
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => document.getElementById('ip-info').textContent = `IP: ${data.ip}`)
            .catch(() => document.getElementById('ip-info').textContent = 'IP: N/A');

        // Connection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        document.getElementById('net-info').textContent = `Net: ${connection ? connection.effectiveType : 'N/A'}`;

        // Battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const update = () => {
                    document.getElementById('bat-info').textContent = `Bat: ${Math.floor(battery.level * 100)}%`;
                };
                update();
                battery.addEventListener('levelchange', update);
            });
        } else {
            document.getElementById('bat-info').textContent = 'Bat: N/A';
        }
    }

    // --- INITIALIZE APP ---
    setInitialTheme();
    renderHomePage();
    updateDeviceInfo();
});
