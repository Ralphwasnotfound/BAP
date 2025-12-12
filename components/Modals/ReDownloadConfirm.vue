<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-80 text-center">
      <h2 class="text-xl font-semibold mb-4">Already Downloaded</h2>

      <p class="text-gray-600 mb-6">
        This PDF was already downloaded this session.<br/>
        Do you want to download it again?
      </p>

      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 bg-gray-400 text-white rounded"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-4 py-2 bg-blue-600 text-white rounded"
          @click="$emit('confirm')"
        >
          Download Again
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { show: Boolean }
}
</script>
