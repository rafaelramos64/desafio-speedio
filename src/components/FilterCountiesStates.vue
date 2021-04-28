<template>
  <div>
    <b-form-input
      v-model="searchCountiesStates"
      type="text"
      placeholder="Municípios e Estados..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <b-card
      v-if="searchCountiesStates"
      no-body
      class="text-left pl-5 pt-1 mt-3"
    >
      <div
        v-for="(countiesStates, index) in countiesStatesOfFilterOptions"
        :key="index"
      >
        <div v-if="filterLabelChecked(countiesStates)">
          <label for="input">
            <input
              @change="getAllLabelsChecked()"
              type="checkbox"
              id="input"
              v-model="selectedCountiesStates"
              :value="countiesStates"
            />
            {{ countiesStates }} <span style="color: rgb(118, 118, 118); font-size: 13px;">{{ sublines[index] }}</span>
          </label>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { api } from '@/services'

export default {
  name: 'FilterCountiesStates',
  data () {
    return {
      sublines: [],
      countiesStatesOfFilterOptions: [],
      selectedCountiesStates: [],
      searchCountiesStates: ''
    }
  },

  mounted () {
    this.getData()
    this.selectedCountiesStates = JSON.parse(localStorage.listCountiesStates || '[]')
  },

  methods: {
    async getData () {
      const response = await api.get()
      const filterOptions = response.data.filters[1].filters[4].filterOptions
      for (let index in filterOptions) {
        this.sublines.push(filterOptions[index].subline)
        this.countiesStatesOfFilterOptions.push(filterOptions[index].label)
      }
    },

    filterLabelChecked (CountiesStates) {
      if (!!this.searchCountiesStates) {
        const countiesStatesCorrect = this.removeAccent(CountiesStates)
        const searchCountiesStatesCorrect = this.removeAccent(this.searchCountiesStates)
        return countiesStatesCorrect.includes(searchCountiesStatesCorrect)
      }
      return false
    },

    getAllLabelsChecked () {
      const parsed = JSON.stringify(this.selectedCountiesStates)
      localStorage.setItem('listCountiesStates', parsed)
    },

    removeAccent (currentString) {
      return currentString
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "");
    },
  }
}
</script>