import { useState, useRef, useEffect } from "react";

export function useDropdownDirection() {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open && ref.current) {
      const buttonRect = ref.current.getBoundingClientRect();
      
      // Find the closest ancestor that can clip/scroll the dropdown
      let parent = ref.current.parentElement;
      let containerBottom = window.innerHeight;
      let containerTop = 0;
      
      while (parent) {
        const style = window.getComputedStyle(parent);
        const overflow = style.overflow + style.overflowY + style.overflowX;
        if (
          parent.tagName === "BODY" ||
          parent.tagName === "HTML" ||
          overflow.includes("auto") ||
          overflow.includes("hidden") ||
          overflow.includes("scroll")
        ) {
          const rect = parent.getBoundingClientRect();
          containerBottom = rect.bottom;
          containerTop = rect.top;
          break;
        }
        parent = parent.parentElement;
      }
      
      const spaceBelow = containerBottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - containerTop;
      
      // If there is less than 160px of space below the button inside the clipping container,
      // and there is more space above than below, open upwards.
      if (spaceBelow < 160 && spaceAbove > spaceBelow) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }
  }, [open]);

  return { ref, open, setOpen, direction };
}
