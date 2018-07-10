export default {
  init() {
    // https://developer.mozilla.org/en/docs/Web/API/Element/matches
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    // Note, this relies on Element.prototype.matches being available (polyfilled above)
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10638731/
    if (!NodeList.prototype.forEach && Array.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  }
}
