<script setup>
  import { reactive, ref, defineProps, onUnmounted, onMounted } from 'vue';
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
    configurationsAPI: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const tabsAPI = reactive([
    { title: 'Body', content: props.configurationsAPI.content.body },
    { title: 'Headers', content: props.configurationsAPI.content.headers },
    { title: 'Params', content: props.configurationsAPI.content.params },
  ]);

  const onClickCloseComponent = () => {
    emits('close');
  };

  onMounted(() => {
    const userAPIRequestSettings = JSON.parse(localStorage.getItem('userAPIRequestSettings')) || [];

    const alreadyExists = userAPIRequestSettings.some((config) => config?.key === props.configurationsAPI.key);

    if (userAPIRequestSettings.length === 0 || !alreadyExists) {
      userAPIRequestSettings.push(props.configurationsAPI);

      localStorage.setItem('userAPIRequestSettings', JSON.stringify(userAPIRequestSettings));
    }

    console.log('pedro', { userAPIRequestSettings });
  });

  // onMounted(() => {
  //   if (localStorage.getItem('userAPIRequestSettings')) {
  //     const userAPISettings = JSON.parse(localStorage.getItem('userAPISettings'));
  //     props.configurationsAPI = userAPISettings;
  //   }
  // });

  console.log('props.configurationsAPI', props.configurationsAPI);
</script>

<template>
  <div class="flex flex-row-reverse mb-4 mt-0">
    <Button
      icon="pi pi-times"
      severity="danger"
      text
      raised
      rounded
      aria-label="Cancel"
      @click="onClickCloseComponent"
    />
  </div>

  <div class="flex overflow-hidden">
    <SplitButton class="m-2 flex-none flex" :label="props.configurationsAPI.content.method" :model="items" outlined />

    <InputText class="m-2 flex-grow-1 flex" type="text" v-model="props.configurationsAPI.content.url" />

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
