import assets from "../assets"

interface Assets {
    (type: "IMAGE" | "FONT"): any;
}

export default assets as Assets;