import React from 'react';
import { Button, ButtonProps } from 'antd';
import { motion } from 'framer-motion';

interface ProfessionalButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'middle' | 'large';
  children: React.ReactNode;
}

const ProfessionalButton: React.FC<ProfessionalButtonProps> = ({
  variant = 'primary',
  size = 'middle',
  children,
  style = {},
  className = '',
  ...buttonProps
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          border: 'none',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)',
          ':hover': {
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          border: 'none',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)',
          ':hover': {
            background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
            boxShadow: '0 6px 20px rgba(100, 116, 139, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      case 'outline':
        return {
          background: 'transparent',
          border: '2px solid #1e3a8a',
          color: '#1e3a8a',
          ':hover': {
            background: '#1e3a8a',
            color: '#ffffff',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(30, 58, 138, 0.3)'
          }
        };
      case 'ghost':
        return {
          background: 'transparent',
          border: 'none',
          color: '#1e3a8a',
          ':hover': {
            background: 'rgba(30, 58, 138, 0.1)',
            color: '#1e40af'
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: '32px',
          padding: '0 16px',
          fontSize: '14px',
          borderRadius: '6px'
        };
      case 'large':
        return {
          height: '48px',
          padding: '0 32px',
          fontSize: '16px',
          borderRadius: '8px'
        };
      default:
        return {
          height: '40px',
          padding: '0 24px',
          fontSize: '15px',
          borderRadius: '8px'
        };
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        {...buttonProps}
        size={size}
        className={`professional-button ${className}`}
        style={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          fontWeight: 600,
          transition: 'all 0.3s ease',
          ...style
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default ProfessionalButton;
