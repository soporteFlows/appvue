export interface Articulo {
  'articulos.id': number
  'articulos.internalcode': string
  'articulos.externalcode': string
  'articulos.nombre': string
  'articulos.descrip': string | null
  'articulos.categid': number
  'articulos.statusinicial': number | null // Tipo desconocido (ajustar si se sabe)
  'articulos.instructivoid': number | null
  'articulos.caracteristicas': string | null
  'articulos.activo': boolean
  'articulos.cantidadunidad': number | null
  'articulos.puntorepo': number | null
  'articulos.nivelobj': number | null
  'articulos.cantminrepo': number | null
  'articulos.imagen': string | null
  'articulos.um': string | null
  'articulos.impuestoalic': number | null
  'articulos.isservice': boolean
  'articulos.ischeque': boolean
  'articulos.isamedida': boolean
  'articulos.cuentacontableid': number | null

  // Campos relacionados con categorías (pueden separarse en otra interfaz)
  'categorias.id': number
  'categorias.name': string
  'categorias.grupo': string
  'categorias.parentid': number | null

  'categoriaPadre.id': number
  'categoriaPadre.name': string
  'categoriaPadre.grupo': string
  'categoriaPadre.parentid': number | null

  'categoriaAbuelo.id': number
  'categoriaAbuelo.name': string
  'categoriaAbuelo.grupo': string
  'categoriaAbuelo.parentid': null

  // Campos adicionales (¿UI?)
  id: number
  editing: boolean
}

export interface TablaArticulos {
  cols: Array<string> // Lista de columnas (ej: "articulos.id", "categorias.name", etc.)
  rows: Array<Articulo> // Array de registros de artículos
  showableColumns?: Array<string> // Columnas visibles (opcional)
  total: number // Total de registros
}
