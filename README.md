

## Manga Web Crawler
- Simple and extendable ready to use web crawler for no-api provided and api provided manga websites.
- For API services it uses Axios, for non-api websites it uses Puppeteer to crawl the website.
- You can add your own crawler for specific website if you want!
### Usage
When you start the MWCrawler, it will ask you to "chose one crawler from up above", you must choose which crawler to use by entering the crawler number.

Then, it will ask you something special, it might be the first chapter of manga or about page of manga. You must enter the url of wanted thing in this part.

MWCrawler will start crawling now.  It might give error, for now just restart it.

### Features
- Turns bunch of images to PDF.
- Creates light-novel manga PDF.
- Adds thumbnail image to PDF. (if specified)
- Clears HTML tags in text for light-novel setting.
- Can turn GIF to PNG if thumbnail is GIF.

### Installation
Open a terminal on MWCrawler's directory and execute these commands below.
```bash
npm i
npm start
```
##### Installing Another Crawler
Move your crawler into `websites` folder and the crawler will be listed in MWCrawler!

#### Writing Your Own Crawler
- Writing a crawler is so easy! Because the MWCrawler handles PDF things.
- First, you must know the architecture of crawlers:

```javascript
module.exports = {
    name: "Epik Manga",
    author: "Emre Cebeci",
    version: "1.0",
    url_message: "Please enter first page URL of series: ",
    light_novel: true,
    has_thumbnail: true,
    browser: true,
    async run(browser, page) { ... }
}
```

- **name:** name of crawler
- **author:** creator of crawler
- **version:** version of crawler
- **url_message:** the text that will be shown on URL entering stage
- **light_novel:** if website is only for light novels then set it to `true`, but if you will fetch images then set it to `false`
- **has_thumbnail:** if website provides thumbnails for mangas set it to `true` else `false`
- **browser:** whether if you need browser or not (not supported yet! now, it opens browser for everything)
- **run:** the function that will be executed when the user enters URL. The two arguments are Puppeteer `Browser` and `Page` objects.
___

- **Writing own `run` function:**
#### Light Novel
- You should push every page to `global.results.pages` variable.
- The structre of page object must be like that:
```json
{ "title": "Title of Page (optional)", "text": "Text of Page" }
```
- You must push your pages in order! 
- Example:
```json
{
	"pages": [
		{ "title": "Page 1", "text": "Lorem ipsum..." }
		{ "title": "Page 2", "text": "lorem ipusm..." }
	]
}
 ```
#### Image Series
- You should push every page to `global.results.pages` variable.
- The page must be string, and it must refer to `path_of_image.png`
- You must push your pages in order! 
- Example:
```json
{
	"pages": [
		"page_1.png"
		"page_2.png"
	]
}
 ```

### Built-in Functions (functions.js)
**async download(url, name):** Downloads the file from `url` and saves it in `downloads` as `name`
**async gifToPng(url):** Downloads the GIF from `url` and converts it to PNG then saves it in `downloads` as `thumbnail.png`
**async sleep(milliseconds):** Halts the program for `milliseconds` ms
