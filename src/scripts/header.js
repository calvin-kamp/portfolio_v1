export const header = {

    vars: {

        queries: {
            component:                      '*[data-js=header]',
            navigation:                     '*[data-navigation]',
            navigationTrigger:              '*[data-navigation-trigger]'
        },

        navOpenClass:                       'header__navigation--open'    

    },

    init() {

        const $headers = this.findComponent();

        if (!$headers.length) {
            console.log('No header-component found');
            return;
        }

        for (const $header of $headers) {
            this.addEventTrigger($header);
        }

    },

    findComponent() {

        return Array.from(document.querySelectorAll(this.vars.queries.component));

    },

    addEventTrigger($header) {

        const $navigationTrigger = $header.querySelector(this.vars.queries.navigationTrigger);
        
        if (!$navigationTrigger) {
            console.log('No navigation-trigger found')
            return;
        }


        $navigationTrigger.addEventListener('click', (event) => {

            event.preventDefault();

            this.eventHandler($navigationTrigger
            );

        });

    },

    eventHandler($navigationTrigger) {

        const $navigation = document.querySelector(this.vars.queries.navigation);

        if(!$navigation) {
            console.log('No navigation found');
            return;
        }

        if ($navigation.classList.contains(this.vars.navOpenClass)) {
            $navigation.classList.remove(this.vars.navOpenClass);
        } else {
            $navigation.classList.add(this.vars.navOpenClass);
        }

    }

}