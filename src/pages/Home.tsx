import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Doctors from "../components/Doctors";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Doctors />
      </main>
    </>
  );
}

export default Home;
