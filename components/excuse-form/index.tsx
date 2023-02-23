import { FormEventHandler, MouseEventHandler, useState } from "react";
import { InputActionMeta } from "react-select";
import Select from "react-select";
import { capitaliseString, randomFromArray } from "../../utils/text";
import { FormExcuseOption } from '../../types/forms';

type ExcuseFormProps<T> = {
  onSubmit: (update: T) => void,
  isLoading: boolean,
  copyToClipboard: MouseEventHandler<HTMLElement>,
  result?: String,
  formOptions: FormExcuseOption<T>[],
  onUpdate: (update: T) => void,
  selectedValues: T
}


export default function ExcuseForm<T>(props: ExcuseFormProps<T>) {
  const {
    result,
    isLoading,
    copyToClipboard,
    onSubmit,
    formOptions,
    onUpdate,
    selectedValues
  } = props;

  if (!formOptions) {
    throw new Error("No form options supplied")
  }

  function sendUpdate(updatedValue: { [key: string]: string }) {
    onUpdate({
      ...selectedValues,
      ...updatedValue
    })
  }

  function randomSubmit() {
    const randomised: T = formOptions.reduce((total, curr) => {
      return {
        ...total,
        [curr.key]: randomFromArray(curr.values)
      }
    }, {} as T)
    onUpdate(randomised)
    onSubmit(randomised)
  }

  function submitForm(e) {
    e.preventDefault();
    onSubmit(selectedValues)
  }

  const selectElements = formOptions.map((option) => {
    const {
      values,
      label,
      key
    } = option;

    const options = values.map((n) => ({
      value: n,
      label: capitaliseString(n)
    }))

    const selectedValue = (selectedValues) ? selectedValues[key] as string : null

    return <div className="mb-5" key={"select-box-" + key.toString()}>
      <label className="pb-2 mb-2 text-sm font-thin text-white spac">{label}</label>
      <Select
        key={label + '-select'}
        value={(selectedValue)
          ? {
            label: capitaliseString(selectedValue),
            value: selectedValue
          }
          : null}
        options={options}
        onChange={(newVal) => {
        sendUpdate({
          [key]: newVal.value
        })
      }}
      inputValue={""}
      onInputChange={function (newValue: string, actionMeta: InputActionMeta): void {
        // Not implemented
      }} onMenuOpen={function (): void {
        // Not implemented
      }} onMenuClose={function (): void {
        // Not implemented
      }}
      />
    </div>
  })


  return (
    <div className="px-4 py-4 mt-16 rounded-lg bg-highlight1">
      <form id="form" onSubmit={submitForm}>
        <div className="mb-8">
          {selectElements}
        </div>

        <div className={[
          "text-center text-white w-100",
          (isLoading) 
            ? "opacity-60"
            : ""
        ].join(' ')}>
          <input disabled={isLoading} className="w-full h-10 rounded-lg bg-gradient-to-r from-green-light to-green-dark " type="submit" value="Justify your negligence" />
          <input disabled={isLoading} className="w-full h-10 mt-4 rounded-lg bg-gradient-to-r from-purple-light to-purple-dark" type="button" onClick={randomSubmit} value="Randomise" />
        </div>
      </form>

      <div id="result" className="mt-8 text-white" onClick={copyToClipboard}>
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold">Result:</h3>
          {isLoading && <img className="h-6 pt-1" src="/loading.gif" />}
          {result && !isLoading && <img className="h-6 mb-2 ml-auto" src="/clipboard.png" />}
        </div>


        <div className={[
          "px-3 py-3 mt-3 rounded-lg bg-highlight2",
          (result) ? "" : "opacity-50"
        ].join(' ')}>
          {isLoading && <p>Betraying friends......</p>}
          {result && !isLoading &&
            <div>
              <p className="font-regular">
                {result}
              </p>
            </div>
          }
          {!result && !isLoading && <p>Structure your excuse above...</p>}
        </div>
      </div>
    </div>
  )
}