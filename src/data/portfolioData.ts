import { PortfolioItem } from '../types';
import { localAssets } from '../assets';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- MURALES ---
  {
    id: 'mural-dulceria',
    title: 'Mural Comercial Dulcería Típica',
    category: 'murales',
    categoryLabel: 'Murales',
    image: localAssets.murales.dulceria,
    description: 'Intervención mural vibrante y llena de color para establecimiento comercial en Tampico. Diseñada para generar identidad de marca y un punto fotográfico irresistible.',
    tags: ['Comercial', 'Ilustración', 'Gran Formato', 'Branding'],
    details: {
      dimensions: '4.5m x 2.8m',
      technique: 'Acrílico sobre muro con sellador UV mate',
      curatedTag: 'Destacado Comercial',
    },
  },
  {
    id: 'mural-hojas',
    title: 'Mural Botánico Orgánico & Follaje',
    category: 'murales',
    categoryLabel: 'Murales',
    image: localAssets.murales.hojas,
    description: 'Composición mural botánica envolvente inspirada en la vegetación tropical, aportando frescura, profundidad y un ambiente de serenidad en interiores.',
    tags: ['Botánico', 'Espacios Vivos', 'Naturaleza', 'Interiores'],
    details: {
      dimensions: '5.0m x 3.2m',
      technique: 'Técnica mixta, acrílico artístico y veladuras',
      curatedTag: 'Ambiente Natural',
    },
  },
  {
    id: 'mural-minerva',
    title: 'Mural Identitario Minerva Tampico',
    category: 'murales',
    categoryLabel: 'Murales',
    image: localAssets.murales.minerva,
    description: 'Pieza artística de carácter urbano y cultural ubicada en la zona Minerva de Tampico, conjugando contrastes tonales dinámicos y narrativa gráfica.',
    tags: ['Tampico', 'Minerva', 'Cultura', 'Arte Urbano'],
    details: {
      dimensions: '3.8m x 2.4m',
      technique: 'Acrílico de alta resistencia climática',
      curatedTag: 'Urbano & Cultural',
    },
  },

  // --- DISEÑO DE ROPA ---
  {
    id: 'ropa-taylor',
    title: "Chamarra Denim 'The Eras Tour Tribute'",
    category: 'ropa',
    categoryLabel: 'Diseño de Ropa',
    image: localAssets.ropa.taylor,
    description: 'Customización integral sobre chamarra de mezclilla inspirada en la icónica gira musical, con detalles hiperdetallados y resistencia al uso continuo.',
    tags: ['Eras Tour', 'Custom Denim', 'Wearable Art', 'Colección'],
    details: {
      dimensions: 'Chamarra Denim Vintage Talla M',
      technique: 'Pintura textil termo-fijada indeleble',
      curatedTag: 'Pieza de Autor',
    },
  },
  {
    id: 'ropa-concierto',
    title: "Chamarra Denim 'Concert Tour Edition'",
    category: 'ropa',
    categoryLabel: 'Diseño de Ropa',
    image: localAssets.ropa.concierto,
    description: 'Intervención artesanal en la espalda con diseño de alta energía y tipografía personalizada concebida especialmente para lucir en festivales.',
    tags: ['Música en Vivo', 'Chamarra Custom', 'Hecho a Mano'],
    details: {
      dimensions: 'Mezclilla pesada 14oz Talla L',
      technique: 'Pintura textil profesional lavable',
      curatedTag: 'Exclusivo',
    },
  },
  {
    id: 'ropa-general',
    title: 'Colección Indumentaria Textil Nahocraft',
    category: 'ropa',
    categoryLabel: 'Diseño de Ropa',
    image: localAssets.ropa.general,
    description: 'Diseño y confección artística con detalles de ilustración a mano alzada. Cada prenda es concebida como un lienzo portable con personalidad propia.',
    tags: ['Moda Lenta', 'Arte Portable', 'Tampico Creativo'],
    details: {
      dimensions: 'Prenda personalizada a medida',
      technique: 'Acuarela textil y pigmentos indelebles',
      curatedTag: 'Edición Limitada',
    },
  },

  // --- TOTEBAGS ---
  {
    id: 'totebag-cenicienta',
    title: "Tote Bag de Lienzo 'Cinderella Dreams'",
    category: 'totebags',
    categoryLabel: 'Totebags',
    image: localAssets.totebags.cenicienta,
    description: 'Bolso utilitario ecológico confeccionado en loneta gruesa 100% algodón, ilustrado artesanalmente con trazos delicados y colores que perduran.',
    tags: ['Eco-friendly', 'Lienzo Algodón', 'Pintado a Mano'],
    details: {
      dimensions: '38 cm x 42 cm (Asas reforzadas)',
      technique: 'Pigmentos textiles de máxima durabilidad',
      curatedTag: 'Best Seller',
    },
  },
  {
    id: 'totebag-princesa',
    title: "Tote Bag Ilustrada 'Royal Portrait'",
    category: 'totebags',
    categoryLabel: 'Totebags',
    image: localAssets.totebags.princesa,
    description: 'Accesorio de arte portable con retrato estilizado y detalles florales. Ideal para el día a día, libros, laptop y salidas casuales con estilo propio.',
    tags: ['Ilustración', 'Artesanal', 'Tampico'],
    details: {
      dimensions: '38 cm x 42 cm',
      technique: 'Ilustración manual sobre loneta natural',
      curatedTag: 'Diseño Original',
    },
  },
  {
    id: 'totebag-rana',
    title: "Tote Bag de Autor 'Tiana & El Loto'",
    category: 'totebags',
    categoryLabel: 'Totebags',
    image: localAssets.totebags.rana,
    description: 'Pieza inspirada en leyendas y cuentos mágicos con una armonía de verdes esmeralda y detalles en oro acrílico textil.',
    tags: ['Cuentos', 'Arte Cotidiano', 'Sostenible'],
    details: {
      dimensions: '40 cm x 40 cm',
      technique: 'Pintura textil con acabado suave al tacto',
      curatedTag: 'Favorito del Taller',
    },
  },
];
