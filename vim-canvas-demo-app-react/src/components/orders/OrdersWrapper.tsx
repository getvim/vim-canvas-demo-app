import orderDiSvg from "@/assets/order-di.svg";
import orderLabSvg from "@/assets/order-lab.svg";
import orderProcedureSvg from "@/assets/order-procedure.svg";
import orderRxSvg from "@/assets/order-rx.svg";
import orderSvg from "@/assets/order.svg";
import React from "react";
import { Trash2 } from "lucide-react";
import { EHR } from "vim-os-js-browser/types";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "../ui/collapsibleEntity";
import { OrderContent } from "./OrderContent";
import type { WorkflowEvent } from "@/types/workflowEvent";
import { formatContentDate } from "@/utils/formatContentDate";
import { Button } from "../ui/button";
import { capitalize } from "@/lib/utils";

const orderIcons: Record<EHR.OrderType, string> = {
  DI: orderDiSvg,
  LAB: orderLabSvg,
  RX: orderRxSvg,
  PROCEDURE: orderProcedureSvg,
  REFERRAL: orderSvg,
};

export const OrdersWrapper: React.FC<{
  orders: EHR.Order[];
  orderCreatedEvents: WorkflowEvent<EHR.Order>[];
  themeColor?: string;
}> = ({ orders, orderCreatedEvents, themeColor }) => {
  return (
    <>
      {orders?.map((order, index) => {
        const orderType = order.basicInformation?.type;
        return (
          <CollapsibleEntity
            entityTitle={"Order"}
            titleSuffix={orderType ? `- ${capitalize(orderType)}` : ""}
            entityIconUrl={(orderType && orderIcons[orderType]) ?? orderSvg}
            themeColor={themeColor}
            badge="State"
            key={index}
          >
            <CollapsibleEntityContent>
              <OrderContent order={order} />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        );
      })}
      {orderCreatedEvents.map((orderCreatedEvent, index) => {
        const { payload: order, receivedAt } = orderCreatedEvent;
        const orderType = order.basicInformation?.type;
        return (
          <CollapsibleEntity
            entityTitle="Order created"
            titleSuffix={orderType ? `- ${capitalize(orderType)}` : ""}
            subtitle={formatContentDate(receivedAt, {
              format: "hh:mm:ss aa",
            })}
            entityIconUrl={(orderType && orderIcons[orderType]) ?? orderSvg}
            themeColor={themeColor}
            badge="Event"
            variant="dashed"
            rightAccessory={
              <Button
                variant="ghost"
                className="p-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  orderCreatedEvent.dismiss();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            }
            key={index}
          >
            <CollapsibleEntityContent variant="dashed">
              <OrderContent order={order} />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        );
      })}
    </>
  );
};
