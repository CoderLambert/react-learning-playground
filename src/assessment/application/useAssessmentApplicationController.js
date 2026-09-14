import { useEffect, useSyncExternalStore } from "react";
import { createAssessmentApplicationController } from "./AssessmentApplicationController.js";

export function useAssessmentApplicationController({ runtime }) {
  const controller = createAssessmentApplicationController({ runtime });

  const view = useSyncExternalStore(
    controller.subscribe,
    controller.getView,
    controller.getView,
  );

  useEffect(() => () => controller.dispose?.(), [controller]);

  return {
    view,
    commands: {
      start: controller.start,
      submit: controller.submit,
      recover: controller.recover,
      next: controller.next,
    },
  };
}
