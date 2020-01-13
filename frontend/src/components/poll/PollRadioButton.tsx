import React from "react";

type PollRadioButtonProps = {
  options: string[];
  name: string;
}

export function PollRadioButton(props: PollRadioButtonProps) {
  const setOptions = () => {
    let options: any = [];
    props.options.forEach(option =>
      options.push(
        <div>
          <input name={props.name} type="radio" value={option} id={option}/>
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
