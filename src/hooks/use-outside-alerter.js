import { useEffect } from "react";

function useOutsideAlerter(refs, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      const conds = [];
      for (let ref of refs) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (!event.target.style.zIndex) {
            conds.push(true);
            continue;
          }
          if (ref.current.style.zIndex > event.target.style.zIndex) {
            conds.push(true);
            continue;
          }
        }
        conds.push(false);
      }
      if (conds.every(Boolean)) {
        handler();
      }
      return;
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler]);
}

export default useOutsideAlerter;
