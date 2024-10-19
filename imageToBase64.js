function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        callback(base64String);
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        callback(null);
    };
    reader.readAsDataURL(file);
}

export { fileToBase64 };