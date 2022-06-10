<h2>Impostors Genesis Items Claim Eligibilty Chrome Extension for OpenSea</h2>

A chrome extension to add genesis claim eligibility data to opensea

This extension adds info about round claim information to the collection grid view and info panels. The plugin uses ethersJS to fetch onchain data

Having an item emoji next to the item will represent if that item has been minted. This works for all item pages (so far Alien, UFO, Pet, Materials) and will work for further mints (cosmetics etc) without any input from the user (no extension uppdates required). I am providing the collection information from a separate repo which I will update as the new collection contracts mint

- Collection Information JSON fetched from: https://github.com/evilcandybar/impostors-eligibility-data/blob/master/collection-info.json
- Mint round information JSON fetched from: https://github.com/evilcandybar/impostors-eligibility-data/blob/master/round-info.json

https://github.com/evilcandybar/impostors-eligibility-data


https://user-images.githubusercontent.com/106555931/171300218-b756c5a9-20f6-4954-9e08-ed25fc079268.mov


![Image 30-05-2022 at 22 40](https://user-images.githubusercontent.com/106555931/171061640-59b32964-b607-488c-89ca-937ef452c161.jpg)


![Image 31-05-2022 at 21 36](https://user-images.githubusercontent.com/106555931/171280132-27a2d0d9-22b8-43c0-b862-f100657dc75c.jpg)


<h2>How to install</h2>

1. Download as a zip and unzip the project to get a folder named `impostors-claim-eligibility-opensea-extension-main`
2. Open google chrome and click the extensions button on the top right (jigsaw peice) ->. click "Manage Extensions" (alternatively go to **chrome://extensions/** in the browser url)
3. Enable the "Developer mode" on the top right
4. Click "Load unpacked" on the top left
5. navigate to the "release" folder of the downloaded project in your file explorer and click select
6. Navigate to opensea and view one the impostors collections or click an impostors genensis item (Alien, UFO, PET etc) and open the "info" panel

**Any support would be greatly appreciated: 0xFFA7AeA6182ed3f3fEC59075B8e4327A4f933Da9**

<h2>How to develop</h2>
This is my first attempt at a chrome plugin so its a little messy forgive me - if you have an idea on how to structure the build process please raise a pull request. Heres my process

- prereq - run `npm install`

1. make changes to the src .ts files - build using the command `npm run-script build`
2. common js files are generated in `dist` folder (something like 98437584h.js/4234939234j.js)
3. copy generated js files (98437584h.js/4234939234j.js) to `release` and rename to `asset-content-script.js` and `collection-content-script.js` (do a search in the files, the one with results for '`-btn`' is collection-content-script)
4. go to chrome and click refresh on the exttension from the manage extensions page

Im using rollup js to process the typescript file into common js. From my experience, this is neccessary in order to pack and convert any external packages and also add the polyfills (chrome extensions are very picky and need to be this way). I originally tried to work with web3JS instead of ethersJS but rollup had troubles adding the polyfills for webJS (rollup polyfills and rollup commonjs packages would conflict). Been trying for a while to get rollupjs to name the files more aptly but had not luck - for now need to do the renaming of the generated number named files.
