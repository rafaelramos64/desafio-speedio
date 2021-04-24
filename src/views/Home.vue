<template>
  <b-container fluid class="pt-3">
    <b-row class="text-center align-items-center">
      <b-col md="6" class="ml-auto mr-auto">
        <FilterOptions />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FilterOptions from '../components/FilterOptions'

export default {
  name: 'Home',
  components: { FilterOptions }
}
</script>
