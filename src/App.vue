<script>
  import { ref, toRefs, reactive, onUnmounted, onMounted } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
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
      const nodes = ref([]);
      const menuNodeRef = ref();
      const visibleDialog = ref(false);
      const nodeSelected = ref('');
      const nodeNameImputed = ref('');
      const nodeTypeToAdd = ref('');
      const requestTabsState = reactive({ tabs: [] });

      const nodeTypes = [
        {
          label: 'Pasta',
          icon: 'pi pi-folder',
          command: () => {
            visibleDialog.value = true;
            nodeTypeToAdd.value = 'folder';
          },
        },
        {
          label: 'HTTP Request',
          icon: 'pi pi-send',
          command: () => {
            visibleDialog.value = true;
            nodeTypeToAdd.value = 'httpRequest';
          },
        },
      ];

      onMounted(() => {
        const userNodesTreeSettings = JSON.parse(localStorage.getItem('userNodesTreeSettings')) || [];

        if (userNodesTreeSettings.length > 0) {
          nodes.value = userNodesTreeSettings;
        }
      });

      onUnmounted(() => {
        console.log('onUnmounted');
        localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
      });

      // onMounted(() => {
      //   const userAPIRequestSettings = JSON.parse(localStorage.getItem('userAPIRequestSettings')) || [];

      //   const alreadyExists = userAPIRequestSettings.some((config) => config?.key === props.configurationsAPI.key);

      //   if (userAPIRequestSettings.length === 0 || !alreadyExists) {
      //     userAPIRequestSettings.push(props.configurationsAPI);

      //     localStorage.setItem('userAPIRequestSettings', JSON.stringify(userAPIRequestSettings));
      //   }
      // });

      const newEventToAdd = () => {
        if (nodeTypeToAdd.value === 'folder') {
          addFolder(nodeNameImputed.value, nodeSelected.value);
        } else if (nodeTypeToAdd.value === 'httpRequest') {
          addHTTPRequest(nodeNameImputed.value, nodeSelected.value);
        }
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
          key: `${parentKey || 'root'}-${name}`,
          label: name,
          data: 'folder',
          icon: 'pi pi-fw pi-folder',
          children: [],
        };

        if (parentKey) {
          const parentFolder = findFolderByKey(parentKey, nodes.value);
          if (parentFolder) {
            parentFolder.children.push(newFolder);

            localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
          } else {
            nodes.value.push(newFolder);

            localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
          }
        } else {
          nodes.value.push(newFolder);

          localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
        }

        nodeNameImputed.value = '';
        visibleDialog.value = false;
      };

      const addHTTPRequest = (name, folderKey) => {
        const newItem = {
          key: `${folderKey}-${name}-${uuidv4()}`,
          label: name,
          data: 'httpRequest',
          icon: 'pi pi-fw pi-file',
        };

        if (folderKey) {
          const folder = findFolderByKey(folderKey, nodes.value);
          if (folder) {
            folder.children.push(newItem);

            localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
          } else {
            nodes.value.push(newItem);

            localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
          }
        } else {
          nodes.value.push(newItem);

          localStorage.setItem('userNodesTreeSettings', JSON.stringify(nodes.value));
        }

        nodeNameImputed.value = '';
        visibleDialog.value = false;
      };

      const onNodeSelected = (event) => {
        nodeSelected.value = event.key;
      };

      const onToggleClickMenuNode = (event) => {
        menuNodeRef.value.toggle(event);
      };

      const onDoubleClickNode = () => {
        const node = findFolderByKey(nodeSelected.value, nodes.value);

        if (node.data !== 'folder' && requestTabsState.tabs.findIndex((tab) => tab.key === node.key) === -1) {
          requestTabsState.tabs.push({
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
                title: Math.random().toString(36).substring(2, 9),
                body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit ',
              },
            },
          });
        }
      };

      const onEventCloseApiRequestComponent = (keyEvent) => {
        const index = requestTabsState.tabs.findIndex(({ key }) => key === keyEvent);

        if (index !== -1) {
          requestTabsState.tabs.splice(index, 1);
        }
      };

      return {
        ...toRefs(requestTabsState),
        nodes,
        visibleDialog,
        nodeSelected,
        nodeNameImputed,
        nodeTypeToAdd,
        nodeTypes,
        menuNodeRef,
        newEventToAdd,
        onDoubleClickNode,
        onEventCloseApiRequestComponent,
        onNodeSelected,
        onToggleClickMenuNode,
      };
    },
  };
</script>

<template>
  <div class="flex card min-h-screen">
    <Dialog
      v-model:visible="visibleDialog"
      modal
      :closable="false"
      :showHeader="false"
      :dismissableMask="true"
      :style="{ width: '15vw', height: 'auto' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex flex-wrap justify-content-center p-4">
        <InputText type="text" placeholder="Qual nome deseja?" v-model="nodeNameImputed" class="mb-4" />
        <Button label="Confirmar" icon="pi pi-check" @click="newEventToAdd" />
      </div>
    </Dialog>

    <div class="card flex flex-grow-0 flex-shrink-0 min-h-screen border-solid border-1">
      <SpeedDial :model="nodeTypes" direction="right" @click="nodeSelected = ''" />

      <div class="pt-3 mt-6">
        <Tree
          :value="nodes"
          :filter="true"
          filterMode="lenient"
          class="w-full md:w-30rem selectionMode='single'"
          selectionMode="single"
          @node-select="onNodeSelected($event)"
          @dblclick="onDoubleClickNode"
        >
          <template #default="slotProps">
            <div class="flex align-items-center">
              <span>{{ slotProps.node.label }}</span>

              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                class="ml-2"
                @click="onToggleClickMenuNode"
                size="small"
                style="background: none !important; border: none !important; color: inherit !important"
              />
              <Menu ref="menuNodeRef" id="overlay_menu" :model="nodeTypes" :popup="true" />
            </div>
          </template>
        </Tree>
      </div>
    </div>

    <div class="card flex-grow-1 flex-shrink-1 w-screen border-solid border-1">
      <TabView v-if="tabs.length > 0" :scrollable="true">
        <TabPanel v-for="tab in tabs" :key="tab.key" :header="tab.title">
          <ApiRequest @close="onEventCloseApiRequestComponent" :configurationsAPI="tab" />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<style>
  .p-speeddial-button {
    width: 40px;
    height: 40px;
  }
</style>
