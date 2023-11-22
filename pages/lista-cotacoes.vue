<template>
  <div id="page">
    <div id="toolbar">
      <button>Abrir</button>
      <button>Fechar</button>
      <button>Cancelar</button>
    </div>

    <!-- @cell-double-clicked="navigateToQuotation" -->
    <ag-grid-vue
      id="grid"
      class="ag-theme-alpine"
      rowSelection="multiple"
      animateRows="true"
      pagination="true"
      paginationPageSize="50"
      :columnDefs="columnDefs"
      :rowData="rowData"
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
import type { CellDoubleClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import type { Nullable } from '~/types/Nullable'
//#endregion

definePageMeta({
  middleware: ['auth-checker'],
})

// #region Fetch data from server
const token = useAuthStore().getToken()

const { data: result, error } = await useFetch(`${useRuntimeConfig().public.apiHostname}/api/v1/cotacoes`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

// Render full-page error if data couldn't be fetched. Otherwise, continue.
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

// Redirect to quotation when it's row is clicked.
const navigateToQuotation = (params: CellDoubleClickedEvent) => {
  useRouter().push('cotacao/' + params.data.id)
}

// Set rowData to Array of Objects, one Object per Row
const rowData = ref<any>(null)

// Each Column Definition results in one Column.
const columnDefs = ref<Array<ColDef>>([
  { field: 'id', headerName: '#', width: 60 },
  {
    field: 'dhCriacao',
    headerName: 'Data Criação',
    width: 150,
    cellDataType: 'date',
    valueFormatter: ({ value: date }: { value: Date }) =>
      [date.getDate(), 1 + date.getMonth(), date.getFullYear()].join('/') ?? '',
  },
  { field: 'status', headerName: 'Status', width: 140 },
  { field: 'observacoes', headerName: 'Observações', width: 300 },
  { field: 'qtdeItens', headerName: 'Qtde Itens', width: 110 },
])

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  flex: 1,
}
//#endregion

onMounted(async () => {
  const quotations = (result.value as any).data

  rowData.value = quotations.map(({ dhCriacao, ...rest }: { dhCriacao: string }) => {
    return { dhCriacao: new Date(dhCriacao), ...rest }
  })
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
