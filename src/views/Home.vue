<template>
  <main>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">
        My Notes App
      </h1>
      <button
        class="text-red-500 hover:underline cursor-pointer"
      >Logout</button>
    </div>

    <form @submit.prevent="handleCreateNote" class="mb-8">
      <label class="block mb-4">
        <span class="bloc text-sm uppercase mb-2">Title</span>
        <input
          type="text"
          v-model="newNote.title"
          placeholder="What's the title?"
          class="block w-full text-slate-800 px-4 py-2"
        >
      </label>
      <label class="block mb-4">
        <span class="bloc text-sm uppercase mb-2">Content</span>
        <textarea
          v-model="newNote.content"
          placeholder="Write your content"
          class="block w-full text-slate-800 px-4 py-2"
        />
      </label>

      <input
        type="submit"
        class="text-green-500 hover:underline cursor-pointer"
        value="Create note"
      >
    </form>

    <div v-if="!notesLoading">
      <div
        v-for="note in notesResult.notes"
        :key="note.id"
        class="relative bg-white text-slate-700 rounded-lg p-6 mb-6"
      >
        <button class="absolute top-6 right-6 text-red-500 font-bold">
          Delete
        </button>
        <h3 class="font-bold text-2xl mb-4">
          {{ note.title }}
        </h3>
        <p class="text-lg text-gray-500 mb-4">
          {{ note.content }}
        </p>
        <div class="text-sm text-gray-500 italic">
          {{ convertToDate(note.created) }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSignOut, useUserId } from '@nhost/vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const router = useRouter()
const { signOut } = useSignOut()
const userId = useUserId()

const newNote = ref({
  title: '',
  content: ''
})

// logout functionality
const logout = () => {
  signOut()

  router.push('/login')
}

const {
  loading: notesLoading,
  result: notesResult,
  refetch: notesRefetch,
} = useQuery(gql`
    query ($userId: String!) {
      notes (
        order_by: { created: desc },
        where: { user_id: { _eq: $userId } }
      ) {
        id,
        title,
        content,
        created
      }
    }
`, {
  userId: userId.value
})

const {
  mutate: createNote,
  onDone: createNoteDone,
} = useMutation(gql`
    mutation (
      $userId: String!,
      $title: String!,
      $content: String!
    ) {
      insert_notes_one(object: {
        content: $content,
        title: $title,
        user_id: $userId
      }) {
        id
      }
    }
`)

const handleCreateNote = () => {
  if (!newNote.value.title || !newNote.value.content) {
    return alert('Please fill in all fields')
  }

  createNote({
    userId: userId.value,
    title: newNote.value.title,
    content: newNote.value.content,
  })
}

createNoteDone(() => {
  notesRefetch()
  newNote.value = {
    title: '',
    content: '',
  }
})

const convertToDate = (date) => {
  return new Date(date).toLocaleString()
}

</script>