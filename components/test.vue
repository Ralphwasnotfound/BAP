<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Supabase People Test</h1>

     <div class="p-10 bg-blue-500 text-white text-2xl">
      Tailwind is working! 🎉
    </div>
    <!-- Input Form -->
    <div class="space-y-3 mb-6">
      <input
        v-model="first_name"
        placeholder="First Name"
        class="border px-3 py-2 rounded w-full"
      />

      <input
        v-model="last_name"
        placeholder="Last Name"
        class="border px-3 py-2 rounded w-full"
      />

      <input
        v-model="age"
        type="number"
        placeholder="Age"
        class="border px-3 py-2 rounded w-full"
      />

      <button
        @click="addPerson"
        class="px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Person
      </button>
    </div>

    <!-- List People -->
    <h2 class="text-xl font-semibold mb-2">People List</h2>

    <div v-if="people.length === 0" class="text-gray-600">
      No people found
    </div>

    <ul>
      <li
        v-for="person in people"
        :key="person.id"
        class="flex justify-between items-center border-b py-2"
      >
        <span>
          {{ person.first_name }} {{ person.last_name }} — Age: {{ person.age }}
        </span>

        <button
          @click="deletePerson(person.id)"
          class="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const { $supabase } = useNuxtApp()

// form data
const first_name = ref("")
const last_name = ref("")
const age = ref("")

// people list
const people = ref([])

// fetch people
async function loadPeople() {
  const { data, error } = await $supabase.from("people").select("*").order("id")

  if (error) console.error(error)
  people.value = data || []
}

// insert person
async function addPerson() {
  if (!first_name.value || !last_name.value || !age.value) {
    alert("Please fill all fields")
    return
  }

  const { error } = await $supabase.from("people").insert([
    {
      first_name: first_name.value,
      last_name: last_name.value,
      age: Number(age.value)
    }
  ])

  if (error) {
    alert("Insert failed")
    console.error(error)
    return
  }

  // clear inputs
  first_name.value = ""
  last_name.value = ""
  age.value = ""

  await loadPeople()
}

// delete person
async function deletePerson(id) {
  const { error } = await $supabase.from("people").delete().eq("id", id)

  if (error) {
    alert("Delete failed")
    console.error(error)
    return
  }

  await loadPeople()
}

// load people on page load
onMounted(() => {
  loadPeople()
})
</script>
