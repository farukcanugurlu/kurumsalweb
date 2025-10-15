import React from 'react';
import { Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const { Title, Paragraph } = Typography;

interface ProfessionalSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  className?: string;
  style?: React.CSSProperties;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  centered?: boolean;
  maxWidth?: number;
}

const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({
  title,
  subtitle,
  children,
  backgroundColor = 'transparent',
  textColor = '#334155',
  titleColor = '#1e3a8a',
  className = '',
  style = {},
  titleLevel = 2,
  centered = true,
  maxWidth = 1200
}) => {
  return (
    <section
      className={`professional-section ${className}`}
      style={{
        backgroundColor,
        color: textColor,
        padding: '80px 0',
        ...style
      }}
    >
      <div style={{ maxWidth, margin: '0 auto', padding: '0 24px' }}>
        <ScrollReveal direction="up" delay={0.2}>
          <div style={{ 
            textAlign: centered ? 'center' : 'left',
            marginBottom: '60px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title
                level={titleLevel}
                style={{
                  color: titleColor,
                  marginBottom: subtitle ? '16px' : '0',
                  background: titleColor === '#1e3a8a' 
                    ? 'linear-gradient(45deg, #1e3a8a, #3b82f6)'
                    : titleColor,
                  WebkitBackgroundClip: titleColor === '#1e3a8a' ? 'text' : 'initial',
                  WebkitTextFillColor: titleColor === '#1e3a8a' ? 'transparent' : 'initial',
                  backgroundClip: titleColor === '#1e3a8a' ? 'text' : 'initial',
                  fontWeight: 700
                }}
              >
                {title}
              </Title>
            </motion.div>
            
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Paragraph
                  style={{
                    fontSize: '18px',
                    color: textColor,
                    opacity: 0.8,
                    maxWidth: '600px',
                    margin: centered ? '0 auto' : '0'
                  }}
                >
                  {subtitle}
                </Paragraph>
              </motion.div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProfessionalSection;
