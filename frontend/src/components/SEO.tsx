import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Kurumsal Web Sitesi',
  description = 'Kurumsal Web Sitesi - Kurumsal web sitesi şablonu ve yönetim paneli.',
  keywords = 'Kurumsal Web Sitesi, kurumsal web sitesi, şablon, yönetim paneli',
  image = 'https://kurumsalwebsitesi.com/logo512.png',
  url = 'https://kurumsalwebsitesi.com',
  type = 'website'
}) => {
  const fullTitle = title.includes('Kurumsal Web Sitesi') ? title : `${title} | Kurumsal Web Sitesi`;
  const fullUrl = url.startsWith('http') ? url : `https://kurumsalwebsitesi.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://kurumsalwebsitesi.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TÜMORSİAD" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="TÜMORSİAD" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1e3a8a" />
    </Helmet>
  );
};

export default SEO;
