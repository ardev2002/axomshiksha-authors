interface UploadFileWithProgressParams {
    file: File;
    presignedUrl: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
}

export function uploadFileWithProgress({ 
    file, 
    presignedUrl,
    onProgress,
    onComplete,
    onError
}: UploadFileWithProgressParams) {
    const xhr = new XMLHttpRequest();

    // Track upload progress using the 'progress' event on xhr.upload
    xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`Upload progress: ${Math.round(percentComplete)}%`);
            if (onProgress) {
                onProgress(percentComplete);
            }
        }
    }, false);

    // Handle upload completion
    xhr.addEventListener('load', function() {
        if (xhr.status === 200) {
            console.log('Upload successful!');
            if (onComplete) {
                onComplete();
            }
        } else {
            console.error('Upload failed. Status:', xhr.status);
            if (onError) {
                onError(new Error(`Upload failed with status: ${xhr.status}`));
            }
        }
    }, false);

    // Handle upload errors
    xhr.addEventListener('error', function() {
        const error = new Error('Upload failed due to a network error.');
        console.error(error.message);
        if (onError) {
            onError(error);
        }
    }, false);

    // Handle upload cancellation/abort
    xhr.addEventListener('abort', function() {
        const error = new Error('Upload aborted.');
        console.error(error.message);
        if (onError) {
            onError(error);
        }
    }, false);

    // Open the PUT request to the S3 pre-signed URL
    xhr.open('PUT', presignedUrl, true);
    
    // Set necessary headers, if any (Content-Type is often required)
    // S3 requires the Content-Type header to be present and match the one used during signing
    xhr.setRequestHeader('Content-Type', file.type); 

    // Send the file data
    xhr.send(file);
}