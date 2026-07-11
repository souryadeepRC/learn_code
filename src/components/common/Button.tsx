import { Button as TButton } from '@/components/ui/button';

type ButtonProps = React.ComponentProps<typeof TButton> & {
  title?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  title,
  leftIcon,
  rightIcon,
  children,
  type = 'button',
  ...props
}) => {
  return (
    <TButton type={type} {...props}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {title ?? children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </TButton>
  );
};

export default Button;
