export type WorkflowEvent<T> = {
  id: string;
  receivedAt: Date;
  dismiss: () => void;
  payload: T;
};
