import React, { useState } from 'react';

const ExcelUploader = () => {
  const [file, setFile] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFilename(`modified_${uploadedFile.name}`);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/create-excel/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const blob = await response.blob();
      setFileBlob(blob);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload or download file.");
    }
  };

  const handleDownload = () => {
    if (fileBlob) {
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Excel Upload & Process</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload & Process</button>

      {fileBlob && (
        <div
          style={{ marginTop: "20px", cursor: "pointer" }}
          onClick={handleDownload}
        >
          📄 <strong>{filename}</strong> (click to download)
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
