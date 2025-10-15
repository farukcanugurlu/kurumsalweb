import React from 'react';
import { Card, CardProps } from 'antd';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface ProfessionalCardProps extends CardProps {
  children: React.ReactNode;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'slide' | 'rotate';
  animationDirection?: 'up' | 'down' | 'left' | 'right' | 'scale';
  animationDelay?: number;
  className?: string;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  children,
  hoverEffect = 'lift',
  animationDirection = 'up',
  animationDelay = 0,
  className = '',
  ...cardProps
}) => {
  const getHoverStyle = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          transition: 'all 0.3s ease',
          ':hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          }
        };
      case 'scale':
        return {
          transition: 'all 0.3s ease',
          ':hover': {
            transform: 'scale(1.03)'
          }
        };
      case 'glow':
        return {
          transition: 'all 0.3s ease',
          ':hover': {
            boxShadow: '0 0 20px rgba(30, 58, 138, 0.3)'
          }
        };
      case 'slide':
        return {
          transition: 'all 0.3s ease',
          ':hover': {
            transform: 'translateX(8px)'
          }
        };
      case 'rotate':
        return {
          transition: 'all 0.3s ease',
          ':hover': {
            transform: 'rotate(2deg)'
          }
        };
      default:
        return {};
    }
  };

  return (
    <ScrollReveal direction={animationDirection} delay={animationDelay}>
      <motion.div
        whileHover={
          hoverEffect === 'lift' ? { y: -8 } :
          hoverEffect === 'scale' ? { scale: 1.03 } :
          hoverEffect === 'slide' ? { x: 8 } :
          hoverEffect === 'rotate' ? { rotate: 2 } :
          {}
        }
        transition={{ duration: 0.3 }}
        style={getHoverStyle()}
      >
        <Card
          {...cardProps}
          className={`professional-card ${className}`}
          style={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            transition: 'all 0.3s ease',
            ...cardProps.style
          }}
        >
          {children}
        </Card>
      </motion.div>
    </ScrollReveal>
  );
};

export default ProfessionalCard;
