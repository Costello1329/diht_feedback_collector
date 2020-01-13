import React from "react";

type PollSelectProps = {
  options: string[];
}

export function PollSelect(props: PollSelectProps) {
  const setOptions = () => {
    let options: any = [];
    props.options.forEach(option => options.push(<option>{option}</option>));

    return options;
  };

  return (
    <select>
      {setOptions()}
    </select>
  );
}
