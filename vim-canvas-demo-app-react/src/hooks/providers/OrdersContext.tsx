import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";
import { useAppConfig } from "../useAppConfig";

interface OrderContext {
  orders: EHR.Order[] | undefined;
}

export const VimOSOrdersContext = createContext<OrderContext>({
  orders: undefined,
});

export const VimOSOrdersProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { updateNotification } = useAppConfig();
  const vimOS = useVimOsContext();
  const [orders, setOrders] = useState<EHR.Order[] | undefined>(undefined);

  useEffect(() => {
    vimOS.ehr.subscribe("orders", (data) => {
      setOrders(data);
      updateNotification("orders", data ? 1 : 0);
    });

    return () => {
      vimOS.ehr.unsubscribe("orders", setOrders);
    };
  }, [vimOS, updateNotification]);

  return (
    <VimOSOrdersContext.Provider
      value={{
        orders,
      }}
    >
      {children}
    </VimOSOrdersContext.Provider>
  );
};
