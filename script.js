// script.js (Versi Final)

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-container');
    const themeToggle = document.getElementById('theme-toggle');
    
    let currentCategory = null;
    let currentFeature = null;

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
        changePage(page, updateDeviceInfo);
    }

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
        changePage(page);
    }

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

    function renderCodeViewerPage(type) {
        const featureData = featuresData.find(c => c.category === currentCategory).features.find(f => f.name === currentFeature);
        const codeId = featureData[`${type}Id`];
        const codeScriptElement = document.getElementById(codeId);
        const codeToDisplay = codeScriptElement ? codeScriptElement.textContent.trim() : "Error: Kode tidak ditemukan.";

        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `
            <h2>${currentFeature} - ${type.toUpperCase()}</h2>
            <div class="code-toolbar">
                <button class="btn" id="copy-btn"><i class="fas fa-copy"></i> Copy</button>
                <button class="btn" id="download-btn"><i class="fas fa-download"></i> Download</button>
                <button class="btn" id="back-to-types">Kembali</button>
            </div>
            <pre class="language-javascript"><code id="code-output"></code></pre>
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

    function updateDeviceInfo() {
        const ipEl = document.getElementById('ip-info');
        if (!ipEl) return;
        const netEl = document.getElementById('net-info');
        const batEl = document.getElementById('bat-info');
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json()).then(data => ipEl.textContent = `IP: ${data.ip}`)
            .catch(() => ipEl.textContent = 'IP: N/A');
        const connection = navigator.connection;
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

    setInitialTheme();
    renderHomePage();
});
