import { Fragment } from 'react'
import {Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'

export type DropdownOption = {
  value: string;
  name: string;
}

type CustomDropdownProps = {
  options: DropdownOption[];
  selected: DropdownOption;
  onChange: (value: DropdownOption) => void;
}

export default function CustomDropdown({ options, selected, onChange }: CustomDropdownProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md border border-white/20 bg-black/20 py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-white/75">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-white/20 bg-black/40 py-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-md focus:outline-none sm:text-sm">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-emerald-800/60 text-white' : 'text-gray-200'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium text-white' : 'font-normal'
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}