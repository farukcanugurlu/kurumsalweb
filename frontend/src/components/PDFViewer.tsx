import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Card, Spin, Alert, Space } from 'antd';
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons';

// PDF.js worker'ı ayarla
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title = "PDF Dökümanı" }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false); // Direkt iframe göster
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(true); // Direkt iframe kullan

  // PDF URL'sini tam yol haline getir
  const getFullPdfUrl = () => {
    if (pdfUrl.startsWith('http')) {
      return pdfUrl;
    }
    // Eğer relative path ise, backend URL'sini ekle
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const portSuffix = port ? `:${port}` : '';
    const backendUrl = `${protocol}//${hostname}${portSuffix}`;
    return `${backendUrl}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
  };

  const fullPdfUrl = getFullPdfUrl();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setUseIframe(true);
    setLoading(false);
    setError(null);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const openInNewTab = () => {
    window.open(fullPdfUrl, '_blank');
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = fullPdfUrl;
    link.download = title;
    link.target = '_blank'; // Yeni sekmede indirme
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📄 {title}</span>
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={downloadPDF}
              size="small"
            >
              İndir
            </Button>
            <Button 
              icon={<LinkOutlined />} 
              onClick={openInNewTab}
              size="small"
              type="primary"
            >
              Yeni Sekmede Aç
            </Button>
          </Space>
        </div>
      }
      style={{ marginTop: 16 }}
    >
      {error && (
        <Alert
          message="PDF Yükleme Hatası"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => window.location.reload()}>
                Yeniden Dene
              </Button>
              <Button size="small" type="primary" onClick={openInNewTab}>
                Yeni Sekmede Aç
              </Button>
            </Space>
          }
        />
      )}

      {useIframe ? (
        <div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>PDF yükleniyor...</div>
            </div>
          )}
          
          {!error && (
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '8px', 
              overflow: 'hidden',
              marginBottom: 16,
              backgroundColor: '#f5f5f5'
            }}>
              <iframe
                src={fullPdfUrl}
                width="100%"
                height="600px"
                style={{ border: 'none' }}
                title={title}
                loading="eager"
                onLoad={() => {
                  setLoading(false);
                  setError(null);
                }}
                onError={() => {
                  setError('PDF dosyası yüklenemedi. Lütfen yeni sekmede açmayı deneyin.');
                  setLoading(false);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>PDF yükleniyor...</div>
            </div>
          )}
          
          {!loading && !error && (
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '8px', 
              overflow: 'hidden',
              marginBottom: 16,
              backgroundColor: '#f5f5f5',
              textAlign: 'center'
            }}>
              <Document
                file={fullPdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>PDF yükleniyor...</div>
                  </div>
                }
                error={
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Alert
                      message="PDF Yüklenemedi"
                      description="PDF dosyası yüklenirken bir hata oluştu. Lütfen yeni sekmede açmayı deneyin."
                      type="error"
                      showIcon
                      action={
                        <Button size="small" type="primary" onClick={openInNewTab}>
                          Yeni Sekmede Aç
                        </Button>
                      }
                    />
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={Math.min(800, window.innerWidth - 100)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div style={{ padding: '40px 0' }}>
                      <Spin size="large" />
                      <div style={{ marginTop: 16 }}>Sayfa yükleniyor...</div>
                    </div>
                  }
                  error={
                    <div style={{ padding: '20px', color: '#ff4d4f' }}>
                      Sayfa yüklenemedi
                    </div>
                  }
                />
              </Document>
            </div>
          )}
        </div>
      )}

      {!useIframe && numPages && numPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 16,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            size="small"
          >
            ← Önceki
          </Button>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Sayfa {pageNumber} / {numPages}
          </span>
          <Button 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages}
            size="small"
          >
            Sonraki →
          </Button>
        </div>
      )}

    </Card>
  );
};

export default PDFViewer;