export default class AsciiByteStream
{
	/**
	 * String data to get streamed.
	 * 
	 * @type {string}
	 */
	raw = "";

	/**
	 * Current cursor position.
	 * 
	 * @type {number}
	 */
	cursor = 0;

	/**
	 * Initialize the stream.
	 * 
	 * @param {string} raw string data to get streamed
	 */
	constructor( raw )
	{
		this.raw = raw;
	}

	/**
	 * Get the current character.
	 * 
	 * @type {string|undefined}
	 */
	get current()
	{
		return this.raw[ this.cursor ];
	}

	/**
	 * Returns the next character in the stream and advances the cursor.
	 *
	 * @type {string|undefined}
	 */
	get next()
	{
		return this.raw[ ++this.cursor ];
	}

	/**
	 * Returns the previous character in the stream and decrements the cursor.
	 *
	 * @type {string}
	 */
	get prev()
	{
		return this.raw[ --this.cursor ];
	}

	/**
	 * Checks if the given needle matches starting from the current
	 * position.
	 * 
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".matches( "rem" ); // true
	 * ```
	 * 
	 * @param {string} needle a string to check
	 * @returns {boolean}
	 */
	matches( needle )
	{
		return this.raw.slice(
			this.cursor,
			this.cursor + needle.length
		) === needle;
	}

	/**
	 * Checks if the given needle matches before the current position.
	 * 
	 * ```js
	 * //   v  <-- cursor is here
	 * "lorem ipsum".before( "lore" ); // true
	 * ```
	 * 
	 * @param {string} needle a string to check
	 * @returns {boolean}
	 */
	before( needle )
	{
		return this.raw.slice(
			this.cursor - needle.length,
			this.cursor
		) === needle;
	}

	/**
	 * Checks if the given needle matches after the current position.
	 * 
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".after( "em" ); // true
	 * ```
	 *
	 * @param {string} needle a string to check
	 * @returns {boolean}
	 */
	after( needle )
	{
		return this.raw.slice(
			this.cursor + 1,
			this.cursor + needle.length + 1
		) === needle;
	}

	/**
	 * Calculates there are how many characters between the current
	 * position and the specified needle in the stream.
	 * 
	 * If the needle is not found, Infinity will be returned.
	 * 
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".distanceTo( "p" ); // 4
	 * ```
	 *
	 * @param {string} needle - The string to search for in the stream.
	 * @returns {number} The index representing the distance to the needle.
	 */
	distanceTo( needle )
	{
		const distance = this.raw.indexOf(
			needle,
			this.cursor
		) - this.cursor - 1;

		return distance < 0
			? Infinity
			: distance;
	}

	/**
	 * Returns an array of arrays, where each inner array contains a
	 * needle and its distance to the current position in the stream.
	 * 
	 * The returned array is sorted in ascending order based on the distance.
	 *
	 * @param {Array<string>} needles - An array of needles to find the closest match for.
	 * @returns {Array<Array<string, number>>}
	 */
	closest( needles )
	{
		return needles
			.map( needle =>
				[ needle, this.distanceTo( needle )]
			)
			.sort(( a, b ) =>
				a[ 1 ] - b[ 1 ]
			);
	}

	/**
	 * Starts a transaction and returns a rollback function.
	 *
	 * @returns {Function} The rollback function that resets the cursor.
	 */
	startTransaction()
	{
		const { cursor } = this;

		function rollback()
		{
			this.cursor = cursor;
		}

		return rollback.bind( this );
	}

	/**
	 * Returns a substring from the current cursor position to the first
	 * occurrence of `target`.
	 * 
	 * If the target is not found, it returns `undefined`.
	 *
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".getUntil( " " ); // "rem"
	 * //    ^  <-- cursor is here now
	 * ```
	 * 
	 * @param {string} target - The string to search for in stream.
	 * @returns {string|undefined}
	 */
	getUntil( target )
	{
		const index = this.raw.indexOf( target, this.cursor );

		if( index === -1 )
		{
			return;
		}

		const data = this.raw.slice( this.cursor, index );

		this.cursor += data.length;

		return data;
	}

	/**
	 * Slices a portion from the current position of the stream to the
	 * given `length`.
	 * 
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".slice( 3 ); // "rem"
	 * //    ^  <-- cursor is here now
	 * ```
	 *
	 * @param {number} length - The length for slicing.
	 * @throws {RangeError} when `length` is negative
	 * @returns {string} The sliced portion of the raw data.
	 */
	slice( length )
	{
		if( length < 0 )
		{
			throw new RangeError(
				`Cannot slice backwards from ${ this.cursor } to ${ length }.`
			);
		}

		return this.raw.slice(
			this.cursor,
			this.cursor += length
		);
	}

	/**
	 * Moves the cursor by the specified length from the current position.
	 *
	 * ```js
	 * //   v  <-- cursor is here
	 *   "lorem ipsum".move( 2 );
	 * //     ^  <-- cursor is here now
	 * ```
	 * 
	 * @param {number} length - The amount by which to move the cursor.
	 * @returns {this}
	 */
	move( length )
	{
		this.cursor += length;
		return this;
	}

	/**
	 * Sets the cursor to the specified position.
	 *
	 * ```js
	 * //   v  <-- cursor is here
	 *   "lorem ipsum".moveTo( 1 );
	 * //  ^  <-- cursor is here now
	 * ```
	 * 
	 * @param {number} position - The new cursor position.
	 * @returns {this}
	 */
	moveTo( position )
	{
		this.cursor = position;
		return this;
	}

	/**
	 * Finds the index of the target in the stream starting from the
	 * current cursor position and move the cursor to that position.
	 *
	 * @param {string} target - The string to search for in the stream.
	 * @returns {number} The index of the target in the stream.
	 */
	jumpTo( target )
	{
		return this.cursor = this.raw.indexOf(
			target,
			this.cursor
		);
	}

	/**
	 * It eats the given target character set(s) starting from the position
	 * of the cursor in the stream until it encounters something else.
	 * 
	 * The consumed data will be returned.
	 *
	 * ```js
	 * //  v  <-- cursor is here
	 * "fooooo ipsum".consume( "o" ); // ooo
	 * //     ^  <-- cursor is here now
	 * ```
	 * 
	 * It supports multibyte character targets.
	 * 
	 * ```js
	 * //     v  <-- cursor is here
	 * "Lorem 12 12 12 ipsum".consume( "12 " ); // 12 12 12 
	 * //              ^  <-- cursor is here now
	 * ```
	 * 
	 * It supports more than one target. With this, it will consume
	 * if the characters at the reached position matches with any of
	 * the given targets.
	 * 
	 * ```js
	 * //    v  <-- cursor is here
	 * "Lorem\s\t\t\s\sipsum".consume([ "\s", "\t" ]); // \s\t\t\s\s
	 * //              ^  <-- cursor is here now
	 * ```
	 * 
	 * @param {string|string[]} target - The string(s) to search for in the stream.
	 * @returns {string}
	 */
	consume( target )
	{
		let index;
		const start = this.cursor;

		if( ! Array.isArray( target ))
		{
			target = [ target ];
		}

		while(( index = target.findIndex( i => this.matches( i ))) > -1 )
		{
			this.move( target[ index ].length );
		}
	
		return this.raw.slice( start, this.cursor );		
	}
}
