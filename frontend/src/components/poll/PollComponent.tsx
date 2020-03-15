import React from "react";
import {PollRadioButton} from "./PollRadioButton";
import {PollSlider} from "./PollSlider";
import {PollInput} from "./PollInput";
import {localization} from "../../services/clientWorkers/LocalizationService";
// @ts-ignore
import courseImage from "../../../assets/images/courseImage.png";
import {
  Button,
  ButtonType,
  ButtonSize
} from "../userInterface/button/Button";
import {pollService} from "../../services/api/PollService";

import "./styles";


export interface PollComponentProps {
  guid: string;
}

interface PollComponentState {
  questionaryGuid: any;
  data: string[];
  renderedAtLeastOnce: boolean;
}

type HandlerForInput = (event: React.ChangeEvent<HTMLInputElement>) => void;

export class PollComponent extends
React.Component<PollComponentProps, PollComponentState> {
  constructor (props: PollComponentProps) {
    super(props);

    this.state = {
      questionaryGuid: "",
      data: ((): string[] => {
        let val: string[] = [];
        for (let i = 0; i < 9; i ++) {
          val.push("");
        }
        return val;
      })(),
      renderedAtLeastOnce: false
    };
  }

  getHandlerForInput (i: number): HandlerForInput {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      const data: string[] = this.state.data;
      data[i] = event.currentTarget.value;

      this.setState({
        data: data
      });
    };
  }

  getAnswers = (data: any): void => {
    this.setState({
      questionaryGuid: data["guid"],
      data: JSON.parse(data["data"]),
      renderedAtLeastOnce: true
    });
  }

  componentDidMount () {
    pollService.get(this.props.guid, this.getAnswers);
  }

  saveAnswers () {
    const body = {
      "questionnaire_id": this.state.questionaryGuid,
      "data": JSON.stringify(this.state.data)
    };
    
    pollService.send(JSON.stringify(body));
  }

  render(): JSX.Element {
    if (!this.state.renderedAtLeastOnce)
      return <></>;

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
              <PollSlider
                initial = {
                  this.state.data === null ?
                  0 :
                  parseInt(this.state.data[1], 10)
                }
                handler = {this.getHandlerForInput(1)}
              />
              <p>{localization.goodAboutLectures()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[3]}
                handler = {this.getHandlerForInput(2)}
              />
              <p>{localization.badAboutLectures()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[4]}
                handler = {this.getHandlerForInput(3)}
              />
              <p>{localization.suggestionAboutLectures()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[5]}
                handler = {this.getHandlerForInput(4)}
              />
            </div>
            <div className="poll">
              <h2>{localization.seminars()}</h2>
              <p>{localization.evaluateQualityOfSeminars()}</p>
              <PollSlider
                initial = {
                  this.state.data === null ?
                  0 :
                  parseInt(this.state.data[5], 10)
                }
                handler = {this.getHandlerForInput(5)}
              />
              <p>{localization.goodAboutSeminars()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[6]}
                handler = {this.getHandlerForInput(6)}
              />
              <p>{localization.badAboutSeminars()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[7]}
                handler = {this.getHandlerForInput(7)}
              />
              <p>{localization.suggestionAboutSeminars()}</p>
              <PollInput
                initial = {this.state.data === null ? "" : this.state.data[8]}
                handler = {this.getHandlerForInput(8)}
              />
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
                  (): void => {this.saveAnswers()}
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
