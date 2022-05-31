import { ethers } from "ethers";

export class AssetPageEligibilityController {

   
    REDEEMER_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_burnDestination","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotConfigureEmptyCriteria","type":"error"},{"inputs":[],"name":"CannotConfigureWithoutOutputItem","type":"error"},{"inputs":[],"name":"CannotConfigureWithoutPaymentToken","type":"error"},{"inputs":[],"name":"CannotRedeemCriteriaLengthMismatch","type":"error"},{"inputs":[],"name":"CannotRedeemForZeroItems","type":"error"},{"inputs":[],"name":"CannotRedeemItemAlreadyRedeemed","type":"error"},{"inputs":[],"name":"CannotRedeemUnownedItem","type":"error"},{"inputs":[],"name":"SweepingTransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":true,"internalType":"address[]","name":"criteria","type":"address[]"},{"components":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"indexed":true,"internalType":"struct ImpostorsRedeemer721.RedemptionConfig","name":"configuration","type":"tuple"}],"name":"ConfigUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"TokenRedemption","type":"event"},{"inputs":[],"name":"burnDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"address","name":"_collection","type":"address"},{"internalType":"uint256[]","name":"_tokenIds","type":"uint256[]"}],"name":"isRedeemed","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"uint256[][]","name":"_tokenIds","type":"uint256[][]"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"redeemed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"redemptionConfigs","outputs":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"redemptionCriteria","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"address[]","name":"_criteria","type":"address[]"},{"components":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"internalType":"struct ImpostorsRedeemer721.RedemptionConfig","name":"_config","type":"tuple"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_destination","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"sweep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];


    REDEEMER_CONTRACT_ADDRESS = '0xf2b49397f91de858ed4138a066b70ecef99db087';

    provider: any;
    contract: any;

    collectionInfo: any;
    roundInfo: any;

    tokenId: any;
    detailsContainerElement: any;

    constructor() {
        if (!!document.getElementById("claim-eligibility")) {
            return;
        }

        this.provider = new ethers.providers.EtherscanProvider('homestead', 'INSFD21PBJSPEEDU75SDJQ4HKTW6AKP3J5');
        this.contract = new ethers.Contract(this.REDEEMER_CONTRACT_ADDRESS, this.REDEEMER_CONTRACT_ABI, this.provider);

        this.retrieveMetaData();

        this.collectionInfo.forEach((collection: any) => {
            if (this.isCollectionProductPage(collection.name)) {
                this.retrieveTokenIdAndContainer();


                collection.relevantRounds.forEach(async (round: number) => {
                    const isRedeemed = await this.isRedeemed(collection.address, round, this.tokenId);
                    this.addEligibilityInfoToDom(round, isRedeemed);
                });
            }
        });
    }

    retrieveMetaData() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", 'https://raw.githubusercontent.com/evilcandybar/impostors-eligibility-data/master/collection-info.json', false );
        xmlHttp.send( null );
        this.collectionInfo = JSON.parse(xmlHttp.responseText);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", 'https://raw.githubusercontent.com/evilcandybar/impostors-eligibility-data/master/round-info.json', false );
        xmlHttp.send( null );
        this.roundInfo = JSON.parse(xmlHttp.responseText);
    }

    retrieveTokenIdAndContainer() {
        const detailsRows = document.getElementsByClassName('sc-1xf18x6-0 sc-1twd32i-0 sc-jjxyhg-0 sc-1d1o334-0 hDbqle kKpYwv gakOkv llrUFG');
        const tokenIdRows = Array.from(detailsRows).filter((row: any) => row.innerText.includes('Token ID'));

        if (tokenIdRows.length) {
            const row: any = tokenIdRows[0]
            this.tokenId = +row.innerText.substring('Token ID'.length);
            this.detailsContainerElement = row.parentNode;
        }
    }

    isCollectionProductPage(collectionName: string) {
        const aboutSection = document.getElementsByClassName('item--about-container');
        if (aboutSection.length) {
            const collectionHref = aboutSection[0].querySelectorAll('a')[0].href;
            return collectionHref.includes('/collection/' + collectionName);
        }

        return false;
    }

    isRedeemed(collectionAddress: string, round: number, tokenId: number) {
        return this.contract.redeemed(round, collectionAddress, tokenId);
    }

    addEligibilityInfoToDom(round: number, isRedeemed: boolean) {
        const roundInfo = this.roundInfo.filter((roundInfo: any) => roundInfo.roundNumber === round);
        let roundText = '';
        if (roundInfo.length) {
            roundText = roundInfo[0].description + ' Minted';
        }

        const divElement = document.createElement('div');
        divElement.classList.add('sc-1xf18x6-0', 'sc-1twd32i-0', 'sc-jjxyhg-0', 'sc-1d1o334-0', 'hDbqle', 'kKpYwv', 'gakOkv', 'llrUFG');
        divElement.innerHTML = roundText;
        divElement.id = "claim-eligibility";

        const spanElement = document.createElement('span');
        spanElement.classList.add('sc-1xf18x6-0', 'sc-1w94ul3-0', 'sc-1d1o334-1', 'hDbqle', 'jIeJKA', 'eTCgWn');
        spanElement.innerHTML = (isRedeemed ? 'Yes' : 'No');

        divElement.appendChild(spanElement);

        this.detailsContainerElement.appendChild(divElement);
    }
}