
import { supabase } from '@/lib/supabaseClient'
import LikeButton from '@/components/LikeButton'
import FavoriteButton from '@/components/FavoriteButton'
import CommentList from '@/components/CommentList'

export default async function DocumentPage({ params }: { params: { id: string }}) {
  const { data: doc } = await supabase
    .from('documents')
    .select('id,title,description,file_path,file_type,created_at')
    .eq('id', params.id)
    .single()

  if (!doc) return <div className="max-w-3xl mx-auto p-6">Not found</div>

  const publicUrl = supabase.storage.from('documents').getPublicUrl(doc.file_path).data.publicUrl
  const isPDF = (doc.file_type||'').includes('pdf')
  const isImage = (doc.file_type||'').startsWith('image/')
  const isOffice = /(msword|officedocument|powerpoint)/.test(doc.file_type||'')
  const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">{doc.title}</h1>
      <p className="text-slate-600 dark:text-slate-300">{doc.description}</p>

      <div className="mt-6 border rounded-lg overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-800">
        {isPDF && (
          <object data={publicUrl} type="application/pdf" className="w-full h-[70vh]">
            <p className="p-4">PDF preview not supported. <a className="text-brand" href={publicUrl} target="_blank">Open PDF</a></p>
          </object>
        )}
        {isImage && <img src={publicUrl} alt={doc.title} className="w-full" />}
        {isOffice && (<iframe src={officeViewer} className="w-full h-[70vh]" />)}
        {!isPDF && !isImage && !isOffice && (<div className="p-4">Preview unavailable. <a className="text-brand" href={publicUrl}>Download</a></div>)}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <a href={publicUrl} download className="btn btn-outline">Download</a>
        <LikeButton documentId={doc.id} />
        <FavoriteButton documentId={doc.id} />
      </div>

      <section className="mt-8">
        <h2 className="font-semibold mb-3">Comments</h2>
        <CommentList documentId={doc.id} />
      </section>
    </main>
  )
}
