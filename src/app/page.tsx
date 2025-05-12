import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';
import About from '@/components/About';

export default function Home() {
  // Bread of the week featured item
  const breadOfTheWeek = {
    name: "...",
    image: "/images/sourdough.jpg"
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header Component with Bread of the Week */}
      <Header breadOfTheWeek={breadOfTheWeek} />

      {/* About Component */}
      <About />

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-8 bg-amber-50">
        <div className="container mx-auto">
          <Gallery />
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="py-16 px-8 bg-amber-100">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <OrderForm />
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </main>
  );
}