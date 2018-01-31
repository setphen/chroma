// tools for color converstions
module.exports = {

    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16)/255,
            g: parseInt(result[2], 16)/255,
            b: parseInt(result[3], 16)/255
        } : null;
    },

    rgbComponentToHex: function (rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    },

    rgbToHex: function(r,g,b) {
        var red = module.exports.rgbComponentToHex(r);
        var green = module.exports.rgbComponentToHex(g);
        var blue = module.exports.rgbComponentToHex(b);
        return red+green+blue;
    }
}
