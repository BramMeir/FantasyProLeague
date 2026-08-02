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
            const matchday = document.querySelector("div.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim().split(" ")[1];
    
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

            // Make sure both home and away teams are unique
            const uniqueHometeams = [...new Set(hometeams_names)];
            const uniqueAwayteams = [...new Set(awayteams_names)];

            return { "matchday": matchday, "matches": uniqueHometeams.map((team, index) => {
                return { "home": team, "away": uniqueAwayteams[index] };
                }) 
            };
        });

        matchdays.push(matchData); // Append new data

        console.log(`Extracted matchday: ${matchData.matchday} with ${matchData.matches.length} matches.`);

        // Check if there is a "Next" button and if it's clickable
        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector("button.MkFootballModuleListCompetitionMatch__matchGroup__nextButton");
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {

            // Get the current matchday before clicking
            const lastMatchday = await page.evaluate(() => {
                const matchday = document.querySelector("div.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim().split(" ")[1];
                return matchday;
            });

            // Click the "Next" button and wait for the table to update
            await Promise.all([
                page.click("button.MkFootballModuleListCompetitionMatch__matchGroup__nextButton"), // Click the Next button
                page.waitForFunction(
                    (lastMatchday) => {
                        const matchday = document.querySelector("div.MkFootballModuleListCompetitionMatch__matchGroup__gameweekName")?.textContent.trim().split(" ")[1];
                        return matchday !== lastMatchday;
                    },
                    {},
                    lastMatchday
                )
            ]);
        }
    }

    // Save the extracted data to a JSON file
    fs.writeFileSync("../backend/data/fixtures.json", JSON.stringify(matchdays, null, 2));

    await browser.close();
};

main();
