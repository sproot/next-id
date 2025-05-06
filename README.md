# @sproot/next-id

This package generates unique, short and random-looking IDs based on timestamp, shardId and some sequence.

## Installation

```bash
npm install @sproot/next-id
# or
yarn add @sproot/next-id
```

## Algorithm

NextId in the nutshell is a 64 bit positive number. We take first 41 bit for `timestamp`, which is the difference between the current time and EPOCH. Then we take next 13 bits for `shardId`, so that we can later identify what shard the ID belongs to. And finally, the rest 10 bits we reserve for some `sequential number` from 0 to 1023.

With all of that it gives us an ability to generate up to `1024 IDs x shard x millisecond` and they all guaranteed to be unique.

In order to make it looking as random [Pseudo encrypt](https://wiki.postgresql.org/wiki/Pseudo_encrypt) algorithm is being used.

## ID Formats

NextId supports multiple representation formats:

- **id (default)**: Base62-encoded string (characters 0-9, A-Z, a-z), most compact form
- **alphanumericId**: Base36-encoded string (characters 0-9, A-Z), useful when case matters
- **numericId**: string representation of 64-bit number (only digits 0-9)
- **pseudoId**: string representation of pseudo-encrypted number

## Usage Examples

### CommonJS
```js
const nextId = require('@sproot/next-id');
nextId(); //=> '4DTZX5Q7czS'
```

### Alternative Import Methods
If you use ES modules:

```js
// Using require with destructuring
const { generate, setShardId, inspect } = require('@sproot/next-id');

// Using dynamic import
const nextId = await import('@sproot/next-id').then(m => m.default);
```

You can also use a more explicit approach:

```js
nextId.generate();
```

Both examples will generate an id with the default shard id (that equal to `process.env.NEXT_ID_SHARD_ID` or `0` if not set). If you want to change shard id, you have to specify it by calling `setShardId` method in advance, like so:

```js
nextId.setShardId(345);
nextId.generate();
nextId();
```

You also can have it generated in `numeric` ([0-9]) or `alphanumeric` ([0-9A-Z]) formats:

```js
nextId({ format: 'numeric' }); //=> '734552048796001285'
nextId({ format: 'alphanumeric' }); //=> '5KWP1K35NMRQ'
```

Keep in mind that numeric format represented as a string because JavaScript's `MAX_SAFE_INTEGER` is a 53 bit number and we need 64 bit for our IDs.

## Options Structure

The ID generation function accepts an options object:

```js
nextId({
  format: 'alphanumeric' // or 'numeric', default is standard Base62 format
});
```

## Inspecting IDs

You can inspect any previously generated ID to get all information about it:

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

You can inspect an ID in numeric or alphanumeric format as well:

```js
nextId.inspect('734558498015524873');
nextId.inspect('5KWR97F01ZWP');
// the result will be the same as in the previous example
```

## Return Data Structure

The `inspect()` method returns an object with the following fields:

- `id`: ID in standard Base62 format
- `alphanumericId`: ID in Base36 format (only digits and uppercase letters)
- `pseudoId`: string representation of ID after pseudo-encryption
- `numericId`: string representation of ID as a number
- `shardId`: numeric value of the shard ID
- `issuedAt`: Date object representing the time when ID was created

## Limitations and Features

- Timestamp is calculated from January 1, 2025 (EPOCH)
- Maximum shardId value: 8191 (2^13 - 1)
- Maximum number of IDs per millisecond per shard: 1024 (2^10)
- The library uses BigInt to work with 64-bit numbers
