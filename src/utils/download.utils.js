export const downloadBlobResponse = (response, fallbackFileName) => {
    const blob = response?.data;
    if (!blob) throw new Error('No file data received');

    const contentDisposition = response.headers?.['content-disposition'] || response.headers?.get?.('content-disposition');

    let fileName = fallbackFileName;
    if (contentDisposition) {
        const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
        if (match && match[1]) {
            fileName = match[1];
        }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
