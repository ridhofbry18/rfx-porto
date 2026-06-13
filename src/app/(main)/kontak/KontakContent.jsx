'use client'

import React, { useState } from 'react'
import { Mail, Cpu, X, ArrowRight, Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import AnimatedText from '@/components/AnimatedText'
import { useData } from '@/components/DataProvider'

const KontakContent = () => {
  const { configSitus } = useData()
  const [modalAiBuka, setModalAiBuka] = useState(false)
  const [kueriAi, setKueriAi] = useState('')
  const [sedangKonsultasi, setSedangKonsultasi] = useState(false)
  const [responAi, setResponAi] = useState('')

  const tanganiAi = async (e) => {
    e.preventDefault();
    if (!kueriAi.trim() || !window.puter) return;

    setSedangKonsultasi(true);
    try {
      // Custom AI prompt inject
      const systemPrompt = `Kamu adalah 'Rexa', asisten AI pintar buatan 'RFX Visual' (sebuah production house / visual artist dari Malang yang dipimpin oleh Ridho Febriyansyah).
      RFX Visual adalah ahli di bidang pembuatan video sinematik, foto produk, color grading, animasi, dan pembuatan website portofolio yang interaktif.
      Tugas kamu:
      1. Berikan ide atau saran yang kreatif dan profesional terkait visual, konsep video/foto, atau desain web.
      2. Selalu gunakan bahasa Indonesia yang asik, ramah, dan sedikit gaul (tapi tetap profesional).
      3. Jangan pernah menyebutkan OpenAI, ChatGPT, atau pembuat aslinya. Kamu murni adalah Rexa dari RFX Visual.
      4. Jika ditanya harga, arahkan untuk menghubungi via DM Instagram @rfx.visual atau email.
      Pertanyaan user: "${kueriAi}"`;

      const response = await window.puter.ai.chat(systemPrompt);
      setResponAi(response.message?.content || response);
    } catch (error) {
      console.log("Error Puter AI:", error);
      setResponAi("Waduh, koneksi ke otak AI gue lagi gangguan nih. Coba lagi bentar ya!");
    } finally {
      setSedangKonsultasi(false);
      setKueriAi('');
    }
  };

  return (
    <>
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center text-white min-h-screen">
        <Layout className="pt-32 pb-16">
          <AnimatedText
            text="REACH OUT."
            className="mb-12 md:mb-20 !text-5xl sm:!text-6xl md:!text-7xl lg:!text-8xl font-display uppercase tracking-wider text-logo-red-light"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left w-full max-w-5xl mx-auto px-4">
            <a href={`mailto:${configSitus?.email || 'email@rfxvisual.my.id'}`}
              className="group p-8 sm:p-10 bg-logo-red/10 backdrop-blur-2xl rounded-3xl border border-logo-red/20 hover:border-logo-red transition-all duration-300 hover:-translate-y-1 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-logo-red/20 rounded-full blur-[50px] -z-10 group-hover:bg-logo-red/40 transition-all" />
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-logo-red group-hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Email</p>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-logo-red transition-colors break-all">
                  {configSitus?.email || 'email@rfxvisual.my.id'}
                </p>
              </div>
            </a>

            <button onClick={() => setModalAiBuka(true)}
              className="group p-8 sm:p-10 bg-blue-600/10 backdrop-blur-2xl rounded-3xl border border-blue-600/20 hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col gap-6 w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] -z-10 group-hover:bg-blue-600/40 transition-all" />
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">AI Assistant</p>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-500 transition-colors">
                  Brainstorm Ide Visual
                </p>
              </div>
            </button>
          </div>
        </Layout>

        {modalAiBuka && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setModalAiBuka(false)}>
            <div className="relative w-full max-w-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 sm:pb-6">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Powered by RFX AI</p>
                  <h3 className="text-lg sm:text-xl font-bold text-white">RFX Brainstorm</h3>
                </div>
                <button onClick={() => setModalAiBuka(false)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {responAi ? (
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 sm:p-6">
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-300 font-light whitespace-pre-wrap">{responAi}</p>
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-xs sm:text-sm">Tanyakan ide visual kamu pada Rexa...</p>
                  </div>
                )}
              </div>

              <form onSubmit={tanganiAi} className="relative pt-4 border-t border-white/10">
                <input
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-white text-xs sm:text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 shadow-inner"
                  value={kueriAi}
                  onChange={e => setKueriAi(e.target.value)}
                  placeholder="Contoh: konsep video cinematic untuk brand fashion..."
                  disabled={sedangKonsultasi}
                />
                <button type="submit" disabled={sedangKonsultasi || !kueriAi} className="absolute right-2 sm:right-3 top-[20px] sm:top-[22px] w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  {sedangKonsultasi ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default KontakContent;
