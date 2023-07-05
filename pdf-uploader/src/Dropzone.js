import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Set the parameters
const REGION = process.env.REACT_APP_REGION;
const ID = process.env.REACT_APP_ACCESS_KEY;
const SECRET = process.env.REACT_APP_SECRET_KEY;
const BUCKET = process.env.REACT_APP_BUCKET_NAME;

// Set up the AWS SDK
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ID,
    secretAccessKey: SECRET,
  },
});

const MyDropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);

        // Prepare the parameters for the S3 upload
        const uploadParams = {
          Bucket: BUCKET,
          Key: file.path, // name of the file in your S3 bucket
          Body: binaryStr,
          ContentType: file.type,
        };

        try {
          // Upload the file to S3
          const data = await s3.send(new PutObjectCommand(uploadParams));
          console.log("Success, file uploaded", data);
        } catch (err) {
          console.log("Error", err);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default MyDropzone;
