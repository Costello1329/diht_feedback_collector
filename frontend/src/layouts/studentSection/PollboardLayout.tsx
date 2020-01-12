import React from "react";
import {PollSelect} from "../../components/pollboard/PollSelect";

import "../../styles/pollboard";
import {PollInput} from "../../components/pollboard/PollInput";
import {PollRadioButton} from "../../components/pollboard/PollRadioButton";
import {PollSlider} from "../../components/pollboard/PollSlider";
import {Pollboard} from "../../components/PollboardComponent";

export interface PollboardLayoutProps {}

export class PollboardLayout
extends React.Component<PollboardLayoutProps> {
  constructor (props: PollboardLayoutProps) {
      super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <Pollboard />;


    return layout;
  }
}
