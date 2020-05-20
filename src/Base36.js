const BaseN = require('./BaseN');
class Base36 extends BaseN {
    static get ALPHABET() {
        return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
}

module.exports = Base36;
