'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { defaultSkills, defaultExperiences } from '@/utils/constants'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [daftarKarya, setDaftarKarya] = useState([])
  const [daftarSubKategori, setDaftarSubKategori] = useState([])
  const [daftarWebsite, setDaftarWebsite] = useState([])
  const [daftarArtikel, setDaftarArtikel] = useState([])
  const [skills, setSkills] = useState(defaultSkills)
  const [experiences, setExperiences] = useState(defaultExperiences)
  const [daftarPricelist, setDaftarPricelist] = useState([])
  const [configSitus, setConfigSitus] = useState({
    heroImage: '', aboutImage: '', homeCaption: '', homeDescription: '',
    heroTagline: '', heroTitle1: '', heroTitle2: '', aboutQuote: '',
    contactStatus: '', contactTitle: '', email: '', portfolioTitle: '',
    statClients: '', statProjects: '', statYears: ''
  })
  const [instagramConfig, setInstagramConfig] = useState({
    igUsername: 'rfx.visual', igProfileImage: '', igBio: '', igFeedPosts: []
  })
  const [isLoading, setIsLoading] = useState(true)

  const ambilData = useCallback(async () => {
    try {
      const { data: projects } = await supabase.from('projects').select('*').order('id', { ascending: false })
      if (projects) setDaftarKarya(projects)

      const { data: subcats } = await supabase.from('subcategories').select('*').order('id', { ascending: true })
      if (subcats) setDaftarSubKategori(subcats)

      const { data: config } = await supabase.from('site_config').select('*').limit(1).single()
      if (config) setConfigSitus(prev => ({ ...prev, ...config }))

      const { data: igConfig } = await supabase.from('instagram_config').select('*').limit(1).single()
      if (igConfig) {
        let feedPosts = igConfig.igFeedPosts
        if (typeof feedPosts === 'string') {
          try { feedPosts = JSON.parse(feedPosts) } catch { feedPosts = [] }
        }
        if (!Array.isArray(feedPosts)) feedPosts = []
        setInstagramConfig(prev => ({ ...prev, ...igConfig, igFeedPosts: feedPosts }))
      }

      const { data: dataSkills } = await supabase.from('skills').select('*').order('level', { ascending: false })
      if (dataSkills && dataSkills.length > 0) setSkills(dataSkills)

      const { data: dataExp } = await supabase.from('experiences').select('*').order('id', { ascending: true })
      if (dataExp && dataExp.length > 0) setExperiences(dataExp)

      const { data: dataWeb } = await supabase.from('websites').select('*').order('id', { ascending: false })
      if (dataWeb) setDaftarWebsite(dataWeb)

      const { data: pricelistsData } = await supabase.from('pricelists').select('*').order('id', { ascending: true })
      if (pricelistsData) setDaftarPricelist(pricelistsData)

      const { data: articles } = await supabase.from('artikel').select('*').order('id', { ascending: false })
      if (articles) setDaftarArtikel(articles)
    } catch (error) {
      console.log("Supabase fetch error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    ambilData()
  }, [ambilData])

  const value = {
    daftarKarya, setDaftarKarya,
    daftarSubKategori, setDaftarSubKategori,
    daftarWebsite, setDaftarWebsite,
    daftarArtikel, setDaftarArtikel,
    skills, setSkills,
    experiences, setExperiences,
    configSitus, setConfigSitus,
    instagramConfig, setInstagramConfig,
    daftarPricelist, setDaftarPricelist,
    isLoading,
    refreshData: ambilData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
