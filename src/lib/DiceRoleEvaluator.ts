import crypto from "crypto";

export default class DiceRollEvaluator {

    private static _getRange(str: string): number {
        var rng_min, rng_max, str_split,
            delta, value;

        str = str.replace(/\s+/g, "");
        str_split = str.split("-");
        rng_min = str_split[0]
        rng_max = str_split[1];

        rng_min = parseInt(rng_min) || 0;
        rng_max = Math.max(parseInt(rng_max), rng_min) || rng_min;

        delta = (rng_max - rng_min + 1);

        value = crypto.randomInt(1, delta);
        value = parseInt(value);

        return value + rng_min;
    }

    static evaluateRoll(str: string): number {
        let check,
            qta, max, dice, mod_opts, mod,
            rng_min, rng_max,
            rolls = [], value = 0;

        str = str.replace(/\s+g/, "");
        check = str.match(/(?:^[-+]?(\d+)?(?:\/(\d+))?[dD](\d+)(?:([-+])(\d+)\b)?$|^(\d+)\-(\d+)$)/);
        
        if (check === null) {
            throw new Error("INVALID STRING")
        }

        qta = check[1];
        max = check[2];
        dice = check[3];
        mod_opts = check[4];
        mod = check[5];
        rng_min = check[6];
        rng_max = check[7];
        check = check[0];

        if(rng_min && rng_max) {
            return this._getRange(str);
        }

        dice = parseInt(dice);
        mod_opts = mod_opts || "";
        mod = parseInt(mod) || 0;
        qta = parseInt(qta) || 1;
        max = Math.max(parseInt(max), qta) || qta;

        for(let val; max--;) {
            val = crypto.randomInt(1, dice);
            val = Math.floor(val) + 1;
            rolls.push(val);
        }

        if (max != qta) {
            rolls.sort((a, b) => {return a < b ? -1 : a === b ? 0 : 1});
            rolls.unshift(rolls.splice(0, qta));
        }

        while (rolls[0][0]) {value += rolls[0].shift();}

        if (mod_opts == "-") {value -= mod;}
        else {value += mod;}
    
        return value        
    }
}