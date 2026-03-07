export const metadata = {
  title: 'Weverskade Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999]">
      {children}
    </div>
  )
}
