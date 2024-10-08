import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { categories, categoriesArray, CategoryKey } from '../src/feed/categories.ts'
import { parsePreferencesCookie, setPreferencesCookie } from '../src/cookies.ts'
import CategoryIndicator from '../components/CategoryIndicator.tsx'
import Header from '../components/Header.tsx'
import { Fragment } from 'preact'

type CategoriesState = {
  disabledCategories: CategoryKey[]
}

const parseDisabledCategories = (formData: FormData): CategoryKey[] => {
  const enabledCategories = formData.getAll('category')
    .map((category) => category.toString())
    .filter((category): category is CategoryKey => category in categories)

  const disabledCategories = categoriesArray()
    .filter(({ category }) => !enabledCategories.includes(category))
    .map(({ category }) => category)

  return disabledCategories
}

export const handler: Handlers<void, CategoriesState> = {
  GET({ headers }, ctx) {
    const { disabledCategories } = parsePreferencesCookie(headers)

    ctx.state.disabledCategories = disabledCategories

    return ctx.render()
  },
  async POST(req, _ctx) {
    const { lastVisit = new Date() } = parsePreferencesCookie(req.headers)
    const disabledCategories = parseDisabledCategories(await req.formData())

    const headers = new Headers({ Location: '/' })

    setPreferencesCookie(headers, lastVisit, disabledCategories)

    return new Response('', { status: 303, headers })
  },
}

export default function Categories({
  state,
}: PageProps<void, CategoriesState>) {
  const { disabledCategories } = state

  return (
    <>
      <Head>
        <title>Categories | theshook.¹</title>
      </Head>
      <div class='mx-auto max-w-2xl mt-2 px-1 relative'>
        <Header label='Categories' disableSettings />
        <p class='mt-2 text-sm mx-2 mb-4'>
          When you disable a category, it will be filtered out of the results with priority. So, if you only disable
          'Elon Musk,' it will no longer show an article tagged with both 'Tech' and 'Elon Musk'.
        </p>
        <form method='post' action='/categories'>
          {Object.entries(Object.groupBy(categoriesArray(), ({ header }) => header ?? 'root')).map((
            [header, categories],
          ) => (
            <Fragment key={header}>
              {header !== 'root' && (
                <h2 class='text-lg leading-loose sm:leading-relaxed font-bold mt-2 ml-1.5'>{header}</h2>
              )}
              <div class='divide-y divide-neutral-200 dark:divide-neutral-700'>
                {categories?.map(({ category, label }) => (
                  <label
                    key={category}
                    class='flex items-center justify-between px-2 py-0.5'
                  >
                    <div class='flex items-center gap-x-2 text-base leading-loose sm:leading-relaxed font-medium'>
                      <CategoryIndicator categories={[category]} />
                      {label}
                    </div>
                    <input
                      checked={!disabledCategories.includes(category)}
                      class='accent-fuchsia-500'
                      name='category'
                      type='checkbox'
                      switch
                      value={category}
                    />
                  </label>
                ))}
              </div>
            </Fragment>
          ))}
          <div class='sticky bottom-0 -mx-1 px-1 backdrop-blur-sm bg-neutral-50/50 dark:bg-black/25'>
            <div class='flex flex-row py-3 px-2 gap-x-2 justify-end'>
              <a
                href='/'
                type='button'
                class='rounded-md bg-neutral-50 dark:bg-black px-2 py-2 text-sm font-semibold hover:shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500'
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
          </div>
        </form>
      </div>
    </>
  )
}
