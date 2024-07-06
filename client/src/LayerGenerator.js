import React, { useState } from 'react';

const LayerGenerator = () => {
    const [pythonRuntime, setPythonRuntime] = useState('');
    const [architecture, setArchitecture] = useState('');
    const [packages, setPackages] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Logic to handle the form submission
        console.log({ pythonRuntime, architecture, packages });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-violet-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6 text-violet-700">Layer Generator</h1>
                <div className="mb-4">
                    <label htmlFor="pythonRuntime" className="block text-gray-700 font-bold mb-2">Python Runtime:</label>
                    <select
                        id="pythonRuntime"
                        value={pythonRuntime}
                        onChange={(e) => setPythonRuntime(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="python3.2">Python 3.2</option>
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
                <button type="submit" className="bg-violet-700 text-white py-2 px-4 rounded hover:bg-violet-800">Download</button>
            </form>
        </div>
    );
};

export default LayerGenerator;
