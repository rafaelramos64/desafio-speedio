<template>
  <div>
    <b-form-input
      v-model="searchLabels"
      type="text"
      placeholder="Setores e Cnaes..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <b-card
      v-if="searchLabels"
      no-body
      class="text-left pl-5 pt-1 mt-3"
    >
      <div
        v-for="(label, index) in labelsOfFilterOptions"
        :key="index"
      >
        <div v-if="filterLabelChecked(label)">
          <label for="input">
            <input  
              @change="getAllLabelsChecked()"
              type="checkbox"
              id="input"
              v-model="selectedLabels"
              :value="label"/>
            {{ label }}         <span style="color: rgb(118, 118, 118); font-size: 13px;">{{ sublines[index] }}</span>
          </label>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { api } from '@/services'

export default {
  name: 'FilterOptions',
  data () {
    return {
      sublines: [],
      labelsOfFilterOptions: [],
      selectedLabels: [],
      searchLabels: ''
    }
  },

  mounted () {
    this.getData()
    this.selectedLabels = JSON.parse(localStorage.listLabels || '[]')
  },

  methods: {
    async getData () {
      const response = await api.get()
      const filterOptions = response.data.filters[0].filters[0].filterOptions

      for (let index in filterOptions) {
        this.labelsOfFilterOptions.push(filterOptions[index].label)
        this.sublines.push(filterOptions[index].subline)
        /* this.groupTags[filterOptions[index].label] = filterOptions[index].subline */
      }
    },

    filterLabelChecked (label) {
      if (!!this.searchLabels) {
        const labelCorrect = this.removeAccent(label)
        const searchLabelCorrect = this.removeAccent(this.searchLabels)
        return labelCorrect.includes(searchLabelCorrect)
      }
      return false
    },

    getAllLabelsChecked () {
      const parsed = JSON.stringify(this.selectedLabels)
      localStorage.setItem('listLabels', parsed)
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