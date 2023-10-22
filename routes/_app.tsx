import { AppProps } from "$fresh/server.ts";
import { categories, Category } from "../categories.ts";
import { Icon } from "../icons/Icon.tsx";

export default function App({ Component }: AppProps) {
  return (
    <body className="bg-gray-100 dark:bg-black">
      <Component />

      <dialog
        id="settingsDialog"
        className="mt-6 bg-gray-100 w-screen backdrop:backdrop-blur-sm sm:bg-gray-100 sm:w-[640px]"
      >
        <form method="post" action=".">
          <fieldset>
            <legend className="text-base font-semibold leading-6 text-gray-900">
              Categories
            </legend>
            <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
              {Object.entries(categories).map(([category, label]) => (
                <div key={category} className="relative flex items-start py-0">
                  <div className="min-w-0 flex-1 text-sm leading-6">
                    <label
                      htmlFor={`check-${category}`}
                      className="select-none font-medium text-gray-900"
                    >
                      <Icon category={category as Category} />
                      <span>{label}</span>
                    </label>
                  </div>
                  <div className="ml-3 flex items-center">
                    <input
                      id={`check-${category}`}
                      name={`check-${category}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          <button value="cancel" formMethod="dialog">Cancel</button>
          <button
            type="submit"
            autoFocus
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            Save
          </button>
        </form>
      </dialog>
    </body>
  );
}
