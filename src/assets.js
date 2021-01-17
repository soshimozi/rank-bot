const fs = require("fs");
const dir = {
    IMAGES: `${__dirname}/../assets/img`,
    FONTS: `${__dirname}/../assets/font`
};
const obj = {
    images: {},
    fonts: {}
};

const clean = (str) => {
    return str.toUpperCase().split(" ").join("_");
};

// load images
fs.readdir(dir.IMAGES, (error, files) => {
    if (error) console.error(`Error while loading assets: ${error.message}!`);

    if (!files.length) throw new Error("Assets dir is corrupted.");

    files.forEach((x, i) => {
        const name = clean(x.split(".")[0]);
        obj.images[name] = `${dir.IMAGES}/${x}`;
    });
});

// load fonts
fs.readdir(dir.FONTS, (error, files) => {
    if (error) console.error(`Error while loading assets: ${error.message}!`);

    if (!files.length) throw new Error("Assets dir is corrupted.");

    files.forEach((x, i) => {
        const name = x.split(".")[0];
        obj.fonts[name] = `${dir.FONTS}/${x}`;
    });
});


/**
 * Canvacord assets loader
 * @param {"FONT"|"IMAGE"} type assets type
 */
module.exports = (type) => {
    switch(type) {
        case "FONT":
            return obj.fonts;
            break;
        case "IMAGE":
            return obj.images;
            break;
        default:
            throw new Error("INVALID_ASSETS_TYPE");
    }
};