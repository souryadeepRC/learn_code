# Reference: Form Pattern (react-hook-form + Zod + TanStack)

## Rules
- Use `useForm<T>({ resolver: zodResolver(schema), mode: 'onTouched' })` for every form.
- Schema is imported from `src/schema/`. Never define validation inline in a component.
- Types are inferred: `z.infer<typeof loginSchema>` — never duplicate type definitions.
- Bind fields using `{...register('fieldName')}`.
- Field errors rendered with `aria-describedby`, `aria-invalid`, `role="alert"`.
- Submit button uses `isLoading` (TanStack v4) to show spinner and disable.
- API errors displayed in a top-level banner with `role="alert"` and `aria-live="assertive"`.

---

## Canonical form example — `LoginForm.tsx`

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuAlertCircle, LuLoader2 } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-login';
import { loginSchema } from '@/schema/auth';
import type { LoginCredentials } from '@/types/auth';
import { cn } from '@/utils/cn';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const { mutate: login, isLoading, error: apiError, isError } = useLogin();
  const isBusy = isLoading || isSubmitting;

  return (
    <div className='space-y-6'>
      {/* API error banner */}
      {isError && apiError?.message && (
        <div role='alert' aria-live='assertive' className='rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
          <LuAlertCircle className='inline h-4 w-4 mr-1.5' aria-hidden='true' />
          {apiError.message}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => login(d))} noValidate>
        <div className='space-y-1'>
          <Label htmlFor='login-email'>Email</Label>
          <Input
            id='login-email'
            type='email'
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-err' : undefined}
            className={cn(errors.email && 'border-destructive')}
            {...register('email')}
          />
          {errors.email && (
            <p id='email-err' role='alert' className='text-xs text-destructive'>
              {errors.email.message}
            </p>
          )}
        </div>

        <Button type='submit' className='w-full mt-4' disabled={isBusy} aria-busy={isBusy}>
          {isBusy ? <LuLoader2 className='h-4 w-4 animate-spin' aria-hidden='true' /> : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
```
