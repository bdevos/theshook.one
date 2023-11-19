import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import {
  categories,
  categoriesArray,
  CategoryKey,
} from '../src/feed/categories.ts'
import {
  getDisabledCategories,
  setDisabledCategoriesCookie,
} from '../src/cookies.ts'
import CategoryIndicator from '../components/CategoryIndicator.tsx'
import Header from '../components/Header.tsx'

type CategoriesProps = {
  disabledCategories: CategoryKey[]
}

const parseDisabledCategories = (formData: FormData): CategoryKey[] => {
  const disabledCategories: CategoryKey[] = []

  for (const [category, value] of formData.entries()) {
    if (category in categories && value === 'on') {
      disabledCategories.push(category as CategoryKey)
    }
  }

  return disabledCategories
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const disabledCategories = getDisabledCategories(req.headers)
    const res = await ctx.render({
      disabledCategories,
    })
    return res
  },
  async POST(req, _ctx) {
    const disabledCategories = parseDisabledCategories(await req.formData())

    const headers = new Headers({ Location: '/' })

    setDisabledCategoriesCookie(headers, disabledCategories)

    return new Response('', {
      status: 303,
      headers,
    })
  },
}

export default function Categories(
  { data: { disabledCategories } }: PageProps<CategoriesProps>,
) {
  return (
    <>
      <Head>
        <title>Disabled Categories | theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1 relative'>
        <Header label='Disabled Categories' disableSettings />
        <form method='post' action='/categories'>
          <div class='mt-4 divide-y divide-neutral-200 dark:divide-neutral-700'>
            {categoriesArray().map(({ category, label }) => (
              <div
                key={category}
                class='flex items-center gap-x-2 px-2'
              >
                <CategoryIndicator categories={[category]} />
                <label
                  htmlFor={`disable-${category}`}
                  class='min-w-0 flex-1 text-base leading-loose sm:leading-relaxed select-none font-medium text-neutral-900 dark:text-neutral-50'
                >
                  {label}
                </label>
                <input
                  id={`disable-${category}`}
                  name={category}
                  checked={disabledCategories.includes(category)}
                  type='checkbox'
                  class='h-4 w-4 accent-fuchsia-600'
                />
              </div>
            ))}
          </div>
          <div class='flex flex-row sticky bottom-0 py-3 px-2 bg-neutral-50 dark:bg-black border-t border-neutral-200 dark:border-neutral-700 gap-x-2 justify-end'>
            <a
              href='/'
              type='button'
              class='rounded-md bg-neutral-50 dark:bg-black px-2 py-2 text-sm font-semibold text-neutral-900 dark:text-white hover:shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
            >
              Cancel
            </a>
            <button
              type='submit'
              class='rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
