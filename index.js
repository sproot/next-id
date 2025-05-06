const NextIdGenerator = require('./src/NextIdGenerator');

const generator = new NextIdGenerator();

function isBrowser() {
    return typeof window !== 'undefined' &&
        typeof window.document !== 'undefined';
}

if(!isBrowser() && process.env.NEXT_ID_SHARD_ID !== undefined) {
    generator.setShardId(
        Number(process.env.NEXT_ID_SHARD_ID)
    );
}

function generate(options) {
    return generator.generate(options);
}

function setShardId(shardId) {
    generator.setShardId(shardId);
    return module.exports;
}

function inspect(id) {
    return generator.inspect(id);
}

module.exports = generate;
module.exports.generate = generate;
module.exports.setShardId = setShardId;
module.exports.inspect = inspect;
