import {action, observable, computed, makeObservable} from 'mobx';

export class storeDocumentSettings {
    constructor() {
        makeObservable(this, {
            isPortrait: observable,
            widthDocument: observable,
            heightDocument: observable,
            allSchemes: observable,
            resetPortrait: action,
            changeDocSize: action,
            pageSizesIndex: computed,
            addSchemes: action
        });
    }

    isPortrait = true;

    resetPortrait (isPortrait) {
        this.isPortrait = isPortrait === true;
    }

    //Document Formats

    widthDocument;
    heightDocument;

    changeDocSize (width, height) {
        let w = width;
        let h = height;
        if (!this.isPortrait) {
            const tempW = w;
            w = h;
            h = tempW;
        }
        this.widthDocument = w;
        this.heightDocument = h;
    }

    getPageSizesList () {
        const txtCm = Common.Utils.Metric.getMetricName(Common.Utils.Metric.c_MetricUnits.cm);
        const pageSizes = [
                { caption: 'US Letter',             subtitle: '21,59 ' + txtCm + ' x 27,94 ' + txtCm,  value: [215.9, 279.4] },
                { caption: 'US Legal',              subtitle: '21,59 ' + txtCm + ' x 35,56 ' + txtCm,  value: [215.9, 355.6] },
                { caption: 'A4',                    subtitle: '21 ' + txtCm + ' x 29,7 ' +  txtCm,     value: [210, 297] },
                { caption: 'A5',                    subtitle: '14,8 ' + txtCm + ' x 21 ' + txtCm,      value: [148, 210] },
                { caption: 'B5',                    subtitle: '17,6 ' + txtCm + ' x 25 ' + txtCm,      value: [176, 250] },
                { caption: 'Envelope #10',          subtitle: '10,48 ' + txtCm + ' x 24,13 ' + txtCm,  value: [104.8, 241.3] },
                { caption: 'Envelope DL',           subtitle: '11 ' + txtCm + ' x 22 ' + txtCm,        value: [110, 220] },
                { caption: 'Tabloid',               subtitle: '27,94 ' + txtCm + ' x 43,18 ' + txtCm,  value: [279.4, 431.8] },
                { caption: 'A3',                    subtitle: '29,7 ' + txtCm + ' x 42 ' + txtCm,      value: [297, 420] },
                { caption: 'Tabloid Oversize',      subtitle: '30,48 ' + txtCm + ' x 45,71 ' + txtCm,  value: [304.8, 457.1] },
                { caption: 'ROC 16K',               subtitle: '19,68 ' + txtCm + ' x 27,3 ' + txtCm,   value: [196.8, 273] },
                { caption: 'Envelope Choukei 3',    subtitle: '11,99 ' + txtCm + ' x 23,49 ' + txtCm,  value: [119.9, 234.9] },
                { caption: 'Super B/A3',            subtitle: '33,02 ' + txtCm + ' x 48,25 ' + txtCm,  value: [330.2, 482.5] },
                { caption: 'A0',                    subtitle: '84,1 ' + txtCm + ' x 118,9 ' + txtCm,   value: [841, 1189] },
                { caption: 'A1',                    subtitle: '59,4 ' + txtCm + ' x 84,1 ' + txtCm,    value: [594, 841] },
                { caption: 'A2',                    subtitle: '42 ' + txtCm + ' x 59,4 ' + txtCm,      value: [420, 594] },
                { caption: 'A6',                    subtitle: '10,5 ' + txtCm + ' x 14,8 ' + txtCm,    value: [105, 148] }
            ];
        return pageSizes;
    }
    
    get pageSizesIndex () {
        let w = this.widthDocument;
        let h = this.heightDocument;
        let ind = -1;
        const pageSizes = this.getPageSizesList();
        pageSizes.forEach(function callback(size, index) {
            if (Math.abs(size.value[0] - w) < 0.1 && Math.abs(size.value[1] - h) < 0.1) {
                ind = index;
            }
        }, this);
        if (ind === -1) {
            ind = -1;
        }
        return ind;
    }

    // Color Schemes

    allSchemes;

    addSchemes(arr) {
        this.allSchemes = arr;
    }

}
