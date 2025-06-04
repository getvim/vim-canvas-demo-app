import { useAppConfig } from "@/hooks/useAppConfig";
import { Fragment } from "react";
import { EHR } from "vim-os-js-browser/types";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { JSONView } from "../ui/jsonView";
import { Separator } from "../ui/separator";
import { ProviderSection } from "../Provider";

interface OrderContentProps {
  order: EHR.Order;
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  const { jsonMode } = useAppConfig();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={order} />
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
          <Separator className="mb-1" />
          {order?.basicInformation?.type === "RX" && (
            <>
              <EntitySectionTitle title="Medications" />
              {!order?.medications || !order.medications.length ? (
                <EntityFieldReadonlyList list={[]} />
              ) : (
                order.medications.map((medication) => (
                  <Fragment key={medication.basicInformation?.ndcCode}>
                    <EntitySectionTitle title="Medication" />
                    <EntitySectionContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="Medication Name" />
                        <EntityFieldReadonlyText
                          text={
                            medication.basicInformation?.medicationName ?? "--"
                          }
                        />
                      </EntityFieldContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="NDC code" />
                        <EntityFieldReadonlyText
                          text={medication.basicInformation?.ndcCode ?? "--"}
                        />
                      </EntityFieldContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="Form" />
                        <EntityFieldReadonlyText
                          text={medication.dosage?.form?.unit ?? "--"}
                        />
                      </EntityFieldContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="Strength value" />
                        <EntityFieldReadonlyText
                          text={medication.dosage?.strength?.value ?? "--"}
                        />
                      </EntityFieldContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="Quantity value" />
                        <EntityFieldReadonlyText
                          text={medication.dosage?.quantity?.value ?? "--"}
                        />
                      </EntityFieldContent>
                      <EntityFieldContent>
                        <EntityFieldTitle title="Quantity unit" />
                        <EntityFieldReadonlyText
                          text={medication.dosage?.quantity?.unit ?? "--"}
                        />
                      </EntityFieldContent>
                    </EntitySectionContent>
                  </Fragment>
                ))
              )}
              <Separator className="mb-1" />
            </>
          )}
          {order?.orderingProvider && (
            <>
              <ProviderSection
                provider={order.orderingProvider}
                title="Ordering Provider"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
