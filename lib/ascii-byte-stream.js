export default class AsciiByteStream
{
	/**
	 * String data to get streamed.
	 * 
	 * @type {string}
	 */
	raw = "";

	/**
	 * Initialize the stream.
	 * 
	 * @param {string} raw string data to get streamed
	 */
	constructor( raw )
	{
		this.raw = raw;
	}

}
