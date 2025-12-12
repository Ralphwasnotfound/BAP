<template>
  <div
    class="w-full flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-10"
  >

    <!-- LEGEND ON LEFT SIDE -->
    <div class="grid grid-cols-1 gap-3 text-sm w-full sm:w-48">

      <div
        v-for="(item, index) in legendData"
        :key="index"
        class="flex items-center gap-2"
      >
        <span
          class="w-4 h-4 rounded"
          :style="{ backgroundColor: item.color }"
        ></span>

        <div class="flex flex-col leading-tight">
          <span class="font-medium text-gray-800">
            {{ item.label }}
          </span>
          <span class="text-gray-600 text-xs">
            {{ item.count }} ({{ item.percent }}%)
          </span>
        </div>
      </div>

    </div>

    <!-- CHART ON RIGHT SIDE -->
    <div class="w-full max-w-xs sm:max-w-sm">
      <canvas ref="chartCanvas"></canvas>
    </div>

  </div>
</template>


<script>
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default {
  props: {
    activities: Array,
  },

  data() {
    return {
      chart: null,
      legendData: [],
      total: 0,
    };
  },

  watch: {
    activities: {
      handler() {
        this.renderChart();
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    renderChart() {
      if (!this.$refs.chartCanvas) return;

      if (this.chart) this.chart.destroy();

      // Count actions
      const counts = {
        addPerson: 0,
        updatedPerson: 0,
        deletedPerson: 0,
        bulkDelete: 0,
        bulkImport: 0,
        downloadPDF: 0,
        exportCSV: 0,
        exportExcel: 0,
      };

      this.activities.forEach((a) => {
        if (counts[a.action] !== undefined) counts[a.action]++;
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);

      const colors = [
        "#22c55e", // green
        "#eab308", // yellow
        "#ef4444", // red
        "#b91c1c", // dark red
        "#7c3aed", // purple
        "#4f46e5", // indigo
        "#14b8a6", // teal
        "#0ea5e9", // sky blue
      ];

      this.total = values.reduce((a, b) => a + b, 0);

      // Build legend with percentages
      this.legendData = labels.map((label, i) => ({
        label,
        count: values[i],
        color: colors[i],
        percent: this.total > 0 ? ((values[i] / this.total) * 100).toFixed(1) : 0,
      }));

      // Render chart
      this.chart = new Chart(this.$refs.chartCanvas, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false }, // hide default legend
          },
          responsive: true,
        },
      });
    },
  },
};
</script>


<style scoped>
canvas {
  max-height: 260px;
}

@media (min-width: 640px) {
  canvas {
    max-height: 340px;
  }
}
</style>
