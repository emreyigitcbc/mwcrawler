/* Manga Web Crawler for Websites That Has No API Service
 * ======================================================
 * Version: 1.0
 * Author: Emre Cebeci
 * Date: 08.13.2022
*/

/* Import required modules */
const puppeteer = require("puppeteer")
const fs = require("fs")
const readline = require('readline-sync')
const colors = require("colors")
const PDFDocument = require('pdfkit');
const axios = require("axios").default
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36 Edg/104.0.1293.54'
axios.defaults.headers.common["sec-ch-ua"] = '"Chromium";v="104", " Not A;Brand";v="99", "Microsoft Edge";v="104"'
async function getAvailableWebsites() {
    let files = await fs.readdirSync("./websites")
    let filtered_files = files.filter(file => file.endsWith(".js"))
    let websites = []
    for (var file of filtered_files) {
        let prop = require("./websites/" + file)
        if (prop.name && prop.version && prop.author) {
            websites.push({ name: prop.name, version: prop.version, author: prop.author, file: file, url_message: prop.url_message })
        }
    }
    return websites
}
(async () => {
    console.log("Welcome to Cebeci's Manga Web Crawler".cyan)
    console.log("=====================================".white)
    console.log("- Available websites:".yellow)
    let websites = await getAvailableWebsites()
    for (var i = 0; i < websites.length; i++) {
        console.log(`${((i + 1) + "").green} - ${websites[i].name.magenta} v${websites[i].version.red} by ${websites[i].author.yellow}`)
    }
    let pass = false
    let chosen = 0
    while (!pass) {
        chosen = readline.question("Choose one: ".bold)
        try {
            chosen = Number(chosen) || 9999
            if (chosen == 9999) throw { code: "NOT_VALID" }
            if (chosen > 0 && chosen <= websites.length) {
                pass = true
            } else {
                throw { code: "RANGE", max: websites.length }
            }
        } catch (err) {
            if (err.code === "RANGE") {
                console.log(("Please, enter a number between 1 and " + err.max).red)
            } else {
                console.log("Please enter a valid number!".red)
            }
        }
    }
    let selected = websites[chosen - 1]
    let url = readline.question(selected.url_message.bold)

    /* START BROWSER & PAGE */
    try {
        global.results = {
            pages: [],
            title: "",
            name: ""
        }
        let selectedCrawler = require("./websites/" + selected.file)
        const browser = await puppeteer.launch({ headless: false, args: ['--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests', '--disable-web-security', '--disable-site-isolation-trials'] });
        const page = await browser.newPage();
        await page.goto(url);
        page.exposeFunction("consoleLog", console.log)
        await selectedCrawler.run(browser, page);
        console.log("Finished crawling!".bold)
        await browser.close();
        let save_file = readline.question("Please enter a file name to save the results: ".bold) + ".pdf"
        console.log("Perfect! Your PDF file will be saved as: ".green + save_file.bold)
        /* Create new PDF document */
        const doc = new PDFDocument({ autoFirstPage: false });
        doc.font("comic.ttf")
        doc.pipe(fs.createWriteStream("./results/" + save_file));
        // Handling the thumbnail
        if (selectedCrawler.has_thumbnail) {
            var img = doc.openImage("./downloads/thumbnail.png");
            doc.addPage({ size: [img.width, img.height] });
            doc.image(img, 0, 0);
        }
        // Checking if it should be saved as text or combination of images
        if (selectedCrawler.light_novel) {
            for (const page of global.results.pages) {
                // Removing any HTML elements
                modified_text = page.text.replace(/<[^>]*>/g, "")
                doc.addPage().text(modified_text)
            }
        } else {
            for(var file of global.results.pages) {
                var img = doc.openImage("./downloads/"+file);
                doc.addPage({ size: [img.width, img.height] });
                doc.image(img, 0, 0);
            }
        }
        doc.end()
        console.log("Finished creating PDF file. Your file saved in 'results' folder, named as ".green + save_file.bold)
    } catch (err) {
        console.log(err)
    }
})()