import React, { useMemo } from "react";
import { BasePropertyProps } from "adminjs";
import { Box, Badge, Label, Text } from "@adminjs/design-system";

const GenreSlotsShow: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;

  // Parse the flattened slots data from record params
  const parsedSlots = useMemo(() => {
    const params = record?.params || {};
    const slotsMap: { [key: number]: string[] } = {};
    
    // Find all slots.x.y keys and parse them
    Object.keys(params).forEach(key => {
      const match = key.match(/^slots\.(\d+)\.(\d+)$/);
      if (match) {
        const slotIndex = parseInt(match[1]);
        const genreIndex = parseInt(match[2]);
        
        if (!slotsMap[slotIndex]) {
          slotsMap[slotIndex] = [];
        }
        slotsMap[slotIndex][genreIndex] = params[key];
      }
    });
    
    // Convert to array format, ensuring no gaps
    const maxSlotIndex = Math.max(-1, ...Object.keys(slotsMap).map(k => parseInt(k)));
    const slotsArray: string[][] = [];
    
    for (let i = 0; i <= maxSlotIndex; i++) {
      slotsArray[i] = slotsMap[i] || [];
    }
    
    return slotsArray;
  }, [record?.params]);

  if (!parsedSlots.length) {
    return (
      <Box>
        <Text color="grey60">No slots configured</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box style={{ marginBottom: '12px' }}>
        <Text variant="sm" color="grey60">
          Team Size: {parsedSlots.length}
        </Text>
      </Box>
      
      <Box style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '12px'
      }}>
        {parsedSlots.map((slot, index) => (
          <Box 
            key={index}
            style={{
              padding: '12px',
              border: '1px solid #e1e5e9',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <Label style={{ marginBottom: '8px', display: 'block', fontSize: '14px' }}>
              Slot {index + 1}
            </Label>
            
            {slot.length > 0 ? (
              <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {slot.map((genre, genreIndex) => (
                  <Badge 
                    key={genreIndex}
                    variant="primary"
                    size="sm"
                  >
                    {genre}
                  </Badge>
                ))}
              </Box>
            ) : (
              <Text variant="sm" color="grey60">
                No genres selected
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GenreSlotsShow;