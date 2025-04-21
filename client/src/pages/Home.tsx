import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="w-full h-full flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-12">
            <img
              src="/in-logo.png"
              alt="Imagine Nashville Logo"
              className="h-32 md:h-48 lg:h-56 w-auto object-contain"
            />
          </div>
          <p className="mt-8 text-2xl md:text-3xl lg:text-4xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Envisioning the future of Music City through data-driven insights
            and community engagement.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <Link to="/visualizations">
              <Button className="bg-black text-white text-base tracking-wider font-bold px-12 py-6 rounded-none hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 uppercase">
                EXPLORE DATA <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a
              href="https://imaginenashville.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="text-base tracking-wider font-bold px-12 py-6 rounded-none border-2 border-black hover:bg-gray-50 transition-all duration-200 uppercase"
              >
                LEARN MORE
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>
    </div>
  );
}
