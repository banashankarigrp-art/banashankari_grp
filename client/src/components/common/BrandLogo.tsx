import React from 'react';
import { BrandBadge } from './BrandBadge';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  return <BrandBadge size={size} className={className} />;
};

export { BrandBadge };
