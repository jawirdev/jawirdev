// data.js

const featuresData = [
    {
        category: "Downloader",
        features: [
            {
                name: "Spotify Downloader",
                case: `//Creator: JawirDev
//Instagram: @jawirdesigner
//Sumber: https://whatsapp.com/channel/0029Vb6Jcay8KMqestkMkj1L
//Spotify Play / Downloader
case 'spotify':
case 'spotifyplay': {
    if (isBan) return XRB();
    await XReaction();
    
    if (!text) return reply(\`Masukkan judul lagu yang ingin diunduh!\\n\\nContoh: \${prefix}\${command} Laskar Pelangi\`);
    
    reply('⏳ Mencari dan mengunduh lagu, Sabar ya wirr...');
    
    try {
        const apiUrl = \`https://kyyokatsurestapi.my.id/search/spotify?q=\${encodeURIComponent(text)}\`;
        const { data: response } = await axios.get(apiUrl);
        
        if (!response.status || !response.result) {
            throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
        }
        
        const song = response.result;
        
        const caption = \`
🎵 *Spotify Downloader* 🎵
🎶 *Judul:* \${song.title}
🎤 *Artis:* \${song.artist}
⏰ *Durasi:* \${song.duration}
📈 *Popularitas:* \${song.popularity}
Mengirim file audio... 
        \`.trim();
        
        // Mengirim informasi lagu terlebih dahulu
        await Alice.sendMessage(m.chat, {
            image: { url: song.thumbnail },
            caption: caption
        }, { quoted: m });
        
        // Mengirim file audio
        await Alice.sendMessage(m.chat, {
            audio: { url: song.audio },
            mimetype: 'audio/mpeg',
            fileName: \`\${song.name}.mp3\`
        }, { quoted: m });
        
    } catch (error) {
        console.error('SpotifyDL Error:', error);
        reply(\`❌ Terjadi kesalahan saat mengunduh lagu.\\n\\n*Pesan:* \${error.message}\`);
    }
}
break;`,
                esm: `//Creator: JawirDev
//Instagram: @jawirdesigner
//Sumber: https://whatsapp.com/channel/0029Vb6Jcay8KMqestkMkj1L
//Spotify Play / Downloader
import axios from 'axios';
export default {
    command: ['spotify', 'spotifyplay'],
    category: 'Downloader',
    async operate({ Alice, m, text, prefix, command, reply, XReaction, XRB, isBan }) {
        if (isBan) return XRB();
        await XReaction();
        
        if (!text) return reply(\`Masukkan judul lagu yang ingin diunduh!\\n\\nContoh: \${prefix}\${command} Laskar Pelangi\`);
        
        reply('⏳ Mencari dan mengunduh lagu, Sabar ya wirr...');
        
        try {
            const apiUrl = \`https://kyyokatsurestapi.my.id/search/spotify?q=\${encodeURIComponent(text)}\`;
            const { data: response } = await axios.get(apiUrl);
            
            if (!response.status || !response.result) {
                throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
            }
            
            const song = response.result;
            
            const caption = \`
🎵 *Spotify Downloader* 🎵
🎶 *Judul:* \${song.title}
🎤 *Artis:* \${song.artist}
⏰ *Durasi:* \${song.duration}
📈 *Popularitas:* \${song.popularity}
Mengirim file audio... 
            \`.trim();
            
            // Mengirim informasi lagu terlebih dahulu
            await Alice.sendMessage(m.chat, {
                image: { url: song.thumbnail },
                caption: caption
            }, { quoted: m });
            
            // Mengirim file audio
            await Alice.sendMessage(m.chat, {
                audio: { url: song.audio },
                mimetype: 'audio/mpeg',
                fileName: \`\${song.name}.mp3\`
            }, { quoted: m });
            
        } catch (error) {
            console.error('SpotifyDL Error:', error);
            reply(\`❌ Terjadi kesalahan saat mengunduh lagu.\\n\\n*Pesan:* \${error.message}\`);
        }
    }
};`,
                cjs: `//Creator: JawirDev
//Instagram: @jawirdesigner
//Sumber: https://whatsapp.com/channel/0029Vb6Jcay8KMqestkMkj1L
//Spotify Play / Downloader
const axios = require('axios');
module.exports = {
    command: ['spotify', 'spotifyplay'],
    category: 'Downloader',
    
    async operate({ Alice, m, text, prefix, command, reply, XReaction, XRB, isBan }) {
        if (isBan) return XRB();
        await XReaction();
        
        if (!text) return reply(\`Masukkan judul lagu yang ingin diunduh!\\n\\nContoh: \${prefix}\${command} Laskar Pelangi\`);
        
        reply('⏳ Mencari dan mengunduh lagu, Sabar ya wirr...');
        
        try {
            const apiUrl = \`https://kyyokatsurestapi.my.id/search/spotify?q=\${encodeURIComponent(text)}\`;
            const { data: response } = await axios.get(apiUrl);
            
            if (!response.status || !response.result) {
                throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
            }
            
            const song = response.result;
            
            const caption = \`
🎵 *Spotify Downloader* 🎵
🎶 *Judul:* \${song.title}
🎤 *Artis:* \${song.artist}
⏰ *Durasi:* \${song.duration}
📈 *Popularitas:* \${song.popularity}
Mengirim file audio... 
            \`.trim();
            
            // Mengirim informasi lagu terlebih dahulu
            await Alice.sendMessage(m.chat, {
                image: { url: song.thumbnail },
                caption: caption
            }, { quoted: m });
            
            // Mengirim file audio
            await Alice.sendMessage(m.chat, {
                audio: { url: song.audio },
                mimetype: 'audio/mpeg',
                fileName: \`\${song.name}.mp3\`
            }, { quoted: m });
            
        } catch (error) {
            console.error('SpotifyDL Error:', error);
            reply(\`❌ Terjadi kesalahan saat mengunduh lagu.\\n\\n*Pesan:* \${error.message}\`);
        }
    }
};`
            }
            // TAMBAHKAN FITUR LAIN DARI KATEGORI INI DI SINI
        ]
    },
    {
        category: "Tools",
        features: [
            // TAMBAHKAN FITUR-FITUR DENGAN KATEGORI "TOOLS" DI SINI
        ]
    }
    // TAMBAHKAN KATEGORI BARU DI SINI
];
