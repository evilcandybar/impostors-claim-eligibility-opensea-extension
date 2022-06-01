import { ethers } from "ethers";

export interface TokenEligibilityModel {
    tokenId: number;
    roundClaimMap: Map<number, boolean>
}

export class CollectionPageEligibilityController {

    

    REDEEMER_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_burnDestination","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotConfigureEmptyCriteria","type":"error"},{"inputs":[],"name":"CannotConfigureWithoutOutputItem","type":"error"},{"inputs":[],"name":"CannotConfigureWithoutPaymentToken","type":"error"},{"inputs":[],"name":"CannotRedeemCriteriaLengthMismatch","type":"error"},{"inputs":[],"name":"CannotRedeemForZeroItems","type":"error"},{"inputs":[],"name":"CannotRedeemItemAlreadyRedeemed","type":"error"},{"inputs":[],"name":"CannotRedeemUnownedItem","type":"error"},{"inputs":[],"name":"SweepingTransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":true,"internalType":"address[]","name":"criteria","type":"address[]"},{"components":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"indexed":true,"internalType":"struct ImpostorsRedeemer721.RedemptionConfig","name":"configuration","type":"tuple"}],"name":"ConfigUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"TokenRedemption","type":"event"},{"inputs":[],"name":"burnDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"address","name":"_collection","type":"address"},{"internalType":"uint256[]","name":"_tokenIds","type":"uint256[]"}],"name":"isRedeemed","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"uint256[][]","name":"_tokenIds","type":"uint256[][]"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"redeemed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"redemptionConfigs","outputs":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"redemptionCriteria","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"},{"internalType":"address[]","name":"_criteria","type":"address[]"},{"components":[{"internalType":"uint96","name":"price","type":"uint96"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"address","name":"payingToken","type":"address"},{"internalType":"uint96","name":"amountOut","type":"uint96"}],"internalType":"struct ImpostorsRedeemer721.RedemptionConfig","name":"_config","type":"tuple"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_destination","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"sweep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];


    REDEEMER_CONTRACT_ADDRESS = '0xf2b49397f91de858ed4138a066b70ecef99db087';

    provider: any;
    contract: any;

    collectionInfo: any;
    roundInfo: any;

    collectionType: any;
    tokenId: any;
    detailsContainerElement: any;
    eligibilityResults: TokenEligibilityModel[] = [];
    assets: any[] = [];

    constructor() {
        if (!document.getElementById("eligibility-refresh-btn")) {
            this.insertRefreshButtonToDom();
        }

        this.provider = new ethers.providers.EtherscanProvider('homestead', 'INSFD21PBJSPEEDU75SDJQ4HKTW6AKP3J5');
        this.contract = new ethers.Contract(this.REDEEMER_CONTRACT_ADDRESS, this.REDEEMER_CONTRACT_ABI, this.provider);

        this.retrieveMetaData()
        this.updateEligibilityInfo();
    }

    insertRefreshButtonToDom() {
        const divElement = document.createElement('div');
        divElement.style.cssText += 'width: 50px;height: 50px;background-color: #3349c6;position: fixed;z-index: 99999;right: 50px;border: 20px;bottom: 10px;border-radius: 9px;cursor: pointer;';
        divElement.id = "eligibility-refresh-btn";

        const imgElement = document.createElement('img');
        imgElement.style.cssText += 'width: 40px;height: 40px;margin-left: 5px;margin-top: 5px;';
        imgElement.src = 'https://impostors.gg/images/favicon-32x32.png';

        divElement.appendChild(imgElement);

        divElement.addEventListener('click', function(this: CollectionPageEligibilityController, e: any) {
            this.updateEligibilityInfo();
          }.bind(this), false);

        document.getElementsByTagName('body')[0].appendChild(divElement);
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

    updateEligibilityInfo() {
        const tokenIds: number[] = this.getVisibleTokenIds();

        this.eligibilityResults = [];

        tokenIds.forEach(id => {
            this.eligibilityResults.push({ tokenId: id, roundClaimMap: new Map()});
        });

        const cInfo = this.collectionInfo.find((ci: any) => ci.name === this.collectionType);

        if (!!cInfo) {
            cInfo.relevantRounds.forEach(async (round: number) => {
                const redeemedResults: boolean[] = await this.isRedeemed(cInfo.address, round, tokenIds);
                redeemedResults.forEach( (value: boolean, i: number) => {
                    this.eligibilityResults[i].roundClaimMap.set(round, value)
                    this.updateDomAssetCardEligbilityInfo(this.eligibilityResults[i]);
                });
            });
        }
    }

    isRedeemed(collectionAddress: string, round: number, tokenIds: number[]) {
        return this.contract.isRedeemed(round, collectionAddress, tokenIds);
    }

    updateDomAssetCardEligbilityInfo(eligibilityModel: TokenEligibilityModel) {
        const asset = this.assets.find((a: any) => +a.href.substring(a.href.lastIndexOf('/') + 1) === eligibilityModel.tokenId);

        if (!!asset) {
            const assetImageContainer = asset.querySelectorAll('i')[0].parentNode;

            let leftDistance = 2;

            eligibilityModel.roundClaimMap.forEach((value, key) => {

                const roundInfoObject = this.roundInfo.find((ri: any) => ri.roundNumber === key);
                const iconCode = roundInfoObject.iconCode;

                if (value && !assetImageContainer.querySelector("#claim-info-" + roundInfoObject.round)) {

                    const iElement = document.createElement('i');
                    iElement.classList.add('material-icons', 'AssetMedia--play-icon');
                    iElement.style.cssText += 'background-color: transparent;border-color: transparent;left:' + leftDistance +'px;';
                    iElement.innerHTML = String.fromCodePoint(+iconCode);
                    iElement.id = 'iconclaim-info-' + roundInfoObject.roundCode;

                    assetImageContainer.appendChild(iElement);

                    leftDistance += 24;
                }
            });
        }
    }

    getVisibleTokenIds(): number[] {
        this.assets = Array.from(document.getElementsByClassName('Asset--anchor'));
        let tokenIds: number[] = [];

        if (this.assets.length) {
            this.collectionType = this.assets[0].baseURI.indexOf("?") === -1 ? this.assets[0].baseURI.substring(this.assets[0].baseURI.lastIndexOf('/') + 1, this.assets[0].baseURI.indexOf('?')) :
                        this.assets[0].baseURI.substring(this.assets[0].baseURI.lastIndexOf('/') + 1);

            this.assets.forEach((asset: any) => {
                tokenIds.push(+asset.href.substring(asset.href.lastIndexOf('/') + 1));
            });
        }

       return tokenIds;
    }
}