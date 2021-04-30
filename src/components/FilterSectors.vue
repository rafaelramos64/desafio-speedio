<template>
  <div>
    <b-form-input
      v-model="searchLabels"
      type="text"
      placeholder="Setores e Cnaes..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <h5 class="mt-3">{{ sectorsTitle }} </h5>
    <b-card
      v-infinite-scroll="{ onEnter, onLeave, distance: 20 }"
      style="max-height: 500px; overflow: auto;"
      v-if="searchLabels"
      no-body
      class="text-left pl-5 pt-1 mt-3"
    >
      <div
        v-for="(label, index) in labelsOfFilterOptions"
        :key="index"
      >
        <transition name="fade">
          <div class="loading" v-if="loading">
            <span class="fa fa-spinner fa-spin"></span> Loading
          </div>
        </transition>
        <div v-if="filterLabelChecked(label)">
          <label for="input-checkbox">
            <input  
              @change="getAllLabelsChecked()"
              type="checkbox"
              id="input-checkbox"
              v-model="selectedLabels"
              :value="labelValues[index]"/>
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
      labelsOfFilterOptions: [],
      sublines: [],
      labelValues: [],
      selectedLabels: [],
      searchLabels: '',
      sectorsTitle: '',
      labelToScroll: [],
      page: 1,
      loading: false,
    }
  },

  mounted () {
    this.initialData()
  },

  methods: {
    async initialData () {
      this.selectedLabels = JSON.parse(localStorage.listLabels || '[]')
      await this.getData()
      this.onEnter()
    },

    async getData () {
      const response = await api.get()
      
      const filterOptions = response.data.filters[0].filters[0].filterOptions

      this.sectorsTitle = response.data.filters[0].filters[0].title
      
      for (let index in filterOptions) {
        this.labelToScroll.push(filterOptions[index].label)
        this.sublines.push(filterOptions[index].subline)
        this.labelValues.push(filterOptions[index].value)
        /* this.groupsublines[filterOptions[index].label] = filterOptions[index].subline */
      }
    },

    filterLabelChecked (label) {
      if (!!this.searchLabels) {
        const labelCorrect = this.removeAccent(label)
        const searchLabelCorrect = this.removeAccent(this.searchLabels)
        return labelCorrect.includes(searchLabelCorrect)
      }
        
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

    onEnter () {
      this.loading = true
      setTimeout(() => {
        const numberPerPage = 20
        let begin = ((this.page - 1) * numberPerPage)
        let end = begin + numberPerPage
        this.labelsOfFilterOptions = this.labelToScroll.slice(begin, end)
        this.page ++
        this.loading = false;
      }, 300);
    },

    onLeave () {
      this.loading = true
      setTimeout(() => {
        const numberPerPage = 20
        let begin = ((this.page - 1) * numberPerPage)
        let end = begin + numberPerPage
        this.labelsOfFilterOptions = this.labelToScroll.slice(begin, end)
        this.page ++
        this.loading = false;
      }, 200);
      console.log('onLeave')
    }
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  position: fixed;
  color: #fff;
  z-index: 1;
  background: #5c4084;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(25% - 45px);
  top: calc(80% - 18px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>