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
              <Button
                variant="outline"
                size="sm"
                className="text-xs w-fit"
                onClick={() => {
                  navigator.clipboard.writeText(sessionTokens.session_jwt);
                }}
              >
                Copy full JWT to clipboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs w-fit"
                onClick={() => {
                  window.open(`https://jwts.dev`);
                }}
              >
                Launch JWT decoder
              </Button>
            </div>
            <div className="break-all whitespace-pre-wrap text-sm leading-relaxed bg-code rounded-md p-2">
              <code>{sessionTokens.session_jwt.substring(0, 300)}...</code>
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
