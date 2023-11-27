import electron from 'electron';
import puppeteer from "puppeteer";
import playwright from "playwright";

const { app, BrowserWindow } = electron;

export function openOldApp(url){


const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        fullscreen: true, // Enables full screen
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Adjust as needed for security
        }
    });

    // Load the specified URL
    win.loadURL(url); // Replace with your desired URL
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {

    console.log("Window Closed")
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    console.log("Window activated")
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
}


export async function openPupeterApp(url) {
    const browser = await puppeteer.launch({headless: false, args: ['--start-fullscreen']});
    const page = await browser.newPage();
    await page.goto(url);
}
export async function openApp(url) {

    const browser = await playwright.chromium.launch({
        headless: false,
        args: ['--start-fullscreen'] // Opens the browser in full screen
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);

}