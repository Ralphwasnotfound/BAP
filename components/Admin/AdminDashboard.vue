<template>
  <div>
    <AdminPeopleTable v-if="page === 'people'" />
    <AdminAnnouncements v-if="page === 'announcements'" />
    <DashboardHome v-if="page === 'dashboard'" />
    <ExportTools v-if="page === 'export'" />
  </div>
</template>

<script>
export default {
  props: ["page"]
}
</script>
