import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the version.js file
const versionFilePath = path.join(__dirname, 'version.ts');

try {
    const data = await fs.readFile(versionFilePath, 'utf8');

    const regex = /version = "([\d.]+)"/;
    const match = data.match(regex);

    if (!match) {
        process.exit(1);
    }

    let currentVersion = parseFloat(match[1]) + 0.1;
    currentVersion = currentVersion.toFixed(1);

    const updatedVersionString = `export const version = "${currentVersion}";\n`;

    await fs.writeFile(versionFilePath, updatedVersionString, 'utf8');
    console.log(`✅ Version updated to: ${currentVersion}`);
} catch (err) {
    console.error('Error updating version file:', err);
}