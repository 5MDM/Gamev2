declare module "rangetouch" {
  interface Opts {
    /**
     * Whether to inject CSS to improve the usability of the inputs. It's recommended you add this yourself if you don't want RangeTouch to take care of it.
     */
    addCSS?: boolean,
    /**
     * This value is used as part of the calculation to determine the value the users selects when touching the range track. Unfortunately as JavaScript can't access the shadow DOM, this value can't be automatically determined. I would recommend customisation (and setting the size of the thumb) given all OS and browser combinations seem to render the control differently.
     */
    thumbWidth?: number,
    /**
     * Watch for new elements added to the DOM that match your string selector.
     * 
     * **Note**: This only applies when using the multiple instance `RangeTouch` setup method and also requires a string selector as the first argument.
     */
    watch?: boolean
  }
  class RangeTouch {
    /**
     * Setup a new instance
     * @param {String|Element} target The element or CSS selector to use instance for
     * @param {Opts} options The options for the `RangeTouch` instance
     */
    constructor(target: string | Element, options?: Opts);
    static get enabled(): boolean;
    /**
     * Setup multiple instances
     * @param {String|Element|NodeList|Element[]} target The elements or CSS selector to use instance for
     * @param {Opts} options The options for the `RangeTouch` instance
     */
    static setup(target: string | Element | NodeList | Element[], options?: Opts);
    /**
     * Initialized the current instance and add event listeners (Internal use only)
     */
    init();
    /**
     * Destroy the current instance and remove event listeners
     */
    destroy();
    /**
     * Enable or disable event listeners (Internal use only)
     * @param toggle Whether to enable or disable listeners
     */
    listeners(toggle?: boolean);
    /**
     * Get the value based on touch position (Internal use only)
     * @param {Event} event
     */
    get(event: Event);
    /**
     * Update range value based on position (Internal use only)
     * @param {Event} event
     */
    set(event: Event);
  }
  export = RangeTouch
}