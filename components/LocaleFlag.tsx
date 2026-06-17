function LocaleFlag({ countryCode }: { countryCode: string }) {
  return (
    <img
      src={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
      alt=""
      width={20}
      height={20}
      className="size-5 shrink-0 rounded-full"
      aria-hidden
    />
  )
}

export { LocaleFlag }
