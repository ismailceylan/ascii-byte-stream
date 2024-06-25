var h = Object.defineProperty;
var u = (t, r, s) => r in t ? h(t, r, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[r] = s;
var c = (t, r, s) => u(t, typeof r != "symbol" ? r + "" : r, s);
class n {
  /**
   * Initialize the stream.
   * 
   * @param {string} raw string data to get streamed
   */
  constructor(r) {
    /**
     * String data to get streamed.
     * 
     * @type {string}
     */
    c(this, "raw", "");
    /**
     * Current cursor position.
     * 
     * @type {number}
     */
    c(this, "cursor", 0);
    this.raw = r;
  }
  /**
   * Get the current character.
   * 
   * @type {string}
   */
  get current() {
    return this.raw[this.cursor];
  }
  /**
   * Returns the next character in the stream and advances the cursor.
   *
   * @type {string}
   */
  get next() {
    return this.raw[++this.cursor];
  }
  /**
   * Returns the previous character in the stream and decrements the cursor.
   *
   * @type {string}
   */
  get prev() {
    return this.raw[--this.cursor];
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
  matches(r) {
    return this.raw.slice(
      this.cursor,
      this.cursor + r.length
    ) === r;
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
  before(r) {
    return this.raw.slice(
      this.cursor - r.length,
      this.cursor
    ) === r;
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
  after(r) {
    return this.raw.slice(
      this.cursor + 1,
      this.cursor + r.length + 1
    ) === r;
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
   * @returns {number} The index representing the distance to the needle.
   */
  distanceTo(r) {
    return this.raw.indexOf(
      r,
      this.cursor
    ) - this.cursor - 1;
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
  closest(r) {
    return r.map(
      (s) => [s, this.distanceTo(s)]
    ).sort(
      (s, i) => s[1] - i[1]
    );
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: r } = this;
    function s() {
      this.cursor = r;
    }
    return s.bind(this);
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
  getUntil(r) {
    const s = this.raw.indexOf(r, this.cursor);
    if (s === -1)
      return;
    const i = this.raw.slice(this.cursor, s);
    return this.cursor += i.length, i;
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
  slice(r) {
    if (r < 0)
      throw new RangeError(
        `Cannot slice backwards from ${this.cursor} to ${r}.`
      );
    return this.raw.slice(
      this.cursor,
      this.cursor += r
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
  move(r) {
    return this.cursor += r, this;
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
  moveTo(r) {
    return this.cursor = r, this;
  }
  /**
   * Finds the index of the target in the stream starting from the
   * current cursor position and move the cursor to that position.
   *
   * @param {string} target - The string to search for in the stream.
   * @returns {number} The index of the target in the stream.
   */
  jumpTo(r) {
    return this.cursor = this.raw.indexOf(
      r,
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
  consume(r) {
    let s;
    const i = this.cursor;
    for (Array.isArray(r) || (r = [r]); (s = r.findIndex((o) => this.matches(o))) > -1; )
      this.move(r[s].length);
    return this.raw.slice(i, this.cursor);
  }
}
export {
  n as default
};
