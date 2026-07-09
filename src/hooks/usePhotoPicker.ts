'use client'

import { useCallback } from 'react'

/**
 * Web equivalent of the RN app's expo-image-picker wrapper. Uses a hidden
 * `<input type="file">` — `openCamera()` hints the mobile browser to open the
 * camera directly via `capture="environment"`, `openGallery()` opens the
 * regular file/photo picker. Cropping/aspect-ratio (`allowsEditing`) isn't
 * implemented on web — options are accepted for call-site compatibility only.
 */
export interface PhotoPickerResult {
  uri: string | null
  canceled: boolean
  error?: 'permission-denied' | 'unknown'
}

export interface UsePhotoPickerOptions {
  aspect?: [number, number]
  quality?: number
  allowsEditing?: boolean
}

function pickFile(capture?: 'user' | 'environment'): Promise<PhotoPickerResult> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    if (capture) input.setAttribute('capture', capture)
    input.style.display = 'none'

    let settled = false
    const cleanup = () => {
      window.removeEventListener('focus', onFocus)
      input.remove()
    }

    const onFocus = () => {
      // Nenhum arquivo escolhido até aqui + foco de volta na janela = usuário cancelou.
      setTimeout(() => {
        if (!settled && !input.files?.length) {
          settled = true
          cleanup()
          resolve({ uri: null, canceled: true })
        }
      }, 300)
    }

    input.onchange = () => {
      settled = true
      cleanup()
      const file = input.files?.[0]
      if (!file) {
        resolve({ uri: null, canceled: true })
        return
      }
      resolve({ uri: URL.createObjectURL(file), canceled: false })
    }

    window.addEventListener('focus', onFocus)
    document.body.appendChild(input)
    input.click()
  })
}

export function usePhotoPicker(_options: UsePhotoPickerOptions = {}) {
  const openCamera = useCallback((): Promise<PhotoPickerResult> => pickFile('environment'), [])
  const openGallery = useCallback((): Promise<PhotoPickerResult> => pickFile(), [])

  return { openCamera, openGallery }
}

export default usePhotoPicker
