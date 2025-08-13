import useSettingStore from '@/common/store/useSettingStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

function SpacingSelector() {
  const setting = useSettingStore((state) => state.setting);

  const updateSetting = useSettingStore((state) => state.updateSetting);

  const handleSpacingSelection = async (value: string) => {
    let viewingOption = { ...setting!.viewingOption };
    viewingOption.spacing = value;

    await updateSetting({ viewingOption });
  };

  return (
    <Select
      value={setting?.viewingOption?.spacing ?? 'normal'}
      onValueChange={handleSpacingSelection}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Spacing" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="compact">Compact</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default SpacingSelector;
