# @proficonf/next-id

This package generates unique, short and random-looking IDs based on timestamp, shardId and some sequence.

The algorithm for generating and encoding can be explained with the following image:

![NextId](https://api.monosnap.com/file/download?id=RXu0u1MePmEfrpEb9yWYP6xMoIHNw7)

NextId in the nutshell is a 64 bit positive number. We take first 41 bit for `timestamp`, which is the difference between the current time and Proficonf release date (EPOCH). Than we take next 13 bits for `shardId`, so that we can later identify what shard the ID belong to. And finally, the rest 10 bits we reserve for some `sequential number` from 0 to 1023.

With all of that it's gives us an ability to generate up to `1024 IDs x shard x millisecond` and they all guaranteed to be unique.

In order to make it looking as random [Pseudo encrypt](https://wiki.postgresql.org/wiki/Pseudo_encrypt) algorithm is being used.

## Usage Examples

The simple way to create id is this:

```js
const nextId = require('next-id');
nextId(); //=> '4DTZX5Q7czS'
```

However, you can do the same more explicitly.

```js
nextId.generate();
```

Both examples will generate an id with the default shard id (that equal to `process.env.NEXT_ID_SHARD_ID` or `0` if not set). If you want to change shard id, you have to specify it by calling `setShardId` method in advance, like so:

```js
nextId.setShardId(345);
nextId.generate();
nextId();
```

You also can have it generated in `numeric` ([0-9]) or `alphanumeric` ([0-9A-Z]) formats.

```js
nextId({ format: 'numeric' }); //=> '734552048796001285'
nextId({ format: 'alphanumeric' }); //=> '5KWP1K35NMRQ'
```

Keep in mind that numeric format represented as a string because JavaScript's `MAX_SAFE_INTEGER` is a 53 bit number and we need 64 bit for our IDs.

You can inspect any previously generated ID to get all information about it.

```js
nextId.setShardId(7534);
nextId.inspect(nextId());
// result:
{
  id: '5tFJamllKR3',
  alphanumericId: '5KWR97F01ZWP',
  pseudoId: '4598183344642370425',
  numericId: '734558498015524873',
  shardId: 7534,
  issuedAt: 2020-06-17T19:26:36.681Z
}
```

You can inspect an ID in numeric or alphanumeric format as well

```js
nextId.inspect('734558498015524873');
nextId.inspect('5KWR97F01ZWP');
// the result will be the same as in the previous example
```
