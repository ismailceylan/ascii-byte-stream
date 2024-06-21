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
	 * @type {string}
	 */
	get current()
	{
		return this.raw[ this.cursor ];
	}

	get next()
	{
		return this.raw[ ++this.cursor ];
	}

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
		return this.raw.slice( this.cursor, this.cursor + needle.length ) === needle;
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
		return this.raw.slice( this.cursor - needle.length, this.cursor ) === needle;
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
		return this.raw.slice( this.cursor + 1, this.cursor + needle.length + 1 ) === needle;
	}

	/**
	 * Calculates the distance to the specified needle in the stream.
	 * 
	 * ```js
	 * // v  <-- cursor is here
	 * "lorem ipsum".distanceTo( "p" ); // 4
	 * ```
	 *
	 * @param {string} needle - The string to search for in the stream.
	 * @return {number} The index representing the distance to the needle.
	 */
	distanceTo( needle )
	{
		return this.raw.slice( this.cursor + 1 ).indexOf( needle );
	}
}
