//Case: //Creator: JawirDev
//Instagram: @jawirdesigner
//Sumber: https://whatsapp.com/channel/0029Vb6Jcay8KMqestkMkj1L
//Spotify Play / Downloader
case 'spotify':
case 'spotifyplay': {
    if (isBan) return XRB();
    await XReaction();
    
    if (!text) return reply(`Masukkan judul lagu yang ingin diunduh!\n\nContoh: ${prefix}${command} Laskar Pelangi`);
    
    reply('⏳ Mencari dan mengunduh lagu, Sabar ya wirr...');
    
    try {
        const apiUrl = `https://kyyokatsurestapi.my.id/search/spotify?q=${encodeURIComponent(text)}`;
        const { data: response } = await axios.get(apiUrl);
        
        if (!response.status || !response.result) {
            throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
        }
        
        const song = response.result;
        
        const caption = `\n🎵 *Spotify Downloader* 🎵\n🎶 *Judul:* ${song.title}\n🎤 *Artis:* ${song.artist}\n⏰ *Durasi:* ${song.duration}\n📈 *Popularitas:* ${song.popularity}\nMengirim file audio... \n        `.trim();
        
        // Mengirim informasi lagu terlebih dahulu
        await Alice.sendMessage(m.chat, {
            image: { url: song.thumbnail },
            caption: caption
        }, { quoted: m });
        
        // Mengirim file audio
        await Alice.sendMessage(m.chat, {
            audio: { url: song.audio },
            mimetype: 'audio/mpeg',
            fileName: `${song.name}.mp3`
        }, { quoted: m });
        
    } catch (error) {
        console.error('SpotifyDL Error:', error);
        reply(`❌ Terjadi kesalahan saat mengunduh lagu.\n\n*Pesan:* ${error.message}`);
    }
}
break;
