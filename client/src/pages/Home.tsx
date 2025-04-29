import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/BY1.png"
              alt="Imagine Nashville Logo"
              className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain hidden md:block"
            />
            <img
              src="/BY2.png"
              alt="Imagine Nashville Logo Mobile"
              className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain md:hidden"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Envisioning the Future of Music City
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Through data-driven insights and community engagement, we're shaping
            a better Nashville for everyone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <Link to="/visualizations">
              <Button className="w-full sm:w-auto bg-[var(--brand-blue)] text-white text-base sm:text-lg tracking-wider font-bold px-8 sm:px-14 py-4 sm:py-7 rounded-none hover:bg-[#E94E3C] transition-all duration-200 flex items-center justify-center gap-2 uppercase">
                DIG INTO THE DATA{" "}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </Link>
            <a
              href="https://imaginenashville.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg tracking-wider font-bold px-8 sm:px-14 py-4 sm:py-7 rounded-none border-2 border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[#E94E3C] hover:text-white hover:border-[#E94E3C] transition-all duration-200 uppercase"
              >
                LEARN MORE
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 sm:-top-48 -right-20 sm:-right-40 w-[14rem] sm:w-[28rem] h-[14rem] sm:h-[28rem] bg-blue-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 sm:-bottom-48 -left-20 sm:-left-40 w-[14rem] sm:w-[28rem] h-[14rem] sm:h-[28rem] bg-purple-100 rounded-full opacity-20 blur-3xl" />
      </div>
    </div>
  );
}
