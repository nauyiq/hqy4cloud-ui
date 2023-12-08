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
  <div :class="{ 'is-loading' : isLoading }">
    <sba-panel :header-sticks-below="['#navigation']" title="Micro Server Grade Info">
      <table class="table is-fullwidth">
        <thead>
        <tr>
          <th v-text="`应用名`"/>
          <th v-text="`服务名`"/>
          <th v-text="`服务类型`"/>
          <th v-text="`灰白度`"/>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
               <span
                   class="is-breakable"
                   v-text="grade.name"
               />
          </td>
          <td>
               <span
                   class="is-breakable"
                   v-text="grade.alias"
               />
          </td>
          <td>
               <span
                   class="is-breakable"
                   v-text="grade.actuatorType"
               />
          </td>
          <td>
            <grade-control
                :value="grade.pubMode"
                @change="level => changeServerGrade(level)"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </sba-panel>
  </div>
</template>
<script>
import GradeControl from './grade-contol'

export default {
  components: {GradeControl},
  props: {
    instance: {
      type: Object,
      required: true
    },
    grade: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    error: null,
  }),
  methods: {
    changeServerGrade(pubMode) {
      this.instance.axios.post('actuator/grade', {pubMode}, {
        headers: {'Content-Type': 'application/json'}
      });
    }
  }
}
</script>