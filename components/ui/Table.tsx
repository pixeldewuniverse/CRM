import { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <table className="min-w-full divide-y divide-slate-200">{children}</table>;
}
