import * as Fingerprint from '@fingerprintjs/fingerprintjs'

export const getDeviceId = async (): Promise<string> => {
    return (await (await Fingerprint.load()).get()).visitorId
}