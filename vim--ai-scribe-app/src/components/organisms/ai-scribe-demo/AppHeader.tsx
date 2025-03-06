import { Stethoscope } from "lucide-react";

export const AppHeader = () => {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <Stethoscope className="h-12 w-12 text-green-500" />
            <h1 className="text-3xl font-bold text-green-600">AIScribe</h1>
          </div>
        </div>
      </header>
    );
  };