import Button from '@/components/common/Button';
import type { ComponentType } from 'react';

interface Props {
  Icon?: ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: React.ComponentProps<typeof Button>;
}

const EmptyBox: React.FC<Props> = ({
  Icon: IconComponent,
  title,
  description,
  action,
}) => {
  return (
    <div className="py-16 text-center space-y-2 max-w-[80%] mx-auto">
      {IconComponent && (
        <IconComponent className="w-12 h-12 mx-auto text-muted-foreground" />
      )}
      <p className="text-sm font-medium text-foreground mt-4 ">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      {action && <Button className="gap-2 mx-auto mt-4" {...action} />}
    </div>
  );
};

export default EmptyBox;
