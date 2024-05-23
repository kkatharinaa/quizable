import * as QRCode from "qrcode"

interface QRCodeOptions {
    width?: number,
    height?: number
}

const DEFAULT_QR_OPTION: QRCodeOptions ={
    width: 120,
    height: 120
} 

export default class QRCodeHelper {
    public static generateQRCodeForQuiz(canvasId: string, entryId: string, options: QRCodeOptions = DEFAULT_QR_OPTION){
        const canvasEl = document.getElementById(canvasId);
        const baseHref: string = document.baseURI.substring(0, document.baseURI.indexOf("/",9));
        const link: string = `${baseHref}/join?entryid=${entryId}`;

        console.log(link)

        QRCode.toCanvas(canvasEl, link, { width: options.width, margin: 0, color:{light:"#FFF3F7"} })
    }
}