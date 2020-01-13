import React from "react";
import {PollRadioButton} from "./poll/PollRadioButton";
import {PollSlider} from "./poll/PollSlider";
import {PollInput} from "./poll/PollInput";
import {PollSelect} from "./poll/PollSelect";
import {localization} from "../services/LocalizationService";
// @ts-ignore
import courseImage from "../../assets/images/courseImage.png";
import "../styles/pollboard.scss";
import {
  Button,
  ButtonType,
  ButtonSize
} from "../components/interface/button/Button";


interface PollComponentProps {
  guid: string;
}

type Data = string;

interface PollComponentState {
  data: Data[];
}

type HandlerForInput = (event: React.ChangeEvent<HTMLInputElement>) => void;

export class PollComponent extends
React.Component<PollComponentProps, PollComponentState> {
  constructor (props: PollComponentProps) {
    super(props);

    this.state = {
      data: ((): string[] => {
        let val: string[] = [];
        for (let i = 0; i < 9; i ++) {
          val.push("");
        }
        return val;
      })()
    };
  }

  getHandlerForInput (i: number): HandlerForInput {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      const data: Data[] = this.state.data;
      data[i] = event.currentTarget.value;

      this.setState({
        data: data
      });
    };
  }

  shouldComponentUpdate = () => {
    return false;
  }

  saveQuestion () {
    // send this body as-is to the server.
    alert(JSON.stringify(this.state.data));
  }

  render(): JSX.Element {
    return (
      <div className="pollboard">
        <div className="answerEditor">
          <h2>{localization.answerEdition()}</h2>
          <div className="polls">
            <div className="poll">
              <h2>{localization.lectures()}</h2>
              <p>{localization.attendedLectures()}</p>
              <PollRadioButton
                handler = {this.getHandlerForInput(0)}
                options={["Да", "Нет"]}
                name="lections"
              />
              <p>{localization.evaluateQualityOfLectures()}</p>
              <PollSlider handler = {this.getHandlerForInput(1)}/>
              <p>{localization.goodAboutLectures()}</p>
              <PollInput handler = {this.getHandlerForInput(2)}/>
              <p>{localization.badAboutLectures()}</p>
              <PollInput handler = {this.getHandlerForInput(3)}/>
              <p>{localization.suggestionAboutLectures()}</p>
              <PollInput handler = {this.getHandlerForInput(4)}/>
            </div>
            <div className="poll">
              <h2>{localization.seminars()}</h2>
              <p>{localization.evaluateQualityOfSeminars()}</p>
              <PollSlider handler = {this.getHandlerForInput(5)}/>
              <p>{localization.goodAboutSeminars()}</p>
              <PollInput handler = {this.getHandlerForInput(6)}/>
              <p>{localization.badAboutSeminars()}</p>
              <PollInput handler = {this.getHandlerForInput(7)}/>
              <p>{localization.suggestionAboutSeminars()}</p>
              <PollInput handler = {this.getHandlerForInput(8)}/>
            </div>
          </div>
        </div>
        <div className="answerInfo">
          <h2>Информация об ответе</h2>
          <div className="answerInfoBox">
            <h2>АКОС ФИВТ 2019-2020</h2>
            <img src={courseImage} />
            <div className = "answerInfoBoxButton">
              <Button
                type = {ButtonType.orange}
                size = {ButtonSize.medium}
                text = {"Сохранить ответ"}
                handler = {
                  (): void => {this.saveQuestion()}
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
