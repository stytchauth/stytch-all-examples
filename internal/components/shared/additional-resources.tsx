import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";

export function AdditionalResources({
  links,
}: {
  links: { href: string; text: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="h4">Additional Resources</Typography>
      {links.map((link) => (
        <div className="flex flex-row gap-2" key={link.href}>
          <BookIcon />
          <Link className="text-body1" href={link.href} text={link.text} />
        </div>
      ))}
    </div>
  );
}

const BookIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6667 1.6665V18.3332H3.33337V1.6665H16.6667ZM10 8.33317H8.33337V9.99984H6.66671V3.33317H5.00004V16.6665H15V3.33317H11.6667V9.99984H10V8.33317Z"
        fill="#1D1D1D"
      />
    </svg>
  );
};
