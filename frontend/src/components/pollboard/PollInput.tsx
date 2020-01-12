import React from "react";
import {localization} from "../../services/LocalizationService";

type PollInputProps = {

}

export function PollInput(props: PollInputProps) {
  return (
    <input type="text" placeholder={localization.myAnswer()}/>
  );
}