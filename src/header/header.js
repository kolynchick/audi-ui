import Component from '../component/component';
import ScrollObserver from '../util/scroll-observer';

const SELECTOR_COMPONENT = '.aui-js-header';
const CLASS_STICKYABLE = 'aui-header--sticky';
const CLASS_IS_STICKY = 'is-sticky';

/**
 * Class constructor for Header AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Header extends Component {

  /**
   * Upgrades all Header AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Header(element));
      }
    });
    return components;
  };

  /**
   * Constructor
   * @constructor
   * @param {HTMLElement} element The element of the AUI component.
   */
  constructor(element) {
    super(element);
  }

  /**
   * Initialize component.
   */
  init() {
    super.init();

    // If Header ist not sticky, there is nothing todo.
    if (!this._element.classList.contains(CLASS_STICKYABLE)) {
      return;
    }

    // FIXME position:sticky currently not working. See also SCSS.
    // If browser supports position:sticky, it will handle positioning and
    // we can skip here.
    // if (window.getComputedStyle(this._element).position.indexOf('sticky') !== -1) {
    //   return;
    // }

    this._scrollObserver = new ScrollObserver();
    this._scrollObserver.scrolled.add(this._scrollHandler = () => this.checkStickiness());

    this._sticky = false;
    this.checkStickiness();
  }

  /**
  * Dispose component.
  */
  dispose() {
    super.dispose();

    this._scrollObserver.resized.remove(this._scrollHandler);
    this._resizeObserver.resized.remove(this._resizedHandler);
  }

  /**
   * Check if position.top is negative. If so stick otherwise release component.
   */
  checkStickiness() {
    if (this._element.getBoundingClientRect().top <= 0) {
      if (!this._sticky) {
        this.stick();
      }
    } else {
      if (this._sticky) {
        this.release();
      }
    }
  }

  /**
   * Stick component to top of viewport in adding sticky class.
   */
  stick() {
    if (!this._sticky) {
      this._element.classList.add(CLASS_IS_STICKY);
    }
    this._sticky = true;
  }

  /**
   * Release component and position not fixed in removing sticky class.
   */
  release() {
    if (this._sticky) {
      this._element.classList.remove(CLASS_IS_STICKY);
    }
    this._sticky = false;
  }
}
