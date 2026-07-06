import type { PropsWithChildren } from 'react';

function UploadCard({ children }: PropsWithChildren) {
  return <section className="glass-panel rounded-3xl p-5 sm:p-6 lg:p-8">{children}</section>;
}

export default UploadCard;
