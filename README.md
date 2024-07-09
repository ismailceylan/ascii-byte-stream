# ASCII Byte Stream
This is a small library that allows us to make logical operations on sets of strings using a cursor technique by treating them as streams.

## Installation
```bash
npm install @iceylan/ascii-byte-stream
```

## Usage
```js
import ASCIIByteStream from "@iceylan/ascii-byte-stream";

const stream = new ASCIIByteStream( "Hello, World!" );

stream.current; // "H"
stream.cursor; // 0
```

## Properties
`ASCIIByteStream` has the following properties:

### cursor
The cursor is a writable and readable integer property that indicates the current character that the stream is pointing at. It starts at 0 and goes to the length of the stream - 1. Zeroth character is the first character in the stream. 

```js
stream.cursor = 4;
stream.current; // "o"
```

### raw
We can always access original string. This library does not modify the original data.

```js
stream.raw; // "Hello, World!"
```

### current
If we want to access the current character that the cursor is pointing at, we can use the `current` property.

It is a read only property. If the cursor has reached at the end of the stream, this will be undefined.

```js
stream.current; // "H"

stream.cursor = Infinity;
stream.current; // undefined
```

### next
We can move the cursor one character forward with the `next` property. It is a read only property with has a side effect on the cursor. If the cursor has reached at the end of the stream, this will be undefined. Otherwise it will return the next character in the stream.

```js
stream.current; // "H"
stream.next; // "e"
stream.current; // "e"
```

### prev
We can move the cursor one character backward with the `prev` property. It is also a read only property. If the cursor has reached at the beginning of the stream, this will return undefined. Otherwise it will return the previous character in the stream.

```js
stream.cursor = 4;
stream.current; // "o"

stream.prev; // "l"
stream.current; // "l"
```

### length
The `length` property indicates the length of the stream. It is a read only property and an alias for `raw.length`.

```js
stream.length; // 13
stream.raw.length; // 13
```

## Methods
`ASCIIByteStream` has the following methods:

### matches
We can match from the current character with the given target. It returns `true` if it matches, and `false` if it doesn't.

```js
stream.current; // "H"

stream.matches( "H" ); // true
stream.matches( "Hell" ); // true
stream.matches( "o" ); // false
```

It does not move the cursor.

### before
It matches if the given target is found before the current character. It returns `true` if it matches, and `false` if it doesn't.

```js
stream.cursor = 4; // "o"
stream.before( "Hell" ); // true
```

It also does not move the cursor.

### after
It matches if the given target is found after the current character. It returns `true` if it matches, and `false` if it doesn't. This method is very similar to `matches` method except that it doesn't use current character, starts from the next character.

```js
stream.cursor = 2; // "e"
stream.after( "llo" ); // true
```

It also does not move the cursor.

### distanceTo
It returns there is how many characters between the current character and the given target. If the target is not found, it returns `Infinity`.

```js
// Hello World!
stream.cursor = 0; // "H"
stream.distanceTo( "W" ); // 5
```

### closest
It takes an array of targets and calculates their distances to the current character. It returns an array of arrays, where each inner array contains the target and its distance to the current position in the stream and the returned root array will be sorted in ascending before returned.

```js
stream.cursor = 0; // "H"
stream.closest([ "!", "W" ]);
```

The returned array is like:

```js
[
	[ "W", 5 ],
	[ "!", 10 ]
]
```

### startTransaction
It starts a transaction. Returns a function that should be called after the transaction is done. It can be used to rollback the cursor.

```js
stream.current;	// "H"
stream.next; // "e"

const rollback = stream.startTransaction();

stream.next; // "l"
stream.next; // "l"
stream.next; // "o"
stream.cursor; // 4

rollback();

stream.current; // "H"
stream.cursor; // 0
```

### getUntil
It returns a substring from the current cursor position to the first occurrence of the given target. If the target is not found, it returns `undefined`.

```js
stream.current; // "H"
stream.getUntil( " " ); // "Hello"

stream.current; // " "
stream.cursor; // 5

stream.getUntil( "x" ); // undefined
```

It will move the cursor.

### slice
It returns a substring as given `length` from the current cursor position. If the given `length` is negative, it will throws a `RangeError`. If `length` is `Infinity`, it will return all the remaining characters in the stream from the current cursor position. It will move the cursor.

```js
stream.cursor = 1;
stream.current; // "e"

stream.slice( 3 ); // "ell"

stream.current; // "o"
stream.cursor; // 4

stream.slice( -1 ); // RangeError
stream.slice( Infinity ); // "o World!"
```

### move
It moves the cursor ahead from the current position by the given `length`. If the given `length` is negative, it will move the cursor backwards. It returns the stream's itself.

```js
// Hello World!
stream.current; // "e"
stream.cursor; // 1

stream.move( 6 );

stream.current; // "o"
stream.cursor; // 7
```

### moveTo
It teleports the cursor to the given position. It returns the stream's itself. Its an alias for `stream.cursor = position` syntax.

```js
stream.current; // "e"
stream.cursor; // 1

stream.moveTo( 6 );

stream.current; // "W"
stream.cursor; // 6

stream.moveTo( 0 );

stream.current; // "H"
stream.cursor; // 0
```

### jumpTo
It finds the index of the target in the stream starting from the current cursor position and move the cursor to that position. It returns the cursor position.

```js
stream.cursor = 1;
stream.current; // "e"

stream.jumpTo( "W" ); // 6

stream.current; // "W"
stream.cursor; // 6
```

### consume
It eats the given target character set(s) starting from the position of the cursor in the stream until it encounters something else.

The consumed data will be returned.

```js
//   v  <-- cursor is here
"Hellooo World!".consume( "o" ); // ooo
//      ^  <-- cursor is here now
```

It supports multibyte character targets.

```js
//     v  <-- cursor is here
"Hello 121212 World!".consume( "12" ); // 121212 
//           ^  <-- cursor is here now
```

It supports more than one target. With this, it will consume if the characters at the reached position matches with any of the given targets.

```js
//    v  <-- cursor is here
"Hello\s\t\t\s\sWorld!".consume([ "\s", "\t" ]); // \s\t\t\s\s
//              ^  <-- cursor is here now
```

## Iteration
We can easily iterate over the stream.

### do-while loop
Since the library has `current` property to indicate the current character, we can trust it's undefined values to break `do-while` loops.

```js
let stack = "";

do
{
	// we can consume current character
	stack += stream.current;
}
while( stream.next !== undefined );

console.log( stack );
// Hello World!
```

### while loop
We can easily use `while` loop to iterate over the stream.

```js
let stack = "";

while( stream.current !== undefined )
{
	// we can consume current character
	stack += stream.current;

	// we should move the cursor
	stream.next;
}

console.log( stack );
// Hello World!
```
