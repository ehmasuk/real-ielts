export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
