"use client";

import { ScissorsIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

interface EnhancedTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  charLeft?: number;
}

export default function EnhancedTextArea({
  charLeft,
  value,
  onChange,
  ...rest
}: EnhancedTextAreaProps) {
  
  const cleanWhiteSpaces = (text: string) => {
    return text.replace(/\s+/g, " ").trim();
  };

  const handleCleanClick = () => {
    if (typeof value === "string" && onChange) {
      const cleaned = cleanWhiteSpaces(value);
      // Trigger a synthetic onChange event so parent updates value
      const event = {
        target: { value: cleaned },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
    }
  };

  return (
    <InputGroup>
      <InputGroupTextarea value={value} onChange={onChange} {...rest} />
      <InputGroupAddon align="block-end" className="border-t">
        {charLeft !== undefined && (
          <InputGroupText className="text-muted-foreground text-xs">
            {charLeft} characters left
          </InputGroupText>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton
              size={"icon-xs"}
              variant={"outline"}
              className="ml-auto hover:cursor-pointer"
              type="button"
              onClick={handleCleanClick}
            >
              <ScissorsIcon />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove extra spaces</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
