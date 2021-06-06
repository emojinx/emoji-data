export type GrandEmoji = {
  emoji: string,
  hexcode: string,
  group: string,
  subgroups: string,
  annotation: string,
  tags: string[],
  "openmoji_tags": string[],
  skintone?: "" | number,
  "skintone_combination"?: string,
  "skintone_base_emoji"?: string,
  "skintone_base_hexcode"?: string,
  version?: number,
  skins?: string[],
  sheets?: Record<string, unknown>
}

export type OpenmojiEmoji = {
  emoji: string,
  hexcode: string,
  group: string,
  subgroups: string,
  annotation: string,
  tags: string | string[],
  "openmoji_tags"?: string | string[],
  "openmoji_author"?: string,
  "openmoji_date"?: string,
  skintone: "" | number,
  "skintone_combination": string,
  "skintone_base_emoji": string,
  "skintone_base_hexcode": string,
  unicode?: number,
  order: number,
}

export type SvgmojiEmoji = {
  emoji: string,
  hexcode: string,
  group: number,
  subgroup: number,
  annotation: string,
  text?: string,
  type?: number,
  order: number,
  version: number,
  shortcodes: string[],
  tags: string[],
  tone?: number[]
  skins?: string[]
}

export type EmojibaseEmoji = {
  emoji: string,
  hexcode: string,
  group: number,
  subgroup: number,
  annotation: string,
  text: string[],
  type: number,
  order: number,
  tags: string[],
  version: number,
  tone?: number,
  skins: EmojibaseEmoji[]
}

type toneHash = "1F3FB" | "1F3FC" | "1F3FD" | "1F3FE" | "1F3FF"

export type EmojidataData = {
  name: string,
  unified: string,
  "sheet_x": 18,
  "sheet_y": 32,
  "short_name": string,
  "short_names": string[],
  text: string | null,
  texts: string[] | null,
  category: string,
  subcategory: string,
  "sort_order": number,
  "has_img_apple": true,
  "has_img_google": true,
  "has_img_twitter": true,
  "has_img_facebook": true,
  "skin_variations": Record<toneHash, EmojidataData>
}
