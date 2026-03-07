interface CTASectionProps {
  label: string;
  linkText: string;
  linkHref: string;
  children: React.ReactNode;
  headingClassName?: string;
  labelClassName?: string;
}

const defaultHeading =
  "font-body font-medium text-[4.028vw] leading-[4.097vw] text-off-black max-w-[62.569vw] mb-[2.778vw] max-md:text-[28px] max-md:leading-[30px] max-md:max-w-none max-md:mb-6";

export default function CTASection({
  label,
  linkText,
  linkHref,
  children,
  headingClassName,
  labelClassName,
}: CTASectionProps) {
  return (
    <div className="flex items-start max-md:flex-col max-md:gap-4">
      <p className={`font-heading font-normal text-[1.389vw] leading-[1.2] text-off-black shrink-0 w-[31.458vw] max-md:w-auto max-md:text-[17px] ${labelClassName || ""}`}>
        {label}
      </p>
      <div>
        <h2 className={headingClassName || defaultHeading}>
          {children}
        </h2>
        <a
          href={linkHref}
          className="link-underline font-body font-medium text-[1.389vw] leading-[1.2] text-off-black pb-[0.486vw] max-md:text-[17px] max-md:pb-1.5"
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}
