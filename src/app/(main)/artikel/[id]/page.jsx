import { createClient } from '@supabase/supabase-js'
import ArtikelDetail from './ArtikelDetail'

// Enable revalidation for dynamic data (in seconds)
export const revalidate = 60

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { title: 'Artikel | RFX Visual' }
  }

  try {
    const { data: artikel } = await supabase
      .from('artikel')
      .select('*')
      .eq('id', id)
      .single()

    if (!artikel) {
      return { title: 'Artikel Tidak Ditemukan | RFX Visual' }
    }

    return {
      title: `${artikel.title} | RFX Visual`,
      description: artikel.summary || (artikel.content ? artikel.content.substring(0, 160) : ''),
      openGraph: {
        title: artikel.title,
        description: artikel.summary || (artikel.content ? artikel.content.substring(0, 160) : ''),
        images: [artikel.image || artikel.image_url],
      },
    }
  } catch (err) {
    return { title: 'Artikel | RFX Visual' }
  }
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        <h2>Koneksi database belum dikonfigurasi.</h2>
      </div>
    )
  }

  try {
    const { data: artikel, error } = await supabase
      .from('artikel')
      .select('*')
      .eq('id', id)
      .single()

    if (!artikel || error) {
      return (
        <div className="min-h-screen flex items-center justify-center text-muted">
          <h2>Artikel tidak ditemukan</h2>
        </div>
      )
    }

    return <ArtikelDetail artikel={artikel} />
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        <h2>Terjadi kesalahan pada database.</h2>
      </div>
    )
  }
}
