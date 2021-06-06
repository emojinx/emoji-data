import { emojiDataPngSprites, svgmojiData, openmojiData } from './data-urls.ts'
import { OpenmojiEmoji, SvgmojiEmoji, EmojidataData, GrandEmoji } from './types.ts'

/**************************************************************************************************************************/

async function fetchOpenmojiData() {
  const res = await fetch(openmojiData)
  return await res.json()
}
async function fetchSvgmojiData() {
  const res = await fetch(svgmojiData)
  return await res.json()
}
async function fetchEmojiPngData(sprite: keyof typeof emojiDataPngSprites) {
  const res = await fetch(emojiDataPngSprites[sprite].data)
  return await res.json()
}

/**************************************************************************************************************************/

async function getHashedOpenmojiData() {
  const res = {} as Record<string, OpenmojiEmoji>

  const emojis = await fetchOpenmojiData()

  emojis.forEach((emoji: OpenmojiEmoji) => {
    if (!['extras-openmoji', 'extras-unicode'].includes(emoji.group)) {
      delete emoji.openmoji_author
      delete emoji.openmoji_date
      delete emoji.unicode

      emoji.tags = (emoji.tags as string).split(',').map(tag => tag.trim())
      emoji.openmoji_tags = (emoji.openmoji_tags as string).split(',').map(tag => tag.trim())

      res[emoji.hexcode.toLowerCase()] = emoji
    }
  })
  
  return res
}
async function getHashedSvgmoji() {
  const res = {} as Record<string, SvgmojiEmoji>

  const emojis = await fetchSvgmojiData()

  emojis.forEach((emoji: SvgmojiEmoji) => res[emoji.hexcode.toLowerCase()] = emoji)
  
  return res
}
async function getHashedEmojidataData(sprite: keyof typeof emojiDataPngSprites) {
  const res = {} as Record<string, EmojidataData>

  const emojis = await fetchEmojiPngData(sprite) as EmojidataData[]

  emojis.forEach((emoji: EmojidataData) => {
    res[emoji.unified.toLowerCase()] = emoji

    if (emoji.skin_variations) {
      Object.entries(emoji.skin_variations).forEach(([_, val]) => {
        res[val.unified.toLowerCase()] = val
      })
    }
  })

  return res
}

/**************************************************************************************************************************/

function addSpriteData(type:string, hex:string, data:Record<string, EmojidataData>) {
  function getHasEmoji() {
    switch(type) {
      case 'apple': return data[hex].has_img_apple
      case 'facebook': return data[hex].has_img_facebook
      case 'twitter': return data[hex].has_img_twitter
      case 'google': return data[hex].has_img_google
      default: return null
    }
  }

  if (typeof data[hex] === 'object') {
    return {
      has_emoji: getHasEmoji(),
      sheet_x: data[hex].sheet_x,
      sheet_y: data[hex].sheet_y,
    }
  }
  return null;
}

export async function buildEmoji() {
  const hashedSvgmoji = await getHashedSvgmoji()
  const hashedOpenmoji = await getHashedOpenmojiData()

  const appleData = await getHashedEmojidataData('apple')
  const googleData = await getHashedEmojidataData('google')
  const facebookData = await getHashedEmojidataData('facebook')
  // const messengerData = await getHashedEmojidataData('messenger')
  const twitterData = await getHashedEmojidataData('twitter')

  const res: Record<string, GrandEmoji> = {}

  for(const hex in hashedOpenmoji) {
    res[hex] = hashedOpenmoji[hex] as GrandEmoji

    if (hashedSvgmoji[hex]) {
      if (hashedSvgmoji[hex].tags?.length) res[hex].tags = [...new Set([...res[hex].tags, ...hashedSvgmoji[hex].tags])]
      if (hashedSvgmoji[hex].version) res[hex].version = hashedSvgmoji[hex].version
      if (hashedSvgmoji[hex].skins) res[hex].skins = hashedSvgmoji[hex].skins
    }

    res[hex].sheets = {
      apple: addSpriteData('apple', hex, appleData),
      google: addSpriteData('google', hex, googleData),
      facebook: addSpriteData('facebook', hex, facebookData),
      twitter: addSpriteData('twitter', hex, twitterData),
    }

    !res[hex].skintone && delete res[hex].skintone
    !res[hex].skintone_combination && delete res[hex].skintone_combination
    !res[hex].skintone_base_emoji && delete res[hex].skintone_base_emoji
    !res[hex].skintone_base_hexcode && delete res[hex].skintone_base_hexcode

    res[hex].tags.length && res[hex].tags.filter(tag => tag.length)
    res[hex].openmoji_tags.length && res[hex].openmoji_tags.filter(tag => tag.length)
  }

  return res
}

export function buildGroupedEmoji(emojiList: Record<string, GrandEmoji>) {
  const emojis = Object.values(emojiList)

  const emojisWithoutGroup: GrandEmoji[] = [];
  const emojisGrouped: Record<string, GrandEmoji[]> = {}

  emojis.forEach(emoji => {
    if (!emoji.group) {
      emojisWithoutGroup.push(emoji)
    } else {
      if (emojisGrouped[emoji.group]) emojisGrouped[emoji.group].push(emoji)
      else emojisGrouped[emoji.group] = [emoji]
    }
  })

  return [emojisGrouped, emojisWithoutGroup];
}
