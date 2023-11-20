<script setup>
  import { reactive, ref, defineProps, onUnmounted } from 'vue';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import InputText from 'primevue/inputtext';
  import SplitButton from 'primevue/splitbutton';
  import ToggleButton from 'primevue/togglebutton';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import Button from 'primevue/button';

  const checked = ref(false);

  const value = ref('');

  const methods = reactive(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

  const items = [
    {
      label: 'GET',
      icon: 'pi pi-refresh',
      command: () => {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      },
    },
    {
      label: 'POST',
      icon: 'pi pi-refresh',
      command: () => {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      },
    },
    {
      label: 'PUT',
      icon: 'pi pi-refresh',
      command: () => {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      },
    },
    {
      label: 'PATCH',
      icon: 'pi pi-refresh',
      command: () => {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      },
    },
    {
      label: 'DELETE',
      icon: 'pi pi-refresh',
      command: () => {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
      },
    },
  ];

  const props = defineProps({
    optionsAPI: {
      type: Object,
      required: true,
    },
  });

  const tabsAPI = reactive([
    { title: 'Body', content: props.optionsAPI.content.body },
    { title: 'Headers', content: props.optionsAPI.content.headers },
    { title: 'Params', content: props.optionsAPI.content.params },
  ]);

  onUnmounted(() => {
    console.log('unmounted');
  });

  const emits = defineEmits(['close']);

  const onCloseComponent = () => {
    emits('close');
  };
</script>

<template>
  <div class="flex flex-row-reverse mb-4 mt-0">
    <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Cancel" @click="onCloseComponent" />
  </div>

  <div class="flex overflow-hidden">
    <SplitButton class="m-2 flex-none flex" :label="props.optionsAPI.content.method" :model="items" outlined />

    <InputText class="m-2 flex-grow-1 flex" type="text" v-model="props.optionsAPI.content.url" />

    <ToggleButton v-model="checked" class="w-9rem flex-none flex" onLabel="Send" offLabel="Cancel" />
  </div>
  <div class="card">
    <TabView>
      <TabPanel v-for="tab in tabsAPI" :key="tab.title" :header="tab.title">
        <p v-if="tab.title === 'Body'" class="m-0"><VueJsonPretty :data="tab.content" /></p>
        <p v-else class="m-0">
          {{ tab.content }}
        </p>
      </TabPanel>
    </TabView>
  </div>
</template>
