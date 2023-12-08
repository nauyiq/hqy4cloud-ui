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
    <sba-panel :header-sticks-below="['#navigation']" title="Micro Server Switchers">
      <div v-if="switchers.length > 0" class="field">
        <p class="control is-expanded has-icons-left">
          <input
              v-model="switcherCriteria"
              class="input"
              type="search"
          >
          <span class="icon is-small is-left">
            <font-awesome-icon icon="filter" />
          </span>
        </p>
      </div>

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th v-text="`ID`"/>
            <th v-text="`名称`"/>
            <th v-text="`状态`"/>
          </tr>
        </thead>
        <tbody>
          <tr v-for="switcher in allSwitcher" :key="switcher.id">
            <td>
              <span
                class="is-breakable"
                v-text="switcher.id"
              />
            </td>
            <td>
              <span
                  class="is-breakable"
                  v-text="switcher.name"
              />
            </td>
            <td>
              <switcher-control
                  :isChecked="switcher.status"
                  @switcher-change="status => changeSwitcherStatus(switcher.id, status)"
              />
            </td>
          </tr>
        </tbody>

      </table>

    </sba-panel>
  </div>
</template>
<script>
import SwitcherControl from '../../components/switcher'

const switcherHasKeyword = (switcher, keyword) => {
  return switcher.name.includes(keyword);
};

const sortSwitchers = switcher => {
  return [...switcher].sort(
      compareBy(s => s.id)
  )
};

const compareBy = mapper => (a, b) => {
  const valA = mapper(a);
  const valB = mapper(b);
  return valA > valB ? 1 : valA < valB ? -1 : 0;
};


export default {
  components: {SwitcherControl},
  props: {
    instance: {
      type: Object,
      required: true
    },
    switchers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    error: null,
    switcherCriteria: null
  }),
  computed: {
    allSwitcher() {
      if (!this.switcherCriteria) {
        return sortSwitchers(this.switchers)
      }
      const filter_switcher = this.switchers.filter(switcher => switcherHasKeyword(switcher, this.switcherCriteria.toLowerCase()));
      return sortSwitchers(filter_switcher)
    }
  },
  methods: {
    changeSwitcherStatus(id, status) {
      this.instance.axios.post('actuator/switcher', {id, status}, {
        headers: {'Content-Type': 'application/json'}
      });
    }
  }
}
</script>
