export default function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) {
            reject(new Error('Input is not a valid file.'));
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
