let Request = require('request');
let trim = require('trim');
let url = require('url');
let striptags = require('striptags');



function normalizeUrl (href, currentUrl) {
    try {
        href = decodeURIComponent(trim(href));
        currentUrl = trim(currentUrl);

        let hrefInfo = url.parse(href, true, true);
        let requestInfo = url.parse(currentUrl, true, true);

        // Split the link and the response url into parts
        if (hrefInfo.protocol) {
            if (hrefInfo.protocol != 'http:' && hrefInfo.protocol != 'https:') {
                return false;
            }
        }

        // Build up an object to pass to url.format
        let resultParts = {};
        resultParts.protocol = hrefInfo.protocol || requestInfo.protocol;
        resultParts.hostname = hrefInfo.hostname || requestInfo.hostname;

        resultParts.port = hrefInfo.port || requestInfo.port;

        // If the port is the default port, discard
        if (resultParts.port == 80) {
            resultParts.port = '';
        }

        // Fully resolve paths
        resultParts.pathname = url.resolve(requestInfo.pathname, (hrefInfo.pathname || ''))
        resultParts.pathname = resultParts.pathname.replace(/\/+/g, '/');

        // Reconstitue the normalized url
        let normalizedUrl = url.format(resultParts);

        // Remove trailing slash
        // if (normalizedUrl.slice(-1) === '/') {
        //     normalizedUrl = normalizedUrl.substr(0, normalizedUrl.length - 1);
        // }

        // Remove the directory index
        let dirIndexRe = /(index.(htm|html|php)|default.(asp|aspx))$/;
        if (normalizedUrl.match(dirIndexRe)) {
            normalizedUrl = normalizedUrl.substr(0, normalizedUrl.lastIndexOf('/'));
        }

    } catch (error) {
        console.log("ERROR ", href, currentUrl);
        return false;
    }
}


module.exports = {
    normalizeUrl: normalizeUrl
}