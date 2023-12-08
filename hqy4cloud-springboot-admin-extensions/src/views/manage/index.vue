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
  <section class="section">
    <grade
      :instance="instance"
      :grade="grade"
    />
    <switchers
      :instance="instance"
      :switchers="switchers"
    />
  </section>
</template>

<script>
import grade from './grade';
import switchers from './switcher-list';
export default {
  components: {
    grade, switchers
  },
  props: {
    instance: { //<1>
      type: Object,
      required: true
    }
  },
  data: () => ({
    grade: {},
    switchers: []
  }),
  async created() {
    const grade_response = await this.instance.axios.get('actuator/grade'); //<2>
    this.grade = grade_response.data;
    const switcher_response = await this.instance.axios.get('actuator/switcher'); //<2>
    this.switchers = Object.values(switcher_response.data)
  }
};
</script>