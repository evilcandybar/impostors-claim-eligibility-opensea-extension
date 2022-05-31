<h2>Impostors Genesis Items Claim Eligibilty Chrome Extension for OpenSea</h2>

A chrome extension to add genesis claim eligbiliy data to info panel in opensea

This extension adds info about round claim information to the "Info" panel in the opensea asset view. The plugin uses ethersJS to fetch onchain data. Information about collection info (UFO, Pet, Materials etc) is fetch from json file stored on a github page (so i can add future item mint info in the future. The plugin won't need to be updated by each individual user upon new collection mints!) - json files can be found here https://github.com/evilcandybar/impostors-eligibility-data


![Image 30-05-2022 at 22 40](https://user-images.githubusercontent.com/106555931/171061640-59b32964-b607-488c-89ca-937ef452c161.jpg)


<h2>How to install</h2>

1. Download and unzip the project to get a folder named `impostors-claim-eligibility-opensea-extension-main`
2. Open google chrome and click the extensions button on the top right (jigsaw peice) ->. click "Manage Extensions"
3. Enable the "Developer mode" on the top right
4. Click "Load unpacked" on the top left
5. navigate to the "release" folder of the downloaded project in your file explorer and click select
6. Navigate to opensea and click an impostors genensis item (Alien, UFO, PET etc) and open the "info" panel

Note: You made need to refresh the page if it doesnt appear - been working on to fix this for a while and ive hit a dead end x)

**Any support would be greatly appreciated: 0xFFA7AeA6182ed3f3fEC59075B8e4327A4f933Da9**

<h2>How to develop</h2>
This is my first attempt at a chrome plugin so its a little messy forgive me - if you have an idea on how to structure the build process please raise a pull request. Heres my process

1. make changes to the src .ts files - build using the command `npm run-script build`
2. common js is generated in `dist` folder (something like 98437584h.js)
3. copy generated js file (98437584h.js) to `release` and rename to `content-script.js`
4. go to chrome and click refresh on the exttension from the manage extensions page

Im using rollup js to process the typescript file into common js. From my experience, this is neccessary in order pack and convert any external packages and also add the polyfills (chrome extensions are very picky and need to be this way). I originally tried to work with web3JS instead of ethersJS rollup had troubles adding the polyfills for webJS (rollup polyfills and rollup commonjs packages would conflict)
