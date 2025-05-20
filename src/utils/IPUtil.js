import libqqwry from 'lib-qqwry';

let qqwry = libqqwry();
qqwry.speed()

export function getIPLoc(ip) {

    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '')
    }
    //check ip regex
    let ipRegex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (!ipRegex.test(ip)) {
        return '未知';
    }

    let str = qqwry.searchIP(ip)
    const {Country, Area} = str
    str = Country + " - " + Area
    str = str.replaceAll('CZ88.NET', '')
    return str
}