import React, { useState } from 'react';
import axios from 'axios';

const LayerGenerator = () => {
    const [pythonRuntime, setPythonRuntime] = useState('python3.8');
    const [architecture, setArchitecture] = useState('x86_64');
    const [packages, setPackages] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        /* Validate the packages input */
        const packageArray = packages.split(',').map(pkg => pkg.trim());
        if (packageArray.some(pkg => !pkg)) {
            setErrorMessage('Packages must be comma-separated and cannot be empty.');
        } else {
            setErrorMessage('');
            setLoading(true);

            try {
                /* Prepare the payload */
                const payload = {
                    runtime: pythonRuntime,
                    architecture,
                    packages: packageArray
                };

                /* Make a POST request to the backend */
                const response = await axios.post('http://localhost:9000/generate-zip', payload, {
                    responseType: 'blob',  // To handle the zip file download
                });

                /* Create a link element to download the zip file */
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'packages.zip');  // Specify the file name
                document.body.appendChild(link);
                link.click();

                /* Clean up */
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Error generating zip:', error);
                setErrorMessage('An error occurred while generating the zip file.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-violet-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6 text-violet-700">Layer Generator</h1>
                <div className="mb-4">
                    <label htmlFor="pythonRuntime" className="block text-gray-700 font-bold mb-2">Runtime:</label>
                    <select
                        id="pythonRuntime"
                        value={pythonRuntime}
                        onChange={(e) => setPythonRuntime(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="python3.8">Python 3.8</option>
                        <option value="python3.9">Python 3.9</option>
                        <option value="python3.10">Python 3.10</option>
                        <option value="python3.11">Python 3.11</option>
                        <option value="python3.12">Python 3.12</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="architecture" className="block text-gray-700 font-bold mb-2">Architecture:</label>
                    <select
                        id="architecture"
                        value={architecture}
                        onChange={(e) => setArchitecture(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="x86_64">x86_64</option>
                        <option value="arm64">arm64</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="packages" className="block text-gray-700 font-bold mb-2">Packages to install:</label>
                    <input
                        type="text"
                        id="packages"
                        value={packages}
                        onChange={(e) => setPackages(e.target.value)}
                        placeholder="Comma separated values"
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <button type="submit" className="bg-violet-700 text-white py-2 px-4 rounded hover:bg-violet-800" disabled={loading}>
                    {loading ? 'Generating...' : 'Download'}
                </button>
            </form>
        </div>
    );
};

export default LayerGenerator;
