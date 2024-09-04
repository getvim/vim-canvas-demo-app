import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSOrders } from "@/hooks/useOrders";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "./ui/entityContent";
import { JSONView } from "./ui/jsonView";
import { Separator } from "./ui/separator";

export const OrderContent = () => {
  const { jsonMode } = useAppConfig();
  const { orders } = useVimOSOrders();

  const order = orders?.[0];

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={orders} />
      ) : (
        <>
          <EntitySectionTitle title="Identifier" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR Order ID" />
              <EntityFieldReadonlyText text={order?.identifiers?.ehrOrderId} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Basic Information" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Created date" />
              <EntityFieldReadonlyText
                text={order?.basicInformation?.createdDate}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Type" />
              <EntityFieldReadonlyText text={order?.basicInformation?.type} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR Encounter ID" />
              <EntityFieldReadonlyText
                text={order?.basicInformation?.ehrEncounterId}
              />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Assessments" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldReadonlyList list={order?.assessments?.assessments} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Procedure Codes" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldReadonlyList
                list={order?.procedureCodes?.procedureCodes}
              />
            </EntityFieldContent>
          </EntitySectionContent>
        </>
      )}
    </div>
  );
};
