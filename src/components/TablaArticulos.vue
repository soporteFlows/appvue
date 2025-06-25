<template>
  <div class="q-pa-md">
    <q-table
      title="Artículos"
      :rows="articulos"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="{ rowsPerPage: 10 }"
      class="my-sticky-header-table"
    >
      <!-- Slots actualizados para la nueva estructura -->
      <template v-slot:body-cell-nombre="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model="props.row.nombre"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.nombre || props.row['articulos.nombre'] || 'Sin nombre' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-internalcode="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model="props.row.internalcode"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.internalcode || props.row['articulos.internalcode'] || 'N/A' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-externalcode="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model="props.row.externalcode"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.externalcode || props.row['articulos.externalcode'] || 'N/A' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-precio="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model.number="props.row.precio"
              type="number"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.precio ? `${formatPrice(props.row.precio)}` : 'N/A' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-descrip="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model="props.row.descrip"
              type="textarea"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.descrip || props.row['articulos.descrip'] || 'Sin descripción' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <div v-if="props.row.editing">
            <q-input
              v-model.number="props.row.stock"
              type="number"
              dense
              outlined
              @keyup.enter="saveArticulo(props.row)"
              @blur="saveArticulo(props.row)"
            />
          </div>
          <div v-else class="cursor-pointer" @click="editArticulo(props.row)">
            {{ props.row.stock || 'N/A' }}
            <q-icon name="edit" class="q-ml-sm text-grey-6" />
          </div>
        </q-td>
      </template>

      <!-- Slot para acciones -->
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              v-if="props.row.editing"
              icon="save"
              color="positive"
              size="sm"
              round
              @click="saveArticulo(props.row)"
            >
              <q-tooltip>Guardar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.editing"
              icon="cancel"
              color="negative"
              size="sm"
              round
              @click="cancelEdit(props.row)"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!props.row.editing"
              icon="edit"
              color="primary"
              size="sm"
              round
              @click="editArticulo(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="visibility" color="info" size="sm" round @click="viewDetails(props.row)">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog para ver detalles completos -->
    <q-dialog v-model="showDetailsDialog" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalles del Artículo</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="selectedArticulo" class="q-gutter-md">
            <pre>{{ JSON.stringify(selectedArticulo, null, 2) }}</pre>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
// import api from '../config/axios'
import { storeToRefs } from 'pinia'
import { useArticulosStore } from '@/stores/articuloStore'

const $q = useQuasar()

const articulosStore = useArticulosStore()
const { articulos, loading } = storeToRefs(articulosStore)
// Estado reactivo
// const articulos = ref([])
// const loading = ref(false)
const showDetailsDialog = ref(false)
const selectedArticulo = ref(null)
const originalData = reactive({}) // Para guardar datos originales al editar

// Configuración de columnas - Actualizada para la estructura de tu API
const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: (row) => row.id || row['articulos.id'],
    sortable: true,
  },
  {
    name: 'internalcode',
    label: 'Código Interno',
    align: 'left',
    field: (row) => row.internalcode || row['articulos.internalcode'],
    sortable: true,
  },
  {
    name: 'externalcode',
    label: 'Código Externo',
    align: 'left',
    field: (row) => row.externalcode || row['articulos.externalcode'],
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.nombre || row['articulos.nombre'],
    sortable: true,
  },
  {
    name: 'descrip',
    label: 'Descripción',
    align: 'left',
    field: (row) => row.descrip || row['articulos.descrip'],
  },
  {
    name: 'categoria',
    label: 'Categoría',
    align: 'left',
    field: (row) => row['categorias.name'] || row.categoria_name,
    sortable: true,
  },
  {
    name: 'activo',
    label: 'Activo',
    align: 'center',
    field: (row) => row.activo || row['articulos.activo'],
    sortable: true,
    format: (val) => (val ? 'Sí' : 'No'),
  },
  {
    name: 'stock',
    label: 'Stock',
    align: 'right',
    field: 'stock', // Este vendrá del endpoint de detalles
    sortable: true,
  },
  {
    name: 'precio',
    label: 'Precio',
    align: 'right',
    field: 'precio', // Este vendrá del endpoint de detalles
    sortable: true,
    format: (val) => (val ? `${formatPrice(val)}` : 'N/A'),
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
  },
]

// Función para formatear precios
const formatPrice = (price) => {
  if (!price) return '0.00'
  return Number(price).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Cargar artículos
// const loadArticulos = async () => {
//   loading.value = true
//   try {
//     // Obtener lista de artículos usando tu API
//     const indexResponse = await api.post('/articulo/index')
//     console.log('✅ indexResponse:', indexResponse)

//     // if (!indexResponse || !indexResponse.data) {
//     //   throw new Error('Error al obtener la lista de artículos')
//     // }

//     // La respuesta parece tener una estructura diferente
//     // Necesitamos encontrar donde están los datos reales de los artículos
//     let articulosData = []

//     // Verificar diferentes posibles ubicaciones de los datos
//     if (indexResponse.data && Array.isArray(indexResponse.data)) {
//       articulosData = indexResponse.data
//     } else if (indexResponse.rows && Array.isArray(indexResponse.rows)) {
//       articulosData = indexResponse.rows
//     } else if (
//       indexResponse.data &&
//       indexResponse.data.rows &&
//       Array.isArray(indexResponse.data.rows)
//     ) {
//       articulosData = indexResponse.data.rows
//     } else {
//       console.warn('Estructura de respuesta inesperada:', indexResponse)
//       // Si no encontramos los datos, podemos usar un array vacío o lanzar error
//       throw new Error('No se encontraron datos de artículos en la respuesta')
//     }

//     console.log(`📋 Se encontraron ${articulosData.length} artículos para procesar`)

//     // Obtener detalles de cada artículo (limitamos a los primeros 50 para evitar sobrecarga)
//     const articulosParaProcesar = articulosData.slice(0, 50)

//     const articulosConDetalles = await Promise.all(
//       articulosParaProcesar.map(async (articulo) => {
//         try {
//           // Usar el ID del artículo (puede estar en diferentes campos)
//           const articuloId = articulo.id || articulo['articulos.id'] || articulo.articuloId

//           if (!articuloId) {
//             console.warn('Artículo sin ID:', articulo)
//             return {
//               ...articulo,
//               editing: false,
//             }
//           }

//           const detailResponse = await api.post(`/articulo/show/${articuloId}`)
//           console.log('✅ detailResponse:', detailResponse)

//           return {
//             ...articulo,
//             ...detailData.data,
//             editing: false, // Agregar flag de edición
//           }

//           // return {
//           //   ...articulo,
//           //   editing: false,
//           // }
//         } catch (error) {
//           console.error(`Error al obtener detalles del artículo ${articulo.id || 'sin ID'}:`, error)
//           return {
//             ...articulo,
//             editing: false,
//           }
//         }
//       }),
//     )

//     articulos.value = articulosConDetalles
//     console.log('✅ articulosConDetalles:', articulos.value)

//     $q.notify({
//       color: 'positive',
//       message: `Se cargaron ${articulosConDetalles.length} artículos correctamente`,
//       icon: 'check',
//     })
//   } catch (error) {
//     console.error('Error al cargar artículos:', error)
//     $q.notify({
//       color: 'negative',
//       message: 'Error al cargar los artículos: ' + error.message,
//       icon: 'error',
//     })
//   } finally {
//     loading.value = false
//   }
// }

// Editar artículo
const editArticulo = (articulo) => {
  // Guardar datos originales
  originalData[articulo.id] = { ...articulo }
  articulo.editing = true
}

// Cancelar edición
const cancelEdit = (articulo) => {
  // Restaurar datos originales
  const original = originalData[articulo.id]
  if (original) {
    Object.assign(articulo, original)
  }
  articulo.editing = false
  delete originalData[articulo.id]
}

// Guardar artículo
const saveArticulo = async (articulo) => {
  try {
    // Aquí harías la llamada al endpoint de actualización
    // const response = await fetch(`https://api.flowsma.com/donandres/articulo/update/${articulo.id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     nombre: articulo.nombre,
    //     precio: articulo.precio,
    //     descripcion: articulo.descripcion,
    //     stock: articulo.stock
    //   })
    // })

    // const result = await response.json()

    // if (result.success) {
    articulo.editing = false
    delete originalData[articulo.id]

    $q.notify({
      color: 'positive',
      message: 'Artículo actualizado correctamente',
      icon: 'check',
    })
    // } else {
    //   throw new Error(result.message || 'Error al actualizar')
    // }
  } catch (error) {
    console.error('Error al guardar artículo:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al guardar los cambios',
      icon: 'error',
    })

    // Restaurar datos originales en caso de error
    cancelEdit(articulo)
  }
}

// Ver detalles completos
const viewDetails = (articulo) => {
  selectedArticulo.value = articulo
  showDetailsDialog.value = true
}

// Cargar datos al montar el componente
onMounted(() => {
  articulosStore.loadArticulos()
})
</script>

<style scoped>
.my-sticky-header-table {
  /* height or max-height is important */
  height: 600px;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff;
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 2px 4px;
}
</style>
