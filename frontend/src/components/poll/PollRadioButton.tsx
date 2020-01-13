import React from "react";

type PollRadioButtonProps = {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  name: string;
  initial: string;
}

export function PollRadioButton(props: PollRadioButtonProps) {
  const setOptions = () => {
    let options: any = [];
    props.options.forEach(option =>
      options.push(
        <div>
          <input
            onChange = {props.handler}
            name = {props.name}
            type="radio"
            value = {option}
            id = {option}/>
          <label htmlFor={option}>{option}</label>
        </div>
      ));

    return options;
  }
  return (
    <fieldset>
      {setOptions()}
    </fieldset>
  );
}
