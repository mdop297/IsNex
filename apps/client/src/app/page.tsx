import Contact from '@/components/landing/Contact';
import { Features } from '@/components/landing/Feature';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { Navbar } from '@/components/landing/Navbar';
import { Pricing } from '@/components/landing/Pricing';

export default function Home() {
  return (
    <>
      <main className="relative">
        <Navbar signInRoute="/auth/signin" signUpRoute="/auth/signup" />
        <div className="relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1000px_at_50%_100px,#77c9fc,transparent)]"></div>
          </div>

          <Hero
            title="Beautiful blocks for Shadcn UI."
            description="Shadcnblocks.com offers the best collection of components and blocks for shadcn/ui."
            primaryButtonText="Go to HomePage"
            primaryButtonUrl="/home"
          />
        </div>
        <div className="relative ">
          <Features />
          <Pricing />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
