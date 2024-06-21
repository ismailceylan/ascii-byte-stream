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
	cursor = -1;

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

}
