import { createContext, useCallback, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import type { WorkflowEvent } from "@/types/workflowEvent";
import { useVimOsContext } from "../useVimOsContext";
import { useAppConfig } from "../useAppConfig";

interface OrderContext {
  orders: EHR.Order[];
  orderCreatedEvents: WorkflowEvent<EHR.Order>[];
}

export const VimOSOrdersContext = createContext<OrderContext>({
  orders: [],
  orderCreatedEvents: [],
});

export const VimOSOrdersProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { updateNotification } = useAppConfig();
  const vimOS = useVimOsContext();
  const [orders, setOrders] = useState<EHR.Order[]>([]);
  const [orderCreatedEvents, setOrderCreatedEvents] = useState<
    WorkflowEvent<EHR.Order>[]
  >([]);

  useEffect(() => {
    vimOS.ehr.subscribe("orders", (data) => {
      setOrders(data ?? []);
      updateNotification("orders", data ? 1 : 0);
    });

    return () => {
      vimOS.ehr.unsubscribe("orders", (data) => setOrders(data ?? []));
    };
  }, [vimOS, updateNotification]);

  const dismissOrderCreated = useCallback((id: string) => {
    setOrderCreatedEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = vimOS.ehr.workflowEvents.order.onOrderCreated(
      (order: EHR.Order) => {
        const orderCreatedEvent: WorkflowEvent<EHR.Order> = {
          id: order?.identifiers?.ehrOrderId ?? "",
          receivedAt: new Date(),
          payload: order,
          dismiss: () => dismissOrderCreated(orderCreatedEvent.id),
        };
        setOrderCreatedEvents((prev) => {
          const exists = prev.some((e) => e.id === orderCreatedEvent.id);
          const next = exists
            ? prev
            : [orderCreatedEvent, ...prev].slice(0, 10);
          return next;
        });
      }
    );
    return () => unsubscribe();
  }, [vimOS, dismissOrderCreated]);

  return (
    <VimOSOrdersContext.Provider
      value={{
        orders,
        orderCreatedEvents,
      }}
    >
      {children}
    </VimOSOrdersContext.Provider>
  );
};
