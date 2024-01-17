<!--
  - Copyright 2014-2018 the original author or authors.
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
  <div v-if="show_db"
       style="height: calc(100vh - 110px)">
    <iframe
        class="iframe-panel"
        :src="db_url"
        sandbox="allow-forms allow-scripts allow-top-navigation allow-popups  allow-same-origin">
    </iframe>
  </div>
</template>
<script>
export default {
  data: () => ({
    db_url: "",
    show_db: false,
    height: document.documentElement.clientHeight - 94.5 + 'px',
  }),
  props: {
    instance: { //<1>
      type: Object,
      required: true
    }
  },
  async created() {
    const response = await this.instance.axios.get('actuator/druid');
    this.db_url = response.data.url
    this.show_db = response.data.enabled
  }
}
</script>

<style scoped>
.iframe-panel {
  width: 100%;
  height: 100%;
  border: none;
  overflow-scrolling: auto;
}
</style>