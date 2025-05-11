import Navigation from '../components/Navigation';
import Title from '../components/Title';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import CursorTrail from '../components/CursorTrail';

export default function Home() {
  return (
    <>
      <CursorTrail />
      <Navigation />
      
      <main className="overflow-x-hidden">
        <section id="home">
          <Title />
        </section>
              
        <section id="about">
          <About />
        </section>
        
        <section id="gallery">
          <Gallery />
        </section>
      </main>
      
      <Footer />
    </>
  );
}
