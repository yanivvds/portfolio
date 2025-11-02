import React, { useState } from 'react';

interface Technology {
  name: string;
  category?: string;
  icon?: string;
  icon_url?: string;
}

interface TechStackVisualizationProps {
  technologies: Technology[];
  title: string;
  isDarkMode: boolean;
}

const TechStackVisualization: React.FC<TechStackVisualizationProps> = ({
  technologies,
  title,
  isDarkMode
}) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (iconUrl: string) => {
    setFailedImages(prev => new Set(prev).add(iconUrl));
  };

  // Group technologies by category for better organization
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    const category = tech.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  // Define category colors and order
  const categoryConfig = {
    'Frontend': { color: '#61DAFB', order: 1 },
    'Backend': { color: '#68D391', order: 2 },
    'Language': { color: '#F6AD55', order: 3 },
    'Database': { color: '#9F7AEA', order: 4 },
    'Cloud': { color: '#4FD1C7', order: 5 },
    'Tools': { color: '#FC8181', order: 6 },
    'Other': { color: '#A0AEC0', order: 7 }
  };

  const sortedCategories = Object.keys(groupedTechnologies).sort((a, b) => {
    const orderA = categoryConfig[a as keyof typeof categoryConfig]?.order || 999;
    const orderB = categoryConfig[b as keyof typeof categoryConfig]?.order || 999;
    return orderA - orderB;
  });

  const renderTechIcon = (tech: Technology) => {
    const hasValidIconUrl = tech.icon_url && !failedImages.has(tech.icon_url);
    
    if (hasValidIconUrl) {
      return (
        <img 
          src={tech.icon_url} 
          alt={`${tech.name} icon`} 
          style={{ 
            width: 18, 
            height: 18, 
            borderRadius: 3,
            objectFit: 'contain'
          }}
          onError={() => handleImageError(tech.icon_url!)}
        />
      );
    }

    // Fallback to text-based icon or first letter
    const fallbackIcon = tech.icon || tech.name.charAt(0).toUpperCase();
    return (
      <span style={{ 
        fontSize: 14, 
        fontWeight: 600,
        color: isDarkMode ? '#e9d5ff' : '#4c1d95'
      }}>
        {fallbackIcon}
      </span>
    );
  };

  return (
    <div style={{
      margin: '12px 0',
      padding: '16px',
      background: isDarkMode ? 'rgba(17,24,39,0.6)' : '#fff',
      borderRadius: '12px',
      boxShadow: isDarkMode ? '0 8px 32px rgba(15,23,42,0.6)' : '0 8px 32px rgba(15,23,42,0.08)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.06)'}`
    }}>
      <h4 style={{ 
        margin: '0 0 16px 0', 
        color: isDarkMode ? '#e9d5ff' : '#7c3aed', 
        fontSize: '16px',
        fontWeight: 600
      }}>
        {title}
      </h4>

      {sortedCategories.length > 1 ? (
        // Organized by categories
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedCategories.map(category => {
            const categoryColor = categoryConfig[category as keyof typeof categoryConfig]?.color || '#A0AEC0';
            
            return (
              <div key={category}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {category}
                </div>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px'
                }}>
                  {groupedTechnologies[category].map((tech, index) => (
                    <div key={`${category}-${index}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      background: isDarkMode 
                        ? `rgba(${parseInt(categoryColor.slice(1,3), 16)}, ${parseInt(categoryColor.slice(3,5), 16)}, ${parseInt(categoryColor.slice(5,7), 16)}, 0.08)`
                        : `rgba(${parseInt(categoryColor.slice(1,3), 16)}, ${parseInt(categoryColor.slice(3,5), 16)}, ${parseInt(categoryColor.slice(5,7), 16)}, 0.1)`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isDarkMode ? '#e9d5ff' : '#1f2937',
                      border: `1px solid ${isDarkMode 
                        ? `rgba(${parseInt(categoryColor.slice(1,3), 16)}, ${parseInt(categoryColor.slice(3,5), 16)}, ${parseInt(categoryColor.slice(5,7), 16)}, 0.2)`
                        : `rgba(${parseInt(categoryColor.slice(1,3), 16)}, ${parseInt(categoryColor.slice(3,5), 16)}, ${parseInt(categoryColor.slice(5,7), 16)}, 0.2)`}`,
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                        borderRadius: '4px',
                        flexShrink: 0
                      }}>
                        {renderTechIcon(tech)}
                      </div>
                      <span style={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Simple grid layout for single category or uncategorized
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px'
        }}>
          {technologies.map((tech, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: isDarkMode ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: isDarkMode ? '#e9d5ff' : '#4c1d95',
              border: `1px solid ${isDarkMode ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.2)'}`,
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}>
              <div style={{
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
                borderRadius: '6px',
                flexShrink: 0
              }}>
                {renderTechIcon(tech)}
              </div>
              <span style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechStackVisualization;