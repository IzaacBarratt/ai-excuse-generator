import { useEffect, useState } from "react";
import { isMobileOrTabletDevice } from "../utils/browser";

export const useMobileDevice = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(isMobileOrTabletDevice());
  });

  return [isMobileOrTablet];
};
