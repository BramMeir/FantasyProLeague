import puppeteer from "puppeteer";
import fs from "fs";

const url = "https://fantasy.proleague.be/stats";

// Load the mapping between team names and their abbreviations
const teams = JSON.parse(fs.readFileSync("../data/teams.json", "utf-8"));

const main = async () => {

    const browser = await puppeteer.launch({ headless: false }); // Set headless: true to run silently
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" }); // Ensure full page load

    let allData = []; // Store extracted data
    let hasNextPage = true;
    let lastFirstPlayerName = ''; // Store the name of the first player for comparison

    while (hasNextPage) {
        // Extract table data from current page
        const data = await page.evaluate((teams) => {
            const rows = document.querySelectorAll("tr.ant-table-row"); // Select all table rows
            return Array.from(rows).map(row => {
                const columns = row.querySelectorAll("td"); // Get all columns
                return {
                    name: columns[1]?.innerText.trim(),   // Player Name
                    team: teams[columns[2]?.innerText.trim()].name,   // Team
                    position: columns[3]?.innerText.trim(), // Position
                    points: columns[4]?.innerText.trim(), // Points
                    goals: columns[5]?.innerText.trim(),  // Goals
                    assists: columns[6]?.innerText.trim(), // Assists
                    price: columns[7]?.innerText.trim().   // Price (€), remove € and M sign
                        replace("€", "").replace("M", ""),
                };
            });
        }, teams);

        allData.push(...data); // Append new data

        // Check if there is a "Next" button and if it's clickable
        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector(".ant-pagination-next button");
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {

            // Get the name of the first player in the table before clicking
            const lastFirstPlayerName = await page.evaluate(() => {
                const firstRow = document.querySelector("tr.ant-table-row");
                const columns = firstRow?.querySelectorAll("td");
                return columns ? columns[1]?.innerText.trim() : '';
            });

            // Click the "Next" button and wait for the table to update
            await Promise.all([
                page.click(".ant-pagination-next button"), // Click the Next button
                page.waitForFunction(
                    (lastFirstPlayerName) => {
                        const firstRow = document.querySelector("tr.ant-table-row");
                        const columns = firstRow?.querySelectorAll("td");
                        return columns ? columns[1]?.innerText.trim() !== lastFirstPlayerName : false;
                    },
                    {},
                    lastFirstPlayerName
                )
            ]);
        }
    }

    // Print the number of players extracted
    console.log(`Total players extracted: ${allData.length}`);

    // Save the extracted data to a JSON file
    fs.writeFileSync("../data/players.json", JSON.stringify(allData, null, 2));

    await browser.close();
};

main();
