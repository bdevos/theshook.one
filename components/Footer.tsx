type Props = {
  isAbout?: boolean
}

export default function Footer({ isAbout = false }: Props) {
  return (
    <div class='flex flex-row pt-8 pb-12 text-xs text-neutral-700 dark:text-neutral-300 items-center gap-x-6 justify-center'>
      {isAbout && <a href='/' class='underline'>Home</a>}
      {!isAbout && <a href='/about' class='underline'>About</a>}
      <a href='https://appjeniksaan.nl' class='underline'>Appjeniksaan</a>
      <a href='https://github.com/bdevos/theshook.one' class='underline'>
        Source code
      </a>
    </div>
  )
}
