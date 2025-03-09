import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi"; // Upload icon
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Loading spinner icon

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(to bottom, #d4edda, #a8e6cf);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  margin: auto;
  min-height: 50vh;
`;

const UploadBox = styled.div`
  width: 45%;
  max-width: 450px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2b4b29;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const UploadTitle = styled.h2`
  font-size: 5.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2b4b29;
`;

const UploadIcon = styled(FiUpload)`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #2b4b29;
`;

const UploadText = styled.p`
  font-size: 1.2rem;
  color: #2b4b29;
  margin-top: 10px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: ${({ success }) => (success ? "green" : "red")};
  margin-top: 15px;
`;

const LoadingIcon = styled(AiOutlineLoading3Quarters)`
  font-size: 2rem;
  color: #2b4b29;
  animation: spin 1s linear infinite;
`;

const UploadSection = () => {
  const [message, setMessage] = useState(""); // Message for success/error
  const [loading, setLoading] = useState(false); // Loading state for file upload

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; // Get first uploaded file

    if (!file) return;

    // Validate file type (accept only CSV files)
    if (!file.name.endsWith(".csv")) {
      setMessage("Please upload a valid CSV file. ❌");
      return;
    }

    setMessage(""); // Clear previous message
    setLoading(true); // Show loading spinner

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); // Hide loading spinner
        setMessage("Upload successful! ✅");
        console.log("Response from server:", data);
      })
      .catch((error) => {
        setLoading(false); // Hide loading spinner
        setMessage("Upload failed. ❌ Try again.");
        console.error("Error uploading file:", error);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <UploadContainer>
      <UploadTitle>Upload Herbal Data</UploadTitle>
      <UploadBox {...getRootProps()}>
        <input {...getInputProps()} />
        <UploadIcon />
        <UploadText>Drag & drop your file here, or click to select one.</UploadText>
      </UploadBox>
      {loading && <LoadingIcon />}
      {message && <Message success={message.includes("successful")}>{message}</Message>}
    </UploadContainer>
  );
};

export default UploadSection;
