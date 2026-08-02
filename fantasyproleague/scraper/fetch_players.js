import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// Load the mapping between team names and their abbreviations
const teams = JSON.parse(fs.readFileSync("../backend/data/teams.json", "utf-8"));
console.log("Loaded team abbreviations:", teams);

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
    console.log(teams);
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
        const playButtonSelector = 'button.pl-btn--md';
        await page.waitForSelector(playButtonSelector, { timeout: 10000 });
        await Promise.all([
            page.click(playButtonSelector),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        console.log("Navigated to the team overview.");
    } catch (error) {
        console.log("Could not find 'Speel mee' button. Assuming we are already on the team overview page.");
    }
    
    // --- NEW STEP: CLICK ON THE "Transfers" button (contains span with text "Transfers") ---
    try {
        console.log("Clicking on the 'Transfers' button...");
        const transfersButtonSelector = 'button.pl-segmented-control__option span';
        await page.waitForSelector(transfersButtonSelector, { timeout: 10000 });
        const transfersButtons = await page.$$(transfersButtonSelector);
        let transfersButtonFound = false;
        for (const button of transfersButtons) {
            const buttonText = await page.evaluate((el) => el.textContent, button);
            if (buttonText.includes("Transfers")) {
                await Promise.all([
                    button.click(),
                    page.waitForNavigation({ waitUntil: 'networkidle0' })
                ]);
                transfersButtonFound = true;
                console.log("Successfully navigated to the Transfers page.");
                break;
            }
        }
        if (!transfersButtonFound) {
            throw new Error("Could not find the 'Transfers' button.");
        }
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
        await page.waitForSelector('.player-name'); // Wait for player rows to be ready

        const playersOnPage = await page.evaluate(() => {
            const rows = document.querySelectorAll('.sc-fONwsr.gzBckv');
            return Array.from(rows).map(row => {
                const nameEl = row.querySelector('.player-name');
                const clubEl = row.querySelector('.player-club');
                const positionEl = row.querySelector('.player-position');
                const priceEl = row.querySelector('.sc-kLIISr.iNQtub span');
                const imgEl = row.querySelector('.PlayerMedia img');

                if (!nameEl || !clubEl || !positionEl || !priceEl || !imgEl) return null;              

                return {
                    name: nameEl.innerText.trim(),
                    team: clubEl.innerText.trim(),
                    position: positionEl.innerText.trim(),
                    price: priceEl.innerText.trim().replace('€', '').replace('M', ''),
                    imageUrl: imgEl.src
                };
            }).filter(player => player !== null);
        });

        allPlayers.push(...playersOnPage);

        console.log(`Scraped ${playersOnPage.length} players from this page. Total so far: ${allPlayers.length}.`);

        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector(".ant-pagination-next button");
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {
            const firstPlayerName = playersOnPage.length > 0 ? playersOnPage[0].name : '';

            console.log("Clicking 'Next' to go to the next page of players...");
            console.log(`Waiting for the first player's name to change from "${firstPlayerName}"...`);
            await Promise.all([
                page.click(".ant-pagination-next button"),
                page.waitForFunction(
                    (previousFirstName) => {
                        const currentFirstName = document.querySelector(".player-name")?.innerText.trim();
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
        const filename = `${sanitizedName}-${teams[player.team.toLowerCase()]?.abbreviation}.png`;
        const filepath = path.join(outputDir, filename);
        console.log(`Downloading image for ${player.name} (${player.team})...`);
        await downloadImage(player.imageUrl, filepath);
    }

    console.log("All player images have been downloaded successfully!");

    // Save the extracted data to a JSON file
    fs.writeFileSync("../backend/data/players.json", JSON.stringify(allPlayers, null, 2));

    await browser.close();
};

main();
