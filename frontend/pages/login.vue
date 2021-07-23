<template>
  <section class="bg-gray-300 h-screen sm:absolute w-full h-full text-gray-700 p-3">
    <div class="flex flex-col h-full w-full relative overflow-auto">
      <div class="m-auto shadow rounded w-full sm:w-3/6 md:w-2/6">
        <access-form :login-form="true" @success="grantAccess" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    grantAccess () {
      this.$router.push('/')
    }
  }
}
</script>
