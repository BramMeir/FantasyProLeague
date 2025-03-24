import puppeteer from "puppeteer";
import fs from "fs";

const url = "https://www.proleague.be/jpl-ranking";

const main = async () => {

    const browser = await puppeteer.launch({ headless: false }); // Set headless: true to run silently
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" }); // Ensure full page load

    // Extract ranking information from the page
    const matchData = await page.evaluate(() => {
        // Select the matchday
        const ranking_elements = document.querySelectorAll("tr.MkFootballCompetitionStandings__tr");

        // Select the team information
        return Array.from(ranking_elements).slice(1).map(team => {
            const columns = team.querySelectorAll("td");
            return {
                "rank": columns[0]?.textContent.trim(),
                "name": columns[1]?.textContent.trim(),
                "points": columns[2]?.textContent.trim(),
                "matches": columns[3]?.textContent.trim(),
                "wins": columns[4]?.textContent.trim(),
                "draws": columns[5]?.textContent.trim(),
                "losses": columns[6]?.textContent.trim(),
                "goals_for": columns[7]?.textContent.trim(),
                "goals_against": columns[8]?.textContent.trim(),
                "goal_difference": columns[9]?.textContent.trim()
            };
        });
    });

    // Save the extracted data to a JSON file
    fs.writeFileSync("../data/ranking.json", JSON.stringify(matchData, null, 2));

    await browser.close();
};

main();
