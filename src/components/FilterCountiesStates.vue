<template>
  <div>
    <b-form-input
      v-model="searchCountiesStates"
      type="text"
      placeholder="Municípios e Estados..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <h5 class="mt-3">{{ titleCounties }} e {{ titleStates }} </h5>
    <b-card
      v-if="searchCountiesStates"
      no-body
      class="text-left pl-5 pt-1 mt-3"
    >
      <div
        v-for="(countiesStates, index) in allCountiesStates"
        :key="index"
      >
        <div v-if="filterCountiesStatesChecked(countiesStates)">
          <label for="input-checkbox">
            <input
              @change="getAllCountiesStatesChecked()"
              type="checkbox"
              id="input-checkbox"
              v-model="selectedCountiesStates"
              :value="allValuesCountiesStates[index]">
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
      allCountiesStates: [],
      allValuesCountiesStates: [],
      selectedCountiesStates: [],
      searchCountiesStates: '',
      titleCounties: '',
      titleStates: ''
    }
  },

  mounted () {
    this.getData()
    this.selectedCountiesStates = JSON.parse(localStorage.listCountiesStates || '[]')
  },

  methods: {
    async getData () {
      const response = await api.get()
      /* const filteredCounties = response.data.filters[1].filters[4].filterOptions
      const filteredStates = response.data.filters[1].filters[5].filterOptions */

      const filteredCountiesStates = response.data.filters[1].filters

      this.titleCounties = filteredCountiesStates[4].title
      this.titleStates = filteredCountiesStates[5].title

      for (let ind = 4; ind < 6; ind++) {
        for (let index in filteredCountiesStates[ind].filterOptions) {

          this.sublines.push(filteredCountiesStates[ind].filterOptions[index].subline)
          this.allCountiesStates.push(filteredCountiesStates[ind].filterOptions[index].label)
          this.allValuesCountiesStates.push(filteredCountiesStates[ind].filterOptions[index].value)
          
        }
      }
    },

    filterCountiesStatesChecked (CountiesStates) {
      if (!!this.searchCountiesStates) {
        const countiesStatesCorrect = this.removeAccent(CountiesStates)
        const searchCountiesStatesCorrect = this.removeAccent(this.searchCountiesStates)
        return countiesStatesCorrect.includes(searchCountiesStatesCorrect)
      }
      return false
    },

    getAllCountiesStatesChecked () {
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