import useSettingStore from '@/common/store/useSettingStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

function ColumnsSelector() {
  const setting = useSettingStore((state) => state.setting);

  const updateSetting = useSettingStore((state) => state.updateSetting);

  const columns = setting!.viewingOption.imageColumns ?? 3;

  const handleColumnsSelection = async (value: String) => {
    let viewingOption = { ...setting!.viewingOption };
    viewingOption.imageColumns = Number(value);

    await updateSetting({ viewingOption });
  };

  return (
    <Select value={String(columns)} onValueChange={handleColumnsSelection}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Items per Row" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Image Columns per Row</SelectLabel>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
            <SelectItem key={value} value={String(value)}>
              {value} items
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ColumnsSelector;
