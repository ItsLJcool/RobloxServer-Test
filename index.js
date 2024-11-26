
require('./utils/prisma_client');

const prisma = global.prisma;

// Dependencies
const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 10867; // 10867
const baseFolder = path.join(__dirname, 'public'); // Folder to serve files from

// Create HTTP server
const server = http.createServer(function (request, response) {
    
    if (request.method === 'POST') {
        handlePostRequest(request, response);
        return;
    }

    // Get the path from the URL
    const requestPath = decodeURIComponent(request.url);

    // Resolve the file path in the base folder
    let filePath = path.join(baseFolder, requestPath);

    // Ensure the file path is within the base folder (prevent directory traversal attacks)
    if (!filePath.startsWith(baseFolder)) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403 Forbidden');
        return;
    }

    // Check if the path points to a folder
fs.stat(filePath, (err, stats) => {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found');
            return;
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html'); // Default to index.html
        }

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('404 Not Found');
                return;
            }

            const mimeType = getMimeType(filePath);

            response.writeHead(200, { 'Content-Type': mimeType });
            fs.createReadStream(filePath).pipe(response);
        });
    });
});

function handlePostRequest(request, response) {
    let body = '';

    // Read the request body
    request.on('data', (chunk) => {
        body += chunk.toString();
    });

    // When the body is fully received
    request.on('end', () => {
        try {
            const data = JSON.parse(body); // Parse JSON data if applicable
            console.log('Received POST data:', data);

            // Respond to the client
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Data received successfully', received: data }));
        } catch (error) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
    });

    // Handle errors
    request.on('error', (error) => {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('500 Internal Server Error');
    });
}

// Start the server
server.listen(port, function () {
    console.log(`Server is listening on port ${port}`);

    console.log("process.argv: ", process.argv);
});

// Utility function to determine MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}

// async function main() {

//     const bruh = await prisma.RobloxUser.create({
//         data: {
//           id: "test",
//         }
//     });
    
//     console.log("bruh: ", bruh);
// }

// main();