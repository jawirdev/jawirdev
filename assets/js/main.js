function copyCode() {
  const code = document.getElementById('codeBlock').innerText;
  navigator.clipboard.writeText(code);
  alert('Kode berhasil disalin!');
}

function rawCode() {
  const file = new URLSearchParams(window.location.search).get('file');
  window.open(`/jawirdev/codes/downloader/${file}.js`, '_blank');
}

function downloadCode() {
  const file = new URLSearchParams(window.location.search).get('file');
  const link = document.createElement('a');
  link.href = `/jawirdev/codes/downloader/${file}.js`;
  link.download = `${file}.js`;
  link.click();
}

function shareCode() {
  alert('Fitur share coming soon!');
}
