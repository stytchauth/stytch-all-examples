import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@stytch-all-examples/internal/components/ui/card";
import { ExampleAppHeader } from "./example-app-header";
import { Button } from "./ui/button";

export function MagicLinkSentCard({
  onResendClick,
  onEmailChangeClick,
}: {
  onResendClick: () => void;
  onEmailChangeClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-sm">
      <Card className="shadow-lg">
        <CardHeader className="items-center flex flex-col gap-8">
          <ExampleAppHeader />
          <CardTitle className="text-center">Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full items-center">
            <p className="text-center text-md font-semibold">Didn't get it?</p>
            <p className="text-center">
              <Button
                variant="link"
                onClick={() => {}}
                className="p-0 text-blue-500 font-normal"
              >
                Resend
              </Button>{" "}
              or{" "}
              <Button
                variant="link"
                onClick={() => {}}
                className="p-0 text-blue-500 font-normal"
              >
                Change email
              </Button>{" "}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
