import MainLayout from '@/components/layouts/MainLayout'
import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/Montserrat-VariableFont_wght.ttf',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={myFont.className}>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
