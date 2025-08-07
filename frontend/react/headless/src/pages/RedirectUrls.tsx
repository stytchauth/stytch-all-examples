import {
  MagicLinkSentCard,
  RedirectUrlTextBox,
} from "@stytch-all-examples/internal";

const handleResendClick = () => {
  console.log("Resend click");
};

const handleEmailChangeClick = () => {
  console.log("Email change click");
};

export function RedirectUrls() {
  return (
    <div className="flex flex-row items-center p-16 gap-8">
      <div className="flex-1">
        <RedirectUrlTextBox />
      </div>
      <div className="flex-1 flex flex-col items-center p-16">
        <MagicLinkSentCard
          onResendClick={handleResendClick}
          onEmailChangeClick={handleEmailChangeClick}
        />
      </div>
    </div>
  );
}
