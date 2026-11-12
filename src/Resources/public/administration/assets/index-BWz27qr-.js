import{S as s,a}from"./ld-proba-hE4qC3CW.js";const p={template:`
<span
    class="lp-status"
    :class="'lp-status--' + state"
>
    <mt-icon
        class="lp-status__icon"
        :name="icon"
        size="11px"
    />
    <span>{{ label }}</span>
</span>`,props:{state:{type:String,required:!0,validator:t=>a.includes(t)},label:{type:String,required:!0}},computed:{icon(){return s[this.state]}}};export{p as default};
