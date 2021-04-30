<template>
  <b-container fluid class="pt-4 pl-5 pr-5">
    <b-row class="text-center align-items-center">
      <b-col md="6" align-self="start">
        <FilterSectors />
      </b-col>
      <b-col md="6" align-self="start">
        <FilterCountiesStates />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FilterSectors from '../components/FilterSectors'
import FilterCountiesStates from '../components/FilterCountiesStates'

export default {
  name: 'Home',
  components: { FilterSectors, FilterCountiesStates }
}
</script>

<style scoped>

</style>