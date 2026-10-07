import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Doctors from "../components/Doctors";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import CustomerReviews from "../components/CustomerReviews";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Doctors />
        <Services />
        <HowItWorks />
        <CustomerReviews />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}

export default Home;
