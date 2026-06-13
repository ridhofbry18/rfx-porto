'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useData } from '@/components/DataProvider';
import PanelAdmin from '@/components/PanelAdmin';
import TransitionEffect from '@/components/TransitionEffect';

const AdminContent = () => {
  const {
    daftarKarya, setDaftarKarya,
    daftarSubKategori, setDaftarSubKategori,
    daftarWebsite, setDaftarWebsite,
    daftarArtikel, setDaftarArtikel,
    skills, setSkills,
    experiences, setExperiences,
    configSitus, setConfigSitus,
    instagramConfig, setInstagramConfig,
    daftarPricelist, setDaftarPricelist,
    refreshData
  } = useData();

  const [modalAdminBuka, setModalAdminBuka] = useState(true);
  const [statusAdmin, setStatusAdmin] = useState(false);
  const [inputKunciAdmin, setInputKunciAdmin] = useState('');

  // State Form Admin
  const [tabAdmin, setTabAdmin] = useState('portofolio');
  const [itemBaru, setItemBaru] = useState({ title: '', category: 'video', subcategory_id: '', image: '', description: '', youtubeUrl: '' });
  const [subKatBaru, setSubKatBaru] = useState({ name: '', parent_category: 'video', cover_image: '' });
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('rfx_admin_auth') === 'true') {
      setStatusAdmin(true);
    }
  }, []);

  const tanganiLoginAdmin = (e) => {
    e.preventDefault();
    if (inputKunciAdmin === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setStatusAdmin(true);
      localStorage.setItem('rfx_admin_auth', 'true');
      setInputKunciAdmin('');
    } else {
      alert("Kunci salah!");
    }
  };

  // --- CRUD SUPABASE ---
  const tanganiHapusKarya = async (id) => {
    if (!statusAdmin || !window.confirm("Yakin hapus karya ini?")) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      setDaftarKarya(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSimpanSubKategori = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: subKatBaru.name,
        parent_category: subKatBaru.parent_category,
        cover_image: subKatBaru.cover_image
      };
      if (idEdit) {
        const { error } = await supabase.from('subcategories').update(payload).eq('id', idEdit);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subcategories').insert([payload]);
        if (error) throw error;
      }
      await refreshData();
      setSubKatBaru({ name: '', parent_category: 'video', cover_image: '' });
      setIdEdit(null);
      alert("Sub kategori berhasil disimpan!");
    } catch (err) { alert(err.message); }
  };

  const tanganiHapusSubKategori = async (id) => {
    if (!window.confirm("Hapus sub kategori ini? (Karya di dalamnya akan masuk ke 'Lainnya')")) return;
    try {
      await supabase.from('subcategories').delete().eq('id', id);
      await refreshData();
    } catch (err) { alert(err.message); }
  };

  const handleSimpanItem = async (e) => {
    e.preventDefault();
    const payload = {
      title: itemBaru.title,
      category: itemBaru.category,
      subcategory_id: itemBaru.subcategory_id ? parseInt(itemBaru.subcategory_id) : null,
      image: itemBaru.image,
      description: itemBaru.description,
      youtubeUrl: itemBaru.youtubeUrl || '',
    };
    try {
      if (idEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', idEdit);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }
      await refreshData();
      setItemBaru({ title: '', category: 'video', subcategory_id: '', image: '', description: '', youtubeUrl: '' });
      setIdEdit(null);
      alert("Berhasil dipublikasikan!");
    } catch (err) {
      console.error('handleSimpanItem error:', err);
      alert("Gagal simpan: " + (err.message || JSON.stringify(err)));
    }
  };

  const handleSimpanConfig = async () => {
    try {
      await supabase.from('site_config').upsert({ id: 1, ...configSitus });
      await refreshData();
      alert("Tampilan tersimpan!");
    } catch (err) { alert(err.message); }
  };

  const handleSimpanInstagram = async () => {
    try {
      const payload = { id: 1, ...instagramConfig };
      try {
        payload.igFeedPosts = Array.isArray(instagramConfig.igFeedPosts) ? JSON.stringify(instagramConfig.igFeedPosts) : instagramConfig.igFeedPosts;
      } catch (e) { payload.igFeedPosts = instagramConfig.igFeedPosts; }
      
      const { data, error } = await supabase.from('instagram_config').upsert(payload).select().single();
      if (error) throw error;
      
      let feedPosts = data?.igFeedPosts;
      if (typeof feedPosts === 'string') {
        try { feedPosts = JSON.parse(feedPosts); } catch { feedPosts = []; }
      }
      
      setInstagramConfig(prev => ({ ...prev, ...data, igFeedPosts: Array.isArray(feedPosts) ? feedPosts : [] }));
      alert("Instagram tersimpan!");
      return true;
    } catch (err) { alert(err.message); return false; }
  };

  const batalEdit = () => {
    setItemBaru({ title: '', category: 'video', subcategory_id: '', image: '', description: '', youtubeUrl: '' });
    setIdEdit(null);
  };

  const handleSimpanSkill = async (skillData, editId, onSuccess) => {
    try {
      if (editId) {
        await supabase.from('skills').update(skillData).eq('id', editId);
      } else {
        await supabase.from('skills').insert([skillData]);
      }
      await refreshData(); 
      if(onSuccess) onSuccess(); 
      alert("Skill saved!");
    } catch (err) { alert(err.message); }
  };

  const tanganiHapusSkill = async (id) => {
    if (!window.confirm("Delete skill?")) return;
    try {
      await supabase.from('skills').delete().eq('id', id);
      setSkills(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  const tanganiHapusPricelist = async (id) => {
    if (!statusAdmin || !window.confirm("Yakin hapus kategori pricelist ini?")) return;
    try {
      await supabase.from('pricelists').delete().eq('id', id);
      setDaftarPricelist(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSimpanPricelist = async (payload, isEditId) => {
    try {
      if (isEditId) {
        const { error } = await supabase.from('pricelists').update(payload).eq('id', isEditId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pricelists').insert([payload]);
        if (error) throw error;
      }
      await refreshData();
      alert("Pricelist berhasil disimpan!");
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  const handleSimpanExperience = async (expData, editId, onSuccess) => {
    try {
      if (editId) {
        await supabase.from('experiences').update(expData).eq('id', editId);
      } else {
        await supabase.from('experiences').insert([expData]);
      }
      await refreshData(); 
      if(onSuccess) onSuccess(); 
      alert("Experience saved!");
    } catch (err) { alert(err.message); }
  };

  const tanganiHapusExperience = async (id) => {
    if (!window.confirm("Delete journey?")) return;
    try {
      await supabase.from('experiences').delete().eq('id', id);
      setExperiences(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSimpanWebsite = async (webData, editId, onSuccess) => {
    try {
      const payload = { title: webData.title, link_web: webData.link_web, link_preview: webData.link_preview };
      if (editId) {
        const { error } = await supabase.from('websites').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('websites').insert([payload]);
        if (error) throw error;
      }
      await refreshData(); 
      if (onSuccess) onSuccess(); 
      alert("Website saved!");
    } catch (err) { alert("Error saving website: " + (err.message || JSON.stringify(err))); }
  };

  const tanganiHapusWebsite = async (id) => {
    if (!statusAdmin || !window.confirm("Hapus website ini?")) return;
    try {
      const { error } = await supabase.from('websites').delete().eq('id', id);
      if (error) throw error;
      setDaftarWebsite(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSimpanArtikel = async (payload, isEditId) => {
    try {
      if (isEditId) {
        const { error } = await supabase.from('artikel').update(payload).eq('id', isEditId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artikel').insert([payload]);
        if (error) throw error;
      }
      await refreshData();
      alert("Artikel berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan artikel. Pastikan tabel 'artikel' sudah ada di Supabase. Error: " + err.message);
      throw err;
    }
  };

  const tanganiHapusArtikel = async (id) => {
    if (!statusAdmin || !window.confirm("Hapus artikel ini?")) return;
    try {
      const { error } = await supabase.from('artikel').delete().eq('id', id);
      if (error) throw error;
      setDaftarArtikel(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <>
      <TransitionEffect />
      <PanelAdmin
        isAdminRoute={true}
        modalAdminBuka={modalAdminBuka} setModalAdminBuka={setModalAdminBuka}
        statusAdmin={statusAdmin} setStatusAdmin={setStatusAdmin}
        inputKunciAdmin={inputKunciAdmin} setInputKunciAdmin={setInputKunciAdmin}
        tanganiLoginAdmin={tanganiLoginAdmin} tabAdmin={tabAdmin} setTabAdmin={setTabAdmin}
        itemBaru={itemBaru} setItemBaru={setItemBaru}
        idEdit={idEdit} setIdEdit={setIdEdit} batalEdit={batalEdit}
        tanganiHapusKarya={tanganiHapusKarya} handleSimpanItem={handleSimpanItem}
        daftarKarya={daftarKarya}
        daftarSubKategori={daftarSubKategori}
        subKatBaru={subKatBaru} setSubKatBaru={setSubKatBaru}
        handleSimpanSubKategori={handleSimpanSubKategori} tanganiHapusSubKategori={tanganiHapusSubKategori}
        configSitus={configSitus} setConfigSitus={setConfigSitus} handleSimpanConfig={handleSimpanConfig}
        instagramConfig={instagramConfig} setInstagramConfig={setInstagramConfig} handleSimpanInstagram={handleSimpanInstagram}
        skills={skills} setSkills={setSkills} experiences={experiences} setExperiences={setExperiences}
        handleSimpanSkill={handleSimpanSkill} tanganiHapusSkill={tanganiHapusSkill}
        handleSimpanExperience={handleSimpanExperience} tanganiHapusExperience={tanganiHapusExperience}
        daftarWebsite={daftarWebsite} handleSimpanWebsite={handleSimpanWebsite} tanganiHapusWebsite={tanganiHapusWebsite}
        daftarPricelist={daftarPricelist} handleSimpanPricelist={handleSimpanPricelist} tanganiHapusPricelist={tanganiHapusPricelist}
        daftarArtikel={daftarArtikel} handleSimpanArtikel={handleSimpanArtikel} tanganiHapusArtikel={tanganiHapusArtikel}
      />
    </>
  );
};

export default AdminContent;
