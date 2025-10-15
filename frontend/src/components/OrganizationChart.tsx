import React, { useState, useEffect } from 'react';
import { Typography, Spin } from 'antd';
import { organizationChartApi } from '../services/api';
import { OrganizationChart as OrgChartType } from '../types';

const { Title } = Typography;

interface OrganizationChartProps {
  className?: string;
}

const OrganizationChart: React.FC<OrganizationChartProps> = ({ className }) => {
  const [chartData, setChartData] = useState<OrgChartType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await organizationChartApi.getAll();
      if (response.data.success) {
        const hierarchy = buildHierarchy(response.data.data);
        setChartData(hierarchy);
      }
    } catch (error) {
      console.error('Organizasyon şeması yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hiyerarşik yapıyı oluştur
  const buildHierarchy = (items: OrgChartType[]): OrgChartType[] => {
    const itemMap = new Map<number, OrgChartType>();
    const rootItems: OrgChartType[] = [];

    // Tüm öğeleri map'e ekle
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Parent-child ilişkilerini kur
    items.forEach(item => {
      const currentItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(currentItem);
      } else {
        rootItems.push(currentItem);
      }
    });

    // DENETİM KURULU'nun altındaki öğeleri kaldır (kardeş öğe olduğu için)
    const denetimKurulu = Array.from(itemMap.values()).find(item => item.title === 'DENETİM KURULU');
    if (denetimKurulu) {
      denetimKurulu.children = [];
    }

    // Sadece GENEL KURUL'u root olarak döndür
    const genelKurul = rootItems.find(item => item.title === 'GENEL KURUL');
    return genelKurul ? [genelKurul] : rootItems;
  };

  // Kutu boyutları ve renkleri - seviyeye göre (kompakt)
  const getBoxStyle = (level: number) => {
    const styles = [
      { width: '200px', height: '60px', fontSize: '16px' }, // Level 0 - Genel Kurul
      { width: '160px', height: '50px', fontSize: '14px' }, // Level 1 - Yönetim/Denetim
      { width: '140px', height: '45px', fontSize: '13px' }, // Level 2 - Başkan/Sekreter
      { width: '120px', height: '40px', fontSize: '12px' }, // Level 3 - Alt organlar
      { width: '100px', height: '35px', fontSize: '11px' }, // Level 4 - Komisyonlar
      { width: '90px', height: '30px', fontSize: '10px' }   // Level 5+ - En alt
    ];
    
    return styles[Math.min(level, styles.length - 1)];
  };

  // Şema öğesini render et
  const renderChartItem = (item: OrgChartType, level: number = 0) => {
    const style = getBoxStyle(level);
    const boxStyle = {
      ...style,
      backgroundColor: level === 0 ? '#1e3a8a' : level === 1 ? '#1e40af' : '#3b82f6',
      color: 'white',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
       padding: level === 0 ? '12px' : '8px',
      boxShadow: level === 0 ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 6px 20px rgba(0, 0, 0, 0.15)',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      fontWeight: 'bold',
      lineHeight: '1.2',
      wordBreak: 'break-word' as const,
      position: 'relative' as const,
      zIndex: 10,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: style.width,
      maxWidth: style.width
    };

    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Ana kutu */}
        <div 
          style={boxStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = level === 0 ? '0 12px 35px rgba(0, 0, 0, 0.25)' : '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = level === 0 ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 6px 20px rgba(0, 0, 0, 0.15)';
          }}
        >
          {item.title}
        </div>

        {/* Alt öğeler */}
        {item.children && item.children.length > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
             marginTop: level === 0 ? '50px' : '40px',
             gap: level === 0 ? '40px' : level === 1 ? '35px' : '30px',
             position: 'relative',
             flexWrap: 'wrap',
             maxWidth: '100%',
             width: '100%'
          }}>
            
            {/* Yatay bağlantı çizgisi - tüm çocukları birleştirir */}
            {item.children.length > 1 && (
              <div style={{
                position: 'absolute',
                top: level === 0 ? '-50px' : '-40px',
                left: '0',
                right: '0',
                height: '3px',
                backgroundColor: '#64748b',
                zIndex: 1
              }} />
            )}
            
            {item.children.map((child, index) => (
              <div key={child.id} style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                {/* Her çocuk için dikey bağlantı çizgisi */}
                <div style={{
                  position: 'absolute',
                  top: level === 0 ? '-50px' : '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3px',
                  height: level === 0 ? '50px' : '40px',
                  backgroundColor: '#64748b',
                  zIndex: 1
                }} />
                
                {/* Ok başlığı */}
                <div style={{
                  position: 'absolute',
                  top: level === 0 ? '-6px' : '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '8px solid #64748b',
                  zIndex: 2
                }} />
                
                {renderChartItem(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 24, fontSize: '18px', color: '#666' }}>
          Organizasyon şeması yükleniyor...
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '24px' }}>📊</div>
        <Title level={3} style={{ color: '#999' }}>Organizasyon şeması bulunamadı</Title>
        <div style={{ fontSize: '16px', color: '#999', marginTop: '16px' }}>
          Admin panelinden organizasyon şeması ekleyebilirsiniz.
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ 
      width: '100%',
      maxWidth: '100%',
      margin: '0',
      padding: '20px',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '0',
      position: 'relative'
    }}>

      {/* Şema Container */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        padding: '60px 0',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {chartData.map((item) => renderChartItem(item, 0))}
      </div>

    </div>
  );
};

export default OrganizationChart;
