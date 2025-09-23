import { PropsWithChildren } from 'react';
import { useAccess } from '@/hooks/useAccess';
import type { NivelAcceso } from '@/lib/authz';

export default function Can({ objectKey, min = 'VER', children }: PropsWithChildren<{objectKey: string, min?: NivelAcceso}>) {
  const { allowed } = useAccess(objectKey, min);
  if (!allowed) return null;
  return <>{children}</>;
}
