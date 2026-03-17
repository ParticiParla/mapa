# Mapa interactivo de ParticiParla

Este documento describe cómo está montado actualmente el mapa interactivo de asociaciones, cómo se usan los *hubs*, el buscador, las capas y el listado lateral de puntos visibles.

## 1. Flujo general de datos

1. Backend (Directus) expone las colecciones `Entity` y `Hub`.
2. La API de Nuxt en `server/api/entities.ts` consulta Directus y devuelve:
   - `entities`: lista de entidades ya mapeadas al tipo `Entity` del frontend.
   - `hubs`: objeto `Record<string, Hub[]>` agrupado por `id` de hub.
3. El frontend (Nuxt 3) consume `/api/entities` desde:
   - `pages/index.vue` para el mapa interactivo web.
   - `pages/map.vue` para la vista maquetada/imprimible.
4. El componente `BaseMap` (`components/BaseMap.vue`) recibe `entities` y `hubs` y pinta el mapa con Leaflet.

## 2. API de entidades (backend)

Archivo: `server/api/entities.ts`

- Usa `@directus/sdk` para leer items de Directus.
- Colección `Entity`:
  - Campos leídos actualmente: `['id', 'name', 'objetive', 'logo', 'coordinates', 'file', 'hub', 'description', 'schedule', 'activities', 'participate', 'observations', 'contact', 'contact_items']`.
  - Se filtra por `status: "Published"`.
- Colección `Hub`:
  - Campos leídos: `['id', 'name', 'horizontalPosition', 'verticalPosition', 'startOfCoordinates', 'pointToShow', 'coordinates']`.
- Transformaciones clave:
  - Se invierte el orden de las coordenadas de hubs (`reverse()`), porque Directus las devuelve en `[lon, lat]` y Leaflet espera `[lat, lon]`.
  - Solo se mantienen hubs que tengan al menos una entidad asociada.
  - Cada item de `Entity` se mapea al tipo `Entity` del frontend, generando también:
    - `logoLink` (URL completa al asset en Directus).
    - `pdfLink` (asset PDF si existe).
- La API devuelve:

```ts
return { entities: response, hubs: Object.groupBy(hubs, a => a.id) }
```

> Nota: cuando se añadan campos nuevos en Directus (por ejemplo, capas/categorías), éste es el lugar donde se deberán leer y mapear a `Entity`.

## 3. Tipos compartidos

Archivo: `utils/types.ts`

- `Entity`: representa una asociación/punto del mapa. Campos relevantes actuales:
  - `id`, `name`, `objective`.
  - `coordinates?: number[] | null` (posición directa; si no hay, se usa `hub`).
  - `logo`, `logoLink`, `pdfLink`.
  - `hub?: number` (id de hub asociada).
  - `description`, `schedule`, `activities`, `participate`, `observations`, `contact`.
  - `contact_items?: string[]` (estructura ajustada en frontend para mostrar contactos detallados).
- `Hub`:
  - `id`, `name`.
  - `horizontalPosition`, `verticalPosition`, `startOfCoordinates` (valores para distribuir puntos alrededor del hub).
  - `pointToShow: { coordinates: number[] }` (punto donde se muestran las entidades).
  - `coordinates: { coordinates: number[] }` (punto real del hub en el mapa).
- `EntityList = Entity[]`.

> Cuando las capas vengan de Directus, aquí se añadirá el/los nuevos campos (ej.: `layers?: string[]`, `category?: string`, etc.).

## 4. Componente de mapa: BaseMap.vue

Archivo: `components/BaseMap.vue`

Responsabilidades:

- Recibir `entities` y `hubs`.
- Pintar marcadores para cada entidad (con logo o índice, según `markerType`).
- Agrupar entidades por hub y distribuirlas alrededor del `pointToShow` del hub, unidas por una flecha al punto real del hub.
- Emitir eventos al exterior:
  - `marker-click`: cuando se hace clic en un marcador (entidad).
  - `visible-change`: lista de entidades visibles dentro de los límites actuales del mapa.

### 4.1. Pinta de entidades y hubs

- Para cada `entity` en `props.entities`:
  - Si `entity.coordinates` es un array, se genera un marcador directo en esas coordenadas.
  - Si **no** tiene `coordinates` válidas pero sí `hub`, se agrupa en `entitiesByHubs[hubId]`.
- Para cada hub en `props.hubs`:
  - Se toma el primer elemento del array (`[id]: Hub[]`) como hub principal.
  - Se calculan:
    - `hubCoords` (posición real del hub).
    - `hubPointToShowCoords` (donde se colocan los marcadores de entidades).
  - Se dibuja una polilínea con flecha entre `hubPointToShowCoords` y `hubCoords`.
  - Se distribuyen las entidades del hub en círculo alrededor de `hubPointToShowCoords` usando `_generatePointsCircle`, aplicando:
    - `horizontalPosition`, `verticalPosition` (desplazamientos x/y).
    - `startOfCoordinates` (ángulo inicial).

### 4.2. Cálculo de entidades visibles

- Cada `L.Marker` guarda internamente la entidad asociada:

```ts
;(marker as any).__entity = entity
```

- `updateVisibleEntities(leafletMap)`:
  - Obtiene los bounds actuales (`leafletMap.getBounds()`).
  - Recorre todas las capas del mapa; si una capa es `L.Marker` y su posición está dentro de los bounds, recoge la entidad asociada.
  - Emite el evento:

```ts
emit('visible-change', Array.from(collected.values()))
```

- `renderLayers(leafletMap)`:
  - Limpia todas las capas salvo el `TileLayer` base.
  - Vuelve a pintar entidades y hubs.
  - Llama a `updateVisibleEntities(leafletMap)` al final.

- `onMapReady`:
  - Configura el mapa (quita controles por defecto, centra en las coordenadas iniciales).
  - Llama a `renderLayers(leafletMap)`.
  - Escucha eventos `moveend` y `zoomend` para recalcular qué puntos están visibles y emitir `visible-change`.

- `watch(() => [props.entities, props.hubs], ...)`:
  - Cuando cambian `entities` o `hubs` (por ejemplo, al aplicar filtros de búsqueda o capas en el frontend), se vuelve a llamar a `renderLayers`.

## 5. Página principal interactiva: index.vue

Archivo: `pages/index.vue`

Responsabilidades:

- Cargar entidades y hubs desde `/api/entities` vía `useFetch`.
- Mostrar el mapa interactivo con `BaseMap`.
- Gestionar el slideover de detalles de una entidad.
- Implementar:
  - Buscador de texto.
  - Toggles de capas (por ahora, heurísticos sobre texto).
  - Listado lateral de puntos visibles en el mapa.

### 5.1. Carga de datos

- `useFetch<{ entities: Entity[], hubs: Record<string, Hub[]> }>('/api/entities')`.
- `entities` y `hubs` se exponen como `computed` para su uso en el template.

### 5.2. Buscador de texto

- `searchQuery: ref('')` recoge el texto introducido en un `UInput` en el header.
- `filteredEntities` aplica:
  - Filtro por capas activas (ver 5.3).
  - Filtro por texto: busca el término (en minúsculas) dentro de `name`, `objective`, `description`, `activities`, `participate`, `observations`, `contact`.
- Solo `filteredEntities` se pasan al `BaseMap`.

### 5.3. Capas (versión heurística provisional)

Hasta que Directus provea campos específicos para capas, se usan capas derivadas del texto:

Capas actuales:

1. Asociaciones de ParticiParla (`asociaciones`)
2. Tablones de Libre Expresión (`tablones`)
3. Teatros (`teatros`)
4. Bibliotecas (`bibliotecas`)
5. Espacios asociativos (`espacios`)
6. La Cantueña (`lacantuenia`)

- `layers`: array estático con `id` y `label` para cada capa.
- `activeLayers: ref<string[]>(...)` contiene las capas activas.
- `toggleLayer(id)` activa/desactiva una capa.
- `getEntityLayers(entity)` asigna capas a una entidad en función de palabras clave en `name`, `objective` y `description` (por ejemplo, si aparece "biblioteca" se añade la capa `bibliotecas`).
- Si una entidad no encaja en ninguna regla, se le asigna por defecto `asociaciones`.

> A futuro, esta lógica se sustituirá por el/los campos que vengan desde Directus (por ejemplo, `entity.layers` leídos en `server/api/entities.ts`).

### 5.4. Listado lateral de puntos visibles

- Se define `visibleEntities: ref<Entity[]>([])`.
- Se pasa un listener a `BaseMap`:

```vue
<BaseMap
  :entities="filteredEntities"
  :hubs="hubs"
  markerType="logo"
  interactive
  @marker-click="handleMarkerClick"
  @visible-change="handleVisibleChange"
/>
```

- `handleVisibleChange(entities: Entity[])` actualiza `visibleEntities`.
- Se muestra un panel lateral (overlay) en la parte derecha del mapa con:
  - Título `Puntos visibles (N)`.
  - Lista de `visibleEntities` con:
    - Logo (si existe) o inicial del nombre.
    - Nombre.
    - Objetivo (truncado en 1-2 líneas).
  - Mensaje de ayuda si no hay puntos visibles (`Mueve o acerca el mapa para ver puntos aquí.`).
- Al hacer clic en un elemento del listado lateral se llama a `handleMarkerClick(entity)`, exactamente igual que cuando se hace clic en un marcador del mapa.

### 5.5. Slideover de detalle de entidad

- Usa `USlideover` para mostrar detalles de la entidad seleccionada.
- La entidad seleccionada se guarda en `selectedEntity: ref<Entity | null>(null)`.
- `handleMarkerClick(entity: Entity)`:
  - Asigna `selectedEntity.value = entity`.
  - Abre el slideover.
- El cuerpo del slideover muestra:
  - Objetivo/Descripción.
  - Actividades.
  - Cómo participar.
  - Horario.
  - Contacto detallado (`contact_items`) con iconos y enlaces (teléfono, redes, web...).
  - Observaciones.

## 6. Vista maquetada/imprimible: map.vue

Archivo: `pages/map.vue`

- Pensada para maquetar/imprimir un mapa con:
  - Tres columnas de entidades con QR (componentes `EntityList`).
  - Un mapa grande con `BaseMap`.
- Usa también `/api/entities`, pero actualmente **no** aplica buscador ni capas.
- `EntityList.vue`:
  - Recibe `entities` y genera un QR para cada una (
    URL del tipo `/?entity=<id>`), que abre la entidad en la vista interactiva (`index.vue`) mediante una query en la URL.
  - Tiene un tratamiento especial para la entidad "ParticiParla".

> En el futuro, si se desea, esta vista también podría respetar filtros/capas o mostrar agrupaciones específicas.

## 7. Hubs: concepto y uso previsto

### 7.1. Concepto

- Un **hub** representa un punto especial en el mapa que agrupa varias entidades.
- Tiene:
  - Una localización real (`coordinates`).
  - Un punto de visualización (`pointToShow`) donde se dibujan los iconos de las entidades asociadas.
  - Parámetros para distribuir esos iconos alrededor (`horizontalPosition`, `verticalPosition`, `startOfCoordinates`).

### 7.2. Uso actual

- En la API (`server/api/entities.ts`):
  - Solo se devuelven hubs que tienen al menos una entidad asociada.
- En `BaseMap.vue`:
  - Las entidades que no tienen `coordinates` directas pero sí `hub` se agrupan por hub.
  - Se dibuja una flecha desde el punto donde se muestran (`pointToShow`) al punto real (`coordinates`).
  - Se distribuyen las entidades en círculo alrededor del `pointToShow`.

### 7.3. Posible uso futuro

- Asociar capas también a hubs (no solo a entidades).
- Añadir interacción al hacer clic directamente en el hub (por ejemplo, resaltar todas las entidades asociadas o mostrar un resumen).
- Cálculos de visibilidad/estadísticas por hub.

## 8. Integración futura con capas de Directus

Cuando el backend (Directus) defina campos específicos para las capas (posiblemente múltiples por entidad), los puntos de integración serán:

1. **Directus**
   - Campo nuevo en la colección `Entity` (por ejemplo `layers`, `categories`, relación many-to-many, etc.).
2. **API de Nuxt** (`server/api/entities.ts`)
   - Añadir el nuevo campo en `fields: [...]` de `readItems('Entity', ...)`.
   - Mapearlo al tipo `Entity` (por ejemplo, `layers?: string[]`).
3. **Tipos compartidos** (`utils/types.ts`)
   - Incluir el campo en la interfaz `Entity`.
4. **Frontend interactivo** (`pages/index.vue`)
   - Sustituir la lógica heurística de `getEntityLayers(entity)` por una lectura directa del campo del backend.
   - Opcional: mostrar chips/etiquetas de capas en el listado lateral y/o en el slideover.
5. **Vista de impresión** (`pages/map.vue`)
   - Decidir si también respeta capas/filtros o si siempre muestra el conjunto completo.

---

Este documento sirve como referencia de contexto para futuras modificaciones del mapa, especialmente:

- Integración de capas reales desde Directus.
- Evolución del concepto de hubs.
- Mejoras en buscador y listados.

Cualquier cambio importante en el flujo de datos o en la estructura de `Entity`/`Hub` debería reflejarse aquí para mantener la documentación alineada con el código.
