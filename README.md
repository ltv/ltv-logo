# LTV Logo

![LTV Co., Ltd](./logo.png)

[LTV Official Website](https://ltv.vn)

LTV Logo with animation

- Javascript
- VueJS
- ReactJS

## Install

- With VueJS

```bash
yarn add ltv-logo-vue # npm install --save ltv-logo-vue
```

## Usage

### VueJS

```ts
import LtvLogo from 'ltv-logo-vue';

@Component({
  components: {
    LtvLogo
  }
})
```

```html
<ltv-logo :size="5" />
```

> `size` can be from `1` to `10`

In case of using css:

```scss
@import 'node_modules/ltv-logo-vue/ltv-logo-vue.css';
```

### Rendered HTML

The html code will be generated to:

```html
<svg class="logo size-5">
  <g class="logo-wrapper">
    <g class="logo-letter V">
      <rect />
      <rect />
    </g>
    <g class="logo-letter L">
      <rect />
      <rect />
    </g>
    <g class="logo-letter T">
      <rect />
      <rect />
    </g>
  </g>
</svg>
```
