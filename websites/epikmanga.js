const { Browser, Page } = require("puppeteer");
const { download, gifToPng } = require("../functions");

module.exports = {
    name: "Epik Manga",
    author: "Emre Cebeci",
    version: "1.0",
    url_message: "Please enter first page URL of series: ",
    light_novel: true,
    has_thumbnail: true,
    browser: true,
    /**
     * @param {Browser} browser
     * @param {Page} page
     * @return {*} 
     */
    async run(browser, page) {
        let name = await page.evaluate(async function () {
            let panel = document.querySelector("div#icerik")
            let manga = panel.querySelector("center").querySelector("h4").innerHTML;
            return manga
        })
        global.results.name = name

        /* Fetch other pages link */
        let chapters = await page.evaluate(async function () {
            let select = document.querySelector(`select[name="mangaType"]`)
            let options = select.querySelectorAll("option")
            let chapters = []
            for (var i = options.length - 1; i > -1; i--) {
                chapters.push({ url: options[i].value, title: options[i].innerHTML })
            }
            return chapters
        })

        /* Crawl pages one by one... */
        for (let chapter of chapters) {
            await page.goto(chapter.url)
            //await page.waitForTimeout(400);
            let page_text = await page.evaluate(async function () {
                let panel = document.querySelector("div#icerik")
                let paragraphs = panel.querySelectorAll("p")
                let text = ""
                for (var p of paragraphs) {
                    text = text + p.innerHTML + "\n"
                }
                return text
            })
            global.results.pages.push({ title: chapter.title, text: page_text })
        }
        // Get thumbnail image
        let thumbnail_url = await page.evaluate(async function () {
            let img = document.querySelector(`img.manga-cover`)
            return img.getAttribute("src")
        })
        if(thumbnail_url.endsWith(".gif"))
        {
            await gifToPng(thumbnail_url)
        } else download(thumbnail_url, "thumbnail.png")
        return global.results
}
}