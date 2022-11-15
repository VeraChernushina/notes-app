<template>
  <main>
    <h1 class="text-4xl font-bold mb-8">My Notes App</h1>

    <form @submit.prevent="registerOrLogin">
      <h3>Login or Register</h3>
      <label>
        <input type="checkbox" v-model="isRegister">
        Register?
      </label>

      <label class="block mb-4">
        <span class="bloc text-sm uppercase mb-2">Email</span>
        <input
          type="email"
          v-model="email"
          placeholder="Enter your Email"
          class="block w-full text-slate-800 px-4 py-2"
        >
      </label>

      <label class="block mb-4">
        <span class="bloc text-sm uppercase mb-2">Password</span>
        <input
          type="password"
          v-model="password"
          placeholder="Enter your password"
          class="block w-full text-slate-800 px-4 py-2"
        >
      </label>

      <input
        type="submit"
        class="text-green-500 hover:underline cursor-pointer"
        value="Login or Sign Up"
      >
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useSignInEmailPassword,
  useSignUpEmailPassword,
} from '@nhost/vue'

const router = useRouter()

const isRegister = ref(false)

const email = ref('')
const password = ref('')

const { signUpEmailPassword } = useSignUpEmailPassword()
const { signInEmailPassword } = useSignInEmailPassword()

const registerOrLogin = async () => {
  if (!email.value || !password.value) {
    return alert('Please fill in all fields!')
  }

  const res = isRegister.value
    ? await signUpEmailPassword(email.value, password.value)
    : await signInEmailPassword(email.value, password.value)

  if (res.isError) {
    return alert(res.error.message)
  }

  router.push('/')
}
</script>