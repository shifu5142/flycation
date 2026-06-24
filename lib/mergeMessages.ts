type MessageValue = string | MessageTree
type MessageTree = { [key: string]: MessageValue }

export function mergeMessages(
  base: MessageTree,
  override: MessageTree
): MessageTree {
  const result: MessageTree = { ...base }

  for (const key of Object.keys(override)) {
    const baseValue = base[key]
    const overrideValue = override[key]

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = mergeMessages(
        baseValue as MessageTree,
        overrideValue as MessageTree
      )
    } else {
      result[key] = overrideValue
    }
  }

  return result
}
