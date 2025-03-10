import { FileText } from "lucide-react";
import type { Note } from "./Note.interface";

export const UserTab = ({
  notes,
}: {
  notes: Note[];
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Previous Notes</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-900">
                {note.patientName}
              </span>
              <span className="text-sm text-gray-500">{note.timestamp}</span>
            </div>
            <div className="space-y-4">
              <details className="text-sm">
                <summary className="font-medium text-green-600 cursor-pointer hover:text-green-800">
                  View SOAP Note
                </summary>
                <div className="mt-4 space-y-4 pl-4">
                  {Object.entries(note.soap).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-medium text-gray-700 capitalize">
                        {key}
                      </h4>
                      <div className="text-gray-600 mt-1 whitespace-pre-line">{value}</div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto mb-3" />
            <p>No saved notes yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
