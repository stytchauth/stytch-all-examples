import { ExampleIcon } from "../example-app-header";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function YourOwnUIBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline">
          <ExampleIcon />
          <p>Your own UI</p>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Not provided by Stytch UI components</p>
      </TooltipContent>
    </Tooltip>
  );
}
