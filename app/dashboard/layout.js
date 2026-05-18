export const metadata = {
  title: 'DMG Control Center',
  description: 'Secure API Console Node',
}

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0e0f11' }}>
        {children}
      </body>
    </html>
  );
}