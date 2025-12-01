import { InfoIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  tooltipContent: string;
  addButton?: boolean;
  inputGroupText?: string;
}
export default function EnhancedInput({
  tooltipContent,
  addButton = false,
  inputGroupText,
  children,
  ...rest
}: EnhancedInputProps) {
  return (
    <InputGroup>
      <InputGroupInput {...rest} />
      {inputGroupText && (
        <InputGroupAddon>
          <InputGroupText>{inputGroupText}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupAddon align="inline-end">
        {addButton && <InputGroupButton asChild>{children}</InputGroupButton>}
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton tabIndex={-1} variant="ghost" aria-label="Info" size="icon-xs">
              <InfoIcon />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
