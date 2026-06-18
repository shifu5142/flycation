import { AppImage } from "@/components/AppImage"

function LocaleFlag({ countryCode }: { countryCode: string }) {
  return (
    <AppImage
      src={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
      alt=""
      width={20}
      height={20}
      wrapperClassName="size-5 shrink-0 rounded-full"
      className="size-5 shrink-0 rounded-full"
      aria-hidden
    />
  )
}

export { LocaleFlag }
