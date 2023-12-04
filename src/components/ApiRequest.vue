<script setup>
  import { reactive, ref, onBeforeMount, toRaw, watch } from 'vue';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import InputText from 'primevue/inputtext';
  import SplitButton from 'primevue/splitbutton';
  import ToggleButton from 'primevue/togglebutton';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import Button from 'primevue/button';

  const sendingRequest = ref(false);

  const methodActive = ref('');

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const createMethod = (label, icon) => {
    return {
      label,
      icon,
      command: (event) => {
        apiRequestSettings.method = event.item.label;
      },
    };
  };

  const typeMethods = reactive(methods.map((method) => createMethod(method, 'pi pi-refresh')));

  const apiRequestSettings = reactive({
    key: '',
    title: '',
    method: '',
    url: '',
    headers: '',
    params: '',
    body: '',
    tabs: [],
  });

  const props = defineProps({
    configurationsAPI: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  onBeforeMount(() => {
    const userAPIRequestSettings = JSON.parse(localStorage.getItem('userAPIRequestSettings')) || [];

    const index = userAPIRequestSettings.findIndex((config) => config.key === props.configurationsAPI.key);

    if (index === -1) {
      Object.assign(apiRequestSettings, {
        key: props.configurationsAPI.key,
        title: props.configurationsAPI.label,
        method: props.configurationsAPI.content.method,
        url: props.configurationsAPI.content.url,
        headers: props.configurationsAPI.content.headers,
        params: props.configurationsAPI.content.params,
        body: props.configurationsAPI.content.body,
        tabs: [
          {
            title: 'Body',
            content: props.configurationsAPI.content.body,
          },
          {
            title: 'Headers',
            content: props.configurationsAPI.content.headers,
          },
          {
            title: 'Params',
            content: props.configurationsAPI.content.params,
          },
        ],
      });
    } else {
      Object.assign(apiRequestSettings, userAPIRequestSettings[index]);
    }
  });

  watch(
    () => apiRequestSettings,
    (newValue, oldValue) => {
      let userAPIRequestSettings = JSON.parse(localStorage.getItem('userAPIRequestSettings')) || [];

      const index = userAPIRequestSettings.findIndex((config) => config.key === newValue.key);

      // If the index is not -1, it means that the configuration already exists, so we update it
      if (index !== -1) {
        userAPIRequestSettings[index] = toRaw(newValue);
      } else {
        userAPIRequestSettings.push(toRaw(newValue));
      }

      localStorage.setItem('userAPIRequestSettings', JSON.stringify(userAPIRequestSettings));
    },
    { deep: true }
  );

  const onClickCloseComponent = () => {
    emits('close', apiRequestSettings.key);
  };

  const onRequestSend = async () => {
    sendingRequest.value = true;

    const requestOptions = {
      method: apiRequestSettings.method,
      headers: apiRequestSettings.headers,
      body: JSON.stringify(apiRequestSettings.body),
    };

    try {
      const response = await fetch(apiRequestSettings.url, requestOptions);

      const data = await response.json();

      console.log(data);

      sendingRequest.value = false;
    } catch (error) {
      console.log(error);

      sendingRequest.value = false;
    }
  };

  const onEditBody = (event) => {
    // apiRequestSettings.body = event.target.value;
    console.log('pedro', { event });
  };
</script>

<template>
  <div class="flex flex-row-reverse mb-4 mt-0">
    <Button
      icon="pi pi-times"
      severity="danger"
      text
      raised
      rounded
      aria-label="Close"
      @click="onClickCloseComponent"
    />
  </div>

  <div class="flex overflow-hidden">
    <SplitButton class="m-2 flex-none flex" :label="apiRequestSettings.method" :model="typeMethods" outlined />

    <InputText class="m-2 flex-grow-1 flex" type="text" v-model="apiRequestSettings.url" />

    <ToggleButton
      v-model="sendingRequest"
      class="w-9rem flex-none flex"
      :loading="sendingRequest"
      onLabel="Cancel"
      offLabel="Send"
      @click="onRequestSend"
    />
  </div>
  <div class="card">
    <TabView>
      <TabPanel v-for="tab in apiRequestSettings.tabs" :key="tab.title" :header="tab.title">
        <p v-if="tab.title === 'Body'" class="m-0">
          <VueJsonPretty
            :show-line-number="true"
            :show-icon="true"
            :virtual="true"
            :editable="true"
            editable-trigger="dblclick"
            :showSelectController="true"
            @value-change="onEditBody(tab.content)"
            v-model:data="tab.content"
          />
        </p>
        <p v-else class="m-0">
          {{ tab.content }}
        </p>
      </TabPanel>
    </TabView>
  </div>
</template>
