import React, { useState } from "react";
import {localization} from "../../services/LocalizationService";

type PollInputProps = {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  initial: string;
}

export function PollInput(props: PollInputProps) {
  let [value, setValue] = useState<string>(props.initial);

  const handler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    props.handler(event);
  }

  return (
    <input
      onChange = {handler}
      type = "text"
      placeholder = {localization.myAnswer()}
      value = {value}
    />
  );
}
