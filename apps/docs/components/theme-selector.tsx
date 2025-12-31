"use client";

import { usePresetTheme } from "@/hooks/use-preset-theme";
import { useMode } from "@/hooks/use-mode";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function ThemeSelector() {
  const { currentThemeId, setTheme, availableThemes } = usePresetTheme();
  const { toggleMode } = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 8, // mt-2 = 8px
            right: window.innerWidth - rect.right,
          });
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      
      // Cmd/Ctrl + Shift + T - Toggle theme selector
      if (isMod && event.shiftKey && event.key === "T") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Cmd/Ctrl + Shift + D - Toggle dark/light mode
      if (isMod && event.shiftKey && event.key === "D") {
        event.preventDefault();
        toggleMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleMode]);

  return (
    <div className="relative" ref={buttonRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="size-8 text-base transition-none md:text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground"
        variant="ghost"
        aria-label="Select theme"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Palette className="size-4" />
      </Button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            role="menu"
            aria-label="Theme options"
            className={cn(
              "fixed z-[9999]",
              "min-w-[260px] overflow-hidden rounded-lg",
              "border border-border bg-popover shadow-lg",
              "animate-in fade-in-0 zoom-in-95",
            )}
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
            }}
          >
            <div className="p-1">
              {availableThemes.map((theme) => {
                // Get the primary-500 color for the swatch
                const primaryColor = theme.colors.light.primary["500"];
                
                return (
                  <button
                    key={theme.id}
                    role="menuitem"
                    onClick={() => {
                      setTheme(theme.id);
                      setIsOpen(false);
                    }}
                    aria-current={currentThemeId === theme.id ? "true" : undefined}
                    title={theme.description}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-start gap-2.5 rounded-md px-3 py-2 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors",
                      currentThemeId === theme.id &&
                        "bg-accent/50 font-medium text-accent-foreground",
                    )}
                  >
                    {/* Color swatch */}
                    <div
                      className="mt-0.5 size-4 shrink-0 rounded-full border border-border/50 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
                      <span className="font-medium">{theme.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {theme.description}
                      </span>
                    </div>
                    {currentThemeId === theme.id && (
                      <Check className="ml-auto size-4 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

