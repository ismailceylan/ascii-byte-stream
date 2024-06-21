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

	matches( needle )
	{
		return this.raw.slice( this.cursor, this.cursor + needle.length ) === needle;
	}
}
