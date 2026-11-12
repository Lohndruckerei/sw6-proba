import{D as s}from"./ld-proba-hE4qC3CW.js";const n={template:`
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
</div>`,computed:{store(){return Shopware.Store.get("lpDesign")},current(){return this.store.design},designs(){return s.map(e=>{const t=e===this.store.defaultDesign;return{key:e,title:this.$tc(`lp-design.designs.${e}`)+(t?` (${this.$tc("lp-design.default")})`:"")}})}},created(){this.store.ensureLoaded()},methods:{async select(e){if(e!==this.current)try{await this.store.setDesign(e)}catch{}}}};export{n as default};
