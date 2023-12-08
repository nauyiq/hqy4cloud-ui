<!--
  - Copyright 2014-2019 the original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="field is-grouped logger-control">
    <div class="control buttons has-addons">
      <sba-confirm-button
          v-for="levelOption in levelOptions"
          :key="levelOption"
          class="button logger-control__level"
          :class="cssClass(levelOption.index)"
          v-text="levelOption.grade"
          @click.stop="selectLevel(levelOption.index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    levelOptions: [
        { grade: "灰度", index: "50"},
        { grade: "白度", index: "100"}
    ]
  }),
  computed: {
  },
  methods: {
    selectLevel(level) {
      this.value = level
      this.$emit('change', level);
    },
    cssClass(level) {
      return {
        'is-active is-black': level === "50" && level === this.value,
        'is-active is-light': level === "100" && level === this.value,
      };
    }
  }
}
</script>

<style lang="scss">
.logger-control {
  &__level {
    &--inherited {
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>