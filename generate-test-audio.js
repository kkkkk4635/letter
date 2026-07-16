const fs = require('fs');
const path = require('path');

function generateWavFile(frequency, duration, outputPath) {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const bytesPerSample = 2;
    const numChannels = 1;
    
    const buffer = Buffer.alloc(44 + numSamples * bytesPerSample * numChannels);
    
    let offset = 0;
    
    buffer.write('RIFF', offset); offset += 4;
    buffer.writeUInt32LE(36 + numSamples * bytesPerSample * numChannels, offset); offset += 4;
    buffer.write('WAVE', offset); offset += 4;
    
    buffer.write('fmt ', offset); offset += 4;
    buffer.writeUInt32LE(16, offset); offset += 4;
    buffer.writeUInt16LE(1, offset); offset += 2;
    buffer.writeUInt16LE(numChannels, offset); offset += 2;
    buffer.writeUInt32LE(sampleRate, offset); offset += 4;
    buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, offset); offset += 4;
    buffer.writeUInt16LE(numChannels * bytesPerSample, offset); offset += 2;
    buffer.writeUInt16LE(bytesPerSample * 8, offset); offset += 2;
    
    buffer.write('data', offset); offset += 4;
    buffer.writeUInt32LE(numSamples * bytesPerSample * numChannels, offset); offset += 4;
    
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
        
        const intSample = Math.round(sample * 32767);
        buffer.writeInt16LE(intSample, offset);
        offset += bytesPerSample;
    }
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`Generated: ${outputPath}`);
}

const musicDir = path.join(__dirname, 'music');
if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
}

generateWavFile(440, 10, path.join(musicDir, 'test1.wav'));
generateWavFile(523.25, 10, path.join(musicDir, 'test2.wav'));
generateWavFile(659.25, 10, path.join(musicDir, 'test3.wav'));

console.log('All test audio files generated!');