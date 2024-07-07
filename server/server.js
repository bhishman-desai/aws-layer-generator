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
    const packagesDir = `${envDir}/lib/${runtime}/site-packages`;

    try {
        /* Step 1: Create a virtual environment */
        console.log(`Creating virtual environment at ${envDir}`);
        await execPromise(`${runtime} -m venv ${envDir}`);

        /* Step 2: Install the specified packages */
        console.log(`Installing packages: ${packages.join(' ')} in ${envDir}`);
        await execPromise(`${envDir}/bin/pip install ${packages.join(' ')}`);

        /* Step 3: Zip the installed packages */
        const output = fs.createWriteStream(`${envDir}/packages.zip`);
        const archive = archiver('zip', {zlib: {level: 9}});

        archive.on('error', (err) => {
            console.error(err);
            return res.status(500).send('Error generating zip file');
        });

        archive.pipe(output);
        archive.directory(packagesDir, false);
        await archive.finalize();

        res.download(`${envDir}/packages.zip`, 'packages.zip', (err) => {
            if (err) {
                console.error(err);
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
