<template>
  <div id="page">
    <h2>Acesse a sua conta</h2>

    <form @submit.prevent="onSubmit">
      <label for="input-email">E-mail</label>
      <input
        required
        type="email"
        name="email"
        id="input-email"
        placeholder="Insira o seu e-mail"
        v-model="user.email"
      />

      <label for="input-password">Senha</label>
      <input
        required
        type="password"
        name="password"
        id="input-password"
        placeholder="Insira a sua senha"
        v-model="user.password"
      />

      <!-- FIXME: <NuxtLink :to="#">Esqueci minha senha</NuxtLink> -->

      <button>Entrar</button>

      <span>Ainda não tem uma conta? <a href="/signup">Crie uma conta</a>.</span>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth-checker'],
})

type UserPayload = {
  email: string | null
  password: string | null
}

const user = ref<UserPayload>({
  email: null,
  password: null,
})

const onSubmit = async (ev: Event) => {
  const response = await fetch(`${useRuntimeConfig().public.apiHostname}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      jwtusername: unref(user).email,
      jwtpassword: unref(user).password,
    }),
  })

  if (!response.ok) {
    switch (response.status) {
      case 401:
        console.error(`${response.statusText}: Username or password incorrect.`)
        break
      default:
        console.error(`${response.statusText}: An error occured. try again later.`)
        break
    }

    return
  }

  const responseBody: AuthResponseBody = await response.json()

  useAuthStore().setToken(responseBody.token)

  console.log(useAuthStore().getToken())

  useRouter().replace(useRoute().redirectedFrom ?? '/')
}
</script>

<style scoped></style>
