import React from "react";
import classNames from "classnames";

import "./styles";


type ButtonHandler = () => void;

export enum ButtonType {
  orange = "orange",
  gray = "gray",
  transparent = "transparent"
}

export enum ButtonSize {
  small = "small",
  medium = "medium",
  big = "big"
}

export interface ButtonProps {
  text: string,
  type: ButtonType,
  size: ButtonSize,
  handler?: ButtonHandler
}

export class Button
extends React.Component<ButtonProps> {
  constructor (props: ButtonProps) {
    super(props);
  }

  private formalClassNameSuffix (rawClass: string): string {
    return rawClass[0].toUpperCase() + rawClass.slice(1);
  }

  private getClassNames (): string {
    return classNames(
      "commonButton",
      "commonButton" + this.formalClassNameSuffix(this.props.type),
      "commonButton" + this.formalClassNameSuffix(this.props.size)
    );
  }

  render (): JSX.Element {
    return (
      <button
        className = {this.getClassNames()}
        onClick = {this.props.handler}
      >
        {this.props.text}
      </button>
    );
  }
}
