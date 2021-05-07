<template>
  <div>
    <b-form-input
      v-model="searchCountiesStates"
      type="text"
      placeholder="Municípios e Estados..."
      autocomplete="off"
      list="options"
    ></b-form-input>
    <h4 class="mt-3"> <b-badge variant="info"> {{ titleCounties }} e {{ titleStates }} </b-badge> </h4>
    <b-card
      v-show="searchCountiesStates"
      id="infinite-list-counties"
      style="max-height: 80vh; overflow: auto;"
      no-body
      class="text-left pl-5 pt-1 mt-3 shadow-lg"
    >
      <div
        v-for="(countiesStates, index) in itemsOfCountiesStates"
        :key="index"
      >
        <transition name="fade">
          <div
            class="loading"
            v-if="loading"
          >
            <span class="fa fa-spinner fa-spin"></span> Loading
          </div>
        </transition>
        <label for="input-checkbox">
          <input
            @change="getAllCountiesStatesChecked()"
            type="checkbox"
            id="input-checkbox"
            v-model="selectedCountiesStates"
            :value="countiesStates.value"
          />
          {{ countiesStates.label }}
          <span style="color: rgb(118, 118, 118); font-size: 13px;">{{
            countiesStates.subline
          }}</span>
        </label>
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
      allCountiesStates: [],
      selectedCountiesStates: [],
      itemsToShow: [],
      itemsOfCountiesStates: [],
      searchCountiesStates: '',
      titleCounties: '',
      titleStates: '',
      labelToScroll: [],
      loading: false
    }
  },

  watch: {
    searchCountiesStates () {
      this.filterCountiesStatesChecked()
    }
  },

  mounted () {
    this.initialData()

    const listElm = document.querySelector('#infinite-list-counties')
    listElm.addEventListener('scroll', e => {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        this.loadMore()
      }
    })
    this.loadMore()
  },

  methods: {
    loadMore () {
    if (this.itemsOfCountiesStates.length === this.itemsToShow.length) {
      this.loading = false
    } else {
      this.loading = true
    }
      setTimeout(e => {
        this.itemsOfCountiesStates.push(
          ...this.itemsToShow.slice(
            this.itemsOfCountiesStates.length,
            this.itemsOfCountiesStates.length + 20
          )
        )
        this.loading = false
      }, 200)
    },

    async initialData () {
      this.selectedCountiesStates = JSON.parse(localStorage.listCountiesStates || '[]')
      await this.getData()
    },

    async getData () {
      const response = await api.get()

      const filteredCountiesStates = response.data.filters[1].filters

      this.titleCounties = filteredCountiesStates[4].title
      this.titleStates = filteredCountiesStates[5].title

      /* for (let ind = 4; ind < 6; ind++) {
        for (let index in filteredCountiesStates[ind].filterOptions) {
          this.allCountiesStates.push(filteredCountiesStates[ind].filterOptions[index])
        }
      } */
      this.allCountiesStates = [...filteredCountiesStates[4].filterOptions, ...filteredCountiesStates[5].filterOptions]
    },

    filterCountiesStatesChecked () {
      if (this.searchCountiesStates) {
        const searchCountiesStatesCorrect = this.removeAccent(this.searchCountiesStates)

        this.itemsToShow = this.allCountiesStates.filter(item => {
          return this.removeAccent(item.label).includes(searchCountiesStatesCorrect)
            || this.removeAccent(item.value).includes(searchCountiesStatesCorrect)
            || this.removeAccent(item.tags).includes(searchCountiesStatesCorrect)
        })
        this.itemsOfCountiesStates = this.itemsToShow.slice(0, 20)
      }
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
  left: calc(75% - 50px);
  top: calc(80% - 18px);
}
</style>