import React from 'react';

interface Props extends React.PropsWithChildren {
  title: string;
  description?: string | React.ReactNode;
}

function SettingItem({ title, description, children }: Props) {
  return (
    <div className="flex h-28 items-center justify-between">
      <div className="w-2/3 grid gap-1">
        <p className="text-base font-bold">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-1/3 text-center">{children}</div>
    </div>
  );
}

export default SettingItem;
