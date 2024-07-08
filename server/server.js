const express = require('express');
const app = express();
const {exec} = require('child_process');
const fs = require('fs');
const archiver = require('archiver');
const util = require('util');

const port = 9000;

const execPromise = util.promisify(exec);

app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).send('Health Route is working!');
});

app.post('/generate-zip', async (req, res) => {
    const {runtime, packages} = req.body;
    const envDir = `/tmp/env_${Date.now()}`;
    const zipFilePath = `${envDir}/packages.zip`;

    try {
        /* Step 1: Create a virtual environment */
        await execPromise(`${runtime} -m venv ${envDir}`);

        /* Step 2: Install the specified packages */
        await execPromise(`${envDir}/bin/pip install ${packages.join(' ')}`);

        /* Step 3: Zip the installed packages */
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {zlib: {level: 9}});

        archive.pipe(output);
        archive.directory(`${envDir}/lib`, false);

        await archive.finalize();

        output.on('close', () => {
            /* Step 4: Download zip after successful compression */
            res.download(zipFilePath, 'packages.zip', (err) => {
                if (err) {
                    return res.status(500).send('Error downloading zip file');
                }

                /* Step 5: Clean up the environment */
                fs.rmSync(envDir, {recursive: true, force: true});
            });
        });

        archive.on('error', (err) => {
            return res.status(500).send('Error generating zip file');
        });

    } catch (err) {
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
