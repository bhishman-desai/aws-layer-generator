const express = require('express');
const app = express();
const {exec} = require('child_process');
const fs = require('fs');
const archiver = require('archiver');
const util = require('util');
const cors = require('cors');

const port = 9000;

const execPromise = util.promisify(exec);

/* CORS */
const allowedOrigins = [
    'https://www.yoursite.com'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
/* TODO: app.use(cors(corsOptions));*/
app.use(cors());

app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).send('Health Route is working!');
});

app.post('/generate-zip', async (req, res, next) => {
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

                /* Step 5: Clean up the environment */
                fs.rmSync(envDir, {recursive: true, force: true});
            });
        });

        archive.on('error', (err) => {
            return next(err);
        });

    } catch (err) {
        return next(err);
    }
});

/* Error handling middleware */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
