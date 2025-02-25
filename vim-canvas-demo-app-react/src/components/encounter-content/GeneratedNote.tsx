// Removed unused React import; with the new JSX transform, it's no longer required.
import {
  EntitySectionTitle,
  EntitySectionContent,
  EntityFieldContent,
  EntityFieldTitle,
  EntityFieldReadonlyText,
} from "../ui/entityContent";

interface GeneratedNoteProps {
  note: string;
}

export const GeneratedNote = ({ note }: GeneratedNoteProps) => {
  if (!note) return null;
  return (
    <>
      <EntitySectionTitle title="Generated Note" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Output" />
          <EntityFieldReadonlyText text={note} />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
}; 