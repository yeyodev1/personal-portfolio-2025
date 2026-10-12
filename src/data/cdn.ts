// Images in /public/work and /public/game are mirrored on Cloudinary under `yeyo-dev/…`.
// Cloudinary picks the best format (WebP/AVIF) and size; the local file stays as a fallback.
const CLOUD = 'coylsvfn'

export function cdn(localPath: string, width?: number) {
  const id = `yeyo-dev${localPath.replace(/\.(jpe?g|png)$/i, '')}` // '/work/x.jpg' → 'yeyo-dev/work/x'
  const transform = ['f_auto', 'q_auto', 'c_limit', width ? `w_${width}` : ''].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transform}/${id}`
}

export function cdnSrcset(localPath: string, width: number) {
  return [1, 2].map((x) => `${cdn(localPath, width * x)} ${x}x`).join(', ')
}
