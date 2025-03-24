import puppeteer from "puppeteer";
import fs from "fs";

const url = "https://www.proleague.be/jpl-kalender";

const main = async () => {

    const browser = await puppeteer.launch({ headless: false }); // Set headless: true to run silently
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" }); // Ensure full page load

    let matchdays = []; // Store extracted matchday data
    let hasNextPage = true;

    while (hasNextPage) {
        // Extract list of matchdays from the page

        const matchData = await page.evaluate(() => {
            // Select the matchday
            const matchday = document.querySelector("span.sc-df0c41ad-3.hDRsm.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim().split(" ")[1];

            // Select all home teams
            const hometeams = document.querySelectorAll('div.MkFootballMatchCard--homeTeam');
    
            const hometeams_names = Array.from(hometeams).map(team => {
                // Extract name of home team
                return team.querySelector('span.MkFootballMatchCard__teamName')?.textContent.trim();                
            });

            // Select all away teams
            const awayteams = document.querySelectorAll('div.MkFootballMatchCard--awayTeam');

            const awayteams_names = Array.from(awayteams).map(team => {
                // Extract name of away team
                return team.querySelector('span.MkFootballMatchCard__teamName')?.textContent.trim();
            });

            return { "matchday": matchday, "matches": hometeams_names.map((team, index) => {
                return { "home": team, "away": awayteams_names[index] };
                }) 
            };
        });
        console.log(matchData);

        matchdays.push(matchData); // Append new data

        // Check if there is a "Next" button and if it's clickable
        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector("button.MkFootballModuleListCompetitionMatch__matchGroup__nextButton");
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {

            // Get the current matchday before clicking
            const lastMatchday = await page.evaluate(() => {
                const matchday = document.querySelector("span.sc-df0c41ad-3.hDRsm.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim();
                return matchday;
            });

            // Click the "Next" button and wait for the table to update
            await Promise.all([
                page.click("button.MkFootballModuleListCompetitionMatch__matchGroup__nextButton"), // Click the Next button
                page.waitForFunction(
                    (lastMatchday) => {
                        const matchday = document.querySelector("span.sc-df0c41ad-3.hDRsm.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim();
                        return matchday !== lastMatchday;
                    },
                    {},
                    lastMatchday
                )
            ]);
        }
    }

    // Save the extracted data to a JSON file
    fs.writeFileSync("../data/fixtures.json", JSON.stringify(matchdays, null, 2));

    await browser.close();
};

main();
