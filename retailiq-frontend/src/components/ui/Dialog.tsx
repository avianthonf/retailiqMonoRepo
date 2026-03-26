import type { ReactNode } from 'react';

interface DialogProps {
  open?: boolean;
  children: ReactNode;
}

export function Dialog({ open, children }: DialogProps) {
  return open ? <div className="dialog-backdrop">{children}</div> : null;
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div className="dialog">{children}</div>;
}

export default Dialog;
