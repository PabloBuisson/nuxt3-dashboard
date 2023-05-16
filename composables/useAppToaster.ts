import { useToast, ToastType } from "tailvue";

export const useAppToaster = (props: AppToasterProps) => {
  if (process.server) return;

  const $toast = useToast();
  const commonParameters = {
    message: props.message,
    type: props.type,
    pauseOnHover: true,
  };
  $toast.show({ ...commonParameters, type: props.type });
};

export interface AppToasterProps {
  message: string;
  type: ToastType;
}
