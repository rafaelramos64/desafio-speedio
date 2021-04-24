<template>
  <div>
    <b-form-input placeholder="Digite aqui..." autocomplete="off" list="options"></b-form-input>

    <datalist id="options">
      <!-- <option>Manual Option</option> -->
      <option v-for="(k, option) in filterOptions" :key="k">{{ option }}</option>
    </datalist>
  </div>
</template>

<script>
import { api } from '@/services'

export default {
  name: 'FilterOptions',
  data() {
    return {
      filterOptions: []
    }
  },

  created () {
    this.getData()
  },

  methods: {
    async getData () {
      const response = await api.get()
      this.filterOptions = response.data.filters[0].filters[0].filterOptions[0]
      console.log(this.filterOptions)
    }
  }
}
</script>