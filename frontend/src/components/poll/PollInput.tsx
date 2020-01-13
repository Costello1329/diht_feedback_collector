import React from "react";
import {localization} from "../../services/LocalizationService";

type PollInputProps = {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PollInput(props: PollInputProps) {
  return (
    <input
      onChange = {props.handler}
      type = "text"
      placeholder = {localization.myAnswer()}
    />
  );
}
