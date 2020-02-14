<template>
  <svg :class="sizeClass">
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
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Vue, Prop } from 'vue-property-decorator';

@Component
export default class LtvLogo extends Vue {
  @Prop({ default: 5 })
  public size!: number;

  public get sizeClass(): string {
    return `logo size-${this.size}`;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables';
svg.logo {
  // width: calc($ls + 10px);
  // height: $ls;
  @for $i from 1 through 10 {
    $value: $i / 10;
    &.size-#{$i} {
      @include scale-logo($value);
    }
  }

  .logo-wrapper {
    transform: translate($global-border, $global-border);
    .logo-letter {
      rect:first-child {
        width: $lw;
        height: $h;
        rx: $br;
      }
      rect:last-child {
        width: $sw;
        height: $h;
        rx: $br;
      }
    }
    .L {
      @include transform-letter(
        $blue,
        $transform-L,
        $transform-L-shape1,
        $transform-L-shape2,
        $Lx1,
        $Ly1,
        $Lx2,
        $Ly2,
        $am-L
      );
    }
    .T {
      @include transform-letter(
        $green,
        $transform-T,
        $transform-T-shape1,
        $transform-T-shape2,
        $Tx1,
        $Ty1,
        $Tx2,
        $Ty2,
        $am-T
      );
    }
    .V {
      @include transform-letter(
        $yellow,
        $transform-V,
        $transform-V-shape1,
        $transform-V-shape2,
        $Vx1,
        $Vy1,
        $Vx2,
        $Vy2,
        $am-V
      );
    }
  }
}
</style>
