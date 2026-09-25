import Footer from 'src/components/Footer/Footer'
import Navbar from 'src/components/Navbar/Navbar'

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
