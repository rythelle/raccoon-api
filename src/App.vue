<script setup>
  import { ref, onMounted } from 'vue';
  import Tree from 'primevue/tree';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import SplitButton from 'primevue/splitbutton';
  import { useToast } from 'primevue/usetoast';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { NodeService } from './service/NodeService';

  const toast = useToast();

  const nodes = ref([]);
  const visible = ref(false);
  const selected = ref(null);
  const itemName = ref('');
  const itemTypeToAdd = ref('');

  const items = [
    {
      label: 'Pasta',
      icon: 'pi pi-folder',
      command: () => {
        visible.value = true;
        itemTypeToAdd.value = 'folder';
      },
    },
    {
      label: 'HTTP Request',
      icon: 'pi pi-send',
      command: () => {
        visible.value = true;
        itemTypeToAdd.value = 'httpRequest';
      },
    },
  ];

  const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
  };

  onMounted(() => {
    NodeService.getTreeNodes().then((data) => (nodes.value = data));
  });

  const expandedKeys = ref({});

  // const expandAll = () => {
  //   for (let node of nodes.value) {
  //     expandNode(node);
  //   }

  //   expandedKeys.value = { ...expandedKeys.value };
  // };

  // const collapseAll = () => {
  //   expandedKeys.value = {};
  // };

  const expandNode = (node) => {
    expandedKeys.value[node.key] = true;

    if (node.children && node.children.length) {
      for (let child of node.children) {
        expandNode(child);
      }
    }
  };

  const scrollableTabs = ref(
    Array.from({ length: 5 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` }))
  );

  const generateNewKey = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const findFolderByKey = (key) => {
    for (let node of nodes.value) {
      if (node.key === key) {
        return folder;
      }

      if (node.children) {
        const result = findFolderByKey(key, folder.children);

        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const addFolder = (name, parentKey) => {
    const newFolder = {
      key: generateNewKey(),
      label: name,
      data: `${name}`,
      icon: 'pi pi-fw pi-folder',
      children: [],
    };

    if (parentKey) {
      const parentFolder = findFolderByKey(parentKey);
      if (parentFolder) {
        parentFolder.children.push(newFolder);
      } else {
        nodes.value.push(newFolder);
      }
    } else {
      nodes.value.push(newFolder);
    }

    itemName.value = '';
    visible.value = false;
  };

  const newEventToAdd = () => {
    if (itemTypeToAdd.value === 'folder') {
      addFolder(itemName.value);
    } else if (itemTypeToAdd.value === 'httpRequest') {
      addHTTPRequest(itemName.value);
    }
  };

  const addHTTPRequest = (name, folderKey) => {
    const newItem = {
      key: generateNewKey(),
      label: name,
      icon: 'pi pi-fw pi-file',
      data: `${name}`,
    };

    if (folderKey) {
      const folder = findFolderByKey(folderKey);
      if (folder) {
        folder.children.push(newItem);
      } else {
        nodes.value.push(newItem);
      }
    } else {
      nodes.value.push(newItem);
    }

    itemName.value = '';
    visible.value = false;
  };

  const onNodeSelect = (event) => {
    selected.value = event.key;
  };
</script>

<template>
  <div class="card flex flex-row flex-wrap min-h-screen">
    <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :showHeader="false"
      :dismissableMask="true"
      :style="{ width: '15vw', height: 'auto' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex flex-wrap justify-content-center p-4">
        <InputText type="text" placeholder="Qual nome deseja?" v-model="itemName" class="mb-4" />
        <Button label="Confirmar" icon="pi pi-check" @click="newEventToAdd" />
      </div>
    </Dialog>
    <div class="min-h-screen">
      <SplitButton label="Novo" icon="pi pi-plus" :model="items" />
      <Toast />
      <div class="pt-3">
        <Tree
          :value="nodes"
          :filter="true"
          filterMode="lenient"
          class="w-full md:w-30rem selectionMode='single'"
          :expandedKeys="expandedKeys"
          selectionMode="single"
          @node-select="onNodeSelect($event)"
        />
      </div>
    </div>

    <div class="pl-3">
      <TabView :scrollable="true">
        <TabPanel v-for="tab in scrollableTabs" :key="tab.title" :header="tab.title">
          <p class="m-0">{{ tab.content }}</p>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>
