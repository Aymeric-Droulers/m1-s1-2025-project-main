import { useState } from 'react'

interface SafeImageProps {
  src?: string
  alt?: string
  size?: number
  style?: React.CSSProperties
}

export function SafeImage({ src, alt, size = 50, style }: SafeImageProps) {
  const [error, setError] = useState(false)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: '#ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setError(true)}
        />
      ) : (
        <span style={{ color: '#777', fontSize: 10 }}>no image</span>
      )}
    </div>
  )
}
