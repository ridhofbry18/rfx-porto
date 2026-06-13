'use client'

import React from 'react'
import { ArrowLeft, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'

const linkifyParagraph = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, start) });
    }
    let normalizedUrl = url;
    const trailingPunctuation = /[.,!?;:)]$/.test(normalizedUrl);
    if (trailingPunctuation) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    parts.push({ type: 'link', content: normalizedUrl });
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
};

const ArtikelDetail = ({ artikel }) => {
  const router = useRouter()

  return (
    <>
      <TransitionEffect />
      <main className="w-full flex flex-col items-center justify-center text-white min-h-screen bg-[#050505] pb-24">
        <Layout className="pt-32">
          <button 
            onClick={() => router.push('/artikel')}
            className="group flex items-center text-zinc-400 hover:text-logo-red font-medium mb-12 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Artikel
          </button>

          <article className="max-w-4xl mx-auto bg-logo-red/5 backdrop-blur-2xl border border-logo-red/20 p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-logo-red/20 rounded-full blur-[80px] -z-10" />
            <div className="flex items-center gap-4 text-logo-red mb-6 font-semibold text-sm tracking-widest uppercase">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" /> 
                {artikel.date || (artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID') : 'Tanggal Rilis')}
              </span>
            </div>
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
              {artikel.title}
            </h1>

            {(artikel.image || artikel.image_url) && (
              <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] overflow-hidden rounded-3xl mb-12 border border-white/5">
                <img src={artikel.image || artikel.image_url} alt={artikel.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
              {(artikel.content || '').split('\n').map((paragraph, idx) => {
                const parts = linkifyParagraph(paragraph);
                return (
                  <p key={idx} className="mb-6 text-zinc-300 leading-relaxed text-justify" style={{ textIndent: '3rem' }}>
                    {parts.map((part, pieceIndex) => {
                      if (part.type === 'link') {
                        return (
                          <a key={pieceIndex} href={part.content} target="_blank" rel="noopener noreferrer" className="text-logo-red underline underline-offset-2 hover:text-white break-words">
                            {part.content}
                          </a>
                        );
                      }
                      return <span key={pieceIndex}>{part.content}</span>;
                    })}
                  </p>
                )
              })}
            </div>
          </article>
        </Layout>
      </main>
    </>
  )
}

export default ArtikelDetail;
