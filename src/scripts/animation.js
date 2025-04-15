import { isInViewport } from "@scripts/utils/is-in-viewport"; 

export const animation = {
    vars: {
        animatableQuery: '[data-js=animatable]', // Selektor für animierbare Elemente
        animationNameAttribute: 'data-animation', // Attribut für den Animationstyp
        activeSuffix: '__active', // Suffix für aktive Animation
    },

    init() {
        this.handleScroll(); // Direkt prüfen
        this.addEventTriggers();
    },

    addEventTriggers() {
        window.addEventListener("scroll", this.handleScroll.bind(this));
    },

    findElements() {
        return Array.from(document.querySelectorAll(this.vars.animatableQuery));
    },

    handleScroll() {
        const $animatableElements = this.findElements().filter(el => !el.dataset.animated); // Nur nicht animierte Elemente

        if ($animatableElements.length === 0) {
            this.removeEventTriggers(); // Entferne Scroll-Listener, wenn alles animiert ist
            return;
        }

        for (const $animatableElement of $animatableElements) {
            if (this.isElement50Visible($animatableElement)) {
                this.startAnimation($animatableElement);
            }
        }
    },

    startAnimation($element) {
        const animationName = $element.getAttribute(this.vars.animationNameAttribute);
        if (!animationName) return;

        const activeClass = `${animationName}${this.vars.activeSuffix}`;

        // Setze `data-animated` direkt, damit es nicht erneut getriggert wird
        $element.dataset.animated = "true";

        // Aktive Klasse hinzufügen, wenn das Element in den Viewport kommt
        requestAnimationFrame(() => {
            $element.classList.add(activeClass);
        });

        // Event-Listener für Transition-Ende
        $element.addEventListener("transitionend", () => {
            this.cleanupAnimation($element, animationName, activeClass);
            this.checkIfAllAnimated();
        }, { once: true });
    },

    cleanupAnimation($element, baseClass, activeClass) {
        $element.classList.remove(activeClass);
        $element.classList.remove(baseClass); // Entfernt auch fade-up
    },

    checkIfAllAnimated() {
        const remainingElements = this.findElements().filter(el => !el.dataset.animated);
        if (remainingElements.length === 0) {
            this.removeEventTriggers(); // Falls alle animiert wurden, Event-Listener entfernen
        }
    },

    removeEventTriggers() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    },

    isElement50Visible($element) {
        const rect = $element.getBoundingClientRect();
        const elementHeight = rect.height;
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);

        return (visibleHeight / elementHeight) >= 0.5; // Mindestens 50% sichtbar
    }
};
