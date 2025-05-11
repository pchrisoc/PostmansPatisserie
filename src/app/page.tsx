import Image from 'next/image';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';

export default function Home() {
  // Bread of the week featured item
  const breadOfTheWeek = {
    name: "Rustic Sourdough",
    description: "Our signature sourdough with a perfectly crispy crust and tender, airy crumb. Made with our 5-year old starter.",
    image: "/images/sourdough.jpg"
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header Component with Bread of the Week */}
      <Header breadOfTheWeek={breadOfTheWeek} />

      {/* About Section */}
      <section id="about" className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 max-w-5xl mx-auto">
            {/* Left circular image */}
            <div className="md:w-1/3 flex justify-center md:justify-start">
              <div className="relative h-72 w-72 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/kian.jpeg"
                  alt="Our bakery"
                  fill
                  sizes="(max-width: 768px) 100vw, 288px"
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Right content: title and text */}
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center md:text-left">Our Story</h2>
              <p className="mb-4 text-stone-700">
                Hello, my name is Kian. I started Postman Patisserie to share my passion for artisanal bread with the world.
                I want to make sure everyone can enjoy the simple pleasure of freshly baked bread.
              </p>
              <p className="mb-4 text-stone-700">
                We use only locally-sourced ingredients and traditional fermentation methods to create bread with 
                exceptional flavor and texture. Each loaf is crafted by hand with care and attention to detail.
              </p>
              <p className="text-stone-700">
                Our commitment to quality and sustainability means we bake in small batches daily, reducing waste 
                and ensuring you get the freshest bread possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-4 md:px-8 bg-amber-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center">Bread Gallery</h2>
          <Gallery />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 md:px-8 bg-amber-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center">Place an Order</h2>
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