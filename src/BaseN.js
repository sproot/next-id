class BaseN {
    static get ALPHABET() {
        return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    static get base() {
        return BigInt(this.ALPHABET.length);
    }

    static encode(number) {
        number = BigInt(number);
        let result = '';
        do {
            result = this.ALPHABET[number % this.base] + result;
            number = number / this.base;
        } while (number > 0n);
        return result;
    }

    static decode(string) {
        let result = 0n;
        for(let i = 0; i < string.length; i++) {
            result = result * this.base;
            result = result + BigInt(this.ALPHABET.indexOf(string[i]));
        }
        return result;
    }
}

module.exports = BaseN;
