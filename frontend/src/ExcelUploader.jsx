import React, { useState } from 'react';

const ExcelUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-excel/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `modified_${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload or download file.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Excel Upload</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload & Process</button>
    </div>
  );
};

export default ExcelUploader;
