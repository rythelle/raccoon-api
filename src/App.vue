<script>
  import { ref, toRefs, onMounted, reactive } from 'vue';
  import ApiRequest from './components/ApiRequest.vue';

  import Tree from 'primevue/tree';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import SplitButton from 'primevue/splitbutton';
  import Menu from 'primevue/menu';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import SpeedDial from 'primevue/speeddial';
  import InputText from 'primevue/inputtext';
  import { useToast } from 'primevue/usetoast';

  export default {
    components: {
      ApiRequest,
      Tree,
      TabView,
      TabPanel,
      SplitButton,
      Menu,
      Dialog,
      Button,
      InputText,
      SpeedDial,
    },
    setup() {
      const toast = useToast();

      const nodes = ref([]);
      const visible = ref(false);
      const selected = ref('');
      const itemName = ref('');
      const itemTypeToAdd = ref('');
      const tabsState = reactive({ tabs: [] });

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

      // onMounted(() => {
      //   NodeService.getTreeNodes().then((data) => (nodes.value = data));
      // });

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

      const generateNewKey = () => {
        return Math.random().toString(36).substring(2, 9);
      };

      const findFolderByKey = (key, nodes) => {
        for (let node of nodes) {
          if (node.key === key) {
            return node;
          }

          if (node.children) {
            const result = findFolderByKey(key, node.children);

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
          data: 'folder',
          icon: 'pi pi-fw pi-folder',
          children: [],
        };

        if (parentKey) {
          const parentFolder = findFolderByKey(parentKey, nodes.value);
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
          addFolder(itemName.value, selected.value);
        } else if (itemTypeToAdd.value === 'httpRequest') {
          addHTTPRequest(itemName.value, selected.value);
        }
      };

      const addHTTPRequest = (name, folderKey) => {
        const newItem = {
          key: generateNewKey(),
          label: name,
          data: 'httpRequest',
          icon: 'pi pi-fw pi-file',
        };

        if (folderKey) {
          const folder = findFolderByKey(folderKey, nodes.value);
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

      const menu = ref();
      // const itemsOptions = ref([
      //   {
      //     label: 'Options',
      //     items: [
      //       {
      //         label: 'Refresh',
      //         icon: 'pi pi-refresh',
      //       },
      //       {
      //         label: 'Export',
      //         icon: 'pi pi-upload',
      //       },
      //     ],
      //   },
      // ]);

      const toggle = (event) => {
        menu.value.toggle(event);
      };

      const onNodeDoubleClick = () => {
        const node = findFolderByKey(selected.value, nodes.value);

        if (node.data !== 'folder' && tabsState.tabs.findIndex((tab) => tab.key === node.key) === -1) {
          tabsState.tabs.push({
            key: node.key,
            title: `${node.label}`,
            content: {
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/posts/1',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                id: 1,
                title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit ',
              },
            },
          });
        }
      };

      const onCloseApiRequestComponent = () => {
        tabsState.tabs = [];
      };

      return {
        nodes,
        expandedKeys,
        ...toRefs(tabsState),
        visible,
        selected,
        itemName,
        itemTypeToAdd,
        items,
        save,
        onNodeSelect,
        toggle,
        menu,
        newEventToAdd,
        onNodeDoubleClick,
        onCloseApiRequestComponent,
      };
    },
  };
</script>

<template>
  <div class="flex card min-h-screen">
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
    <div class="card flex flex-grow-0 flex-shrink-0 min-h-screen border-solid border-1">
      <!-- <SplitButton icon="pi pi-plus" :model="items" @click="selected = ''" /> -->

      <SpeedDial :model="items" direction="right" @click="selected = ''" />

      <Toast />
      <div class="pt-3 mt-6">
        <Tree
          :value="nodes"
          :filter="true"
          filterMode="lenient"
          class="w-full md:w-30rem selectionMode='single'"
          :expandedKeys="expandedKeys"
          selectionMode="single"
          @node-select="onNodeSelect($event)"
          @dblclick="onNodeDoubleClick"
        >
          <template #default="slotProps">
            <div class="flex align-items-center">
              <span>{{ slotProps.node.label }}</span>

              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                class="ml-2"
                @click="toggle"
                size="small"
                style="background: none !important; border: none !important; color: inherit !important"
              />
              <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            </div>
          </template>
        </Tree>
      </div>
    </div>

    <div class="card flex-grow-1 flex-shrink-1 w-screen border-solid border-1">
      <ApiRequest v-if="tabs.length > 0" @close="onCloseApiRequestComponent" v-for="tab in tabs" :optionsAPI="tab" />
    </div>
  </div>
</template>

<style>
  .p-speeddial-button {
    width: 40px;
    height: 40px;
  }
</style>
