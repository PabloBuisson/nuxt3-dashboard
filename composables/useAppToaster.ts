import { useToast, ToastType } from "tailvue";

export const useAppToaster = (props: AppToasterProps) => {
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
