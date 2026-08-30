import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const baseUrl = 'https://rfxvisual.my.id'

  // Static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/myroom`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/artikel`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kontak`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/rfx-links`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/rfx-links/pricelist`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/rfx-links/orderweb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic article routes
  let articleRoutes = []
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )

    try {
      const { data: articles } = await supabase
        .from('artikel')
        .select('id, title, created_at')
        .order('id', { ascending: false })

      if (articles) {
        articleRoutes = articles.map(article => ({
          url: `${baseUrl}/artikel/${article.id}`,
          lastModified: article.created_at ? new Date(article.created_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))
      }
    } catch (error) {
      console.log('Sitemap: Could not fetch articles', error.message)
    }
  }

  return [...staticRoutes, ...articleRoutes]
}
