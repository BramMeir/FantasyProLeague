// scrape-all-player-images.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// --- SETUP (no changes) ---
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const loginUrl = "https://proleague.unidy.de/users/login";
const teamUrl = "https://fantasy.proleague.be/team/67155"; // We start here to find the buttons

const email = process.env.FANTASY_EMAIL;
const password = process.env.FANTASY_PASSWORD;

const outputDir = path.join(__dirname, "../frontend/public/images/players");

// --- HELPER FUNCTIONS (no changes) ---
const downloadImage = async (imageUrl, filepath) => {
    try {
        const response = await axios({ method: 'GET', url: imageUrl, responseType: 'stream' });
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download ${imageUrl}: ${error.message}`);
    }
};


const main = async () => {
    // --- VALIDATION AND SETUP (no changes) ---
    if (!email || !password) {
        console.error("ERROR: Please create a .env file and add FANTASY_EMAIL and FANTASY_PASSWORD.");
        return;
    }
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created directory: ${outputDir}`);
    }

    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1280, height: 800 } });
    const page = await browser.newPage();
    

    // --- 1. AUTHENTICATION (no changes) ---
    console.log("Navigating to login page...");
    await page.goto(loginUrl, { waitUntil: "networkidle2" });

    console.log("Entering credentials...");
    await page.waitForSelector('#login_email');
    await page.type('#login_email', email);
    await page.keyboard.press('Enter');

    await page.waitForSelector('#user_password');
    await page.type('#user_password', password);

    console.log("Submitting password...");

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 120000 });
    console.log("2FA complete, login successful!");


    // --- 2. NAVIGATION TO TRANSFERS PAGE ---
    console.log(`Navigating to entry page: ${teamUrl}`);
    await page.goto(teamUrl, { waitUntil: "networkidle2" });

    try {
        console.log("Clicking the 'Speel mee' button...");
        const playButtonSelector = 'button.playNow';
        await page.waitForSelector(playButtonSelector, { timeout: 10000 });
        await Promise.all([
            page.click(playButtonSelector),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        console.log("Navigated to the team overview.");
    } catch (error) {
        console.log("Could not find 'Speel mee' button. Assuming we are already on the team overview page.");
    }
    
    // --- NEW STEP: CLICK ON THE "Transfers" LINK ---
    try {
        console.log("Clicking on the 'Transfers' link...");
        const transferLinkSelector = 'a[href="/edit/67155"]';
        await page.waitForSelector(transferLinkSelector);
        await Promise.all([
            page.click(transferLinkSelector),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        console.log("Successfully navigated to the Transfers page.");
    } catch (error) {
        console.error("Fatal: Could not find or click the 'Transfers' link. Stopping script.");
        await browser.close();
        return;
    }


    // --- 3. SCRAPING ALL PLAYERS WITH PAGINATION ---
    let allPlayers = [];
    let hasNextPage = true;

    while (hasNextPage) {
        console.log("Scraping a new page of players...");
        await page.waitForSelector('tr.ant-table-row'); // Wait for table to be ready

        const playersOnPage = await page.evaluate(() => {
            const rows = document.querySelectorAll("tr.ant-table-row");
            return Array.from(rows).map(row => {
                const nameEl = row.querySelector('.name span');
                const teamEl = row.querySelector('.player-club');
                const imageEl = row.querySelector('img');
                if (!nameEl || !teamEl || !imageEl) return null;
                return {
                    name: nameEl.innerText.trim(),
                    team: teamEl.innerText.trim(),
                    imageUrl: imageEl.src,
                };
            }).filter(player => player !== null);
        });

        allPlayers.push(...playersOnPage);

        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector(".ant-pagination-next button");
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {
            const firstPlayerName = playersOnPage.length > 0 ? playersOnPage[0].name : '';
            await Promise.all([
                page.click(".ant-pagination-next button"),
                page.waitForFunction(
                    (previousFirstName) => {
                        const currentFirstName = document.querySelector("tr.ant-table-row .name span")?.innerText.trim();
                        return currentFirstName && currentFirstName !== previousFirstName;
                    },
                    {},
                    firstPlayerName
                )
            ]);
        }
    }

    console.log(`Found a total of ${allPlayers.length} players. Starting download...`);

    // --- 4. DOWNLOADING ---
    for (const player of allPlayers) {
        const sanitizedName = player.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedName}-${player.team.toLowerCase()}.png`;
        const filepath = path.join(outputDir, filename);
        console.log(`Downloading image for ${player.name} (${player.team})...`);
        await downloadImage(player.imageUrl, filepath);
    }

    console.log("All player images have been downloaded successfully!");
    await browser.close();
};

main();