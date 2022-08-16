const { Browser, Page } = require("puppeteer");
const { download } = require("../functions");

module.exports = {
    name: "Webtoon Hatti",
    author: "Emre Cebeci",
    version: "1.0",
    url_message: "Please enter first page URL of series: ",
    light_novel: false,
    has_thumbnail: false,
    browser: true,
    /**
     * @param {Browser} browser
     * @param {Page} page
     * @return {*} 
     */
    async run(browser, page) {
        /* Fetch other pages link */
        let chapters = await page.evaluate(async function () {
            let select = document.querySelector(`select.single-chapter-select`)
            let options = select.querySelectorAll("option")
            let chapters = []
            for (var i = options.length - 1; i > -1; i--) {
                chapters.push({ url: options[i].getAttribute("data-redirect"), title: options[i].innerHTML })
            }
            return chapters
        })
        let imgUrls = []
        let total = 0
        /* Crawl pages one by one... */
        for (let chapter of chapters) {
            await page.goto(chapter.url)
            //await page.waitForTimeout(400);
            let page_info = await page.evaluate(async function () {
                let total = 0
                let imgUrls = []
                let panel = document.querySelector("div.reading-content")
                let images = panel.querySelectorAll("img.wp-manga-chapter-img")
                for (var image of images) {
                    total += 1;
                    imgUrls.push(image.src)
                }
                return [total, imgUrls]
            })
            imgUrls = imgUrls.concat(page_info[1])
            total += page_info[0]
        }
        console.log("All data fetched, ".bold + total + " items will be downloaded.".bold)
        for(var [index, url] of imgUrls.entries()) {
            await download(url, index+".jpg")
            console.log(`${index+1}/${total} downloaded.`)
            global.results.pages.push(index+".jpg")
        }
    }
}