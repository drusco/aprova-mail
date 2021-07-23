<template>
  <div>
    <div class="absolute flex flex-col h-full w-full overflow-hidden text-gray-800" @click="closeMenu">
      <div class="flex flex-col flex-grow">
        <header class="flex flex-column px-5 py-3 border-b border-fuchsia-600">
          <div class="flex">
            <strong class="font-bold text-sm my-auto text-blue-500">APROVA-MAIL</strong>
          </div>
          <div class="ml-auto relative">
            <button class="flex" @click="openMenu">
              <b class="truncate w-32 inline-block pt-2 text-right uppercase text-xs">
                {{ user.nome }}
              </b>
              <span class="ml-3">
                <user-icon class="user-img text-blue-500" />
              </span>
            </button>
            <div v-if="menu" class="absolute -mr-2 text-center bg-white mt-3 shadow-lg border border-gray-300 rounded-b-lg w-40 p-3 right-0 z-30 border-t-0">
              <button @click="logout">
                Sair da conta
              </button>
            </div>
          </div>
        </header>
        <section class="relative flex flex-column flex-grow">
          <div class="absolute h-full w-full flex">
            <div class="w-3/12 h-full flex flex-col overflow-hidden relative z-20 bg-gray-700 text-gray-200">
              <div class="flex flex-col">
                <div class="py-3 px-5">
                  <button
                    class="btn mt-3 text-gray-700 font-bold bg-white"
                    @click="newMessage"
                  >
                    + Nova Mensagem
                  </button>
                </div>
                <div class="m-3 my-3 px-3 overflow-auto" style="max-height: 100px">
                  <button
                    :class="{
                      'bg-gray-400': folder === 'inboxFolder',
                      'bg-gray-500': folder !== 'inboxFolder'
                    }"
                    class="flex text-sm py-1 pl-4 pr-8 rounded-full text-gray-700 font-bold block"
                    @click="inboxMessages"
                  >
                    <folder-icon class="my-auto inline-block mr-2 w-4 h-4" />
                    <span class="my-auto">Inbox</span>
                  </button>
                  <button
                    :class="{
                      'bg-gray-400': folder === 'sentFolder',
                      'bg-gray-500': folder !== 'sentFolder'
                    }"
                    class="flex text-sm py-1 pl-4 pr-8 rounded-full mt-2 text-gray-700 font-bold block"
                    @click="sentMesssages"
                  >
                    <folder-icon class="my-auto inline-block mr-2 w-4 h-4" />
                    <span class="my-auto">Sent</span>
                  </button>
                </div>
              </div>
              <div class="flex flex-col h-4/6 flex-grow">
                <div class="p-2 pb-0 mx-3 text-gray-400">
                  <strong class="text-sm">Usuarios na mesma cidade</strong>
                </div>
                <div v-if="filteredCitizens" class="m-3 overflow-auto">
                  <div v-for="(citizen, index) in filteredCitizens" :key="index" class="mr-3 flex py-1 border-b border-gray-600 user-listing" @click="newMessage({ destinatario: citizen.nickname })">
                    <div class="flex p-3">
                      <user-icon class="user-img" />
                    </div>
                    <div class="flex leading-none mr-3">
                      <div class="my-auto text-sm w-40 truncate">
                        <p class="truncate w-36">
                          {{ citizen.nome }}
                        </p>
                        <span class="font-bold">{{ citizen.nickname }}</span>
                      </div>
                    </div>
                    <div class="flex ml-auto">
                      <button class="m-auto m-auto user-message-btn" title="Enviar mensagem">
                        <arrow-right-big class="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="citizens && citizens.length && !filteredCitizens.length" class="px-5 text-sm">
                  Não há resultados para "{{ userSearch }}"
                </div>
                <div class="px-2 py-3 bg-gray-600 mt-auto">
                  <input v-model="userSearch" type="text" class="w-full p-1 px-4 bg-gray-600 rounded-full outline-none focus:bg-gray-700" placeholder="Buscar usuario...">
                </div>
              </div>
            </div>
            <div v-if="message" class="w-9/12 flex flex-col">
              <header class="py-3 px-4 flex flex-col bg-white border-b border-gray-300 shadow-md z-10">
                <div class="flex border-b pb-3 border-gray-300 relative">
                  <label class="inline-flex items-center w-full">
                    <strong class="text-sm text-gray-600">Para:</strong>
                    <input v-model="message.destinatario" type="text" class="form-input w-auto text-gray-500 ml-3 p-0 w-full" @focusin="showUserList" @focusout="hideUserList">
                  </label>
                  <div v-if="userList" class="absolute text-sm bg-white w-5/12 z-10 shadow-lg rounded-b border border-gray-200 p-3 mt-9 border-t-0">
                    <div style="max-height:200px;" class="overflow-auto">
                      <div
                        v-for="(usuario, index) in userListFiltered"
                        :key="index"
                        class="grid grid-cols-3 flex py-2 cursor-pointer mr-3"
                        :class="{
                          'border-b border-gray-200': index !== userListFiltered.length-1
                        }"
                        @click="setDestinatario(usuario.nickname)"
                      >
                        <div class="flex my-auto text-xs inline-block">
                          <span class="border border-gray-300 rounded-full p-1 px-2 truncate">{{ usuario.nickname }}</span>
                        </div>
                        <span class="my-auto col-span-2 truncate inline-block ml-4">{{ usuario.nome }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex pt-3">
                  <label class="inline-flex items-center w-full">
                    <strong class="text-sm text-gray-600">Título:</strong>
                    <input v-model="message.titulo" type="text" class="form-input text-gray-500 ml-3 w-full p-0 my-auto">
                  </label>
                </div>
              </header>
              <section class="flex flex-grow">
                <div class="h-full w-full relative flex flex-col">
                  <div class="absolute w-full h-full">
                    <div class="h-full overflow-hidden mx-2">
                      <textarea v-model="message.conteudo" class="h-full w-full p-5 m-0 outline-none resize-none" placeholder="Mensagem..." />
                    </div>
                  </div>
                </div>
              </section>
              <div v-if="errors.message" class="error-wrapper">
                <div v-for="(error, index) in errors.message" :key="index" class="error-message">
                  {{ error }}
                </div>
              </div>
              <section class="p-3 border-t border-gray-300 bg-gray-100 text-right">
                <button class="btn btn-sm border w-28 border-gray-400 btn-white" @click="cancelMessage">
                  <b>Cancelar</b>
                </button>
                <button class="btn btn-sm ml-3 w-36 text-white bg-blue-500" @click="sendMessage">
                  <b>Enviar</b>
                </button>
              </section>
            </div>
            <div v-else class="w-9/12 flex flex-col">
              <header class="py-3 px-4 flex bg-white border-b border-gray-300 shadow-md z-10">
                <div class="w-full flex">
                  <div class="flex border border-gray-300 rounded-full p-1 w-full">
                    <div class="my-auto w-full">
                      <input v-model="messageSearch" type="text" class="form-input w-full p-0 my-auto px-4" placeholder="Buscar...">
                    </div>
                    <div class="my-auto">
                      <button
                        class="btn btn-sm border border-gray-300 hover:border-blue-500"
                        @click="search"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
                <div class="w-5/12 flex ml-2">
                  <div class="flex text-sm mx-auto">
                    <div class="flex">
                      <label class="inline-flex items-center my-auto">
                        <input type="checkbox" class="form-checkbox border border-gray-300 rounded-full text-blue-500" @change="toggleExactMatch">
                        <span class="ml-2">Busca exata</span>
                      </label>
                      <label class="inline-flex items-center ml-2 my-auto">
                        <input
                          v-model="messageSearchBy"
                          type="radio"
                          class="form-radio border border-gray-300"
                          checked
                          name="searchIn"
                          value="titulo"
                        >
                        <span class="ml-2">Título</span>
                      </label>
                      <label class="inline-flex items-center ml-2 my-auto">
                        <input v-model="messageSearchBy" type="radio" class="form-radio border border-gray-300" name="searchIn" value="conteudo">
                        <span class="ml-2">Conteúdo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </header>
              <div v-if="messageSent" class="success-wrapper border-b border-green-300">
                Sua mensagem foi enviada com sucesso!
              </div>
              <div v-if="errors.message" class="error-wrapper border-b border-red-300">
                <div v-for="(error, index) in errors.message" :key="index" class="error-message">
                  {{ error }}
                </div>
              </div>
              <section class="flex flex-grow">
                <div
                  class="h-full relative flex flex-col"
                  :class="{
                    'w-6/12': viewMessage,
                    'w-full': !viewMessage
                  }"
                >
                  <div class="absolute w-full h-full">
                    <div
                      v-if="currentFolder"
                      class="h-full overflow-auto mx-2 pr-3"
                    >
                      <div
                        v-for="(mensagem, index) in currentFolder"
                        :key="index"
                        class="flex p-3 border-b border-gray-200 hover:bg-gray-200 text-sm"
                      >
                        <div class="flex mr-3">
                          <label class="inline-flex items-center">
                            <input type="checkbox" class="form-checkbox border border-gray-300 rounded-full text-blue-500">
                          </label>
                        </div>
                        <div class="grid grid-cols-7 cursor-pointer w-full" @click="openMessage(mensagem)">
                          <div
                            v-if="folder !== 'sentFolder'"
                            class="truncate col-span-2 ml-3"
                            :class="{
                              'font-bold': !mensagem.read && getCitizen(mensagem.remetente).nickname !== $auth.user.nickname
                            }"
                          >
                            {{ getCitizen(mensagem.remetente).nickname }}
                          </div>
                          <div
                            class="truncate col-span-2 ml-6"
                            :class="{
                              'col-span-4': viewMessage || folder === 'sentFolder',
                              'font-bold': !mensagem.read && getCitizen(mensagem.remetente).nickname !== $auth.user.nickname
                            }"
                          >
                            {{ mensagem.titulo }}
                          </div>
                          <div
                            class="truncate col-span-2 text-gray-400 ml-3"
                            :class="{
                              'hidden': viewMessage
                            }"
                          >
                            {{ mensagem.conteudo }}
                          </div>
                          <div class="flex ml-auto text-right ml-3">
                            <span class="my-auto">{{ new Date(mensagem.date).toLocaleDateString() }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="viewMessage"
                  class="flex flex-col h-full shadow z-30 w-6/12"
                >
                  <div class="p-3 border-b border-gray-300">
                    <div class="mb-3 flex">
                      <div class="text-lg">
                        {{ viewMessage.titulo }}
                      </div>
                      <div class="mr-3 ml-auto pl-4">
                        <button class="text-2xl leading-none border border-gray-300 rounded-full w-8 h-8 flex" @click="closeMessage">
                          <span class="m-auto">&times;</span>
                        </button>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="flex px-3 pl-0">
                        <user-icon class="user-img text-gray-500" />
                      </div>
                      <div class="flex leading-none">
                        <div class="my-auto text-sm truncate" style="width:250px">
                          <b>{{ getCitizen(viewMessage.remetente).nickname }}</b>
                          <span class="ml-2">{{ getCitizen(viewMessage.remetente).nome }}</span>
                        </div>
                      </div>
                      <div class="flex ml-auto pr-6">
                        <small class="my-auto">{{ new Date(viewMessage.date).toLocaleDateString() }}</small>
                      </div>
                    </div>
                  </div>
                  <div
                    class="h-full relative overflow-auto my-3 mx-2 pr-2"
                  >
                    <div class="absolute h-full w-full p-3">
                      <div class="flex flex-col h-full">
                        <textarea v-model="viewMessage.conteudo" class="resize-none select-none h-full outline-none" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="p-3 border-t border-gray-200 flex">
                    <button
                      class="btn btn-sm border border-gray-300 my-auto"
                      @click="newMessage({
                        titulo: 'RE: ' + viewMessage.titulo,
                        destinatario: getCitizen($auth.user.id === viewMessage.remetente ? viewMessage.destinatario : viewMessage.remetente).nickname
                      })"
                    >
                      <span class="flex">
                        <reply-icon class="w-4 h-4 inline my-auto mr-1" />
                        <span class="my-auto">Responder</span>
                      </span>
                    </button>
                    <button class="btn btn-sm border border-gray-300 ml-2 my-auto" @click="closeMessage">
                      Fechar
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  middleware: 'auth',
  async asyncData ({ $axios }) {
    const citizens = await $axios.get(`${process.env.API}/users/citizens`)
    const inbox = await $axios.get(`${process.env.API}/messages/inbox`)
    return {
      citizens: citizens?.data || [],
      inboxFolder: inbox?.data || []
    }
  },
  data: () => ({
    errors: {},
    exactMatch: false,
    viewMessage: false,
    message: false,
    menu: false,
    userList: false,
    messageSent: false,
    userSearch: '',
    inboxFolder: [],
    sentFolder: [],
    folder: 'inboxFolder',
    messageSearch: '',
    messageSearchBy: 'titulo'
  }),
  computed: {
    currentFolder () {
      return this[this.folder]
    },
    user () {
      return this.$auth.user
    },
    userListFiltered () {
      const keyword = this.message?.destinatario.toLowerCase()
      return this.citizens?.filter((user) => {
        return user.nickname.includes(keyword) || user.nome.includes(keyword)
      })
    },
    filteredCitizens () {
      if (!this.userSearch) { return this.citizens }
      return this.citizens?.filter((user) => {
        return user.nickname.includes(this.userSearch) || user.nome.includes(this.userSearch)
      })
    }
  },
  methods: {
    async search () {
      const folder = this.folder.replace('Folder', '')
      await this.$axios.get(`${process.env.API}/messages/${folder}`, {
        params: {
          exactMatch: this.exactMatch,
          [this.messageSearchBy]: this.messageSearch
        }
      })
        .then((res) => {
          if (res?.data) {
            this[folder + 'Folder'] = res.data
          }
        }).catch((err) => {
          if (err?.response?.status === 401) { this.$router.push('/login') }
          this.sanitizeErrors(err?.response?.data?.message, true)
          setTimeout(() => {
            this.sanitizeErrors()
          }, 2000)
        })
    },
    async inboxMessages (filters) {
      this.folder = 'inboxFolder'
      this.message = false
      this.viewMessage = false
      const inbox = await this.$axios.get(`${process.env.API}/messages/inbox`, filters)
      this.inboxFolder = inbox?.data
    },
    async sentMesssages (filters) {
      this.folder = 'sentFolder'
      this.message = false
      this.viewMessage = false
      const sent = await this.$axios.get(`${process.env.API}/messages/sent`, filters)
      this.sentFolder = sent?.data
    },
    getCitizen (id) {
      if (id === this.$auth.user.id) { return this.$auth.user }
      return this.citizens?.filter(user => user.id === id).pop()
    },
    setDestinatario (value) {
      if (this.message) {
        this.message.destinatario = value
      } else {
        this.newMessage({ destinatario: value })
      }
    },
    showUserList () {
      this.userList = true
    },
    hideUserList () {
      setTimeout(() => {
        this.userList = false
      }, 150)
    },
    toggleExactMatch () {
      this.exactMatch = !this.exactMatch
    },
    async openMessage (message) {
      await this.$axios.get(`${process.env.API}/messages/view/${message.id}`)
        .then((res) => {
          if (res?.data) {
            this.viewMessage = res?.data
            message.read = true
          }
        }).catch((err) => {
          if (err?.response?.status === 401) { this.$router.push('/login') }
          this.sanitizeErrors(err?.response?.data?.message, true)
          setTimeout(() => {
            this.sanitizeErrors()
          }, 2000)
        })
    },
    closeMessage () {
      this.viewMessage = false
    },
    closeMenu () {
      this.menu = false
    },
    openMenu () {
      setImmediate(() => {
        this.menu = true
      })
    },
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
    },
    newMessage (message) {
      this.viewMessage = false
      this.sanitizeErrors()
      this.message = Object.assign({
        titulo: '',
        destinatario: '',
        conteudo: ''
      }, message)
    },
    cancelMessage () {
      this.sanitizeErrors()
      this.message = false
    },
    displaySuccessMessage () {
      this.messageSent = true
      this.message = false
      setTimeout(() => {
        this.messageSent = false
      }, 3000)
    },
    async sendMessage () {
      if (!this.message) { return }
      this.sanitizeErrors()
      await this.$axios.post(`${process.env.API}/messages`, {
        titulo: this.message.titulo,
        destinatario: this.message.destinatario,
        conteudo: this.message.conteudo
      }).then(() => {
        this.displaySuccessMessage()
      }).catch((err) => {
        if (err?.response?.status === 401) { this.$router.push('/login') }
        this.sanitizeErrors(err?.response?.data?.message)
      })
    },
    sanitizeErrors (errors, bypassMessage) {
      this.errors = {}
      if (!this.message && !bypassMessage) { return }
      let message = this.message
      if (bypassMessage) {
        this.newMessage()
        message = this.message
        this.message = false
      }
      if (errors) {
        if (typeof errors === 'string') {
          errors = [errors]
        }
        if (!Array.isArray(errors)) { return }
        if (!this.errors.message) { this.errors.message = [] }
        errors.forEach((error) => {
          Object.keys(message).forEach((key) => {
            if (error.startsWith(key + ':')) {
              this.errors.message.push(error.substring(error.indexOf(':') + 1))
            }
          })
        })
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .user {
    &-img {
      width: 32px;
      height: 32px;
      padding: 1px;
      @apply rounded-full m-auto object-cover border border-gray-300;
    }
    &-listing {
      @apply cursor-pointer;
      .user-message-btn {
        @apply text-gray-600;
      }
      &:hover {
        .user-message-btn {
          @apply text-gray-400;
        }
      }
    }
  }
  .success-wrapper {
    @apply bg-green-100 p-5 border-b border-green-300 text-green-500 font-bold text-sm;
  }
  .error {
    &-wrapper {
      @apply bg-red-100 p-5 border-t border-red-300;
    }
    &-message {
      @apply text-sm text-red-500 font-bold my-1 relative ml-2 pl-3;
      &:before{
        content: '*';
        left: 0;
        margin-top: 2px;
        position: absolute;
      }
    }
  }
</style>
