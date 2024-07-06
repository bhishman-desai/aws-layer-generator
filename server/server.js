const express = require('express');
const app = express();
const {exec} = require('child_process');
const fs = require('fs');
const archiver = require('archiver');

const port = 9000;

app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).send('Health Route is working!');
});

app.post('/generate-zip', async (req, res) => {
    const {runtime, packages} = req.body;
    const envDir = `/tmp/env_${Date.now()}`;
    const packagesDir = `${envDir}/lib/python${runtime}/site-packages`;

    try {
        /* Check if the specified Python version is installed */
        const pythonInstalled = await commandExists(`python${runtime}`);
        if (!pythonInstalled) {
            await installPython(runtime);
        }

        /* Step 1: Create a virtual environment */
        exec(`python${runtime} -m venv ${envDir}`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating virtual environment');
            }

            /* Step 2: Install the specified packages */
            exec(`${envDir}/bin/pip install ${packages.join(' ')}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error installing packages');
                }

                /* Step 3: Zip the installed packages */
                const output = fs.createWriteStream(`${envDir}/packages.zip`);
                const archive = archiver('zip', {zlib: {level: 9}});

                output.on('close', () => {
                    res.download(`${envDir}/packages.zip`, 'packages.zip', (err) => {
                        if (err) {
                            console.error(err);
                        }

                        /* Clean up the environment */
                        fs.rmSync(envDir, {recursive: true, force: true});
                    });
                });

                archive.on('error', (err) => {
                    console.error(err);
                    res.status(500).send('Error generating zip file');
                });

                archive.pipe(output);
                archive.directory(packagesDir, false);
                archive.finalize();
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

/* Helper function to check if a command exists */
const commandExists = (command) => {
    return new Promise((resolve) => {
        exec(`command -v ${command}`, (error) => {
            resolve(!error);
        });
    });
};

/* Helper function to install a specific version of Python */
const installPython = (version) => {
    return new Promise((resolve, reject) => {
        exec(`apt-get update && apt-get install -y python${version} python${version}-venv`, (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
};

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});