import Canvas, { createCanvas } from 'canvas';
import path from 'path';
import { applyText, renderEmoji, shorten, toAbbrev } from './Utils';

/**
 * @typedef {object} CanvacordRankData
 * @property {number} width Rank card width
 * @property {number} height Rank card height
 * @property {object} background Rank card background data
 * @property {("image"|"color")} [background.type="color"] Background type
 * @property {string|Buffer} [background.image="#23272A"] Background image (or color)
 * @property {object} progressBar Progressbar data
 * @property {boolean} [progressBar.rounded=true] If the progressbar should be rounded
 * @property {number} [progressBar.x=275.5] Progressbar X
 * @property {number} [progressBar.y=183.75] Progressbar Y
 * @property {number} [progressBar.height=37.5] Progressbar height
 * @property {number} [progressBar.width=596.5] Progressbar width
 * @property {object} [progressBar.track] Progressbar track
 * @property {string} [progressBar.track.color="#484b4E"] Progressbar track color
 * @property {object} [progressBar.bar] Progressbar bar data
 * @property {("color"|"gradient")} [progressBar.bar.type="color"] Progressbar bar type
 * @property {string|string[]} [progressBar.bar.color="#FFFFFF"] Progressbar bar color
 * @property {object} overlay Progressbar overlay
 * @property {boolean} [overlay.display=true] If it should display overlay
 * @property {number} [overlay.level=0.5] Overlay opacity level
 * @property {string} [overlay.color="#333640"] Overlay bg color
 * @property {object} avatar Rank card avatar data
 * @property {string|Buffer} [avatar.source=null] Avatar source
 * @property {number} [avatar.x=70] X
 * @property {number} [avatar.y=50] Y
 * @property {number} [avatar.height=180] height
 * @property {number} [avatar.width=180] width
 * @property {object} status Rank card status
 * @property {number} [status.width=5] Status width
 * @property {("online"|"dnd"|"idle"|"offline"|"streaming")} [status.type] Status type
 * @property {string} [status.color="#43B581"] Status color
 * @property {boolean} [status.circle=false] Circualr status?
 * @property {object} rank Rank card rank data
 * @property {boolean} [rank.display=true] If it should display rank
 * @property {number} [rank.data=1] The Rank
 * @property {string} [rank.textColor="#FFFFFF"] Rank text color
 * @property {string} [rank.color="#F3F3F3"] Rank color
 * @property {string} [rank.displayText="RANK"] Rank display text
 * @property {object} level Rank card level data
 * @property {boolean} [level.display=true] If it should display level
 * @property {number} [level.data=1] The level
 * @property {string} [level.textColor="#FFFFFF"] level text color
 * @property {string} [level.color="#F3F3F3"] level color
 * @property {string} [level.displayText="LEVEL"] level display text
 * @property {object} currentXP Rank card current xp
 * @property {number} [currentXP.data=0] Current xp
 * @property {string} [currentXP.color="#FFFFFF"] Rank card current xp color
 * @property {object} requiredXP Rank card required xp
 * @property {number} [requiredXP.data=0] required xp
 * @property {string} [requiredXP.color="#FFFFFF"] Rank card required xp color
 * @property {object} discriminator Rank card discriminator
 * @property {number|string} [discriminator.discrim=null] The discriminator
 * @property {string} [discriminator.color="rgba(255, 255, 255, 0.4)"] Rank card discriminator color
 * @property {object} username Username Data
 * @property {string} [username.name=null] Rank card username
 * @property {string} [username.color="#FFFFFF"] Rank card username color
 * @property {boolean} [renderEmojis=false] If it should render emojis
 * @property {object} badgeData
 * @property {string} [badgeData.colorNoBadges="#000000"] color for no badge
 * @property {string} [badgeData.colorBadgesBox="#000000"] color for badges box
 * @property {number} [badgeData.opacityBadges=0.4] opacity for badges
 * @property {number} [badgeData.opacityNoBadges=0.4] opacity when no badges
 * @property {string} [badgeData.badge1=null] first badge
 * @property {string} [badgeData.badge2=null] second badge
 * @property {string} [badgeData.badge3=null] third badge
 * @property {string} [badgeData.badge4=null] fourth badge
 * @property {string} [badgeData.badge5=null] fifth badge
 * @property {string} [badgeData.badge6=null] sixth badge
 * @property {string} [badgeData.badge7=null] seventh badge
 * @property {string} [badgeData.badge8=null] eigth badge
 * @property {string} [badgeData.badge9=null] ninth badge
 */
class RankCard {
    data: any;

    constructor() {
        
        this.data = {
            width: 934,
            height: 322,
            background: {
                type: "color",
                image: "#23272A"
            },
            progressBar: {
                rounded: true,
                x: 275.5,
                y: 183.75,
                height: 37.5,
                width: 596.5,
                track: {
                    color: "#484b4E"
                },
                bar: {
                    type: "color",
                    color: "#FFFFFF"
                }
            },
            overlay: {
                display: true,
                level: 0.5,
                color: "#333640"
            },
            avatar: {
                source: null,
                x: 70,
                y: 50,
                height: 180,
                width: 180
            },
            status: {
                width: 5,
                type: "online",
                color: "#43B581",
                circle: false
            },
            rank: {
                display: true,
                data: 1,
                textColor: "#FFFFFF",
                color: "#F3F3F3",
                displayText: "RANK"
            },
            level: {
                display: true,
                data: 1,
                textColor: "#FFFFFF",
                color: "#F3F3F3",
                displayText: "LEVEL"
            },
            currentXP: {
                data: 50,
                color: "#FFFFFF"
            },
            requiredXP: {
                data: 200,
                color: "#FFFFFF"
            },
            discriminator: {
                discrim: null,
                color: "rgba(255, 255, 255, 0.4)"
            },
            username: {
                name: null,
                color: "#FFFFFF"
            },
            renderEmojis: false,
            badgeData: {
                addonBadges: true, 
                colorNoBadges: "#000000",
                colorBadges: "#222222",
                opacityBadges: 0.4,
                opacityNoBadges: 0.4,
                colorBadgesBox: "#000000",
                badge1: null,
                badge2: null,
                badge3: null,
                badge4: null,
                badge5: null,
                badge6: null,
                badge7: null,
                badge8: null,
                badge9: null
                // for testing:
                // badge1: "gold",
                // badge2: "diamond",
                // badge3: "bronze",
                // badge4: "silver",
                // badge5: "gold",
                // badge6: "silver",
                // badge7: "silver",
                // badge8: "silver",
                // badge9: "gold"
            }
        }

        //this.registerFonts();
    }

    /**
     * Loads font
     * @param {any[]} fontArray Font array
     * @returns {Rank}
     */
    registerFonts(fontArray: any[] = []): RankCard {

        //console.log("fonts: ", assets("FONT"));
        
        if (!fontArray.length) {
            setTimeout(() => {
                // default fonts
                Canvas.registerFont(`${__dirname}/../../assets/font/MANROPE_BOLD.ttf`, {
                   family: "Manrope",
                    weight: "bold",
                    style: "normal"
                });

                Canvas.registerFont(`${__dirname}/../../assets/font/MANROPE_REGULAR.ttf`, {
                    family: "Manrope",
                    weight: "regular",
                    style: "normal"
                });

               Canvas.registerFont(`${__dirname}/../../assets/font/MANROPE_EXTRA_BOLD.otf`, {
                    family: "Manrope",
                    weight: "bold",
                    style: "normal"
                });

            }, 250);
        } else {
            fontArray.forEach(font => {
                Canvas.registerFont(font.path, font.face);
            });
        }

        return this;
    }   

    /**
     * If it should render username with emojis (if any)
     * @param {boolean} [apply=false] Set it to `true` to render emojis.
     * @returns {Rank}
     */
    renderEmojis(apply:boolean = false):RankCard {
        this.data.renderEmojis = !!apply;
        return this;
    }

    /**
     * Set progressbar style
     * @param {string|string[]} color Progressbar Color
     * @param {("COLOR"|"GRADIENT")} [fillType] Progressbar type
     * @param {boolean} [rounded=true] If progressbar should have rounded edges
     * @returns {Rank}
     */
    setProgressBar(color:string|string[], fillType: ("COLOR"|"GRADIENT")= "COLOR", rounded:boolean = true):RankCard {
        switch (fillType) {
            case "COLOR":
                if (typeof color !== "string") throw new Error(`Color type must be a string, received ${typeof color}!`);
                this.data.progressBar.bar.color = color;
                this.data.progressBar.bar.type = "color";
                this.data.progressBar.rounded = !!rounded;
                break;
            case "GRADIENT":
                if (!Array.isArray(color)) throw new Error(`Color type must be Array, received ${typeof color}!`);
                this.data.progressBar.bar.color = color.slice(0, 2);
                this.data.progressBar.bar.type = "gradient";
                this.data.progressBar.rounded = !!rounded;
                break;
            default:
                throw new Error(`Unsupported progressbar type "${fillType}"!`);
        }

        return this;
    }

    /**
     * Set progressbar track
     * @param {string} color Track color
     * @returns {Rank}
     */
    setProgressBarTrack(color:string):RankCard {
        if (typeof color !== "string") throw new Error(`Color type must be a string, received "${typeof color}"!`);
        this.data.progressBar.track.color = color;

        return this;
    }

    /**
     * Set card overlay
     * @param {string} color Overlay color
     * @param {number} [level=0.5] Opacity level
     * @param {boolean} [display=true] IF it should display overlay
     * @returns {Rank}
     */
    setOverlay(color:string, level:number = 0.5, display:boolean = true):RankCard {
        if (typeof color !== "string") throw new Error(`Color type must be a string, received "${typeof color}"!`);
        this.data.overlay.color = color;
        this.data.overlay.display = !!display;
        this.data.overlay.level = level && typeof level === "number" ? level : 0.5;
        return this;
    }    
    /**
     * Set username
     * @param {string} name Username
     * @param {string} color Username color
     * @returns {Rank}
     */
    setUsername(name:string, color:string = "#FFFFFF"): RankCard {
        if (typeof name !== "string") throw new Error(`Expected username to be a string, received ${typeof name}!`);
        this.data.username.name = name;
        this.data.username.color = color && typeof color === "string" ? color : "#FFFFFF";
        return this;
    }    

    /**
     * Set discriminator
     * @param {string|number} discriminator User discriminator
     * @param {string} color Discriminator color
     * @returns {Rank}
     */
    setDiscriminator(discriminator:string|number, color:string = "rgba(255, 255, 255, 0.4)"): RankCard {
        this.data.discriminator.discrim = !isNaN(discriminator as number) && `${discriminator}`.length === 4 ? discriminator : null;
        this.data.discriminator.color = color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
        return this;
    }

    /**
     * Set Rank
     * @param {number} data Current Rank
     * @param {string} text Display text
     * @param {boolean} [display=true] If it should display rank
     * @returns {Rank}
     */
    setRank(data:number, text:string = "RANK", display:boolean = true): RankCard {
        if (typeof data !== "number") throw new Error(`Level data must be a number, received ${typeof data}!`);
        this.data.rank.data = data;
        this.data.rank.display = !!display;
        if (!text || typeof text !== "string") text = "RANK";
        this.data.rank.displayText = text;

        return this;
    }

    /**
     * Set rank display color
     * @param {string} text text color
     * @param {string} number Number color
     * @returns {Rank}
     */
    setRankColor(text:string = "#FFFFFF", number:string = "#FFFFFF"): RankCard {
        if (!text || typeof text !== "string") text = "#FFFFFF";
        if (!number || typeof number !== "string") number = "#FFFFFF";
        this.data.rank.textColor = text;
        this.data.rank.color = number;
        return this;
    }

    /**
     * Set level color
     * @param {string} text text color
     * @param {string} number number color
     * @returns {Rank}
     */
    setLevelColor(text:string = "#FFFFFF", number:string = "#FFFFFF"): RankCard {
        if (!text || typeof text !== "string") text = "#FFFFFF";
        if (!number || typeof number !== "string") number = "#FFFFFF";
        this.data.level.textColor = text;
        this.data.level.color = number;
        return this;
    }

    /**
     * Set Level
     * @param {number} data Current Level
     * @param {string} text Display text
     * @param {boolean} [display=true] If it should display level
     * @returns {Rank}
     */
    setLevel(data:number, text:string = "LEVEL", display:boolean = true): RankCard {
        if (typeof data !== "number") throw new Error(`Level data must be a number, received ${typeof data}!`);
        this.data.level.data = data;
        this.data.level.display = !!display;
        if (!text || typeof text !== "string") text = "LEVEL";
        this.data.level.displayText = text;

        console.log('setting level: ', this.data.level.data);
        return this;
    }

    /**
     * Set required xp
     * @param {number} data Required xp
     * @param {string} color Color
     * @returns {RankCard}
     */
    setRequiredXP(data:number, color:string = "#FFFFFF"):RankCard {
        if (typeof data !== "number") throw new Error(`Required xp data type must be a number, received ${typeof data}!`);
        this.data.requiredXP.data = data;
        this.data.requiredXP.color = color && typeof color === "string" ? color : "#FFFFFF";
        return this;
    }

    /**
     * Set font size
     * @param {number} size
     */
    setFontSize(size:string):RankCard {
        this.data.fontSize = size;
        return this;
    }

    /**
     * Set current xp
     * @param {number} data Current xp
     * @param {string} color Color
     * @returns {RankCard}
     */
    setCurrentXP(data:number, color:string = "#FFFFFF"):RankCard {
        if (typeof data !== "number") throw new Error(`Current xp data type must be a number, received ${typeof data}!`);
        this.data.currentXP.data = data;
        this.data.currentXP.color = color && typeof color === "string" ? color : "#FFFFFF";
        return this;
    }    
    /**
     * Set custom status color
     * @param {string} color Color to set
     * @returns {Rank}
     */
    setCustomStatusColor(color:string): RankCard {
        if (!color || typeof color !== "string") throw new Error("Invalid color!");
        this.data.status.color = color;
        return this;
    }

    /**
     * Set status
     * @param {("online"|"idle"|"dnd"|"offline"|"streaming")} status User status
     * @param {boolean} circle If status icon should be circular.
     * @param {number|boolean} width Status width
     * @returns {Rank}
     */
    setStatus(status:("online"|"idle"|"dnd"|"offline"|"streaming"), circle:boolean = false, width: boolean | number = 5): RankCard {
        switch(status) {
            case "online":
                this.data.status.type = "online";
                this.data.status.color = "#43B581";
                break;
            case "idle":
                this.data.status.type = "idle";
                this.data.status.color = "#FAA61A";
                break;
            case "dnd":
                this.data.status.type = "dnd";
                this.data.status.color = "#F04747";
                break;
            case "offline":
                this.data.status.type = "offline";
                this.data.status.color = "#747F8E";
                break;
            case "streaming":
                this.data.status.type = "streaming";
                this.data.status.color = "#593595";
                break;
            default:
                throw new Error(`Invalid status "${status}"`);
        }

        if (width !== false) this.data.status.width = typeof width === "number" ? width : 5;
        else this.data.status.width = false;
        if ([true, false].includes(circle)) this.data.status.circle = circle;

        return this;
    }    

    setBadge(variable:number, value:("bronze"|"silver"|"gold"|"diamond")|string) {
        if (Number(variable) > 0 && Number(variable) < 10) {
          if (Number(variable) === 1) this.data.badgeData.badge1 = value;
          if (Number(variable) === 2) this.data.badgeData.badge2 = value;
          if (Number(variable) === 3) this.data.badgeData.badge3 = value;
          if (Number(variable) === 4) this.data.badgeData.badge4 = value;
          if (Number(variable) === 5) this.data.badgeData.badge5 = value;
          if (Number(variable) === 6) this.data.badgeData.badge6 = value;
          if (Number(variable) === 7) this.data.badgeData.badge7 = value;
          if (Number(variable) === 8) this.data.badgeData.badge8 = value;
          if (Number(variable) === 9) this.data.badgeData.badge9 = value;
          return this;
        }
      }    

    /**
     * Set background image/color
     * @param {("COLOR"|"IMAGE")} type Background type
     * @param {string|Buffer} [data] Background color or image
     * @returns {Rank}
     */
    setBackground(type:("COLOR"|"IMAGE"), data:string|Buffer):RankCard {
        if (!data) throw new Error("Missing field : data");
        switch(type) {
            case "COLOR":
                this.data.background.type = "color";
                this.data.background.image = data && typeof data === "string" ? data : "#23272A";
                break;
            case "IMAGE":
                this.data.background.type = "image";
                this.data.background.image = data;
                break;
            default:
                throw new Error(`Unsupported background type "${type}"`);
        }

        return this;
    }    

    /**
     * User avatar
     * @param {string|Buffer} data Avatar data
     * @returns {Rank}
     */
    setAvatar(data:string|Buffer): RankCard {
        
        if (!data) throw new Error(`Invalid avatar type "${typeof data}"!`);

        this.data.avatar.source = data;
        return this;
    }

    async toBuffer(ops = { fontX: "Manrope", fontY: "Manrope" }): Promise<Buffer> {

        const bg = this.data.background.type === "image" ? await Canvas.loadImage(this.data.background.image) : null;
        const avatar = await Canvas.loadImage(this.data.avatar.source);

        const canvas = createCanvas(this.data.width, this.data.height);
        const ctx = canvas.getContext('2d');

        // create background
        if (bg !== null) {
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = this.data.background.image;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // add overlay
        if (!!this.data.overlay.display) {
            ctx.globalAlpha = this.data.overlay.level || 1;
            ctx.fillStyle = this.data.overlay.color;
            ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
        }

        // reset transparency
        ctx.globalAlpha = 1;
        
        // draw username
        ctx.font = `bold ${this.data.fontSize ?? '36px'} ${ops.fontX}`;
        ctx.fillStyle = this.data.username.color;
        ctx.textAlign = "start";
        const name = shorten(this.data.username.name, 10);

        // apply username
        !this.data.renderEmojis ? ctx.fillText(`${name}`, 257 + 18.5, 164) : await renderEmoji(ctx, name, 257 + 18.5, 164);

        // draw discriminator
        if (!this.data.discriminator.discrim) throw new Error("Missing discriminator!");
        const discrim = `${this.data.discriminator.discrim}`;
        if (discrim) {
            ctx.font = `${this.data.fontSize ?? '36px'} ${ops.fontY}`;
            ctx.fillStyle = this.data.discriminator.color;
            ctx.textAlign = "start";
            ctx.fillText(`#${discrim.substr(0, 4)}`, ctx.measureText(name).width + 35 + 257, 164);
        }        

        // fill level
        if (this.data.level.display && !isNaN(this.data.level.data)) {
            console.log('level ', this.data.level.data);

                ctx.font = `bold ${this.data.fontSize ?? '36px'} ${ops.fontX}`;
                ctx.fillStyle = this.data.level.textColor;
                ctx.fillText(this.data.level.displayText, 755 - ctx.measureText(toAbbrev(parseInt(this.data.level.data))).width, 82);
                ctx.font = `bold ${this.data.fontSize ?? '32px'} ${ops.fontX}`;
                ctx.fillStyle = this.data.level.color;
                ctx.textAlign = "end";
                ctx.fillText(toAbbrev(parseInt(this.data.level.data)), 755 + 115, 82);
        }

        // fill rank
        if (this.data.rank.display && !isNaN(this.data.rank.data)) {

            ctx.font = `bold ${this.data.fontSize ?? '36px'} ${ops.fontX}`;
            ctx.fillStyle = this.data.rank.textColor;

            ctx.fillText(this.data.rank.displayText, 755 - ctx.measureText(toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width - 7 - ctx.measureText(toAbbrev(parseInt(this.data.rank.data)) || "-").width, 82);

            ctx.font = `bold ${this.data.fontSize ?? '32px'} ${ops.fontX}`;
            ctx.fillStyle = this.data.rank.color;
            ctx.textAlign = "end";
            ctx.fillText(toAbbrev(parseInt(this.data.rank.data)), 750 - ctx.measureText(toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width, 82);
        }      

        // show progress
        ctx.font = `bold ${this.data.fontSize ?? '30px'} ${ops.fontX}`;
        ctx.fillStyle = this.data.requiredXP.color;
        ctx.textAlign = "start";
        ctx.fillText("/ " + toAbbrev(this.data.requiredXP.data), 670 + ctx.measureText(toAbbrev(this.data.currentXP.data)).width + 15, 164);

        ctx.fillStyle = this.data.currentXP.color;
        ctx.fillText(toAbbrev(this.data.currentXP.data), 670, 164);

        // draw progressbar
        ctx.beginPath();
        if (!!this.data.progressBar.rounded) {
            // bg
            ctx.fillStyle = this.data.progressBar.track.color;
            ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
            ctx.fill();
            ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
            ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();

            ctx.beginPath();
            // apply color
            if (this.data.progressBar.bar.type === "gradient") {
                // @todo: Fix this
                // @ts-ignore
                let gradientContext = ctx.createRadialGradient(this._calculateProgress, 0, 500, 0);
                this.data.progressBar.bar.color.forEach((color, index) => {
                    gradientContext.addColorStop(index, color);
                });
                ctx.fillStyle = gradientContext;
            } else {
                ctx.fillStyle = this.data.progressBar.bar.color;
            }

            // progress bar
            ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
            ctx.fill();
            ctx.fillRect(257 + 18.5, 147.5 + 36.25, this._calculateProgress, 37.5);
            ctx.arc(257 + 18.5 + this._calculateProgress, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();
        } else {

            // progress bar
            ctx.fillStyle = this.data.progressBar.bar.color;
            ctx.fillRect(this.data.progressBar.x, this.data.progressBar.y, this._calculateProgress, this.data.progressBar.height);

            // outline
            ctx.beginPath();
            ctx.strokeStyle = this.data.progressBar.track.color;
            ctx.lineWidth = 7;
            ctx.strokeRect(this.data.progressBar.x, this.data.progressBar.y, this.data.progressBar.width, this.data.progressBar.height);
        }

        ctx.save();

        // circle
        ctx.beginPath();
        ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // draw avatar
        ctx.drawImage(avatar, 35, 45, this.data.avatar.width + 20, this.data.avatar.height + 20);
        ctx.restore();

        //draw status
        if (!!this.data.status.circle) {
            ctx.beginPath();
            ctx.fillStyle = this.data.status.color;
            ctx.arc(215, 205, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        } else if (!this.data.status.circle && this.data.status.width !== false) {
            console.log('drawing circle');
            ctx.beginPath();
            ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
            ctx.strokeStyle = this.data.status.color;
            ctx.lineWidth = this.data.status.width;
            ctx.stroke();
        }     

        if (this.data.badgeData.addonBadges) {
            
            ctx.fillStyle = this.data.badgeData.colorBadgesBox;
            ctx.globalAlpha = this.data.badgeData.opacityBadges;
            ctx.fillRect(210 + 50 + 50, 235, 525, 50);
    
            ctx.fillStyle = this.data.badgeData.colorNoBadges;
            if (!this.data.badgeData.badge1) {
                console.log('drawing no badge');
    
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
    
                ctx.fillText(".", 210 + 50 + 50 + 25 + 30 / 2, 235 + 10 + 25);
    
    
            } else {
              ctx.globalAlpha = 1;
              if (
                this.data.badgeData.badge1.toLowerCase() === "bronze" ||
                this.data.badgeData.badge1.toLowerCase() === "silver" ||
                this.data.badgeData.badge1.toLowerCase() === "gold" ||
                this.data.badgeData.badge1.toLowerCase() === "diamond"
              ) {
                let badge1 = await Canvas.loadImage(
                  `${__dirname}/../../assets/img/rank/bubble_${this.data.badgeData.badge1.toLowerCase()}.png`
                );
    
                ctx.drawImage(badge1, 210 + 50 + 50 + 25, 235 + 10, 30, 30);
    
              } else {
                let badge1 = await Canvas.loadImage(this.data.badgeData.badge1);
                ctx.drawImage(badge1, 210 + 50 + 50 + 25, 235 + 10, 30, 30);
              }
            }
    
            if (!this.data.badgeData.badge2) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 210 + 50 + 50 + 25 + 30 + 25 + 30 / 2, 235 + 10 + 25);
            } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge2.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge2.toLowerCase() === "silver" ||
                    this.data.badgeData.badge2.toLowerCase() === "gold" ||
                    this.data.badgeData.badge2.toLowerCase() === "diamond") {
    
                    console.log('loading image for rank 2');
                    let badge2 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/speaker_${this.data.badgeData.badge2.toLowerCase()}.png`
                    );
    
                    console.log('badge2', badge2);
    
                    ctx.drawImage(badge2, 210 + 50 + 50 + 25 + 30 + 25, 235 + 10, 30, 30);
    
                } else {
                    let badge2 = await Canvas.loadImage(this.data.badgeData.badge2);
                    ctx.drawImage(badge2, 210 + 50 + 50 + 25 + 30 + 25, 235 + 10, 30, 30);
                }
            }            
    
            if (!this.data.badgeData.badge3) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 2 + 30 / 2, 
                    235 + 10 + 25);
            } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge3.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge3.toLowerCase() === "silver" ||
                    this.data.badgeData.badge3.toLowerCase() === "gold" ||
                    this.data.badgeData.badge3.toLowerCase() === "diamond") {
    
                    let badge3 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/stream_${this.data.badgeData.badge3.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge3, 
                        210 + 50 + 50 + 25 + (30 + 25) * 2, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge3 = await Canvas.loadImage(this.data.badgeData.badge3);
                    ctx.drawImage(badge3, 
                        210 + 50 + 50 + 25 + (30 + 25) * 2, 
                        235 + 10, 30, 30);
                }
            }            
    
            if (!this.data.badgeData.badge4) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 3 + 30 / 2, 
                    235 + 10 + 25);
            } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge4.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge4.toLowerCase() === "silver" ||
                    this.data.badgeData.badge4.toLowerCase() === "gold" ||
                    this.data.badgeData.badge4.toLowerCase() === "diamond") {
    
                    let badge4 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/picture_${this.data.badgeData.badge4.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge4, 
                        210 + 50 + 50 + 25 + (30 + 25) * 3, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge4 = await Canvas.loadImage(this.data.badgeData.badge4);
                    ctx.drawImage(badge4, 
                        210 + 50 + 50 + 25 + (30 + 25) * 3, 
                        235 + 10, 30, 30);
                }
            }            
            
    
            if (!this.data.badgeData.badge5) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 4 + 30 / 2, 
                    235 + 10 + 25);
            } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge5.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge5.toLowerCase() === "silver" ||
                    this.data.badgeData.badge5.toLowerCase() === "gold" ||
                    this.data.badgeData.badge5.toLowerCase() === "diamond") {
    
                    let badge5 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/like_${this.data.badgeData.badge5.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge5, 
                        210 + 50 + 50 + 25 + (30 + 25) * 4, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge5 = await Canvas.loadImage(this.data.badgeData.badge5);
                    ctx.drawImage(badge5, 
                        210 + 50 + 50 + 25 + (30 + 25) * 4, 
                        235 + 10, 30, 30);
                }
            }  
    
            if (!this.data.badgeData.badge6) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 5 + 30 / 2, 
                    235 + 10 + 25);
        } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge6.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge6.toLowerCase() === "silver" ||
                    this.data.badgeData.badge6.toLowerCase() === "gold" ||
                    this.data.badgeData.badge6.toLowerCase() === "diamond") {
    
                    let badge6 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/star_${this.data.badgeData.badge6.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge6, 
                        210 + 50 + 50 + 25 + (30 + 25) * 5, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge6 = await Canvas.loadImage(this.data.badgeData.badge6);
                    ctx.drawImage(badge6, 
                        210 + 50 + 50 + 25 + (30 + 25) * 5, 
                        235 + 10, 30, 30);
                }
            }  
    
            if (!this.data.badgeData.badge7) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 6 + 30 / 2, 
                    235 + 10 + 25);
        } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge7.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge7.toLowerCase() === "silver" ||
                    this.data.badgeData.badge7.toLowerCase() === "gold" ||
                    this.data.badgeData.badge7.toLowerCase() === "diamond") {
    
                    let badge7 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/boost_${this.data.badgeData.badge7.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge7, 
                        210 + 50 + 50 + 25 + (30 + 25) * 6, 
                        235 + 10, 30, 30);
        
                } else {
                    let badge7 = await Canvas.loadImage(this.data.badgeData.badge7);
                    ctx.drawImage(badge7, 
                        210 + 50 + 50 + 25 + (30 + 25) * 6, 
                        235 + 10, 30, 30);
                        }
            }     
    
            if (!this.data.badgeData.badge8) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 7 + 30 / 2, 
                    235 + 10 + 25);
        } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge8.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge8.toLowerCase() === "silver" ||
                    this.data.badgeData.badge8.toLowerCase() === "gold" ||
                    this.data.badgeData.badge8.toLowerCase() === "diamond") {
    
                    let badge8 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/money_${this.data.badgeData.badge8.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge8, 
                        210 + 50 + 50 + 25 + (30 + 25) * 7, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge8 = await Canvas.loadImage(this.data.badgeData.badge8);
                    ctx.drawImage(badge8, 
                        210 + 50 + 50 + 25 + (30 + 25) * 7, 
                        235 + 10, 30, 30);
                }
            }            
    
            if (!this.data.badgeData.badge9) {
                ctx.globalAlpha = this.data.badgeData.opacityNoBadges;
                ctx.textAlign = "center";
                ctx.font = applyText(canvas, ".", 120, 30, "Bold");
                ctx.fillText(".", 
                    210 + 50 + 50 + 25 + (30 + 25) * 8 + 30 / 2, 
                    235 + 10 + 25);
            } else {
                ctx.globalAlpha = 1;
                if (
                    this.data.badgeData.badge9.toLowerCase() === "bronze" ||
                    this.data.badgeData.badge9.toLowerCase() === "silver" ||
                    this.data.badgeData.badge9.toLowerCase() === "gold" ||
                    this.data.badgeData.badge9.toLowerCase() === "diamond") {
    
                    let badge9 = await Canvas.loadImage(
                        `${__dirname}/../../assets/img/rank/bot_${this.data.badgeData.badge9.toLowerCase()}.png`
                    );
    
                    ctx.drawImage(badge9, 
                        210 + 50 + 50 + 25 + (30 + 25) * 8, 
                        235 + 10, 30, 30);
    
                } else {
                    let badge9 = await Canvas.loadImage(this.data.badgeData.badge9);
                    ctx.drawImage(badge9, 
                        210 + 50 + 50 + 25 + (30 + 25) * 8, 
                        235 + 10, 30, 30);
                }
            }            
    
        }

        return canvas.toBuffer();
    }

    /**
     * Calculates progress
     * @type {number}
     * @private
     * @ignore
     */
    get _calculateProgress() {
        const cx = this.data.currentXP.data;
        const rx = this.data.requiredXP.data;

        if (rx <= 0) return 1;
        if (cx > rx) return this.data.progressBar.width;

        let width = (cx * 615) / rx;
        if (width > this.data.progressBar.width) width = this.data.progressBar.width;
        return width;
    }    

 

}

export default RankCard;