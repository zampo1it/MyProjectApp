import { useState } from "react";
import "./App.css";

function App() {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFiles([...e.target.files]);
        }
    };

    const handleReset = () => {
        setFiles([]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFiles([...e.dataTransfer.files]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        files.forEach((file) => {
            data.append("file", file);
        });
        fetch("https://localhost:7279/api/importfile/ImportFile", { method: "POST", body: data })
            .then((response) => response.blob())
            .then((blob) => {
                console.log("data is " + blob);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "file.pdf";
                a.click();
                window.URL.revokeObjectURL(url);
                setFiles([]);
            })
            .catch(() => setFiles([]));

    };

    return (
        <div className="wrapper">
            <h1>HTML to PDF converter</h1>
            <form className={`form ${dragActive ? "drag" : ""}`}
                onReset={handleReset}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleLeave}
                onDrop={handleDrop}
                onSubmit={handleSubmit}
            >
                <h2>Drag file here</h2>
                <p>or</p>
                <label className="label">
                    <span>Load file</span>
                    <input
                        className="input"
                        type="file"
                        accept=".html"
                        onChange={handleChange}
                    />
                </label>
                {files.length > 0 && (
                    <>
                        <ul className="file-list">
                            {files.map(({ name }, id) => (
                                <li key={id}>{name}</li>
                            ))}
                        </ul>
                        <button className="button-submit" type="submit">Convert</button>
                        <button className="button-reset" type="reset">
                            Clear
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}

export default App;