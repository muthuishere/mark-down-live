import http from 'http';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';
import {getCurrentProjectFolder} from "./shared/os_utils.js";
import chalk from "chalk";


const fsPromises = fs.promises;

export class AppServer {
    constructor(port, folder) {
        this.port = port;
        this.folder = folder;
        this.server = http.createServer(this.requestListener.bind(this));
        this.wss = new WebSocket.Server({server: this.server});
        this.setupWebSocket();
    }

    close() {
        // Close all WebSocket connections
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });

        // Close the WebSocket server
        this.wss.close(() => {
            console.log('WebSocket Server closed');
        });

        // Close the HTTP server
        this.server.close(() => {
            console.log('HTTP Server closed');
        });

        // Handle any additional cleanup if necessary
    }

    async serveFile(filePath, contentType, res) {
        try {
            const data = await fs.readFile(filePath);
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        } catch (error) {
            res.writeHead(500);
            res.end(`Server Error: ${error.code}`);
        }
    }

    requestListener(req, res) {
        let filePath = path.join(this.folder, req.url === '/' ? 'index.html' : req.url);
        let extname = path.extname(filePath);

        switch (extname) {
            case '.css':
                this.serveFile(filePath, 'text/css', res);
                break;
            case '.js':
                this.serveFile(filePath, 'application/javascript', res);
                break;
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                this.serveFile(filePath, `image/${extname.slice(1)}`, res);
                break;
            default:
                this.serveHtml(filePath, res);
        }
    }

    async serveHtml(filePath, res) {
        try {
            let data = await fsPromises.readFile(filePath, 'utf8');

            let script = await fsPromises.readFile(getCurrentProjectFolder() + "/assets/injected.html", 'utf8');

            data = data.replace('</body>', script + '</body>');
            // }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        } catch (error) {
            res.writeHead(500);
            res.end(`Server Error: ${error.code}`);
        }

        // this.serveFile(filePath, 'text/html', res);
    }

    setupWebSocket() {
        this.wss.on('connection', ws => {
            console.log('Client connected');
            ws.on('message', message => {
                console.log(`Received: ${message}`);
                this.wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            });
            ws.on('close', () => console.log('Client disconnected'));
        });
    }

    start() {

        this.server.listen(this.port, () => {
            console.error(chalk.greenBright(`Present Makrdown Server running on port ${this.port}`));
        });

        this.server.on('error', (err) => {
            console.error(chalk.red('Server error:' + err));
        });

        // Keep the server running
        process.on('uncaughtException', (err) => {
            // console.error('Uncaught Exception:', err);
            console.error(chalk.red('Uncaught Exception:' + err));
            // Optionally restart the server or handle as needed
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error(chalk.red('Unhandled Rejection at:' + promise + 'reason:' + reason));

            // Optionally restart the server or handle as needed
        });


    }

    sendMessage(message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {

                if(typeof message === 'object'){
                    message = JSON.stringify(message);
                }

                client.send(message);
            }
        });
    }
}

/** @type {AppServer} */
let server;

export async function startAppServer(outputfolder, port) {


    server = new AppServer(port, outputfolder);
    await server.start();


}


export async function sendMessageToWebSockets(msg) {

console.log('sendMessageToWebSockets', msg);
    server.sendMessage(msg);

}

export function stopAppServer() {
    server.close();
}