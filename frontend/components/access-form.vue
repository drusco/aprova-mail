<template>
  <div>
    <div v-if="isLoginForm" class="flex flex-col bg-white h-full">
      <div class="p-5 bg-blue-500 text-white">
        <strong>Acesse sua conta</strong>
      </div>
      <div class="p-5 py-3">
        <label>
          <div class="my-2 text-sm">Nickname</div>
          <input
            v-model="user.nickname"
            type="text"
            class="w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.login
            }"
          >
        </label>
        <label>
          <div class="my-2 text-sm">Senha</div>
          <input
            v-model="user.senha"
            type="password"
            class="w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.login
            }"
          >
        </label>
        <div v-if="errors.login">
          <div v-for="(error, index) in errors.login" :key="index" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row border-t border-gray-300 mt-2 p-5 bg-gray-200 text-right">
        <button class="btn btn-sm bg-white border border-gray-300 w-full sm:w-6/12 sm:mr-1" @click="toggleForms">
          Cadastre-se
        </button>
        <button class="btn btn-sm bg-gray-400 text-white w-full sm:w-6/12 sm:ml-1 mt-2 sm:mt-0" @click="login">
          <strong>Entrar</strong>
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col bg-white h-full">
      <div class="p-5 bg-blue-500 text-white">
        <strong>Meu primeiro acesso</strong>
      </div>
      <div class="p-5 py-3">
        <label>
          <div class="my-2 text-sm">Nome</div>
          <input
            v-model="user.nome"
            type="text"
            class="w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.nome
            }"
          >
        </label>

        <div v-if="errors.nome">
          <div v-for="(error, index) in errors.nome" :key="index" class="error-message">
            {{ error }}
          </div>
        </div>

        <label>
          <div class="my-2 text-sm">Nickname</div>
          <input
            v-model="user.nickname"
            type="text"
            class="w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.nickname
            }"
          >
        </label>

        <div v-if="errors.nickname">
          <div v-for="(error, index) in errors.nickname" :key="index" class="error-message">
            {{ error }}
          </div>
        </div>

        <label v-if="cities && cities.length">
          <div class="my-2 text-sm">Cidade</div>
          <select
            v-model="user.cidade"
            class="form-select w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.cidade
            }"
          >
            <option v-for="(city, index) in cities" :key="index" :value="city.uuid">{{ city.cidade }}</option>
          </select>
        </label>

        <div v-if="errors.cidade">
          <div v-for="(error, index) in errors.cidade" :key="index" class="error-message">
            {{ error }}
          </div>
        </div>

        <label>
          <div class="my-2 text-sm">Senha</div>
          <input
            v-model="user.senha"
            type="password"
            class="w-full p-1 px-4 rounded-lg outline-none focus:bg-gray-100 border border-gray-300"
            :class="{
              'border-red-500': errors.senha
            }"
          >
        </label>

        <div v-if="errors.senha">
          <div v-for="(error, index) in errors.senha" :key="index" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row border-t border-gray-300 mt-2 p-5 bg-gray-200 text-right">
        <button class="btn btn-sm bg-white border border-gray-300 w-full sm:w-6/12 sm:mr-1" @click="toggleForms">
          Já possui conta?
        </button>
        <button class="btn btn-sm bg-gray-400 text-white w-full sm:w-6/12 sm:ml-1 mt-2 sm:mt-0" @click="signup">
          <strong>Cadastrar</strong>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessForm',
  props: {
    loginForm: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    errors: {},
    isLoginForm: false,
    cities: [],
    user: {
      nome: '',
      nickname: '',
      cidade: '',
      senha: ''
    }
  }),
  computed: {
    token () {
      return this.$store.state.auth.token
    }
  },
  async mounted () {
    const cities = await this.$axios.get(`${process.env.API}/cities`)
    this.cities = cities && cities.data
    this.isLoginForm = this.loginForm
  },
  methods: {
    toggleForms () {
      this.isLoginForm = !this.isLoginForm
      this.errors = {}
      this.resetUserInfo()
    },
    resetUserInfo () {
      this.user.nome = ''
      this.user.nickname = ''
      this.user.cidade = ''
      this.user.senha = ''
    },
    sanitizeErrors (errors) {
      this.errors = {}
      if (errors) {
        if (typeof errors === 'string') {
          errors = [errors]
        }
        if (!Array.isArray(errors)) { return }
        errors.forEach((error) => {
          ['login', ...Object.keys(this.user)].forEach((key) => {
            if (error.startsWith(key + ':')) {
              if (!this.errors[key]) { this.errors[key] = [] }
              this.errors[key].push(error.substring(error.indexOf(':') + 1))
            }
          })
        })
        this.$forceUpdate()
      }
    },
    async signup () {
      this.sanitizeErrors()
      return await this.$axios.post(`${process.env.API}/users`, {
        nome: this.user.nome,
        nickname: this.user.nickname,
        cidade: this.user.cidade,
        senha: this.user.senha
      }).then(this.login).catch((res) => {
        if (res?.response?.data?.message) {
          this.sanitizeErrors(res.response.data.message)
        }
      })
    },
    async login () {
      this.sanitizeErrors()
      await this.$auth.loginWith('local', {
        data: {
          username: this.user.nickname,
          password: this.user.senha
        }
      }).then(() => {
        this.$emit('success')
      }).catch(() => {
        this.sanitizeErrors(['login:Usuario ou senha inválida'])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-select {
  @apply bg-white;
  &:focus {
    border-color: inherit;
  }
}
.error {
  &-message {
    @apply text-xs text-red-500 font-bold my-1 ml-2;
    &:before{
      content: '* ';
    }
  }
}
</style>
