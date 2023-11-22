<template>
  <div id="page">
    <div id="toolbar">
      <button @click="exportToCsv()">Exportar</button>
    </div>

    <ag-grid-vue
      id="grid"
      class="ag-theme-alpine"
      rowSelection="multiple"
      animateRows="true"
      pagination="true"
      paginationPageSize="50"
      :columnDefs="columnDefs.value"
      :rowData="rowData.value"
      :defaultColDef="defaultColDef"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script lang="ts" setup>
// #region Import deps
// the AG Grid Vue Component
import { AgGridVue } from 'ag-grid-vue3'

// Core grid CSS, always needed
import 'ag-grid-community/styles/ag-grid.css'

// Optional theme CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'

// AG Grid Typescript Generics
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import type { Nullable } from '~/types/Nullable'
//#endregion

definePageMeta({
  middleware: ['auth-checker'],
})

// #region Fetch data from server
const token = useAuthStore().getToken()

const { data: result, error } = await useFetch(
  `${useRuntimeConfig().public.apiHostname}/api/v1/cotacoes/${useRoute().params.id}`,
  {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
)

// Render full-page error if there is one. Otherwise, continue.
if (!!error.value) {
  throw createError(error.value)
}
//#endregion

// #region Configure AG Grid
// Optional - for accessing Grid's API
const gridApi = ref<Nullable<GridApi>>(null)

// Obtain API from grid's onGridReady event
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api
}

// Set rowData to Array of Objects, one Object per Row
const rowData = reactive<any>([])

// Each Column Definition results in one Column.
const columnDefs = reactive<{ value: ColDef[] }>({
  value: [
    { field: 'id', headerName: '#', editable: false, pinned: true, resizable: true },
    { field: 'descProduto', headerName: 'Descrição', pinned: true, resizable: true },
    { field: 'refProduto', headerName: 'Referência', pinned: true, resizable: true },
    { field: 'marcaProduto', headerName: 'Marca', pinned: true, resizable: true },
    { field: 'quant', headerName: 'Qtd Req', type: 'numericColumn', pinned: true, resizable: true },
    { field: 'unidade', headerName: 'UN', pinned: true, resizable: true },
    {
      field: 'vrUnit',
      headerName: 'Vr Unit.',
      editable: true,
      type: 'numericColumn',
      // cellEditor: NumericEditor,
      cellEditorParams: {
        min: 0,
        precision: 2,
        showStepperButtons: false,
      },
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        } else {
          const formatter = new Intl.NumberFormat('pt-BR', {
            currency: 'BRL',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          return formatter.format(params.value)
        }
      },
    },
    {
      field: 'observacoes',
      headerName: 'Qtd Disp',
      editable: true,
      type: 'numericColumn',
      //cellEditor: NumericEditor,
      cellEditorParams: {
        min: 0,
        precision: 2,
        showStepperButtons: false,
      },
      valueFormatter: (params) => {
        if (params.value == null) {
          return ''
        } else {
          const formatter = new Intl.NumberFormat('pt-BR', {
            currency: 'BRL',
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          return formatter.format(params.value)
        }
      },
    },
  ],
})

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  flex: 1,
}

const exportToCsv = () => {
  return unref(gridApi)!.exportDataAsCsv()
}
//#endregion

onMounted(async () => {
  const quotation = (result.value as any).data
  rowData.value = quotation.itens
})
</script>

<style scoped>
#page {
  @apply h-[100svh] flex flex-col;
}

#grid {
  @apply flex-1;
}
</style>
