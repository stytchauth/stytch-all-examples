import { toast } from "sonner";
import { SessionTokens } from "../b2b/session-card";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function SessionTokensCard({
  sessionTokens,
  handleBack,
}: {
  sessionTokens: SessionTokens;
  handleBack: () => void;
}) {
  return (
    <Card className="w-lg">
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-bold">Session Token</p>
            <div className="border border-gray-200 rounded-md p-2 text-sm bg-code">
              <code>{sessionTokens.session_token}</code>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold">Session JWT</p>
            <div className="flex flex-row gap-2 justify-start">
              <div className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(sessionTokens.session_jwt);
                    toast.success("JWT copied to clipboard");
                  }}
                >
                  Copy JWT to clipboard
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs w-full"
                  onClick={() => {
                    window.open(`https://jwts.dev`);
                  }}
                >
                  Launch JWT decoder
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-sm w-fit self-start"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
