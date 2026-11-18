import{C as l}from"./ld-proba-AUqwTkp-.js";const i={template:`
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
</span>`,props:{label:{type:String,required:!0},color:{type:String,required:!1,default:"c1",validator:e=>l.includes(e)},icon:{type:String,required:!1,default:null},title:{type:String,required:!1,default:null}}};export{i as default};
