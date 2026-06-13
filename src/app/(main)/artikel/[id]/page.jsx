import { createClient } from '@supabase/supabase-js'
import ArtikelDetail from './ArtikelDetail'

// Enable revalidation for dynamic data (in seconds)
export const revalidate = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const { data: artikel } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', id)
    .single()

  if (!artikel) {
    return {
      title: 'Artikel Tidak Ditemukan | RFX Visual',
    }
  }

  return {
    title: `${artikel.title} | RFX Visual`,
    description: artikel.summary || artikel.content.substring(0, 160),
    openGraph: {
      title: artikel.title,
      description: artikel.summary || artikel.content.substring(0, 160),
      images: [artikel.image || artikel.image_url],
    },
  }
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const { data: artikel, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', id)
    .single()

  if (!artikel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2>Artikel tidak ditemukan</h2>
      </div>
    )
  }

  return <ArtikelDetail artikel={artikel} />
}
