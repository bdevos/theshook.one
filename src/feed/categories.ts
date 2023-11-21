export type CategoryKey =
  | 'ai-artificial-intelligence'
  | 'apple'
  | 'apps'
  | 'business'
  | 'cars'
  | 'climate-change'
  | 'creators'
  | 'cryptocurrency'
  | 'cyber-security'
  | 'electric-cars'
  | 'elon-musk'
  | 'entertainment'
  | 'environment'
  | 'film'
  | 'facebook'
  | 'gadgets'
  | 'games'
  | 'google'
  | 'good-deals'
  | 'how-to'
  | 'iphone'
  | 'keyboards'
  | 'meta'
  | 'microsoft'
  | 'policy'
  | 'reviews'
  | 'samsung'
  | 'science'
  | 'space'
  | 'smart-home'
  | 'streaming-wars'
  | 'tech'
  | 'tesla'
  | 'tiktok'
  | 'transportation'
  | 'tv'
  | 'twitter'
  | 'youtube'

type CategoryMeta = {
  label: string
  color: string
}

export const categories: Record<CategoryKey, CategoryMeta> = {
  'ai-artificial-intelligence': {
    label: 'Artificial Intelligence',
    color: '#3498db',
  },
  'apple': { label: 'Apple', color: '#A52A2A' },
  'apps': { label: 'Apps', color: '#FFA500' },
  'business': { label: 'Business', color: '#95a5a6' },
  'cars': { label: 'Cars', color: '#e74c3c' },
  'climate-change': { label: 'Climate', color: '#008000' },
  'creators': { label: 'Creators', color: '#800080' },
  'cryptocurrency': { label: 'Crypto', color: '#FFFF00' },
  'good-deals': { label: 'Deals', color: '#228B22' },
  'electric-cars': { label: 'Electric Cars', color: '#00a86b' },
  'elon-musk': { label: 'Elon Musk', color: '#00FFFF' },
  'entertainment': { label: 'Entertainment', color: '#e74c3c' },
  'environment': { label: 'Environment', color: '#008000' },
  'facebook': { label: 'Facebook', color: '#3b5998' },
  'film': { label: 'Film', color: '#FF1493' },
  'gadgets': { label: 'Gadgets', color: '#808080' },
  'games': { label: 'Games', color: '#FF4500' },
  'google': { label: 'Google', color: '#4285F4' },
  'how-to': { label: 'How-to', color: '#8A2BE2' },
  'iphone': { label: 'iPhone', color: '#bdc3c7' },
  'keyboards': { label: 'Keyboards', color: '#333333' },
  'meta': { label: 'Meta', color: '#800000' },
  'microsoft': { label: 'Microsoft', color: '#00ADEF' },
  'policy': { label: 'Policy', color: '#800000' },
  'reviews': { label: 'Reviews', color: '#9932CC' },
  'samsung': { label: 'Samsung', color: '#1428A0' },
  'science': { label: 'Science', color: '#4682B4' },
  'cyber-security': { label: 'Security', color: '#0000FF' },
  'space': { label: 'Space', color: '#000080' },
  'smart-home': { label: 'Smart Home', color: '#3498db' },
  'streaming-wars': { label: 'Streaming', color: '#FF6347' },
  'tech': { label: 'Tech', color: '#808080' },
  'tesla': { label: 'Tesla', color: '#E60012' },
  'tiktok': { label: 'Tiktok', color: '#69C9D0' },
  'transportation': { label: 'Transportation', color: '#808000' },
  'tv': { label: 'TV', color: '#800080' },
  'twitter': { label: 'Twitter', color: '#1DA1F2' },
  'youtube': { label: 'Youtube', color: '#FF0000' },
} as const

export const categoriesArray = (): {
  category: CategoryKey
  label: string
  color: string
}[] => {
  return Object.entries(categories).map(([category, { label, color }]) => {
    return {
      category: category as CategoryKey,
      label,
      color,
    }
  })
}

export const theVergeFeedUrl = (
  category: CategoryKey,
  hash: string | null = null,
) =>
  `https://www.theverge.com/rss/${category}/index.xml${!hash ? '' : `?${hash}`}`
