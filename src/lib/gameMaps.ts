/**
 * Mapas de imagens locais para os jogos, chaveados pelo `imageUrl`/`imageKey`
 * retornado pela API (nome do arquivo sem extensão).
 *
 * No app RN isso exigia um `require()` por imagem (limitação do bundler nativo).
 * No Vite, `import.meta.glob(..., { eager: true })` resolve todos os arquivos
 * da pasta de uma vez — o mapa fica sempre sincronizado com `src/assets/*`,
 * sem precisar listar cada arquivo manualmente.
 */
function toKeyedMap(modules: Record<string, unknown>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const path in modules) {
    const fileName = path.split('/').pop() ?? path
    const key = fileName.replace(/\.[^.]+$/, '')
    map[key] = modules[path] as string
  }
  return map
}

const vowelsModules = import.meta.glob('../assets/vowels/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})
const wordsModules = import.meta.glob('../assets/words/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})
const animalsModules = import.meta.glob('../assets/animals/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

export const VOWELS_IMAGE_MAP: Record<string, string> = toKeyedMap(vowelsModules)
export const WORDS_IMAGE_MAP: Record<string, string> = toKeyedMap(wordsModules)
export const ANIMALS_IMAGE_MAP: Record<string, string> = toKeyedMap(animalsModules)
