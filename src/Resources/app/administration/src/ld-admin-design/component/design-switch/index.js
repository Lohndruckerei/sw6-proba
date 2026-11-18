/* GENERIERT aus ld-admin-design 1.1.0 (3d22274) – nicht hier ändern, sondern in ~/projekte/sw6-entwicklung-lohndruckerei/ld-admin-design/vorlage und ./sync.sh ausführen. */
import { DESIGNS } from '../../constants';

/**
 * Schalter „Design A | B | C“ für den Praxistest. Speichert die Wahl je Benutzer.
 * Dahinter „Markieren“: Plugin-Markierung (Testmodus) für alle Lohndruckerei-Plugins, siehe marker.js.
 * Platz: Smart-Bar (#smart-bar-actions), vor „Speichern“.
 */
export default {
    template: `
<div class="lp-design-switch" role="group" :aria-label="$tc('lp-design.switchLabel')">
    <span class="lp-design-switch__label">{{ $tc('lp-design.switchLabel') }}</span>
    <button
        v-for="design in designs"
        :key="design.key"
        v-tooltip.bottom="{ message: design.title, appearance: 'light' }"
        type="button"
        class="lp-design-switch__option"
        :class="{ 'is--active': design.key === current }"
        :aria-pressed="design.key === current ? 'true' : 'false'"
        @click="select(design.key)"
    >
        {{ design.key.toUpperCase() }}
    </button>
    <button
        v-tooltip.bottom="{ message: $tc('lp-design.marker.toggleTitle'), appearance: 'light' }"
        type="button"
        class="lp-design-switch__option lp-design-switch__marker"
        :class="{ 'is--active': markerActive }"
        :aria-pressed="markerActive ? 'true' : 'false'"
        @click="toggleMarker"
    >
        {{ $tc('lp-design.marker.toggle') }}
    </button>
</div>`,

    data() {
        return {
            markerActive: window.ldAdminMarker?.active ?? false,
            markerOff: null,
        };
    },

    computed: {
        store() {
            return Shopware.Store.get('lpDesign');
        },

        current() {
            return this.store.design;
        },

        designs() {
            return DESIGNS.map((key) => {
                const isDefault = key === this.store.defaultDesign;

                return {
                    key,
                    title: this.$tc(`lp-design.designs.${key}`) + (isDefault ? ` (${this.$tc('lp-design.default')})` : ''),
                };
            });
        },
    },

    created() {
        this.store.ensureLoaded();
        this.markerOff = window.ldAdminMarker?.onChange((active) => {
            this.markerActive = active;
        }) ?? null;
    },

    unmounted() {
        this.markerOff?.();
    },

    methods: {
        toggleMarker() {
            window.ldAdminMarker?.toggle();
        },

        async select(design) {
            if (design === this.current) {
                return;
            }

            try {
                await this.store.setDesign(design);
            } catch {
                // Anzeige ist schon umgeschaltet; nur das Speichern für den Benutzer ist fehlgeschlagen.
            }
        },
    },
};
