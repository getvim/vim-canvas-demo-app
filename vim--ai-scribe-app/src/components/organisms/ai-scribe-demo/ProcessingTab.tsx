import { Clock, FileText, MessageSquare } from "lucide-react";

export const ProcessingTab = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 pt-12">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-black shadow-lg flex items-center justify-center animate-pulse-green">
            <div className="w-32 h-32 rounded-full bg-black/80 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Processing
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-green-800">
            Transcribing audio...
          </h2>
          <p className="text-gray-600">This usually takes about 30 seconds</p>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <p className="text-xl text-gray-700 mb-4">
            While we process your recording
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-600">
                Your note is being transcribed and formatted into SOAP sections
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-600">
                Medical terms are being identified and linked to ICD codes
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-600">
                The note will be ready for your review in moments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
