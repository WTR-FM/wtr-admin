import React, { useEffect, useMemo, useState } from "react";
import { useRecord, BasePropertyProps } from "adminjs";
import { Box, Button, Label, Select, Icon, Input, fontSizes } from "@adminjs/design-system";

const genreOptions = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hiphop", label: "Hip-Hop" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "electronic", label: "Electronic" },
];

const GenreSlotsEdit: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange } = props;

  // Parse the flattened slots data from record params
  const parseInitialSlots = useMemo(() => {
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

  const [slots, setSlots] = useState<string[][]>(parseInitialSlots);

  useEffect(() => {
    onChange(property.path, slots);
  }, [slots, onChange, property.path]);

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTeamSize = parseInt(e.target.value);
    const oldTeamSize = slots.length;
    if (newTeamSize > oldTeamSize) {
      setSlots([...slots, ...Array.from({ length: newTeamSize - oldTeamSize }, () => [])]);
    } else {
      setSlots(slots.slice(0, newTeamSize));
    }
  };

  const handleAddSlot = () => {
    setSlots([...slots, []]);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
  };

  const handleSelectChange = (values: any, index: number) => {
    const updated = [...slots.map(slot => Array.isArray(slot) ? [...slot] : [])];
    updated[index] = values.map((v: any) => v.value);
    setSlots(updated);
  };

  return (
    <Box style={{ marginBottom: '24px' }}>
      <Label style={{ marginBottom: '8px', display: 'block' }}>Slots</Label>

      <Box variant="grey" style={{ padding: '20px' }}>
        <Box style={{ marginBottom: '20px' }}>
          <Label style={{ marginBottom: '8px', display: 'block' }}>Team Size</Label>
          <Input
            type="number"
            value={slots.length}
            onChange={handleTeamSizeChange}
            style={{ maxWidth: '150px' }}
          />
        </Box>

        <Box style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {slots.map((slot, index) => (
            <Box key={index} style={{ marginBottom: '16px' }}>
              <Label style={{ marginBottom: '8px', display: 'block' }}>
                Slot {index + 1}
              </Label>
              <Box display="flex" alignItems="center" gap="sm" style={{ width: '100%' }}>
                <Box style={{ flex: 1 }}>
                  <Select
                    isMulti
                    options={genreOptions}
                    value={Array.isArray(slot) ? slot.map((s) => ({ value: s, label: s })) : []}
                    onChange={(values) => handleSelectChange(values, index)}
                  />
                </Box>
                <Button
                  type="button"
                  variant="text"
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveSlot(index)}
                  style={{ flexShrink: 0 }}
                >
                  <Icon icon="X" />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleAddSlot}
        >
          + Add Slots
        </Button>
      </Box>
    </Box>
  );
};

export default GenreSlotsEdit;