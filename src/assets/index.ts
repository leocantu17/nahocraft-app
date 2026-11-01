import logoImage from '../public/logoNahocraft.jpg';
import muralDulceria from '../public/murales/mural dulceria.png';
import muralHojas from '../public/murales/mural hojas.png';
import muralMinerva from '../public/murales/mural minerva.png';

// URLs públicas oficiales alojadas en Supabase Storage (Bucket: nahocraft-media)
export const supabaseMediaUrls = {
  murales: {
    dulceria:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/murales/mural-dulceria.png',
    hojas:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/murales/mural-hojas.png',
    minerva:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/murales/mural-minerva.png',
  },
  cursos: {
    muralismoColor:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/cursos/curso-muralismo-color.png',
    botanicoAcrilico:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/cursos/curso-botanico-acrilico.png',
  },
  estudio: {
    tallerMinerva:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/estudio/taller-minerva-portada.png',
  },
  sobreMi: {
    logo:
      'https://yvlpfkrppzundpluvubk.supabase.co/storage/v1/object/public/nahocraft-media/sobre-mi/logoNahocraft.jpg',
  },
};

export const localAssets = {
  logo: supabaseMediaUrls.sobreMi.logo || logoImage,
  murales: {
    dulceria: supabaseMediaUrls.murales.dulceria || muralDulceria,
    hojas: supabaseMediaUrls.murales.hojas || muralHojas,
    minerva: supabaseMediaUrls.murales.minerva || muralMinerva,
  },
  cursos: supabaseMediaUrls.cursos,
  estudio: supabaseMediaUrls.estudio,
};
