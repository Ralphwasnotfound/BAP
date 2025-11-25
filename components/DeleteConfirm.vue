<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white p-6 rounded shadow w-80">

      <h2 class="text-xl font-bold text-red-600 mb-4">Delete Person</h2>

      <p>
        Are you sure you want to delete
        <b>{{ person?.full_name }}</b>?
      </p>

      <div class="flex justify-end mt-6">
        <button
          class="px-3 py-1 bg-gray-300 rounded mr-2"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-3 py-1 bg-red-600 text-white rounded"
          @click="$emit('confirm')"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    person: Object
  },
  emits: ["close", "confirm"]
};
</script>
