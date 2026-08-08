import Button from '@/components/common/Button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SocialAuth = () => {
  return (
    <>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg" type="button" className="gap-2">
          <FcGoogle className="h-5 w-5" />
          Google
        </Button>
        <Button variant="outline" size="lg" type="button" className="gap-2">
          <FaGithub className="h-5 w-5" />
          GitHub
        </Button>
      </div>
    </>
  );
};
export default SocialAuth;
