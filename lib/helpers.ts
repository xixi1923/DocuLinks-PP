
export function fileIcon(mime: string) {
  if ((mime||'').includes('pdf')) return '📄'
  if ((mime||'').startsWith('image/')) return '🖼️'
  if (/(msword|officedocument|powerpoint)/.test(mime||'')) return '📑'
  return '📚'
}
