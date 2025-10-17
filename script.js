document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi animasi partikel
    particlesJS.load('particles-js', 'assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });

    // Cek jika kita berada di halaman features.html
    if (document.getElementById('category-list')) {
        loadCategories();
        getUserInfo();
    }
});

// Fungsi untuk memuat kategori dari features.json
async function loadCategories() {
    const response = await fetch('features.json');
    const data = await response.json();
    const categoryList = document.getElementById('category-list');
    
    let html = '<h2>Pilih Kategori Fitur</h2>';
    data.categories.forEach(category => {
        html += `<div class="category-item">`;
        html += `<button class="category-button">${category.name}</button>`;
        html += `<div class="feature-list hidden">`;
        category.features.forEach(feature => {
            // Kita akan buat fungsi showCodeTypes(slug) nanti
            html += `<a href="#" onclick="showCodeTypes('${feature.slug}', '${feature.name}', '${feature.path}')" class="feature-link">${feature.name}</a>`;
        });
        html += `</div></div>`;
    });
    
    categoryList.innerHTML = html;

    // Tambahkan event listener untuk animasi slide down
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            const featureList = button.nextElementSibling;
            featureList.classList.toggle('hidden');
        });
    });
}

// Fungsi untuk menampilkan info pengguna
async function getUserInfo() {
    // Dapatkan IP dari API eksternal
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        document.getElementById('ip').textContent = ipData.ip;
    } catch (error) {
        document.getElementById('ip').textContent = 'N/A';
    }

    // Dapatkan info baterai
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            document.getElementById('battery').textContent = `${Math.floor(battery.level * 100)}%`;
        });
    } else {
        document.getElementById('battery').textContent = 'N/A';
    }
    
    // Dapatkan info device (sederhana)
    document.getElementById('device').textContent = navigator.platform;
}

// Fungsi untuk Halaman 3 (Pilihan Jenis Kode)
function showCodeTypes(slug, name, path) {
    // Sembunyikan daftar kategori dan tampilkan halaman pilihan
    document.getElementById('category-list').classList.add('hidden');
    const codeTypeSelection = document.getElementById('code-type-selection');
    codeTypeSelection.classList.remove('hidden');

    codeTypeSelection.innerHTML = `
        <h2>${name}</h2>
        <div class="button-group">
            <button onclick="showCodeView('${path}/case.txt', '${name}', 'Case')">Case</button>
            <button onclick="showCodeView('${path}/cjs.txt', '${name}', 'Plugins CJS')">Plugins CJS</button>
            <button onclick="showCodeView('${path}/esm.txt', '${name}', 'Plugins ESM')">Plugins ESM</button>
            <button class="back-button" onclick="goBackToCategories()">Kembali</button>
        </div>
    `;
}

// Fungsi untuk Halaman 4 (Tampilan Kode)
async function showCodeView(filePath, featureName, codeType) {
    // Sembunyikan halaman pilihan, tampilkan viewer kode
    document.getElementById('code-type-selection').classList.add('hidden');
    const codeView = document.getElementById('code-view');
    codeView.classList.remove('hidden');

    const response = await fetch(filePath);
    const codeText = await response.text();

    codeView.innerHTML = `
        <h3>${featureName} - <span>${codeType}</span></h3>
        <div class="code-box">
            <div class="code-header">
                <span>© JawirDev x GPT-5</span>
                <div class="code-actions">
                    <button id="copy-btn">Copy</button>
                    </div>
            </div>
            <pre><code class="language-javascript">${Prism.highlight(codeText, Prism.languages.javascript, 'javascript')}</code></pre>
        </div>
        <button class="back-button" onclick="goBackToCodeTypes()">Kembali</button>
    `;

    // Fungsi copy
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(codeText);
        alert('Kode berhasil disalin!');
    });
}

// Fungsi Navigasi Kembali
function goBackToCategories() {
    document.getElementById('code-type-selection').classList.add('hidden');
    document.getElementById('category-list').classList.remove('hidden');
}

function goBackToCodeTypes() {
    document.getElementById('code-view').classList.add('hidden');
    document.getElementById('code-type-selection').classList.remove('hidden');
}
