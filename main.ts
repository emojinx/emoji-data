import { buildEmoji, buildGroupedEmoji } from './build-emoji.ts'

const data = await buildEmoji()
const [groupedData, ungroupedEmojis] = buildGroupedEmoji(data)

await Deno.writeTextFile('./build/emoji-list.json', JSON.stringify(data))
console.log('data written to ./build/emoji-list.json')

await Deno.writeTextFile('./build/emoji-grouped.json', JSON.stringify(groupedData))
console.log('grouped list written to ./build/emoji-grouped.json')
