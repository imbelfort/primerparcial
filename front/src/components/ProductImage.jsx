import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

export const ProductImage = ({ src, alt, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Resetear el estado de error cuando cambia la fuente
    setImageError(false);
    
    if (!src) {
      setImageUrl('');
      return;
    }
    
    // Construir la URL completa si es necesario
    const fullUrl = src.startsWith('http') ? src : `http://127.0.0.1:8000${src}`;
    setImageUrl(fullUrl);
  }, [src]);

  // Si hay un error o no hay URL, mostrar el placeholder
  if (imageError || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl border h-96 ${className}`}>
        <Package size={64} className="text-gray-300" />
      </div>
    );
  }

  // Si hay una URL válida, mostrar la imagen
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover rounded-xl border border-gray-200 shadow ${className}`}
      onError={() => setImageError(true)}
    />
  );
};
