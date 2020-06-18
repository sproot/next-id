class Pseudo {
    static encrypt(number) {
        number = BigInt(number);

        const BITMASK = 4294967295n;
        let l1, l2, r1, r2;
        l1 = (number >> 32n) & BITMASK;
        r1 = number & BITMASK;
        for(let i=0; i<3; i++) {
            l2 = r1;
            r2 = l1 ^ BigInt(Math.round(
                (((1366.0 * Number(r1) + 150889) % 714025) / 714025.0) * (32767 * 32767)
            ));
            l1 = l2;
            r1 = r2;
        }

        return (r1 << 32n) + l1;
    }

    static decrypt(number) {
        return this.encrypt(number);
    }
}

module.exports = Pseudo;
