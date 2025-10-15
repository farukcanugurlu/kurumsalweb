import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'article';
  data?: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Kurumsal Web Sitesi",
          "alternateName": "Kurumsal Web Sitesi",
          "url": "https://kurumsalwebsitesi.com",
          "logo": "https://kurumsalwebsitesi.com/logo512.png",
          "description": "Kurumsal web sitesi şablonu ve yönetim paneli",
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "TR",
            "addressLocality": "İstanbul"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Turkish", "English", "Arabic"]
          },
          "sameAs": [
            "https://www.facebook.com/kurumsalwebsitesi",
            "https://www.linkedin.com/company/kurumsalwebsitesi",
            "https://twitter.com/kurumsalwebsitesi"
          ]
        };
      
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Kurumsal Web Sitesi",
          "url": "https://kurumsalwebsitesi.com",
          "description": "Kurumsal web sitesi şablonu ve yönetim paneli",
          "publisher": {
            "@type": "Organization",
            "name": "Kurumsal Web Sitesi"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kurumsalwebsitesi.com/haberler?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
      
      case 'article':
        return data ? {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.summary,
          "image": data.imageUrl ? `https://kurumsalwebsitesi.com${data.imageUrl}` : "https://kurumsalwebsitesi.com/logo512.png",
          "datePublished": data.publishDate,
          "dateModified": data.updatedAt || data.publishDate,
          "author": {
            "@type": "Organization",
            "name": "Kurumsal Web Sitesi"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Kurumsal Web Sitesi",
            "logo": {
              "@type": "ImageObject",
              "url": "https://kurumsalwebsitesi.com/logo512.png"
            }
          }
        } : null;
      
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
