const { default: axios } = require("axios");
const { Browser, Page } = require("puppeteer");
const { download, sleep } = require("../functions")
module.exports = {
    name: "Manga Gecesi",
    author: "Emre Cebeci",
    version: "1.0",
    url_message: "Please enter the episode 0 page URL of series: ",
    light_novel: false,
    has_thumbnail: false,
    browser: false,
    /**
     * @param {Browser} browser
     * @param {Page} page
     * @return {*} 
     */
    async run(browser, page) {
        // Fetch chapter data first
        let comic_name = await page.url().replace(/[^]*cizgi-romanlar[/]/g, "").split("/")[0]
        let response = await axios.get(`https://mangagecesi.com/v1/comics/${comic_name}/chapter-list`)
        let chapters = response.data.length
        // Start fetching images
        let total = 0;
        for (var i = 0; i < chapters; i++) {
            let chapter_data = {}
            try {
                chapter_data = await axios.get(`https://mangagecesi.com/v1/comics/${comic_name}/chapters/bolum-${i}`)
                console.log(i + ". bölüm indiriliyor (" + chapter_data.data.chapter.pages.length + " sayfa)")
                for (var [index, url] of chapter_data.data.chapter.pages.entries()) {
                    await download(url, total + ".jpg")
                    console.log(i + ". bölüm sayfa " + index + " indirildi.")
                    global.results.pages.push(total + ".jpg")
                    total += 1
                }
            } catch (err) {
                console.log(err)
                await sleep(5000)
            }
        }


        return global.results
    }
}