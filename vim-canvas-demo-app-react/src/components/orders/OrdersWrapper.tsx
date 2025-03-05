import orderDiSvg from "@/assets/order-di.svg";
import orderLabSvg from "@/assets/order-lab.svg";
import orderProcedureSvg from "@/assets/order-procedure.svg";
import orderRxSvg from "@/assets/order-rx.svg";
import orderSvg from "@/assets/order.svg";
import React from "react";
import { EHR } from "vim-os-js-browser/types";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "../ui/collapsibleEntity";
import { OrderContent } from "./OrderContent";

const orderIcons: Record<EHR.OrderType, string> = {
  DI: orderDiSvg,
  LAB: orderLabSvg,
  RX: orderRxSvg,
  PROCEDURE: orderProcedureSvg,
};

export const OrdersWrapper: React.FC<{
  orders: EHR.Order[];
  themeColor?: string;
}> = ({ orders, themeColor }) => {
  return (
    <>
      {orders?.map((order, index) => {
        const orderType = order.basicInformation?.type;
        return (
          <CollapsibleEntity
            entityTitle={orderType ? `Order - ${orderType}` : "Order"}
            entityIconUrl={(orderType && orderIcons[orderType]) ?? orderSvg}
            themeColor={themeColor}
            key={index}
          >
            <CollapsibleEntityContent>
              <OrderContent order={order} />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        );
      })}
    </>
  );
};
