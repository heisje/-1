export class HttpError extends Error {
    constructor(status, statusText, data) {
        super(statusText);
        this.status = status;
        this.data = data;
    }
}

export async function http(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new HttpError(response.status, response.statusText, errorData);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError(0, 'Network error', { message: error.message });
        }
    }
}

// // Error handling example
// async function fetchData() {
//     try {
//         const data = await http('https://api.example.com/data');
//         console.log(data);
//     } catch (error) {
//         if (error instanceof HttpError) {
//             console.error(`HTTP Error: ${error.status} - ${error.message}`);
//             console.error('Error details:', error.data);
//         } else {
//             console.error('Unexpected error:', error);
//         }
//     }
// }

// fetchData();