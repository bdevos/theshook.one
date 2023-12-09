export type CategoryKey =
  | 'ai-artificial-intelligence'
  | 'antitrust'
  | 'apple'
  | 'apps'
  | 'autonomous-cars'
  | 'books'
  | 'business'
  | 'cars'
  | 'climate-change'
  | 'creators'
  | 'cryptocurrency'
  | 'cyber-security'
  | 'electric-cars'
  | 'elon-musk'
  | 'energy'
  | 'entertainment'
  | 'environment'
  | 'film'
  | 'facebook'
  | 'gadgets'
  | 'games'
  | 'gift-guide'
  | 'google'
  | 'good-deals'
  | 'health'
  | 'how-to'
  | 'iphone'
  | 'keyboards'
  | 'meta'
  | 'microsoft'
  | 'policy'
  | 'politics'
  | 'regulation'
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
  | 'wearables'
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
  'antitrust': { label: 'Antitrust', color: '#4169E1' },
  'apple': { label: 'Apple', color: '#A52A2A' },
  'apps': { label: 'Apps', color: '#FFA500' },
  'autonomous-cars': { label: 'Autonomous Cars', color: '#008080' },
  'books': { label: 'Books', color: '#964B00' },
  'business': { label: 'Business', color: '#95a5a6' },
  'cars': { label: 'Cars', color: '#e74c3c' },
  'climate-change': { label: 'Climate', color: '#008000' },
  'creators': { label: 'Creators', color: '#800080' },
  'cryptocurrency': { label: 'Crypto', color: '#FFFF00' },
  'good-deals': { label: 'Deals', color: '#228B22' },
  'electric-cars': { label: 'Electric Cars', color: '#00a86b' },
  'elon-musk': { label: 'Elon Musk', color: '#00FFFF' },
  'energy': { label: 'Energy', color: '#008000' },
  'entertainment': { label: 'Entertainment', color: '#e74c3c' },
  'environment': { label: 'Environment', color: '#008000' },
  'facebook': { label: 'Facebook', color: '#3b5998' },
  'film': { label: 'Film', color: '#FF1493' },
  'gadgets': { label: 'Gadgets', color: '#808080' },
  'games': { label: 'Games', color: '#FF4500' },
  'gift-guide': { label: 'Gift Guide', color: '#FFD700' },
  'google': { label: 'Google', color: '#4285F4' },
  'health': { label: 'Health', color: '#ADD8E6' },
  'how-to': { label: 'How-to', color: '#8A2BE2' },
  'iphone': { label: 'iPhone', color: '#bdc3c7' },
  'keyboards': { label: 'Keyboards', color: '#333333' },
  'meta': { label: 'Meta', color: '#800000' },
  'microsoft': { label: 'Microsoft', color: '#00ADEF' },
  'policy': { label: 'Policy', color: '#800000' },
  'politics': { label: 'Politics', color: '#000080' },
  'regulation': { label: 'Regulation', color: '#00008B' },
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
  'wearables': { label: 'Wearable', color: '#40E0D0' },
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

export const mergeCategories = (...categories: CategoryKey[]) => Array.from(new Set(categories.flatMap((cat) => cat)))

export const theVergeFeedUrl = (
  category: CategoryKey,
  hash: string | null = null,
) => `https://www.theverge.com/rss/${category}/index.xml${!hash ? '' : `?${hash}`}`
