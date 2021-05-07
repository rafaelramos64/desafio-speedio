<template>
  <div>
    <b-form-input
      v-model="searchLabels"
      type="text"
      placeholder="Setores e Cnaes..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <h5 class="mt-3">{{ sectorsTitle }}</h5>
    <b-card
      v-if="searchLabels"
      id="infinite-list"
      style="max-height: 80vh; overflow: auto;"
      no-body
      class="text-left pl-5 pt-1 mt-3 shadow-lg"
    >
      <div v-for="(item, index) in itemsOfFilterOptions" :key="index">
        <transition name="fade">
          <div class="loading" v-if="loading">
            <span class="fa fa-spinner fa-spin"></span> Loading
          </div>
        </transition>
        <label for="input-checkbox">
          <input
            @change="getAllLabelsChecked()"
            type="checkbox"
            id="input-checkbox"
            v-model="selectedLabels"
            :value="item.value"
          />
          {{ item.label }}
          <span style="color: rgb(118, 118, 118); font-size: 13px;">{{
            item.subline
          }}</span>
        </label>
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
      itemsOfFilterOptions: [],
      selectedLabels: [],
      searchLabels: '',
      sectorsTitle: '',
      itemsToShow: [],
      loading: false,
      filterOptions: []
    }
  },

  watch: {
    searchLabels: function (newQuestion, oldQuestion) {
      this.filterLabelChecked()
    }
  },

  mounted () {
    this.initialData()

    const listElm = document.querySelector('#infinite-list')
    listElm.addEventListener('scroll', e => {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        this.loadMore()
      }
    })
    this.loadMore()
  },

  methods: {
    loadMore () {
      this.loading = true
      setTimeout(e => {
        this.itemsOfFilterOptions.push(
          ...this.itemsToShow.slice(
            this.itemsOfFilterOptions.length,
            this.itemsOfFilterOptions.length + 20
          )
        )
        this.loading = false
      }, 200)
    },

    async initialData () {
      this.selectedLabels = JSON.parse(localStorage.listLabels || '[]')
      await this.getData()
    },

    async getData () {
      const response = await api.get()
      
      this.filterOptions = response.data.filters[0].filters[0].filterOptions
      this.sectorsTitle = response.data.filters[0].filters[0].title
    },

    filterLabelChecked () {
      if (this.searchLabels && this.searchLabels !== '') {
        const searchLabelCorrect = this.removeAccent(this.searchLabels)

        this.itemsToShow = this.filterOptions.filter(item => {
          return this.removeAccent(item.label).includes(searchLabelCorrect)
        })
        
        /* for (let i = 0; i < this.itemsToShow.length; i++) {
          this.itemsToShow[i].label = `${i + 1} - ${this.itemsToShow[i].label}`
        } */

        this.itemsOfFilterOptions = this.itemsToShow.slice(0, 20)
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
        .replace(/[\u0300-\u036f]/g, '')
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
