/* GENERIERT aus ld-admin-design 1.0.0 (1d3d326) – nicht hier ändern, sondern in ~/projekte/sw6-entwicklung-lohndruckerei/ld-admin-design/vorlage und ./sync.sh ausführen. */
import { CATEGORY_COLORS } from '../../constants';

/**
 * Kategorie-Chip. Aussehen je Design: A grau mit farbigem Icon,
 * B getönt mit Farbbalken (CMYK), C farbiges Quadrat.
 *
 * color: c1 | c2 | c3 | c4 (Kategorie-Farbe aus DESIGN.md)
 */
export default {
    template: `
<span
    class="lp-chip"
    :style="{ '--lp-t': 'var(--lp-' + color + ')' }"
    :title="title"
>
    <mt-icon
        v-if="icon"
        class="lp-chip__icon"
        :name="icon"
        size="12px"
    />
    <span class="lp-chip__label">{{ label }}</span>
</span>`,

    props: {
        label: {
            type: String,
            required: true,
        },

        color: {
            type: String,
            required: false,
            default: 'c1',
            validator: (value) => CATEGORY_COLORS.includes(value),
        },

        icon: {
            type: String,
            required: false,
            default: null,
        },

        title: {
            type: String,
            required: false,
            default: null,
        },
    },
};
