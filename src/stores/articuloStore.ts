import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/axios' // o tu path correcto
import type { Articulo } from '../types'

export const useArticulosStore = defineStore('articulos', () => {
  const articulos = ref<Articulo[]>([])
  const loading = ref(false)
  const columnas = ref([])

  // Ayuda: pausa entre lotes
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Actualiza un artículo dentro del array
  const actualizarArticulo = (id: number, data: Partial<Articulo>) => {
    const index = articulos.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      articulos.value[index] = { ...articulos.value[index], ...data }
    }
  }

  const loadArticulos = async () => {
    loading.value = true
    try {
      const indexResponse = await api.post('/articulo/index')

      let articulosData: Articulo[] = []

      console.log('✅ indexResponse:', indexResponse)

      if (Array.isArray(indexResponse.data)) {
        articulosData = indexResponse.data
      } else if (Array.isArray(indexResponse.rows)) {
        articulosData = indexResponse.rows
      } else if (indexResponse.data?.rows && Array.isArray(indexResponse.data.rows)) {
        articulosData = indexResponse.data.rows
      } else {
        throw new Error('No se encontraron datos de artículos en la respuesta')
      }

      // Mostrar rápido los artículos sin detalles
      articulos.value = articulosData.map((articulo: any) => {
        const id = articulo.id || articulo['articulos.id'] || articulo.articuloId
        return { ...articulo, id, editing: false }
      })

      // Cargar detalles en segundo plano
      const batchSize = 20
      const MAX_CONCURRENT_BATCHES = 5
      let queue: Promise<void>[] = []

      for (let i = 0; i < articulos.value.length; i += batchSize) {
        const batch = articulos.value.slice(i, i + batchSize)

        const tarea = async () => {
          await Promise.all(
            batch.map(async (articulo) => {
              try {
                const detailResponse = await api.post(`/articulo/show/${articulo.id}`)
                // Combiná los datos de detalle
                actualizarArticulo(articulo.id, detailResponse.data)
              } catch (e) {
                console.warn(`No se pudo cargar detalle del artículo ${articulo.id}`)
              }
            }),
          )
        }

        queue.push(tarea())

        if (queue.length >= MAX_CONCURRENT_BATCHES) {
          await Promise.all(queue)
          queue = []
          await delay(100)
        }
      }

      if (queue.length > 0) {
        await Promise.all(queue)
      }
    } catch (error) {
      console.error('Error al cargar artículos:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    articulos,
    loading,
    loadArticulos,
  }
})
