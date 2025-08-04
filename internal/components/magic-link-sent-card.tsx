import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@stytch-all-examples/internal/components/ui/card";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import { ExampleIcon } from "./example-icon";

export function MagicLinkSentCard() {
  return (
    <div className="flex flex-col gap-4 w-sm">
      <Card className="shadow-lg">
        <CardHeader className="items-center flex flex-col gap-4">
          <div className="flex justify-center">
            <ExampleIcon />
          </div>
          <CardTitle className="text-center">Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 w-full items-center">
            <Typography variant="body1" className="text-center text-gray-600">
              We've sent a magic link to your email address.
            </Typography>
            <Typography variant="body2" className="text-center text-gray-500">
              Didn't get it?
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
